import { motion } from 'framer-motion';
import { User, Mail, MapPin, Calendar, Phone, Globe, MessageSquare, CheckSquare } from 'lucide-react';
import { Controller } from 'react-hook-form';
import { Translations } from "@/i18n/translations";
import { countries } from "@/lib/countries";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface PersonalDetailsStepProps {
    t: Translations;
    errors: any;
    register: any;
    watch: any;
    language: string;
    control: any;
}

export const PersonalDetailsStep = ({ t, errors, register, watch, language, control }: PersonalDetailsStepProps) => {
    const country = watch('country');
    const shouldShowStateProvince = country === 'United States of America' || country === 'Canada';

    const suggestedCodes = ['DE', 'KR', 'US'];
    const suggestedCountries = countries.filter(c => suggestedCodes.includes(c.code));
    const selectedCountry = countries.find(c => c.name === country);

    const InputWrapper = ({ children, icon: Icon, error, label }: { children: React.ReactNode, icon?: any, error?: any, label?: string }) => (
        <div className="w-full group">
            {label && <label className="block text-xs font-medium text-gray-700 dark:text-slate-300 mb-1.5 ml-1 transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400">{label}</label>}
            <div className={`
        flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl border transition-all duration-300 ease-out
        focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:border-indigo-500 dark:focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:shadow-md focus-within:-translate-y-0.5
        ${error ? 'border-red-500 bg-red-50/50 dark:bg-red-900/20' : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'}
      `}>
                {Icon && <Icon className="w-4 h-4 text-gray-400 dark:text-slate-500 shrink-0 transition-colors group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400" />}
                {children}
            </div>
            {error && <p className="mt-1 ml-1 text-xs text-red-500 font-medium">{error.message}</p>}
        </div>
    );

    const SectionCard = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100 dark:border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white transition-colors">{title}</h3>
            </div>
            {children}
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
            className="w-full space-y-6 pb-4"
        >
            {/* Personal Information */}
            <SectionCard title={t.formSectionPersonal || "Personal Information"} icon={User}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputWrapper label={t.formFirstName} icon={User} error={errors.firstName}>
                        <input
                            {...register('firstName', { required: t.errorRequired })}
                            placeholder={t.formFirstName}
                            autoComplete="given-name"
                            className="w-full bg-transparent border-none outline-none text-sm text-gray-900 placeholder-gray-500"
                        />
                    </InputWrapper>
                    <InputWrapper label={t.formLastName} icon={User} error={errors.lastName}>
                        <input
                            {...register('lastName', { required: t.errorRequired })}
                            placeholder={t.formLastName}
                            autoComplete="family-name"
                            className="w-full bg-transparent border-none outline-none text-sm text-gray-900 placeholder-gray-500"
                        />
                    </InputWrapper>

                    <InputWrapper label={t.formSalutation} error={errors.salutation}>
                        <Controller
                            control={control}
                            name="salutation"
                            rules={{ required: t.errorRequired }}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger className="w-full !bg-transparent dark:!bg-transparent hover:!bg-transparent dark:hover:!bg-transparent border-none shadow-none focus:ring-0 focus-visible:ring-0 px-0 !py-0 !h-auto !min-h-0 flex-1 text-sm text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-500">
                                        <SelectValue placeholder={t.formSalutationPlaceholder} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Mr">{t.formSalutationMr}</SelectItem>
                                        <SelectItem value="Ms">{t.formSalutationMs}</SelectItem>
                                        <SelectItem value="Mx">{t.formSalutationMx}</SelectItem>
                                        <SelectItem value="Prefer not to say">{t.formSalutationPreferNot}</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </InputWrapper>

                    <InputWrapper label={t.formDateOfBirth} icon={Calendar} error={errors.dateOfBirth}>
                        <input
                            {...register('dateOfBirth', { required: t.errorRequired })}
                            type="date"
                            autoComplete="bday"
                            className="w-full bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-500"
                        />
                    </InputWrapper>
                </div>
            </SectionCard>

            {/* Contact Information */}
            <SectionCard title={t.formSectionContact || "Contact Information"} icon={Mail}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputWrapper label={t.formEmail} icon={Mail} error={errors.email}>
                        <input
                            {...register('email', {
                                required: t.errorRequired,
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: t.errorEmail
                                }
                            })}
                            type="email"
                            autoComplete="email"
                            placeholder="name@example.com"
                            className="w-full bg-transparent border-none outline-none text-sm text-gray-900 placeholder-gray-500"
                        />
                    </InputWrapper>
                    <InputWrapper label={t.formPhone} icon={Phone} error={errors.phoneNumber}>
                        <input
                            {...register('phoneNumber', { required: t.errorRequired })}
                            type="tel"
                            autoComplete="tel"
                            placeholder="+1 234 567 890"
                            className="w-full bg-transparent border-none outline-none text-sm text-gray-900 placeholder-gray-500"
                        />
                    </InputWrapper>
                </div>
            </SectionCard>

            {/* Address */}
            <SectionCard title={t.formSectionAddress || "Address"} icon={MapPin}>
                <div className="space-y-5">
                    <InputWrapper label={t.formStreet} icon={MapPin} error={errors.street}>
                        <input
                            {...register('street', { required: t.errorRequired })}
                            placeholder={t.formStreet}
                            autoComplete="address-line1"
                            className="w-full bg-transparent border-none outline-none text-sm text-gray-900 placeholder-gray-500"
                        />
                    </InputWrapper>

                    <InputWrapper label={t.formAddressLine2} icon={MapPin} error={errors.addressLine2}>
                        <input
                            {...register('addressLine2')}
                            placeholder={t.formAddressLine2}
                            autoComplete="address-line2"
                            className="w-full bg-transparent border-none outline-none text-sm text-gray-900 placeholder-gray-500"
                        />
                    </InputWrapper>

                    <div className="grid grid-cols-2 gap-5">
                        <InputWrapper label={t.formPostalCode} error={errors.postalCode}>
                            <input
                                {...register('postalCode', { required: t.errorRequired })}
                                placeholder={t.formPostalCode}
                                autoComplete="postal-code"
                                className="w-full bg-transparent border-none outline-none text-sm text-gray-900 placeholder-gray-500"
                            />
                        </InputWrapper>
                        <InputWrapper label={t.formCity} error={errors.city}>
                            <input
                                {...register('city', { required: t.errorRequired })}
                                placeholder={t.formCity}
                                autoComplete="address-level2"
                                className="w-full bg-transparent border-none outline-none text-sm text-gray-900 placeholder-gray-500"
                            />
                        </InputWrapper>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <InputWrapper label={t.formCountry} icon={Globe} error={errors.country}>
                            <Controller
                                control={control}
                                name="country"
                                rules={{ required: t.errorRequired }}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger className="w-full !bg-transparent dark:!bg-transparent hover:!bg-transparent dark:hover:!bg-transparent border-none shadow-none focus:ring-0 focus-visible:ring-0 px-0 !py-0 !h-auto !min-h-0 flex-1 text-sm text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-500">
                                            <SelectValue placeholder={t.formCountryPlaceholder}>
                                                {selectedCountry && (
                                                    <span className="flex items-center gap-2">
                                                        <span>{selectedCountry.flag}</span>
                                                        <span>{selectedCountry.name}</span>
                                                    </span>
                                                )}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>{t.formSuggestedCountries}</SelectLabel>
                                                {suggestedCountries.map((country) => (
                                                    <SelectItem key={`suggested-${country.code}`} value={country.name}>
                                                        <span className="flex items-center gap-2">
                                                            <span>{country.flag}</span>
                                                            <span>{country.name}</span>
                                                        </span>
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                            <SelectGroup>
                                                <SelectLabel>{t.formAllCountries}</SelectLabel>
                                                {countries.map((country) => (
                                                    <SelectItem key={country.code} value={country.name}>
                                                        <span className="flex items-center gap-2">
                                                            <span>{country.flag}</span>
                                                            <span>{country.name}</span>
                                                        </span>
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </InputWrapper>

                        {shouldShowStateProvince && (
                            <InputWrapper label={t.formStateProvince} error={errors.stateProvince}>
                                <input
                                    {...register('stateProvince', { required: shouldShowStateProvince ? t.errorRequired : false })}
                                    placeholder={t.formStateProvince}
                                    autoComplete="address-level1"
                                    className="w-full bg-transparent border-none outline-none text-sm text-gray-900 placeholder-gray-500"
                                />
                            </InputWrapper>
                        )}
                    </div>
                </div>
            </SectionCard>

            {/* Message */}
            <SectionCard title={t.formMessage || "Message"} icon={MessageSquare}>
                <div className={`
                    w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl border transition-all duration-300 ease-out
                    focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:border-indigo-500 dark:focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:shadow-md focus-within:-translate-y-0.5
                    ${errors.message ? 'border-red-500 bg-red-50/50 dark:bg-red-900/20' : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'}
                `}>
                    <textarea
                        {...register('message', { required: t.errorRequired, minLength: { value: 10, message: t.errorRequired } })}
                        rows={4}
                        placeholder={t.formMessagePlaceholder}
                        className="w-full bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-500 resize-none"
                    />
                </div>
                {errors.message && <p className="mt-1 ml-1 text-xs text-red-500 font-medium">{errors.message.message}</p>}
            </SectionCard>

            {/* Consent */}
            <SectionCard title="Consent" icon={CheckSquare}>
                <div className="space-y-2">
                    <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                        <input
                            {...register('contactConsent', { required: t.errorConsent })}
                            type="checkbox"
                            id="contactConsent"
                            className="mt-0.5 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <div className="flex-1">
                            <label htmlFor="contactConsent" className="text-sm text-gray-700 dark:text-slate-300 cursor-pointer select-none font-medium block transition-colors">
                                {t.formContactConsent} <span className="text-red-500">*</span>
                            </label>
                            {errors.contactConsent && <p className="text-xs text-red-500 mt-1">{errors.contactConsent.message}</p>}
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                        <input
                            {...register('privacyConsent', { required: t.errorConsent })}
                            type="checkbox"
                            id="privacy_policy_checkbox"
                            className="mt-0.5 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <div className="flex-1">
                            <label htmlFor="privacy_policy_checkbox" className="text-sm text-gray-700 dark:text-slate-300 cursor-pointer select-none font-medium block transition-colors">
                                {t.formPrivacyConsent} <a href={`/${language}/privacy-policy`} className="text-indigo-600 dark:text-indigo-400 hover:underline">{t.formPrivacyConsentLink}</a> <span className="text-red-500">*</span>
                            </label>
                            {errors.privacyConsent && <p className="text-xs text-red-500 mt-1">{errors.privacyConsent.message}</p>}
                        </div>
                    </div>
                </div>
            </SectionCard>
        </motion.div>
    );
};
