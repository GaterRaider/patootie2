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
            value: t.serviceCard1Title,
            count: 4
        },
        {
            id: 'legal',
            title: t.serviceCard2Title,
            icon: Scale,
            caption: "Visa & Legal Support",
            value: t.serviceCard2Title,
            count: 7
        },
        {
            id: 'finance',
            title: t.serviceCard3Title,
            icon: Wallet,
            caption: "Benefits & Banking",
            value: t.serviceCard3Title,
            count: 3
        },
        {
            id: 'daily',
            title: t.serviceCard4Title,
            icon: Zap,
            caption: "Utilities & Insurance",
            value: t.serviceCard4Title,
            count: 2
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

            <p className="text-sm text-muted-foreground mb-6">
                {t.formServicePlaceholder || "Choose a category so we know where to start."}
            </p>

            <div className={`border rounded-2xl p-4 md:p-6 bg-gray-50/50 ${errors?.service ? 'border-red-300' : 'border-gray-200'}`}>
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
                  relative flex flex-col gap-3 p-5 rounded-2xl border text-left transition-all duration-150 min-h-[120px]
                  hover:border-gray-400 hover:-translate-y-[1px] hover:shadow-lg
                  ${isSelected
                                        ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-1 ring-indigo-600/20'
                                        : 'border-gray-200 bg-white shadow-sm'
                                    }
                `}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center transition-colors
                    ${isSelected ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}
                  `}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 pr-20">
                                        <h3 className="font-semibold text-gray-900 text-base md:text-lg mb-1">
                                            {category.title}
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            {category.caption}
                                        </p>
                                    </div>
                                </div>

                                {/* Service Count Badge */}
                                <div className="absolute top-5 right-5">
                                    <span className={`
                    text-xs font-medium px-2.5 py-1 rounded-full
                    ${isSelected
                                            ? 'bg-indigo-100 text-indigo-600'
                                            : 'bg-gray-100 text-gray-500'
                                        }
                  `}>
                                        {category.count} services
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
