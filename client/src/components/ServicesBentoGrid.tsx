import { useState, useEffect } from "react";
import { LucideIcon, ArrowRight, Check, X } from "lucide-react";
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
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel";
import { useMediaQuery } from "@/hooks/use-mobile";

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
    language: "en" | "ko";
}

export function ServicesBentoGrid({ services, onSelect, language }: ServicesBentoGridProps) {
    const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
    const [selectedSubService, setSelectedSubService] = useState<string>("");
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const isMobile = useMediaQuery("(max-width: 768px)");

    useEffect(() => {
        if (!api) {
            return;
        }

        setCurrent(api.selectedScrollSnap());

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);

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
                    {language === "ko" ? "자세히 보기" : "Learn more"} <ArrowRight className="ml-1 h-4 w-4" />
                </div>
            </CardContent>
        </Card>
    );

    return (
        <>
            {/* Desktop Grid */}
            <div className="hidden md:grid grid-cols-2 gap-6 max-w-5xl mx-auto">
                {services.map((service) => (
                    <ServiceCardContent key={service.id} service={service} />
                ))}
            </div>

            {/* Mobile Carousel */}
            <div className="md:hidden">
                <Carousel
                    setApi={setApi}
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full max-w-sm mx-auto"
                >
                    <CarouselContent className="-ml-2 md:-ml-4">
                        {services.map((service) => (
                            <CarouselItem key={service.id} className="pl-2 md:pl-4 basis-11/12">
                                <div className="p-1 h-full">
                                    <ServiceCardContent service={service} />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <div className="flex justify-center gap-2 mt-4">
                        {services.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => api?.scrollTo(index)}
                                className={`h-2 w-2 rounded-full transition-all duration-300 ${current === index ? "bg-primary w-4" : "bg-gray-300 dark:bg-gray-700"
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </Carousel>
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
                                    {language === "ko" ? "서비스 선택 (선택사항)" : "Select a Service (Optional)"}
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
