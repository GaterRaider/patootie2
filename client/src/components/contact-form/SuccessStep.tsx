import { motion } from 'framer-motion';
import { Check, Sparkles, RefreshCw } from 'lucide-react';

export const SuccessStep = ({ t, refId, onReset }: any) => (
    <div className="w-full max-w-[1100px] mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-[0_18px_45px_rgba(15,23,42,0.12)] border border-gray-200 dark:border-slate-800 p-6 md:p-10 transition-colors duration-300">
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6"
            >
                <Check className="w-10 h-10 text-white" />
            </motion.div>

            <h2 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white transition-colors">{t.formSuccessGreeting}</h2>
            <p className="text-lg text-muted-foreground dark:text-slate-400 mb-8 transition-colors">{t.formSuccessBody}</p>

            <div className="inline-flex items-center gap-2 px-6 py-3 bg-muted dark:bg-slate-800 rounded-full text-sm mb-6 transition-colors">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-700 dark:text-slate-300 transition-colors">
                    {t.formReferenceId}: <span className="font-mono font-semibold text-gray-900 dark:text-white">{refId || "Generating..."}</span>
                </span>
            </div>

            <button
                onClick={onReset}
                className="flex items-center justify-center gap-2 mx-auto px-6 py-3 rounded-xl border-2 border-input dark:border-slate-700 hover:bg-muted dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300 transition-all"
            >
                <RefreshCw className="w-4 h-4" />
                {t.formSendAnother}
            </button>
        </motion.div>
    </div>
);
