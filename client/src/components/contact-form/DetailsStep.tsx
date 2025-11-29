import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { countries } from "@/lib/countries";

export const DetailsStep = ({ t, errors, register, watch, language }: any) => {
    const country = watch('country');
    const shouldShowStateProvince = country === 'United States of America' || country === 'Canada';

    const suggestedCodes = ['DE', 'KR', 'US'];
    const suggestedCountries = countries.filter(c => suggestedCodes.includes(c.code));

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl mb-4">
                    <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Address & Message</h2>
                <p className="text-muted-foreground">Complete your submission</p>
            </div>

            <div className="space-y-4">
                {/* Address Fields */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        {t.formStreet} <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...register('street', { required: t.errorRequired })}
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${errors.street
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-input focus:border-primary'
                            } focus:outline-none focus:ring-4 focus:ring-primary/10 bg-background`}
                    />
                    {errors.street && (
                        <p className="mt-1 text-sm text-red-500">{errors.street.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        {t.formAddressLine2}
                    </label>
                    <input
                        {...register('addressLine2')}
                        className="w-full px-4 py-3 rounded-xl border-2 border-input focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all bg-background"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            {t.formPostalCode} <span className="text-red-500">*</span>
                        </label>
                        <input
                            {...register('postalCode', { required: t.errorRequired })}
                            className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${errors.postalCode
                                ? 'border-red-500 focus:border-red-500'
                                : 'border-input focus:border-primary'
                                } focus:outline-none focus:ring-4 focus:ring-primary/10 bg-background`}
                        />
                        {errors.postalCode && (
                            <p className="mt-1 text-sm text-red-500">{errors.postalCode.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            {t.formCity} <span className="text-red-500">*</span>
                        </label>
                        <input
                            {...register('city', { required: t.errorRequired })}
                            className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${errors.city
                                ? 'border-red-500 focus:border-red-500'
                                : 'border-input focus:border-primary'
                                } focus:outline-none focus:ring-4 focus:ring-primary/10 bg-background`}
                        />
                        {errors.city && (
                            <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            {t.formCountry} <span className="text-red-500">*</span>
                        </label>
                        <select
                            {...register('country', { required: t.errorRequired })}
                            className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${errors.country
                                ? 'border-red-500 focus:border-red-500'
                                : 'border-input focus:border-primary'
                                } focus:outline-none focus:ring-4 focus:ring-primary/10 bg-background`}
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
                        {errors.country && (
                            <p className="mt-1 text-sm text-red-500">{errors.country.message}</p>
                        )}
                    </div>

                    {shouldShowStateProvince && (
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                {t.formStateProvince} <span className="text-red-500">*</span>
                            </label>
                            <input
                                {...register('stateProvince', { required: shouldShowStateProvince ? t.errorRequired : false })}
                                className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${errors.stateProvince
                                    ? 'border-red-500 focus:border-red-500'
                                    : 'border-input focus:border-primary'
                                    } focus:outline-none focus:ring-4 focus:ring-primary/10 bg-background`}
                            />
                            {errors.stateProvince && (
                                <p className="mt-1 text-sm text-red-500">{errors.stateProvince.message}</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Message */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        {t.formMessage} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        {...register('message', { required: t.errorRequired, minLength: { value: 10, message: t.errorRequired } })}
                        rows={4}
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all resize-none ${errors.message
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-input focus:border-primary'
                            } focus:outline-none focus:ring-4 focus:ring-primary/10 bg-background`}
                        placeholder={t.formMessagePlaceholder}
                    />
                    {errors.message && (
                        <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
                    )}
                </div>

                {/* Consent Checkboxes */}
                <div className="space-y-3 p-4 border-2 rounded-xl bg-muted/30">
                    <div className="flex items-start space-x-2">
                        <input
                            {...register('contactConsent', { required: t.errorConsent })}
                            type="checkbox"
                            id="contactConsent"
                            className="w-4 h-4 mt-1 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <label htmlFor="contactConsent" className="text-sm cursor-pointer">
                            {t.formContactConsent} <span className="text-red-500">*</span>
                        </label>
                    </div>
                    {errors.contactConsent && (
                        <p className="text-sm text-red-500">{errors.contactConsent.message}</p>
                    )}

                    <div className="flex items-start space-x-2">
                        <input
                            {...register('privacyConsent', { required: t.errorConsent })}
                            type="checkbox"
                            id="privacy_policy_checkbox"
                            className="w-4 h-4 mt-1 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <label htmlFor="privacy_policy_checkbox" className="text-sm cursor-pointer">
                            {t.formPrivacyConsent} <a href={`/${language}/privacy-policy`} className="text-primary hover:underline">{t.formPrivacyConsentLink}</a> <span className="text-red-500">*</span>
                        </label>
                    </div>
                    {errors.privacyConsent && (
                        <p className="text-sm text-red-500">{errors.privacyConsent.message}</p>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
