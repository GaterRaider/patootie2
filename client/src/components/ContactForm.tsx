import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { Translations } from "@/i18n/translations";
import { useLanguage } from "@/contexts/LanguageContext";
import { ServicePersonalStep } from "./contact-form/ServicePersonalStep";
import { ContactInfoStep } from "./contact-form/ContactInfoStep";
import { DetailsStep } from "./contact-form/DetailsStep";
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
  refId
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
  const { handleSubmit, trigger, formState: { errors }, register, watch, setValue } = methods;

  const steps = [
    { title: t.stepService || 'Service', component: ServicePersonalStep, fields: ['service', 'salutation', 'firstName', 'lastName', 'dateOfBirth'] },
    { title: t.stepContact || 'Contact', component: ContactInfoStep, fields: ['email', 'phoneNumber'] },
    { title: 'Address', component: DetailsStep, fields: ['street', 'postalCode', 'city', 'country', 'message', 'contactConsent', 'privacyConsent'] }
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
    <div className="w-full">
      {/* Progress Bar - Fixed Alignment */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3 px-4">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${index < currentStep
                ? 'bg-green-500 text-white'
                : index === currentStep
                  ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                  : 'bg-muted text-muted-foreground'
                }`}>
                {index < currentStep ? <Check className="w-5 h-5" /> : index + 1}
              </div>
              <span className={`text-xs mt-2 font-medium text-center ${index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Form */}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleFormSubmit)} onKeyDown={handleKeyDown}>
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

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-8">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-input font-medium hover:bg-muted transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                {t.stepBack || "Back"}
              </button>
            )}

            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:shadow-lg hover:scale-[1.02] transition-all"
              >
                {t.stepNext || "Continue"}
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : t.stepSubmit || "Submit"}
                <Check className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>
      </FormProvider>

      {/* Progress Text */}
      <p className="text-center mt-4 text-sm text-muted-foreground">
        Step {currentStep + 1} of {steps.length}
      </p>
    </div>
  );
}
