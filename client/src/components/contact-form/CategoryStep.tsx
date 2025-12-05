import { motion } from 'framer-motion';
import { Home, Scale, Wallet, Zap, AlertCircle } from 'lucide-react';
import { Translations } from "@/i18n/translations";

interface CategoryStepProps {
    t: Translations;
    selectedService: string;
    setSelectedService: (service: string) => void;
    setValue: any;
    register: any;
    errors?: any;
}

export const CategoryStep = ({ t, selectedService, setSelectedService, setValue, register, errors }: CategoryStepProps) => {
    const categories = [
        {
            id: 'housing',
            title: t.serviceCard1Title,
            icon: Home,
            caption: t.serviceCard1Tagline,
            value: 'housing',
            count: t.serviceCard1Services.length
        },
        {
            id: 'legal',
            title: t.serviceCard2Title,
            icon: Scale,
            caption: t.categoryCard2Caption,
            value: 'legal',
            count: t.serviceCard2Services.length
        },
        {
            id: 'finance',
            title: t.serviceCard3Title,
            icon: Wallet,
            caption: t.categoryCard3Caption,
            value: 'finance',
            count: t.serviceCard3Services.length
        },
        {
            id: 'daily',
            title: t.serviceCard4Title,
            icon: Zap,
            caption: t.categoryCard4Caption,
            value: 'daily',
            count: t.serviceCard4Services.length
        }
    ];

    const handleSelect = (value: string) => {
        setValue('service', value);
        setSelectedService(value);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
            className="w-full"
        >
            <input type="hidden" {...register('service', { required: t.errorRequired })} />

            <p className="text-sm text-muted-foreground dark:text-slate-400 mb-6 transition-colors">
                {t.formServicePlaceholder || "Select a category"}
            </p>

            <div className={`border rounded-2xl p-4 md:p-6 bg-gray-50/50 dark:bg-slate-900/50 ${errors?.service ? 'border-red-300 dark:border-red-800' : 'border-gray-200 dark:border-slate-800'} transition-colors`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categories.map((category) => {
                        const isSelected = selectedService === category.value;
                        const Icon = category.icon;

                        return (
                            <button
                                key={category.id}
                                type="button"
                                onClick={() => handleSelect(category.value)}
                                className={`
                  relative flex flex-col justify-between gap-3 p-5 rounded-2xl border text-left transition-all duration-200 min-h-[120px] group
                  hover:scale-[1.02] hover:shadow-xl
                  ${isSelected
                                        ? 'border-indigo-500 bg-white dark:bg-slate-800 shadow-[0_0_20px_rgba(99,102,241,0.15)] ring-1 ring-indigo-500'
                                        : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-200 dark:hover:border-indigo-700'
                                    }
                `}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0
                    ${isSelected ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg scale-110' : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}
                  `}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 dark:text-white text-base md:text-lg mb-1 transition-colors">
                                            {category.title}
                                        </h3>
                                        <p className="text-xs text-gray-500 dark:text-slate-400 transition-colors">
                                            {category.caption}
                                        </p>
                                    </div>
                                </div>

                                {/* Service Count Badge - Now in flow with auto margin top */}
                                <div className="ml-auto mt-4">
                                    <span className={`
                    text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-200 border shadow-sm backdrop-blur-sm
                    ${isSelected
                                            ? 'bg-indigo-50/90 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                                            : 'bg-white/90 dark:bg-slate-800/90 text-gray-600 dark:text-slate-400 border-gray-200 dark:border-slate-700'
                                        }
                  `}>
                                        {category.count} {t.categoryServicesCount}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {errors?.service && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 mt-3 text-red-600 text-sm"
                >
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.service.message || t.errorRequired}</span>
                </motion.div>
            )}
        </motion.div>
    );
};
