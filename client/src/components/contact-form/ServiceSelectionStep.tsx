import { motion } from 'framer-motion';
import { Check, Star, Package, FileText, LogOut, XCircle } from 'lucide-react';
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
}

export const ServiceSelectionStep = ({
    t,
    selectedService,
    selectedSubService,
    setSelectedSubService,
    selectedSubServices,
    setSelectedSubServices,
    setValue,
    register
}: ServiceSelectionStepProps) => {

    // Determine which services to show based on selected category
    let services: { id: string; title: string; description?: string; icon?: any; isBundle?: boolean }[] = [];
    let isMultiSelect = false;

    if (selectedService === t.serviceCard1Title) {
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
    } else if (selectedService === t.serviceCard2Title) {
        services = t.serviceCard2Services.map((service, index) => ({
            id: `service-2-${index}`,
            title: service,
            icon: FileText
        }));
    } else if (selectedService === t.serviceCard3Title) {
        services = t.serviceCard3Services.map((service, index) => ({
            id: `service-3-${index}`,
            title: service,
            icon: FileText
        }));
    } else if (selectedService === t.serviceCard4Title) {
        services = t.serviceCard4Services.map((service, index) => ({
            id: `service-4-${index}`,
            title: service,
            icon: FileText
        }));
    }

    const handleSelect = (serviceTitle: string) => {
        if (isMultiSelect) {
            const newSelection = selectedSubServices.includes(serviceTitle)
                ? selectedSubServices.filter(s => s !== serviceTitle)
                : [...selectedSubServices, serviceTitle];
            setSelectedSubServices(newSelection);
        } else {
            const newValue = serviceTitle === selectedSubService ? '' : serviceTitle;
            setSelectedSubService(newValue);
            setValue('subService', newValue);
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



            <div className="border border-gray-200 rounded-2xl p-4 md:p-6 bg-gray-50/50">
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
                                        ? 'border-indigo-500 bg-white shadow-[0_0_20px_rgba(99,102,241,0.15)] ring-1 ring-indigo-500'
                                        : 'border-gray-200 bg-white hover:border-indigo-200'
                                    }
                `}
                            >
                                <div className="flex items-start gap-4 w-full">
                                    {/* Icon */}
                                    <div className={`
                    w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center transition-all duration-300 mt-0.5
                    ${isSelected ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md scale-110' : 'bg-gray-100 text-gray-500 group-hover:bg-indigo-50 group-hover:text-indigo-600'}
                  `}>
                                        <Icon className="w-5 h-5" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start w-full mb-1">
                                            <h4 className={`text-base font-semibold ${isSelected ? 'text-indigo-900' : 'text-gray-900'}`}>
                                                {service.title}
                                            </h4>

                                            {/* Checkmark */}
                                            <div className={`
                        w-5 h-5 rounded-full border flex items-center justify-center transition-all flex-shrink-0 ml-3
                        ${isSelected
                                                    ? 'bg-indigo-600 border-indigo-600 opacity-100 scale-100'
                                                    : 'border-gray-300 opacity-0 scale-90'
                                                }
                      `}>
                                                <Check className="w-3 h-3 text-white" />
                                            </div>
                                        </div>

                                        {/* Description */}
                                        {service.description && (
                                            <p className="text-sm text-gray-500 leading-relaxed mb-2">
                                                {service.description}
                                            </p>
                                        )}

                                        {/* Bundle Items List */}
                                        {service.isBundle && t.relocationBundleItems && (
                                            <ul className="mt-3 space-y-1.5 bg-white/50 rounded-lg p-3 border border-indigo-100/50">
                                                <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2">Included:</p>
                                                {t.relocationBundleItems.map((item, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                                        <Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                                                        <span>{item}</span>
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
        </motion.div>
    );
};
