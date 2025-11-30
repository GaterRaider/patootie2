import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, ArrowLeft } from 'lucide-react';
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

  const steps = [
    {
      id: 'category',
      title: t.stepService || 'Category',
      subtitle: "Answer a few quick questions so we can match you with the right support.",
      headline: "How can we help you?",
      component: CategoryStep,
      fields: ['service']
    },
    {
      id: 'service',
      title: t.formSubService || 'Service',
      subtitle: "Select a specific service",
      headline: selectedService || "Select your services",
      component: ServiceSelectionStep,
      fields: ['subService']
    },
    {
      id: 'personal',
      title: t.stepPersonal || 'Details',
      subtitle: "We need a few details to get in touch and start your journey.",
      headline: "Tell us about yourself",
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
    <div id="contact-form-top" className="w-full max-w-[1100px] mx-auto bg-white rounded-3xl shadow-[0_18px_45px_rgba(15,23,42,0.12)] border border-gray-200 p-6 md:p-10">

      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center px-3 py-1 rounded-full border border-indigo-100 bg-indigo-50 text-xs font-bold tracking-wider text-indigo-600 uppercase mb-6">
          Contact form
        </div>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              {steps[currentStep].headline}
            </h1>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-2xl">
              {steps[currentStep].subtitle}
            </p>
          </div>

          <div className="flex flex-col items-end min-w-[200px]">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Step {currentStep + 1} of {steps.length}
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-[length:200%_100%]"
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
            />
          </AnimatePresence>

          {/* Footer Navigation */}
          <div className="flex justify-between md:justify-end items-center gap-3 mt-10 pt-6">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`
                px-6 py-2.5 rounded-full text-sm font-medium transition-all
                ${currentStep === 0
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              {t.stepBack || "Back"}
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="group flex items-center gap-2 px-8 py-2.5 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                {t.stepNext || "Continue"}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="group flex items-center gap-2 px-8 py-2.5 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none"
              >
                {isSubmitting ? (t.formSubmitting || 'Submitting...') : (t.stepSubmit || "Submit")}
                {!isSubmitting && <Check className="w-4 h-4" />}
              </button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
