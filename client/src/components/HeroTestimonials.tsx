import React, { useEffect, useState, useMemo } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Star } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';

interface TestimonialItem {
    id: string;
    name: string;
    rating: number; // 1-5
    profilePicture?: string;
    text?: string;
    active: boolean;
}

interface HeroTestimonialsConfig {
    enabled: boolean;
    autoPlay?: boolean;
    autoPlayInterval?: number;
    items: TestimonialItem[];
}

export function HeroTestimonials() {
    const { data: settings } = trpc.siteSettings.getAll.useQuery();
    const [config, setConfig] = useState<HeroTestimonialsConfig | null>(null);

    // Configure Autoplay plugin
    const plugins = useMemo(() => {
        if (config?.autoPlay) {
            return [
                Autoplay({
                    delay: (config.autoPlayInterval || 5) * 1000,
                    stopOnInteraction: true
                })
            ];
        }
        return [];
    }, [config?.autoPlay, config?.autoPlayInterval]);

    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' }, plugins);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (settings?.heroTestimonials) {
            try {
                const parsed = JSON.parse(settings.heroTestimonials);
                setConfig(parsed);
            } catch (e) {
                console.error("Failed to parse hero testimonials setting", e);
            }
        }
    }, [settings]);

    useEffect(() => {
        if (emblaApi) {
            emblaApi.on('select', () => {
                setCurrentIndex(emblaApi.selectedScrollSnap());
            });
        }
    }, [emblaApi]);

    if (!config?.enabled || !config.items.length) {
        return null;
    }

    const activeItems = config.items.filter(item => item.active);

    if (activeItems.length === 0) {
        return null;
    }

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={cn(
                            "w-3.5 h-3.5",
                            star <= rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
                        )}
                    />
                ))}
            </div>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mt-6 md:mt-8 flex justify-center md:justify-start w-full px-4 md:px-0"
        >
            {activeItems.length === 1 ? (
                // Single Testimonial View
                <div className="flex flex-col gap-2 max-w-full md:max-w-md mx-auto md:mx-0">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 md:h-10 md:w-10 border border-white dark:border-slate-800 shadow-sm shrink-0">
                            <AvatarImage src={activeItems[0].profilePicture} alt={activeItems[0].name} className="object-cover" />
                            <AvatarFallback className="bg-slate-200 dark:bg-slate-800 text-muted-foreground font-medium text-xs">
                                {activeItems[0].name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="font-semibold text-foreground truncate">{activeItems[0].name}</span>
                            <span className="text-slate-900 dark:text-slate-200 mx-0.5">|</span>
                            <div className="flex items-center gap-1.5 shrink-0">
                                {renderStars(activeItems[0].rating)}
                                <span className="font-bold text-muted-foreground">{activeItems[0].rating.toFixed(1)}</span>
                            </div>
                        </div>
                    </div>
                    {activeItems[0].text && (
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-tight">{activeItems[0].text}</p>
                    )}
                </div>
            ) : (
                // Carousel View
                <div className="relative max-w-[280px] sm:max-w-md w-full group mx-auto md:mx-0">
                    <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex">
                            {activeItems.map((item) => (
                                <div className="flex-[0_0_100%] min-w-0 pr-4 md:pr-6" key={item.id}>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9 md:h-10 md:w-10 border border-white dark:border-slate-800 shadow-sm shrink-0">
                                                <AvatarImage src={item.profilePicture} alt={item.name} className="object-cover" />
                                                <AvatarFallback className="bg-slate-200 dark:bg-slate-800 text-muted-foreground font-medium text-xs">
                                                    {item.name.slice(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="font-semibold text-foreground truncate">{item.name}</span>
                                                <span className="text-slate-900 dark:text-slate-200 mx-0.5">|</span>
                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    {renderStars(item.rating)}
                                                    <span className="font-bold text-muted-foreground">{item.rating.toFixed(1)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        {item.text && (
                                            <p className="text-sm text-muted-foreground line-clamp-2 leading-tight">{item.text}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Dots */}
                    <div className="absolute -bottom-4 left-0 right-0 flex justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 touch-none pointer-events-none md:pointer-events-auto">
                        {activeItems.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => emblaApi?.scrollTo(index)}
                                className={cn(
                                    "w-1 h-1 rounded-full transition-all duration-300 pointer-events-auto",
                                    index === currentIndex
                                        ? "bg-slate-600 dark:bg-slate-400 w-3"
                                        : "bg-slate-300 dark:bg-slate-600 hover:bg-slate-400"
                                )}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    );
}
