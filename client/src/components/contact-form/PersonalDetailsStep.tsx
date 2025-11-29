import { motion } from 'framer-motion';
import { User, Mail, MapPin, Calendar, Phone, Globe, MessageSquare } from 'lucide-react';
import { Translations } from "@/i18n/translations";
import { countries } from "@/lib/countries";

interface PersonalDetailsStepProps {
    t: Translations;
    errors: any;
    register: any;
    watch: any;
    language: string;
}

export const PersonalDetailsStep = ({ t, errors, register, watch, language }: PersonalDetailsStepProps) => {
    const country = watch('country');
    const shouldShowStateProvince = country === 'United States of America' || country === 'Canada';

    const suggestedCodes = ['DE', 'KR', 'US'];
    const suggestedCountries = countries.filter(c => suggestedCodes.includes(c.code));

    const SectionTitle = ({ children }: { children: React.ReactNode }) => (
        <div className="relative pl-3 my-6 first:mt-2">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-indigo-600 rounded-full" />
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {children}
            </h4>
        </div>
    );

    const InputWrapper = ({ children, icon: Icon, error }: { children: React.ReactNode, icon?: any, error?: any }) => (
        <div className="w-full">
            <div className={`
        flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-full border transition-all duration-200
        focus-within:bg-indigo-50/50 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10
        ${error ? 'border-red-500 bg-red-50/50' : 'border-gray-200'}
      `}>
                {Icon && <Icon className="w-4 h-4 text-gray-400 shrink-0" />}
                {children}
            </div>
            {error && <p className="mt-1 ml-4 text-xs text-red-500">{error.message}</p>}
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
            className="w-full pb-4"
        >
            {/* Personal Information */}
            <SectionTitle>{t.formSectionPersonal || "Personal Information"}</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <InputWrapper error={errors.salutation}>
                    <select
                        {...register('salutation', { required: t.errorRequired })}
                        className="w-full bg-transparent border-none outline-none text-sm text-gray-900 placeholder-gray-500 appearance-none cursor-pointer"
                    >
                        <option value="">{t.formSalutationPlaceholder}</option>
                        <option value="Mr">{t.formSalutationMr}</option>
                        <option value="Ms">{t.formSalutationMs}</option>
                        <option value="Mx">{t.formSalutationMx}</option>
                        <option value="Prefer not to say">{t.formSalutationPreferNot}</option>
                    </select>
                </InputWrapper>

                <InputWrapper icon={Calendar} error={errors.dateOfBirth}>
                    <input
                        {...register('dateOfBirth', { required: t.errorRequired })}
                        type="date"
                        className="w-full bg-transparent border-none outline-none text-sm text-gray-900 placeholder-gray-500"
                    />
                </InputWrapper>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputWrapper icon={User} error={errors.firstName}>
                    <input
                        {...register('firstName', { required: t.errorRequired })}
                        placeholder={t.formFirstName}
                        className="w-full bg-transparent border-none outline-none text-sm text-gray-900 placeholder-gray-500"
                    />
                </InputWrapper>
                <InputWrapper icon={User} error={errors.lastName}>
                    <input
                        {...register('lastName', { required: t.errorRequired })}
                        placeholder={t.formLastName}
                        className="w-full bg-transparent border-none outline-none text-sm text-gray-900 placeholder-gray-500"
                    />
                </InputWrapper>
            </div>

            {/* Contact Information */}
            <SectionTitle>{t.formSectionContact || "Contact Information"}</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputWrapper icon={Mail} error={errors.email}>
                    <input
                        {...register('email', {
                            required: t.errorRequired,
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: t.errorEmail
                            }
                        })}
                        type="email"
                        placeholder={t.formEmail}
                        className="w-full bg-transparent border-none outline-none text-sm text-gray-900 placeholder-gray-500"
                    />
                </InputWrapper>
                <InputWrapper icon={Phone} error={errors.phoneNumber}>
                    <input
                        {...register('phoneNumber', { required: t.errorRequired })}
                        type="tel"
                        placeholder={t.formPhone}
                        className="w-full bg-transparent border-none outline-none text-sm text-gray-900 placeholder-gray-500"
                    />
                </InputWrapper>
            </div>

            {/* Address */}
            <SectionTitle>{t.formSectionAddress || "Address"}</SectionTitle>
            <div className="space-y-4">
                <InputWrapper icon={MapPin} error={errors.street}>
                    <input
                        {...register('street', { required: t.errorRequired })}
                        placeholder={t.formStreet}
                        className="w-full bg-transparent border-none outline-none text-sm text-gray-900 placeholder-gray-500"
                    />
                </InputWrapper>

                <InputWrapper icon={MapPin} error={errors.addressLine2}>
                    <input
                        {...register('addressLine2')}
                        placeholder={t.formAddressLine2}
                        className="w-full bg-transparent border-none outline-none text-sm text-gray-900 placeholder-gray-500"
                    />
                </InputWrapper>

                <div className="grid grid-cols-2 gap-4">
                    <InputWrapper error={errors.postalCode}>
                        <input
                            {...register('postalCode', { required: t.errorRequired })}
                            placeholder={t.formPostalCode}
                            className="w-full bg-transparent border-none outline-none text-sm text-gray-900 placeholder-gray-500"
                        />
                    </InputWrapper>
                    <InputWrapper error={errors.city}>
                        <input
                            {...register('city', { required: t.errorRequired })}
                            placeholder={t.formCity}
                            className="w-full bg-transparent border-none outline-none text-sm text-gray-900 placeholder-gray-500"
                        />
                    </InputWrapper>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputWrapper icon={Globe} error={errors.country}>
                        <select
                            {...register('country', { required: t.errorRequired })}
                            className="w-full bg-transparent border-none outline-none text-sm text-gray-900 placeholder-gray-500 appearance-none cursor-pointer"
                        >
                            <option value="">{t.formCountryPlaceholder}</option>
                            <optgroup label={t.formSuggestedCountries}>
                                {suggestedCountries.map((country) => (
                                    <option key={`suggested-${country.code}`} value={country.name}>
                                        {country.flag} {country.name}
                                    </option>
                                ))}
                            </optgroup>
                            <optgroup label={t.formAllCountries}>
                                {countries.map((country) => (
                                    <option key={country.code} value={country.name}>
                                        {country.flag} {country.name}
                                    </option>
                                ))}
                            </optgroup>
                        </select>
                    </InputWrapper>

                    {shouldShowStateProvince && (
                        <InputWrapper error={errors.stateProvince}>
                            <input
                                {...register('stateProvince', { required: shouldShowStateProvince ? t.errorRequired : false })}
                                placeholder={t.formStateProvince}
                                className="w-full bg-transparent border-none outline-none text-sm text-gray-900 placeholder-gray-500"
                            />
                        </InputWrapper>
                    )}
                </div>
            </div>

            {/* Message */}
            <SectionTitle>{t.formMessage || "Message"}</SectionTitle>
            <div className={`
        w-full px-4 py-3 bg-gray-50 rounded-2xl border transition-all duration-200
        focus-within:bg-indigo-50/50 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10
        ${errors.message ? 'border-red-500 bg-red-50/50' : 'border-gray-200'}
      `}>
                <textarea
                    {...register('message', { required: t.errorRequired, minLength: { value: 10, message: t.errorRequired } })}
                    rows={4}
                    placeholder={t.formMessagePlaceholder}
                    className="w-full bg-transparent border-none outline-none text-sm text-gray-900 placeholder-gray-500 resize-none"
                />
            </div>
            {errors.message && <p className="mt-1 ml-4 text-xs text-red-500">{errors.message.message}</p>}

            {/* Consent */}
            <div className="mt-6 space-y-3 p-4 border border-gray-200 rounded-2xl bg-gray-50/50">
                <div className="flex items-start gap-3">
                    <input
                        {...register('contactConsent', { required: t.errorConsent })}
                        type="checkbox"
                        id="contactConsent"
                        className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="contactConsent" className="text-xs text-gray-600 cursor-pointer select-none">
                        {t.formContactConsent} <span className="text-red-500">*</span>
                    </label>
                </div>
                {errors.contactConsent && <p className="text-xs text-red-500 ml-7">{errors.contactConsent.message}</p>}

                <div className="flex items-start gap-3">
                    <input
                        {...register('privacyConsent', { required: t.errorConsent })}
                        type="checkbox"
                        id="privacy_policy_checkbox"
                        className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="privacy_policy_checkbox" className="text-xs text-gray-600 cursor-pointer select-none">
                        {t.formPrivacyConsent} <a href={`/${language}/privacy-policy`} className="text-indigo-600 hover:underline font-medium">{t.formPrivacyConsentLink}</a> <span className="text-red-500">*</span>
                    </label>
                </div>
                {errors.privacyConsent && <p className="text-xs text-red-500 ml-7">{errors.privacyConsent.message}</p>}
            </div>
        </motion.div>
    );
};
