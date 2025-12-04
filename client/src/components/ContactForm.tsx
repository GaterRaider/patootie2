import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, ArrowLeft, Send } from 'lucide-react';
import { Translations } from "@/i18n/translations";
import { useLanguage } from "@/contexts/LanguageContext";
import { CategoryStep } from "./contact-form/CategoryStep";
import { ServiceSelectionStep } from "./contact-form/ServiceSelectionStep";
import { PersonalDetailsStep } from "./contact-form/PersonalDetailsStep";
import { SuccessStep } from "./contact-form/SuccessStep";

interface ContactFormProps {
  t: Translations;
  selectedService: string;
  selectedSubService?: string;
  selectedSubServices: string[];
  setSelectedService: (value: string) => void;
  setSelectedSubService: (value: string) => void;
  setSelectedSubServices: (value: string[]) => void;
  selectedViaCard: boolean;
  setSelectedViaCard: (value: boolean) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  onLocationChange: (path: string) => void;
  isSuccess: boolean;
  onReset: () => void;
  refId?: string;
}

// Main Form Component
export function ContactForm({
  t,
  selectedService,
  selectedSubService,
  selectedSubServices,
  setSelectedService,
  setSelectedSubService,
  setSelectedSubServices,
  onSubmit,
  isSubmitting,
  isSuccess,
  onReset,
  refId,
  selectedViaCard,
  setSelectedViaCard
}: ContactFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { language } = useLanguage();
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      service: selectedService || '',
      subService: selectedSubService || '',
      salutation: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      email: '',
      phoneNumber: '',
      preferredLanguage: '',
      street: '',
      addressLine2: '',
      postalCode: '',
      city: '',
      country: '',
      stateProvince: '',
      message: '',
      contactConsent: false,
      privacyConsent: false
    }
  });
  const { handleSubmit, trigger, formState: { errors }, register, watch, setValue, reset } = methods;

  useEffect(() => {
    if (isSuccess) {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [isSuccess]);

  // Scroll to top of form when step changes
  useEffect(() => {
    const contactFormTop = document.getElementById('contact-form-top');
    if (contactFormTop) {
      contactFormTop.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentStep]);

  // Handle direct navigation from service cards
  useEffect(() => {
    if (selectedViaCard && selectedService) {
      // Update form values
      setValue('service', selectedService);
      if (selectedSubService) setValue('subService', selectedSubService);

      // Determine target step
      if (selectedSubService || selectedSubServices.length > 0) {
        setCurrentStep(2); // Jump to Personal Details
      } else {
        setCurrentStep(1); // Jump to Service Selection
      }

      // Reset the flag
      setSelectedViaCard(false);
    }
  }, [selectedViaCard, selectedService, selectedSubService, selectedSubServices, setValue, setSelectedViaCard]);

  // Auto-scroll to footer on Category selection (Step 1)
  useEffect(() => {
    if (currentStep === 0 && selectedService) {
      const footer = document.getElementById('contact-form-footer');
      if (footer) {
        // Small timeout to allow state update and render
        setTimeout(() => {
          footer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      }
    }
  }, [selectedService, currentStep]);

  const steps = [
    {
      id: 'category',
      title: t.stepService || 'Category',
      subtitle: t.contactFormStep1Subtitle,
      headline: t.contactFormStep1Headline,
      component: CategoryStep,
      fields: ['service']
    },
    {
      id: 'service',
      title: t.formSubService || 'Service',
      subtitle: t.contactFormStep2Subtitle,
      headline: selectedService || t.contactFormStep2Headline,
      component: ServiceSelectionStep,
      fields: ['subService']
    },
    {
      id: 'personal',
      title: t.stepPersonal || 'Details',
      subtitle: t.contactFormStep3Subtitle,
      headline: t.contactFormStep3Headline,
      component: PersonalDetailsStep,
      fields: ['salutation', 'firstName', 'lastName', 'dateOfBirth', 'email', 'phoneNumber', 'street', 'postalCode', 'city', 'country', 'message', 'contactConsent', 'privacyConsent']
    }
  ];

  const StepComponent = steps[currentStep].component;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = async (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) {
      e.preventDefault();
    }
    const fieldsToValidate = steps[currentStep].fields as any;
    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFormSubmit = (data: any) => {
    // Create a synthetic form event for the parent handler
    const formElement = document.createElement('form');
    Object.keys(data).forEach(key => {
      const input = document.createElement('input');
      input.name = key;
      input.value = data[key] || '';
      formElement.appendChild(input);
    });

    const syntheticEvent = {
      preventDefault: () => { },
      currentTarget: formElement,
      target: formElement
    } as unknown as React.FormEvent<HTMLFormElement>;

    onSubmit(syntheticEvent);
  };

  // Handle Enter key to advance
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement)) {
      e.preventDefault();
      if (currentStep < steps.length - 1) {
        handleNext(e);
      }
    }
  };

  if (isSuccess) {
    return <SuccessStep t={t} refId={refId} onReset={onReset} />;
  }

  return (
    <div id="contact-form-top" className="w-full max-w-[1100px] mx-auto bg-card dark:bg-card rounded-3xl shadow-[0_18px_45px_rgba(15,23,42,0.12)] border border-border dark:border-border p-6 md:p-10 scroll-mt-32 transition-colors duration-300">

      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center px-3 py-1 rounded-full border border-primary/20 dark:border-primary/50 bg-primary/10 dark:bg-primary/20 text-xs font-bold tracking-wider text-primary dark:text-primary uppercase mb-6">
          {t.contactFormTitle}
        </div>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-card-foreground dark:text-card-foreground mb-3 transition-colors">
              {steps[currentStep].headline}
            </h1>
            <p className="text-muted-foreground dark:text-muted-foreground text-sm md:text-base leading-relaxed max-w-2xl transition-colors">
              {steps[currentStep].subtitle}
            </p>
          </div>

          <div className="flex flex-col items-end min-w-[200px]">
            <div className="text-xs font-bold text-muted-foreground/60 dark:text-muted-foreground/60 uppercase tracking-wider mb-2 transition-colors">
              {t.stepIndicator} {currentStep + 1} {t.stepOf} {steps.length}
            </div>
            <div className="w-full h-2 bg-secondary dark:bg-secondary rounded-full overflow-hidden shadow-inner transition-colors">
              <motion.div
                className="h-full bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%]"
                initial={{ width: 0 }}
                animate={{
                  width: `${progress}%`,
                  backgroundPosition: ["0% 50%", "100% 50%"]
                }}
                transition={{
                  width: { duration: 0.5, ease: "easeInOut" },
                  backgroundPosition: { duration: 2, repeat: Infinity, ease: "linear" }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Form Steps */}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleFormSubmit)} onKeyDown={handleKeyDown} className="relative min-h-[300px]">
          <AnimatePresence mode="wait">
            <StepComponent
              key={currentStep}
              t={t}
              errors={errors}
              register={register}
              watch={watch}
              setValue={setValue}
              selectedService={selectedService}
              setSelectedService={setSelectedService}
              selectedSubService={selectedSubService}
              setSelectedSubService={setSelectedSubService}
              selectedSubServices={selectedSubServices}
              setSelectedSubServices={setSelectedSubServices}
              language={language}
              control={methods.control}
            />
          </AnimatePresence>

          {/* Footer Navigation */}
          {/* Footer Navigation */}
          <div id="contact-form-footer" className={`flex items-center mt-12 pt-8 ${currentStep === steps.length - 1 ? 'justify-between' : 'justify-between md:justify-end gap-3'}`}>

            {/* Back Button */}
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`
                transition-all duration-200 flex items-center gap-2
                ${currentStep === steps.length - 1
                  ? 'text-muted-foreground/60 dark:text-muted-foreground/60 hover:text-muted-foreground dark:hover:text-muted-foreground text-sm font-medium px-2 py-2 -ml-2' // Minimal style for last step
                  : `px-6 py-2.5 rounded-full text-sm font-medium ${currentStep === 0 ? 'text-muted-foreground/40 dark:text-muted-foreground/40 cursor-not-allowed' : 'text-muted-foreground dark:text-muted-foreground hover:bg-secondary dark:hover:bg-secondary hover:text-foreground dark:hover:text-foreground'}`
                }
              `}
            >
              {currentStep === steps.length - 1 && <ArrowLeft className="w-4 h-4" />}
              {t.stepBack || "Back"}
            </button>

            {/* Next / Submit Button */}
            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="group flex items-center gap-2 px-8 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                {t.stepNext || "Continue"}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            ) : (
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  group relative flex items-center gap-3 px-10 py-4 rounded-full text-white text-base font-bold tracking-wide
                  bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto]
                  shadow-[0_10px_25px_-5px_rgba(79,70,229,0.4)]
                  hover:shadow-[0_20px_35px_-5px_rgba(79,70,229,0.5)]
                  transition-all duration-500
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none
                `}
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%"]
                }}
                transition={{
                  backgroundPosition: { duration: 3, repeat: Infinity, ease: "linear" },
                  default: { duration: 0.2 }
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isSubmitting ? (t.formSubmitting || 'Sending...') : (t.stepSubmit || "Send Request")}
                  {!isSubmitting && <Send className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />}
                </span>
              </motion.button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
