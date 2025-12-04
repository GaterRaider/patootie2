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
            caption: t.categoryCard2Caption,
            value: t.serviceCard2Title,
            count: 7
        },
        {
            id: 'finance',
            title: t.serviceCard3Title,
            icon: Wallet,
            caption: t.categoryCard3Caption,
            value: t.serviceCard3Title,
            count: 3
        },
        {
            id: 'daily',
            title: t.serviceCard4Title,
            icon: Zap,
            caption: t.categoryCard4Caption,
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

            <p className="text-sm text-muted-foreground dark:text-muted-foreground mb-6 transition-colors">
                {t.formServicePlaceholder || "Select a category"}
            </p>

            <div className={`border rounded-2xl p-4 md:p-6 bg-secondary/50 dark:bg-card/50 ${errors?.service ? 'border-destructive dark:border-destructive' : 'border-border dark:border-border'} transition-colors`}>
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
                  relative flex flex-col gap-3 p-5 rounded-2xl border text-left transition-all duration-200 min-h-[120px] group
                  hover:scale-[1.02] hover:shadow-xl
                  ${isSelected
                                        ? 'border-primary bg-card dark:bg-card shadow-[0_0_20px_rgba(var(--primary),0.15)] ring-1 ring-primary'
                                        : 'border-border dark:border-border bg-card dark:bg-card hover:border-primary/40 dark:hover:border-primary/40'
                                    }
                `}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0
                    ${isSelected ? 'bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg scale-110' : 'bg-secondary dark:bg-secondary text-muted-foreground dark:text-muted-foreground group-hover:bg-primary/10 dark:group-hover:bg-primary/20 group-hover:text-primary dark:group-hover:text-primary'}
                  `}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 pr-20">
                                        <h3 className="font-semibold text-foreground dark:text-foreground text-base md:text-lg mb-1 transition-colors">
                                            {category.title}
                                        </h3>
                                        <p className="text-xs text-muted-foreground dark:text-muted-foreground transition-colors">
                                            {category.caption}
                                        </p>
                                    </div>
                                </div>

                                {/* Service Count Badge */}
                                <div className="absolute bottom-5 right-5">
                                    <span className={`
                    text-xs font-medium px-2.5 py-1 rounded-full transition-colors
                    ${isSelected
                                            ? 'bg-primary/20 dark:bg-primary/20 text-primary dark:text-primary'
                                            : 'bg-secondary dark:bg-secondary text-muted-foreground dark:text-muted-foreground'
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
                    className="flex items-center gap-2 mt-3 text-destructive text-sm"
                >
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.service.message || t.errorRequired}</span>
                </motion.div>
            )}
        </motion.div>
    );
};
