import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Package, FileText, LogOut, XCircle, AlertCircle } from 'lucide-react';
import { Translations } from "@/i18n/translations";

interface ServiceSelectionStepProps {
    t: Translations;
    selectedService: string;
    selectedSubService: string | undefined;
    setSelectedSubService: (value: string) => void;
    selectedSubServices: string[];
    setSelectedSubServices: (value: string[]) => void;
    setValue: any;
    register: any;
    errors?: any;
}

export const ServiceSelectionStep = ({
    t,
    selectedService,
    selectedSubService,
    setSelectedSubService,
    selectedSubServices,
    setSelectedSubServices,
    setValue,
    register,
    errors
}: ServiceSelectionStepProps) => {

    // Scroll to error if validation fails
    useEffect(() => {
        if (errors?.subService) {
            document.getElementById('service-step-container')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [errors?.subService]);

    // Determine which services to show based on selected category
    let services: { id: string; title: string; description?: string; icon?: any; isBundle?: boolean }[] = [];
    let isMultiSelect = false;

    if (selectedService === 'housing') {
        // Housing & Relocation
        isMultiSelect = true;
        services = t.serviceCard1Services.map((service, index) => {
            let icon = Star;
            if (index === 0) icon = Package; // Relocation Bundle
            if (index === 1) icon = FileText; // Anmeldung
            if (index === 2) icon = LogOut; // Deregistration
            if (index === 3) icon = XCircle; // Cancellation

            return {
                id: `service-1-${index}`,
                title: service,
                description: t.serviceCard1Descriptions?.[index] || "",
                icon: icon,
                isBundle: index === 0
            };
        });
    } else if (selectedService === 'legal') {
        services = t.serviceCard2Services.map((service, index) => ({
            id: `service-2-${index}`,
            title: service,
            description: t.serviceCard2Descriptions?.[index] || "",
            icon: FileText
        }));
    } else if (selectedService === 'finance') {
        services = t.serviceCard3Services.map((service, index) => ({
            id: `service-3-${index}`,
            title: service,
            description: t.serviceCard3Descriptions?.[index] || "",
            icon: FileText
        }));
    } else if (selectedService === 'daily') {
        services = t.serviceCard4Services.map((service, index) => ({
            id: `service-4-${index}`,
            title: service,
            description: t.serviceCard4Descriptions?.[index] || "",
            icon: FileText
        }));
    }

    const handleSelect = (serviceTitle: string) => {
        if (isMultiSelect) {
            const newSelection = selectedSubServices.includes(serviceTitle)
                ? selectedSubServices.filter(s => s !== serviceTitle)
                : [...selectedSubServices, serviceTitle];
            setSelectedSubServices(newSelection);

            // value is required for validation, even if we track it in array state
            // Join them so the field has a value if array is not empty
            setValue('subService', newSelection.length > 0 ? newSelection.join(',') : '', { shouldValidate: true });
        } else {
            const newValue = serviceTitle === selectedSubService ? '' : serviceTitle;
            setSelectedSubService(newValue);
            setValue('subService', newValue, { shouldValidate: true });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
            className="w-full"
        >
            <input type="hidden" {...register('subService')} />



            {/* Validation Wrapper */}
            <div
                id="service-step-container"
                className={`rounded-2xl transition-all duration-300 ${errors?.subService ? 'ring-2 ring-red-500 p-1' : ''}`}
            >
                <div className="grid grid-cols-1 gap-3">
                    {services.map((service, index) => {
                        const isSelected = isMultiSelect
                            ? selectedSubServices.includes(service.title)
                            : selectedSubService === service.title;

                        const Icon = service.icon || Star;

                        return (
                            <button
                                key={service.id}
                                type="button"
                                onClick={() => handleSelect(service.title)}
                                className={`
                  relative flex flex-col items-start p-5 rounded-xl border text-left transition-all duration-200 group
                  hover:scale-[1.02] hover:shadow-xl w-full
                  ${isSelected
                                        ? 'border-indigo-500 bg-white dark:bg-slate-800 shadow-[0_0_20px_rgba(99,102,241,0.15)] ring-1 ring-indigo-500'
                                        : 'border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 hover:border-indigo-200 dark:hover:border-indigo-700'
                                    }
                `}
                            >
                                <div className="flex items-start gap-4 w-full">
                                    {/* Icon */}
                                    <div className={`
                    w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center transition-all duration-300 mt-0.5
                    ${isSelected ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md scale-110' : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}
                  `}>
                                        <Icon className="w-5 h-5" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start w-full mb-1">
                                            <h2 className={`text-base font-semibold transition-colors break-words hyphens-auto flex-1 min-w-0 ${isSelected ? 'text-indigo-900 dark:text-indigo-300' : 'text-gray-900 dark:text-white'}`}>
                                                {service.title}
                                            </h2>

                                            {/* Checkmark */}
                                            <div className={`
                        w-5 h-5 rounded-full border flex items-center justify-center transition-all flex-shrink-0 ml-3
                        ${isSelected
                                                    ? 'bg-indigo-600 border-indigo-600 opacity-100 scale-100'
                                                    : 'border-gray-300 dark:border-slate-600 opacity-0 scale-90'
                                                }
                      `}>
                                                <Check className="w-3 h-3 text-white" />
                                            </div>
                                        </div>

                                        {/* Description */}
                                        {service.description && (
                                            <p className={`text-sm leading-relaxed mb-2 transition-colors ${isSelected ? 'text-indigo-700/80 dark:text-indigo-300/70' : 'text-gray-500 dark:text-slate-400'}`}>
                                                {service.description}
                                            </p>
                                        )}

                                        {/* Bundle Items List */}
                                        {service.isBundle && t.relocationBundleItems && (
                                            <ul className="mt-3 space-y-1.5 bg-white/50 dark:bg-slate-900/50 rounded-lg p-3 border border-indigo-100/50 dark:border-indigo-900/30 transition-colors">
                                                <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">Included:</p>
                                                {t.relocationBundleItems.map((item, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-slate-400">
                                                        <Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                                                        <span className="flex-1 min-w-0 break-words hyphens-auto">{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {errors?.subService && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 mt-3 text-red-600 text-sm"
                    onViewportEnter={() => {
                        document.getElementById('service-step-container')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                >
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.subService.message || t.errorRequired}</span>
                </motion.div>
            )}
        </motion.div >
    );
};
