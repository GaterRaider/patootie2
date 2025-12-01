import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

export const ContactInfoStep = ({ t, errors, register }: any) => (
    <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
    >
        <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-4">
                <Mail className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">{t.stepContact || "Contact Information"}</h2>
            <p className="text-muted-foreground">How can we reach you?</p>
        </div>

        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-2">
                    {t.formEmail} <span className="text-red-500">*</span>
                </label>
                <input
                    {...register('email', {
                        required: t.errorRequired,
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: t.errorEmail
                        }
                    })}
                    type="email"
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${errors.email
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-input focus:border-primary'
                        } focus:outline-none focus:ring-4 focus:ring-primary/10 bg-background`}
                />
                {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">
                    {t.formPhone} <span className="text-red-500">*</span>
                </label>
                <input
                    {...register('phoneNumber', { required: t.errorRequired })}
                    type="tel"
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${errors.phoneNumber
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-input focus:border-primary'
                        } focus:outline-none focus:ring-4 focus:ring-primary/10 bg-background`}
                />
                {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-500">{errors.phoneNumber.message}</p>
                )}
            </div>

            {/* <div>
        <label className="block text-sm font-medium mb-2">
          {t.formPreferredLanguage}
        </label>
        <select
          {...register('preferredLanguage')}
          className="w-full px-4 py-3 rounded-xl border-2 border-input focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all bg-background"
        >
          <option value="">{t.formPreferredLanguagePlaceholder}</option>
          <option value="English">English</option>
          <option value="Korean">Korean (한국어)</option>
          <option value="German">German (Deutsch)</option>
        </select>
      </div> */}
        </div>
    </motion.div>
);
