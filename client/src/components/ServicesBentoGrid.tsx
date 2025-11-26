import { useState, useRef, useEffect } from "react";
import { Language, getTranslations } from "@/i18n/translations";
import { LucideIcon, ArrowRight, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export interface ServiceItem {
    id: string;
    icon: LucideIcon;
    title: string;
    description: string;
    servicesList: string[];
    ctaText: string;
}

interface ServicesBentoGridProps {
    services: ServiceItem[];
    onSelect: (serviceTitle: string, subService?: string) => void;
    language: Language;
}

export function ServicesBentoGrid({ services, onSelect, language }: ServicesBentoGridProps) {
    const t = getTranslations(language);
    const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
    const [selectedSubService, setSelectedSubService] = useState<string>("");
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Track scroll position to update active dot
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const scrollLeft = container.scrollLeft;
            const cardWidth = container.scrollWidth / services.length;
            const newIndex = Math.round(scrollLeft / cardWidth);
            setActiveIndex(newIndex);
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [services.length]);

    const handleCardClick = (service: ServiceItem) => {
        setSelectedService(service);
        setSelectedSubService(""); // Reset sub-service when opening a new card
    };

    const handleClose = () => {
        setSelectedService(null);
        setSelectedSubService("");
    };

    const handleCtaClick = () => {
        if (selectedService) {
            onSelect(selectedService.title, selectedSubService || undefined);
            handleClose();
        }
    };

    const ServiceCardContent = ({ service }: { service: ServiceItem }) => (
        <Card
            className="h-full cursor-pointer group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 relative overflow-hidden bg-card/50 backdrop-blur-sm"
            onClick={() => handleCardClick(service)}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader>
                <div className="mb-4 w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <service.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                    {service.title}
                </CardTitle>
                <CardDescription className="line-clamp-3">
                    {service.description}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center text-sm text-primary font-medium mt-auto group-hover:translate-x-1 transition-transform">
                    {t.serviceLearnMore} <ArrowRight className="ml-1 h-4 w-4" />
                </div>
            </CardContent>
        </Card>
    );

    return (
        <>
            {/* Unified Responsive Grid/Slider */}
            <div
                ref={scrollContainerRef}
                className="
                    flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 -mx-4 px-4
                    md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:pb-0 md:mx-auto md:px-0 md:max-w-5xl
                    scrollbar-hide
                "
            >
                {services.map((service) => (
                    <div
                        key={service.id}
                        className="min-w-[85vw] sm:min-w-[350px] snap-center md:min-w-0 h-full"
                    >
                        <ServiceCardContent service={service} />
                    </div>
                ))}
            </div>

            {/* Pagination Dots - Mobile Only */}
            <div className="flex justify-center gap-2 mt-4 md:hidden">
                {services.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            const container = scrollContainerRef.current;
                            if (container) {
                                const cardWidth = container.scrollWidth / services.length;
                                container.scrollTo({ left: cardWidth * index, behavior: 'smooth' });
                            }
                        }}
                        className={`h-2 rounded-full transition-all duration-300 ${index === activeIndex
                                ? 'w-8 bg-primary'
                                : 'w-2 bg-primary/30 hover:bg-primary/50'
                            }`}
                        aria-label={`Go to service ${index + 1}`}
                    />
                ))}
            </div>

            {/* Detail Modal */}
            <Dialog open={!!selectedService} onOpenChange={(open) => !open && handleClose()}>
                <DialogContent
                    className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto"
                    showCloseButton={false}
                    onOpenAutoFocus={(e) => e.preventDefault()}
                >
                    <button
                        onClick={handleClose}
                        className="absolute right-4 top-4 rounded-full bg-secondary/50 hover:bg-secondary p-2 transition-colors z-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5 text-foreground/70" />
                    </button>
                    {selectedService && (
                        <>
                            <DialogHeader>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                                        <selectedService.icon className="h-7 w-7 text-primary" />
                                    </div>
                                    <DialogTitle className="text-2xl">{selectedService.title}</DialogTitle>
                                </div>
                                <DialogDescription className="text-base leading-relaxed">
                                    {selectedService.description}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="py-6">
                                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                                    {t.serviceSelectOptional}
                                </h4>
                                <RadioGroup value={selectedSubService} onValueChange={setSelectedSubService} className="grid gap-3">
                                    {selectedService.servicesList.map((item, index) => (
                                        <Label
                                            key={index}
                                            htmlFor={`service-${index}`}
                                            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedSubService === item
                                                ? "border-primary bg-primary/5 shadow-sm"
                                                : "border-border/40 hover:bg-secondary/50 hover:border-primary/30"
                                                }`}
                                        >
                                            <RadioGroupItem value={item} id={`service-${index}`} className="mt-1" />
                                            <span className="text-sm font-medium leading-relaxed">{item}</span>
                                        </Label>
                                    ))}
                                </RadioGroup>
                            </div>

                            <DialogFooter>
                                <Button onClick={handleCtaClick} className="w-full sm:w-auto text-base py-6">
                                    {selectedService.ctaText}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
