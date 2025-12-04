import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

export interface ServiceItem {
    id: string;
    icon: LucideIcon;
    title: string;
    tagline?: string;
    badge?: string;
    isBundle?: boolean;
    description: string;
    servicesList: string[];
    ctaText: string;
}

interface ServicesBentoGridProps {
    services: ServiceItem[];
    onSelect: (serviceTitle: string, subService?: string, subServices?: string[]) => void;
    language: Language;
}

export function ServicesBentoGrid({ services, onSelect, language }: ServicesBentoGridProps) {
    const t = getTranslations(language);
    const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
    const [selectedSubService, setSelectedSubService] = useState<string>("");
    const [selectedSubServices, setSelectedSubServices] = useState<string[]>([]);
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
        setSelectedSubServices([]); // Reset sub-services
    };

    const handleClose = () => {
        setSelectedService(null);
        setSelectedSubService("");
        setSelectedSubServices([]);
    };

    const handleCtaClick = () => {
        if (selectedService) {
            onSelect(
                selectedService.title,
                selectedSubService || undefined,
                selectedService.isBundle ? selectedSubServices : undefined
            );
            handleClose();
        }
    };

    const ServiceCardContent = ({ service }: { service: ServiceItem }) => (
        <Card
            className="h-full cursor-pointer group hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/20 relative overflow-hidden bg-card/50 backdrop-blur-sm flex flex-col hover:-translate-y-2 hover:scale-[1.02]"
            onClick={() => handleCardClick(service)}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader>
                <div className="mb-4 w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <service.icon className="h-6 w-6 text-primary" />
                </div>
                {service.badge && (
                    <Badge variant="secondary" className="mb-2 w-fit bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                        {service.badge}
                    </Badge>
                )}
                <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                    {service.title}
                </CardTitle>
                {service.tagline && (
                    <p className="text-sm font-medium text-primary/80 mb-2">
                        {service.tagline}
                    </p>
                )}
                <CardDescription className="line-clamp-3">
                    {service.description}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-end">
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
                    grid grid-flow-col auto-cols-[calc(100vw-4rem)] sm:auto-cols-[350px] overflow-x-auto snap-x snap-mandatory gap-4 pb-6 -mx-4 px-4
                    md:grid-flow-row md:grid-cols-2 md:auto-cols-auto md:gap-6 md:overflow-visible md:pb-0 md:mx-auto md:px-0 md:max-w-5xl
                    scrollbar-hide
                "
                style={{ scrollSnapStop: 'always' }}
            >
                {services.map((service, index) => (
                    <div
                        key={service.id}
                        className="w-full h-full snap-center"
                        style={{ scrollSnapStop: 'always' }}
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
                        className="absolute right-4 top-4 rounded-full bg-[#f7f8fa] dark:bg-secondary/50 hover:bg-[#eff1f5] dark:hover:bg-secondary p-2 transition-colors z-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
                                {selectedService.isBundle ? (
                                    <div className="grid gap-3">
                                        {selectedService.servicesList.map((item, index) => (
                                            <div key={index}>
                                                <Label
                                                    htmlFor={`service-${index}`}
                                                    className={cn(
                                                        "flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 relative overflow-hidden",
                                                        "hover:shadow-md active:scale-[0.99]",
                                                        selectedSubServices.includes(item)
                                                            ? "border-primary bg-primary/10 shadow-sm"
                                                            : "border-muted/60 bg-[#f7f8fa] dark:bg-card hover:border-primary/50 hover:bg-primary/5"
                                                    )}
                                                >
                                                    <Checkbox
                                                        id={`service-${index}`}
                                                        checked={selectedSubServices.includes(item)}
                                                        onCheckedChange={(checked) => {
                                                            if (checked) {
                                                                setSelectedSubServices([...selectedSubServices, item]);
                                                            } else {
                                                                setSelectedSubServices(selectedSubServices.filter(s => s !== item));
                                                            }
                                                        }}
                                                        className="mt-1 shrink-0"
                                                    />
                                                    <span className="text-base font-medium leading-relaxed">{item}</span>
                                                    {selectedSubServices.includes(item) && (
                                                        <div className="absolute inset-0 bg-primary/5 pointer-events-none animate-in fade-in duration-200" />
                                                    )}
                                                </Label>
                                                {/* Show sub-items if this is the Relocation Bundle item */}
                                                {(item === "Relocation Bundle" || item === "이주 패키지" || item === "Umzugspaket") && t.relocationBundleItems && (
                                                    <div className="ml-4 mt-3 p-4 rounded-lg bg-secondary/30 border border-border/50 space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
                                                        <div className="text-xs font-semibold text-primary/80 uppercase tracking-wider mb-2">{t.includedInBundle}</div>
                                                        {t.relocationBundleItems.map((subItem, subIndex) => (
                                                            <div key={subIndex} className="flex items-start gap-2.5 text-sm text-foreground/90">
                                                                <div className="mt-1 w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                                    {selectedSubServices.includes(item) && (
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-in zoom-in duration-200" />
                                                                    )}
                                                                </div>
                                                                <span className={cn("leading-relaxed transition-colors duration-200", selectedSubServices.includes(item) ? "text-foreground" : "text-muted-foreground")}>{subItem}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <RadioGroup value={selectedSubService} onValueChange={setSelectedSubService} className="grid gap-3">
                                        {selectedService.servicesList.map((item, index) => (
                                            <Label
                                                key={index}
                                                htmlFor={`service-${index}`}
                                                className={cn(
                                                    "flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 relative overflow-hidden",
                                                    "hover:shadow-md active:scale-[0.99]",
                                                    selectedSubService === item
                                                        ? "border-primary bg-primary/10 shadow-sm"
                                                        : "border-muted/60 bg-[#f7f8fa] dark:bg-card hover:border-primary/50 hover:bg-primary/5"
                                                )}
                                            >
                                                <RadioGroupItem value={item} id={`service-${index}`} className="mt-1 shrink-0" />
                                                <span className="text-base font-medium leading-relaxed">{item}</span>
                                                {selectedSubService === item && (
                                                    <div className="absolute inset-0 bg-primary/5 pointer-events-none animate-in fade-in duration-200" />
                                                )}
                                            </Label>
                                        ))}
                                    </RadioGroup>
                                )}
                            </div>

                            <DialogFooter>
                                <Button onClick={handleCtaClick} className="w-full sm:w-auto text-base py-6">
                                    {t.serviceSelectChoice}
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
