import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Send, CheckCircle2, AlertCircle, User, Mail, Phone, MapPin, Calendar, Globe, MessageSquare, Home, Briefcase } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Translations } from "@/i18n/translations";
import { countries } from "@/lib/countries";

interface ContactFormProps {
  t: Translations;
  selectedService: string;
  setSelectedService: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  onLocationChange: (path: string) => void;
  isSuccess: boolean;
  onReset: () => void;
}

export function ContactForm({
  t,
  selectedService,
  setSelectedService,
  onSubmit,
  isSubmitting,
  onLocationChange,
  isSuccess,
  onReset
}: ContactFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [progress, setProgress] = useState(0);
  const containerRef = useState<HTMLDivElement | null>(null);
  // Store the name for the success message so it persists even if we clear formData later
  const [submittedName, setSubmittedName] = useState("");

  useEffect(() => {
    if (isSuccess) {
      if (formData.firstName) {
        setSubmittedName(formData.firstName);
      }
      // Scroll to the container
      const element = document.getElementById('contact-form-container');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [isSuccess, formData.firstName]);

  const handleReset = () => {
    setFormData({});
    setTouched({});
    setSubmittedName("");
    onReset();
  };

  const requiredFields = [
    'service', 'salutation', 'firstName', 'lastName', 'dateOfBirth',
    'email', 'phoneNumber', 'street', 'postalCode', 'city', 'country',
    'currentResidence', 'preferredLanguage', 'message', 'contactConsent', 'privacyConsent'
  ];

  useEffect(() => {
    let totalFields = requiredFields.length;
    if (shouldShowStateProvince()) {
      totalFields += 1;
    }

    let filledCount = 0;

    requiredFields.forEach(field => {
      if (isFieldValid(field)) filledCount++;
    });

    if (shouldShowStateProvince() && isFieldValid('stateProvince')) {
      filledCount++;
    }

    setProgress(Math.round((filledCount / totalFields) * 100));
  }, [formData, selectedService]);

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const isFieldValid = (name: string): boolean => {
    if (name === 'service') return !!selectedService;
    if (name === 'email') {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData[name] || '');
    }
    if (name === 'contactConsent' || name === 'privacyConsent') {
      return formData[name] === 'true';
    }
    if (name === 'stateProvince') {
      if (shouldShowStateProvince()) {
        return !!(formData[name] && formData[name].trim() !== '');
      }
      return true;
    }
    return !!(formData[name] && formData[name].trim() !== '');
  };

  const shouldShowStateProvince = (): boolean => {
    const country = formData.country || '';
    return country === 'United States' || country === 'Canada';
  };

  const showValidation = (name: string): boolean => {
    return touched[name] || false;
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fieldsToCheck = [...requiredFields];
    if (shouldShowStateProvince()) {
      fieldsToCheck.push('stateProvince');
    }

    const newTouched: Record<string, boolean> = {};
    let firstErrorField: string | null = null;
    let hasErrors = false;

    fieldsToCheck.forEach(field => {
      if (!isFieldValid(field)) {
        newTouched[field] = true;
        hasErrors = true;
        if (!firstErrorField) firstErrorField = field;
      }
    });

    if (hasErrors) {
      setTouched(prev => ({ ...prev, ...newTouched }));
      toast.error("Please correct the highlighted errors to proceed.", { duration: 5000 });

      if (firstErrorField) {
        const element = document.getElementsByName(firstErrorField)[0] || document.getElementById(firstErrorField as string);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.focus();
        }
      }
      return;
    }

    onSubmit(e);
  };

  if (isSuccess) {
    return (
      <div id="contact-form-container" className="py-12 px-4 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20">
          <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-2xl md:text-3xl font-bold mb-4">
          Thanks for reaching out, {submittedName}!
        </h3>
        <p className="text-lg text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
          We have received your request and will get back to you via email within 24 hours.
        </p>
        <Button
          variant="outline"
          onClick={handleReset}
          className="border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors"
        >
          Send another request
        </Button>
      </div>
    );
  }

  return (
    <div id="contact-form-container">
      <form onSubmit={handleFormSubmit} className="space-y-8" noValidate>
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Form Progress</span>
            <span className="font-medium text-primary">{progress}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Honeypot field */}
        <input type="text" name="honeypot" className="hidden" tabIndex={-1} autoComplete="off" />

        {/* Service Selection */}
        <div className="space-y-3 p-4 bg-primary/5 rounded-lg border-2 border-primary/20">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-primary dark:text-blue-100 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary dark:text-blue-400" />
              {t.formService} *
            </h3>
            {showValidation('service') && isFieldValid('service') && (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            )}
          </div>
          <Select
            name="service"
            value={selectedService}
            onValueChange={(value) => {
              setSelectedService(value);
              handleBlur('service');
            }}
            required
          >
            <SelectTrigger className={`bg-background ${showValidation('service') && !isFieldValid('service') ? 'border-red-500' : ''}`}>
              <SelectValue placeholder={t.formServicePlaceholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={t.serviceCard1Title}>{t.serviceCard1Title}</SelectItem>
              <SelectItem value={t.serviceCard2Title}>{t.serviceCard2Title}</SelectItem>
              <SelectItem value={t.serviceCard3Title}>{t.serviceCard3Title}</SelectItem>
              <SelectItem value={t.serviceCard4Title}>{t.serviceCard4Title}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Personal Information */}
        <div className="space-y-4 p-4 bg-blue-50/40 dark:bg-blue-950/20 rounded-lg border border-blue-100/50 dark:border-blue-900/50">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Personal Information
          </h3>

          {/* Salutation */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="salutation">{t.formSalutation} *</Label>
              {showValidation('salutation') && isFieldValid('salutation') && (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              )}
            </div>
            <Select
              name="salutation"
              onValueChange={(value) => {
                handleInputChange('salutation', value);
                handleBlur('salutation');
              }}
              required
            >
              <SelectTrigger className={showValidation('salutation') && !isFieldValid('salutation') ? 'border-red-500' : ''}>
                <SelectValue placeholder={t.formSalutationPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mr">{t.formSalutationMr}</SelectItem>
                <SelectItem value="Ms">{t.formSalutationMs}</SelectItem>
                <SelectItem value="Mx">{t.formSalutationMx}</SelectItem>
                <SelectItem value="Prefer not to say">{t.formSalutationPreferNot}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Name */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="firstName">{t.formFirstName} *</Label>
                {showValidation('firstName') && isFieldValid('firstName') && (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                )}
              </div>
              <Input
                id="firstName"
                name="firstName"
                required
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                onBlur={() => handleBlur('firstName')}
                className={showValidation('firstName') && !isFieldValid('firstName') ? 'border-red-500' : ''}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="lastName">{t.formLastName} *</Label>
                {showValidation('lastName') && isFieldValid('lastName') && (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                )}
              </div>
              <Input
                id="lastName"
                name="lastName"
                required
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                onBlur={() => handleBlur('lastName')}
                className={showValidation('lastName') && !isFieldValid('lastName') ? 'border-red-500' : ''}
              />
            </div>
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="dateOfBirth" className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                {t.formDateOfBirth} *
              </Label>
              {showValidation('dateOfBirth') && isFieldValid('dateOfBirth') && (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              )}
            </div>
            <Input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              required
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              onBlur={() => handleBlur('dateOfBirth')}
              className={showValidation('dateOfBirth') && !isFieldValid('dateOfBirth') ? 'border-red-500' : ''}
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4 p-4 bg-blue-50/40 dark:bg-blue-950/20 rounded-lg border border-blue-100/50 dark:border-blue-900/50">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Contact Information
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  {t.formEmail} *
                </Label>
                {showValidation('email') && isFieldValid('email') && (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                )}
              </div>
              <Input
                id="email"
                name="email"
                type="email"
                required
                onChange={(e) => handleInputChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                className={showValidation('email') && !isFieldValid('email') ? 'border-red-500' : ''}
              />
              {showValidation('email') && !isFieldValid('email') && formData.email && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Please enter a valid email address
                </p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  {t.formPhone} *
                </Label>
                {showValidation('phoneNumber') && isFieldValid('phoneNumber') && (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                )}
              </div>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                required
                placeholder="+49 123 456789"
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                onBlur={() => handleBlur('phoneNumber')}
                className={showValidation('phoneNumber') && !isFieldValid('phoneNumber') ? 'border-red-500' : ''}
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="space-y-4 p-4 bg-blue-50/40 dark:bg-blue-950/20 rounded-lg border border-blue-100/50 dark:border-blue-900/50">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Address
          </h3>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="street" className="flex items-center gap-2">
                <Home className="h-4 w-4 text-gray-500" />
                {t.formStreet} *
              </Label>
              {showValidation('street') && isFieldValid('street') && (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              )}
            </div>
            <Input
              id="street"
              name="street"
              required
              onChange={(e) => handleInputChange('street', e.target.value)}
              onBlur={() => handleBlur('street')}
              className={showValidation('street') && !isFieldValid('street') ? 'border-red-500' : ''}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="addressLine2">{t.formAddressLine2}</Label>
            <Input id="addressLine2" name="addressLine2" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="postalCode">{t.formPostalCode} *</Label>
                {showValidation('postalCode') && isFieldValid('postalCode') && (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                )}
              </div>
              <Input
                id="postalCode"
                name="postalCode"
                required
                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                onBlur={() => handleBlur('postalCode')}
                className={showValidation('postalCode') && !isFieldValid('postalCode') ? 'border-red-500' : ''}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="city">{t.formCity} *</Label>
                {showValidation('city') && isFieldValid('city') && (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                )}
              </div>
              <Input
                id="city"
                name="city"
                required
                onChange={(e) => handleInputChange('city', e.target.value)}
                onBlur={() => handleBlur('city')}
                className={showValidation('city') && !isFieldValid('city') ? 'border-red-500' : ''}
              />
            </div>
          </div>

          {shouldShowStateProvince() && (
            <div className="space-y-2 p-3 bg-blue-50/30 dark:bg-blue-950/30 rounded-lg border border-blue-100/50 dark:border-blue-900/50">
              <div className="flex items-center justify-between">
                <Label htmlFor="stateProvince" className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-gray-500" />
                  {t.formStateProvince}
                </Label>
              </div>
              <Input
                id="stateProvince"
                name="stateProvince"
                onChange={(e) => handleInputChange('stateProvince', e.target.value)}
                onBlur={() => handleBlur('stateProvince')}
              />
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                {formData.country === 'United States' ? 'State is required for USA' : 'Province is required for Canada'}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="country">{t.formCountry} *</Label>
              {showValidation('country') && isFieldValid('country') && (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              )}
            </div>
            <Select
              name="country"
              onValueChange={(value) => {
                handleInputChange('country', value);
                handleBlur('country');
              }}
              required
            >
              <SelectTrigger className={showValidation('country') && !isFieldValid('country') ? 'border-red-500' : ''}>
                <SelectValue placeholder={t.formCountryPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.name}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Current Residence and Language */}
        <div className="space-y-4 p-4 bg-blue-50/40 dark:bg-blue-950/20 rounded-lg border border-blue-100/50 dark:border-blue-900/50">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Additional Information
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="currentResidence">{t.formCurrentResidence} *</Label>
                {showValidation('currentResidence') && isFieldValid('currentResidence') && (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                )}
              </div>
              <Select
                name="currentResidence"
                onValueChange={(value) => {
                  handleInputChange('currentResidence', value);
                  handleBlur('currentResidence');
                }}
                required
              >
                <SelectTrigger className={showValidation('currentResidence') && !isFieldValid('currentResidence') ? 'border-red-500' : ''}>
                  <SelectValue placeholder={t.formCurrentResidencePlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.name}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="preferredLanguage">{t.formPreferredLanguage} *</Label>
                {showValidation('preferredLanguage') && isFieldValid('preferredLanguage') && (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                )}
              </div>
              <Select
                name="preferredLanguage"
                onValueChange={(value) => {
                  handleInputChange('preferredLanguage', value);
                  handleBlur('preferredLanguage');
                }}
                required
              >
                <SelectTrigger className={showValidation('preferredLanguage') && !isFieldValid('preferredLanguage') ? 'border-red-500' : ''}>
                  <SelectValue placeholder={t.formPreferredLanguagePlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Korean">Korean (한국어)</SelectItem>
                  <SelectItem value="German">German (Deutsch)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Message/Describe your situation */}
          <div className="space-y-2 mt-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="message" className="text-lg font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                {t.formMessage} *
              </Label>
              {showValidation('message') && isFieldValid('message') && (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              )}
            </div>
            <Textarea
              id="message"
              name="message"
              rows={5}
              required
              minLength={10}
              placeholder="Please describe your specific situation, what services you need, and any relevant details about your case."
              onChange={(e) => handleInputChange('message', e.target.value)}
              onBlur={() => handleBlur('message')}
              className={`resize-none ${showValidation('message') && !isFieldValid('message') ? 'border-red-500' : ''}`}
            />
            {formData.message && (
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                {formData.message.length} characters
              </p>
            )}
          </div>
        </div>

        {/* Consent Checkboxes */}
        <div className="space-y-4 p-4 rounded-lg border border-border/50 bg-[#FDFDFD] dark:bg-secondary/10 shadow-sm">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="contactConsent"
              name="contactConsent"
              required
              onChange={(e) => handleInputChange('contactConsent', e.target.checked ? 'true' : 'false')}
              className={showValidation('contactConsent') && !isFieldValid('contactConsent') ? 'outline-2 outline-red-500' : ''}
              style={{
                width: '20px',
                height: '20px',
                minWidth: '20px',
                minHeight: '20px',
                marginTop: '2px',
                cursor: 'pointer',
                accentColor: 'var(--color-primary)',
                border: '1px solid var(--color-primary)',
                borderRadius: '4px'
              }}
            />
            <label htmlFor="contactConsent" className={`text-sm leading-relaxed cursor-pointer ${showValidation('contactConsent') && !isFieldValid('contactConsent') ? 'text-red-500' : ''}`}>
              {t.formContactConsent} *
            </label>
          </div>
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="privacy-policy-consent"
              name="privacyConsent"
              required
              onChange={(e) => handleInputChange('privacyConsent', e.target.checked ? 'true' : 'false')}
              className={showValidation('privacyConsent') && !isFieldValid('privacyConsent') ? 'outline-2 outline-red-500' : ''}
              style={{
                width: '20px',
                height: '20px',
                minWidth: '20px',
                minHeight: '20px',
                flexShrink: 0,
                marginTop: '2px',
                cursor: 'pointer',
                accentColor: 'var(--color-primary)',
                border: '1px solid var(--color-primary)',
                borderRadius: '4px',
                display: 'block',
                position: 'relative'
              }}
            />
            <label htmlFor="privacy-policy-consent" className={`text-sm leading-relaxed cursor-pointer ${showValidation('privacyConsent') && !isFieldValid('privacyConsent') ? 'text-red-500' : ''}`}>
              {t.formPrivacyConsent}{" "}
              <button
                type="button"
                onClick={() => onLocationChange("/privacy-policy")}
                className="text-primary hover:underline font-medium"
              >
                {t.formPrivacyConsentLink}
              </button>{" "}
              *
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          className="w-full shadow-lg hover:shadow-xl transition-all text-base h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 font-semibold"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Send className="mr-2 h-5 w-5 animate-spin" />
              {t.formSubmitting}
            </>
          ) : (
            <>
              <Send className="mr-2 h-5 w-5" />
              {t.formSubmit}
            </>
          )}
        </Button>

        {progress < 100 && !isSubmitting && (
          <p className="text-sm text-center text-muted-foreground">
            Please complete all required fields to submit
          </p>
        )}
      </form>
    </div>
  );
}
