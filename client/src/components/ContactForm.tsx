import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Translations } from "@/i18n/translations";
import { countries } from "@/lib/countries";

interface ContactFormProps {
  t: Translations;
  selectedService: string;
  setSelectedService: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  onLocationChange: (path: string) => void;
}

export function ContactForm({ 
  t, 
  selectedService, 
  setSelectedService, 
  onSubmit, 
  isSubmitting,
  onLocationChange 
}: ContactFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [progress, setProgress] = useState(0);

  const requiredFields = [
    'service', 'salutation', 'firstName', 'lastName', 'dateOfBirth',
    'email', 'phoneNumber', 'street', 'postalCode', 'city', 'country',
    'currentResidence', 'preferredLanguage', 'message'
  ];

  useEffect(() => {
    const filledFields = requiredFields.filter(field => {
      if (field === 'service') return selectedService;
      return formData[field] && formData[field].trim() !== '';
    });
    setProgress(Math.round((filledFields.length / requiredFields.length) * 100));
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
    return !!(formData[name] && formData[name].trim() !== '');
  };

  const showValidation = (name: string): boolean => {
    return touched[name] || false;
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
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
          <Label htmlFor="service" className="text-base font-semibold">{t.formService} *</Label>
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
          <SelectTrigger className="bg-background">
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
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>
        
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
            <SelectTrigger>
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
            <Label htmlFor="dateOfBirth">{t.formDateOfBirth} *</Label>
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
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Contact Information</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="email">{t.formEmail} *</Label>
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
              <Label htmlFor="phoneNumber">{t.formPhone} *</Label>
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
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Address</h3>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="street">{t.formStreet} *</Label>
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
        
        <div className="space-y-2">
          <Label htmlFor="stateProvince">{t.formStateProvince}</Label>
          <Input id="stateProvince" name="stateProvince" />
        </div>
        
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
            <SelectTrigger>
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
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Additional Information</h3>
        
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
              <SelectTrigger>
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
              <SelectTrigger>
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
      </div>

      {/* Message */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="message">{t.formMessage} *</Label>
          {showValidation('message') && isFieldValid('message') && (
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          )}
        </div>
        <Textarea 
          id="message" 
          name="message" 
          rows={6} 
          required 
          minLength={10} 
          onChange={(e) => handleInputChange('message', e.target.value)}
          onBlur={() => handleBlur('message')}
          className={`resize-none ${showValidation('message') && !isFieldValid('message') ? 'border-red-500' : ''}`}
        />
        {formData.message && (
          <p className="text-xs text-muted-foreground">
            {formData.message.length} characters
          </p>
        )}
      </div>

      {/* Consent Checkboxes */}
      <div className="space-y-4 p-4 bg-secondary/30 rounded-lg">
        <div className="flex items-start gap-3">
          <Checkbox id="contactConsent" name="contactConsent" required />
          <label htmlFor="contactConsent" className="text-sm leading-relaxed cursor-pointer">
            {t.formContactConsent} *
          </label>
        </div>
        <div className="flex items-start gap-3">
          <input 
            type="checkbox" 
            id="privacyConsent" 
            name="privacyConsent" 
            required
            className="h-5 w-5 mt-0.5 cursor-pointer accent-primary border border-primary/50 rounded"
          />
          <label htmlFor="privacyConsent" className="text-sm leading-relaxed cursor-pointer">
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
        className="w-full shadow-lg hover:shadow-xl transition-all text-base h-12" 
        disabled={isSubmitting || progress < 100}
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
  );
}
