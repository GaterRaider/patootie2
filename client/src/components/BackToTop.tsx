import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function BackToTop() {
    const [isVisible, setIsVisible] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    useEffect(() => {
        let observer: IntersectionObserver;

        const initObserver = () => {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                const submitButton = contactSection.querySelector('button[type="submit"]');
                const target = submitButton || contactSection;

                observer = new IntersectionObserver(
                    ([entry]) => {
                        // Show button if target is NOT intersecting and is above the viewport (scrolled past)
                        // boundingClientRect.top < 0 means it's above the viewport
                        setIsVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0);
                    },
                    {
                        root: null, // viewport
                        threshold: 0, // trigger as soon as even 1px is out
                    }
                );

                observer.observe(target);
            }
        };

        // Small timeout to ensure DOM is ready (especially with hydration/rendering timing)
        const timeoutId = setTimeout(initObserver, 1000);

        return () => {
            clearTimeout(timeoutId);
            if (observer) observer.disconnect();
        };
    }, []);

    const scrollToContact = () => {
        // Trigger click animation
        setIsClicked(true);
        setTimeout(() => setIsClicked(false), 300);

        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    if (!isVisible) return null;

    return (
        <Button
            onClick={scrollToContact}
            size="icon"
            className={`!fixed !bottom-8 !right-8 !z-40 h-12 w-12 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 hover:-translate-y-1 hover:scale-110 active:scale-95 group relative overflow-hidden ${isClicked ? 'animate-bounce' : ''}`}
            aria-label="Back to contact form"
            style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 40 }}
        >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />

            {/* Arrow icon with rotation animation */}
            <ArrowUp className="h-5 w-5 relative z-10 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110" />

            {/* Pulse ring on hover */}
            <div className="absolute inset-0 rounded-full bg-primary opacity-0 group-hover:opacity-20 group-hover:animate-ping" />
        </Button>
    );
}
