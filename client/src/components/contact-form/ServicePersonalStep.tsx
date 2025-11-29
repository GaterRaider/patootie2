import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';

export const ServicePersonalStep = ({ t, errors, register, watch, setValue, selectedService, setSelectedService, selectedSubService, setSelectedSubService, selectedSubServices, setSelectedSubServices }: any) => {
    const currentService = watch('service');

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
                    <Briefcase className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">{t.stepService || "Service & Personal"}</h2>
                <p className="text-muted-foreground">Tell us what you need</p>
            </div>

            <div className="space-y-4">
                {/* Service Selection */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        {t.formService} <span className="text-red-500">*</span>
                    </label>
                    <select
                        {...register('service', { required: t.errorRequired })}
                        onChange={(e) => {
                            setValue('service', e.target.value);
                            setSelectedService(e.target.value);
                        }}
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${errors.service
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-input focus:border-primary'
                            } focus:outline-none focus:ring-4 focus:ring-primary/10 bg-background`}
                    >
                        <option value="">{t.formServicePlaceholder}</option>
                        <option value={t.serviceCard1Title}>{t.serviceCard1Title}</option>
                        <option value={t.serviceCard2Title}>{t.serviceCard2Title}</option>
                        <option value={t.serviceCard3Title}>{t.serviceCard3Title}</option>
                        <option value={t.serviceCard4Title}>{t.serviceCard4Title}</option>
                    </select>
                    {errors.service && (
                        <p className="mt-1 text-sm text-red-500">{errors.service.message}</p>
                    )}
                </div>

                {/* Relocation Bundle Checkboxes */}
                {currentService === t.serviceCard1Title && (
                    <div className="space-y-3 p-4 border-2 rounded-xl bg-muted/30">
                        <label className="block text-sm font-medium">
                            {t.serviceSelectChoice} <span className="text-red-500">*</span>
                        </label>
                        {t.serviceCard1Services.map((service: string, index: number) => (
                            <div key={index} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id={`subservice-${index}`}
                                    checked={selectedSubServices.includes(service)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedSubServices([...selectedSubServices, service]);
                                        } else {
                                            setSelectedSubServices(selectedSubServices.filter((s: string) => s !== service));
                                        }
                                    }}
                                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                />
                                <label htmlFor={`subservice-${index}`} className="text-sm cursor-pointer">
                                    {service}
                                </label>
                            </div>
                        ))}
                    </div>
                )}

                {/* Sub-service dropdown for other services */}
                {currentService && currentService !== t.serviceCard1Title && (
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            {t.formSubService}
                        </label>
                        <select
                            {...register('subService')}
                            onChange={(e) => {
                                setValue('subService', e.target.value);
                                setSelectedSubService(e.target.value);
                            }}
                            className="w-full px-4 py-3 rounded-xl border-2 border-input focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all bg-background"
                        >
                            <option value="">{t.formSubServicePlaceholder}</option>
                            {currentService === t.serviceCard2Title && t.serviceCard2Services.map((s: string, i: number) => (
                                <option key={i} value={s}>{s}</option>
                            ))}
                            {currentService === t.serviceCard3Title && t.serviceCard3Services.map((s: string, i: number) => (
                                <option key={i} value={s}>{s}</option>
                            ))}
                            {currentService === t.serviceCard4Title && t.serviceCard4Services.map((s: string, i: number) => (
                                <option key={i} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Salutation */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        {t.formSalutation} <span className="text-red-500">*</span>
                    </label>
                    <select
                        {...register('salutation', { required: t.errorRequired })}
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${errors.salutation
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-input focus:border-primary'
                            } focus:outline-none focus:ring-4 focus:ring-primary/10 bg-background`}
                    >
                        <option value="">{t.formSalutationPlaceholder}</option>
                        <option value="Mr">{t.formSalutationMr}</option>
                        <option value="Ms">{t.formSalutationMs}</option>
                        <option value="Mx">{t.formSalutationMx}</option>
                        <option value="Prefer not to say">{t.formSalutationPreferNot}</option>
                    </select>
                    {errors.salutation && (
                        <p className="mt-1 text-sm text-red-500">{errors.salutation.message}</p>
                    )}
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            {t.formFirstName} <span className="text-red-500">*</span>
                        </label>
                        <input
                            {...register('firstName', { required: t.errorRequired })}
                            className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${errors.firstName
                                ? 'border-red-500 focus:border-red-500'
                                : 'border-input focus:border-primary'
                                } focus:outline-none focus:ring-4 focus:ring-primary/10 bg-background`}
                        />
                        {errors.firstName && (
                            <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            {t.formLastName} <span className="text-red-500">*</span>
                        </label>
                        <input
                            {...register('lastName', { required: t.errorRequired })}
                            className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${errors.lastName
                                ? 'border-red-500 focus:border-red-500'
                                : 'border-input focus:border-primary'
                                } focus:outline-none focus:ring-4 focus:ring-primary/10 bg-background`}
                        />
                        {errors.lastName && (
                            <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>
                        )}
                    </div>
                </div>

                {/* Date of Birth */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        {t.formDateOfBirth} <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...register('dateOfBirth', { required: t.errorRequired })}
                        type="date"
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${errors.dateOfBirth
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-input focus:border-primary'
                            } focus:outline-none focus:ring-4 focus:ring-primary/10 bg-background`}
                    />
                    {errors.dateOfBirth && (
                        <p className="mt-1 text-sm text-red-500">{errors.dateOfBirth.message}</p>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
