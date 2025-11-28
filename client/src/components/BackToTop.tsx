import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function BackToTop() {
    const [isVisible, setIsVisible] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Get the contact form section
            const contactSection = document.getElementById('contact');

            if (contactSection) {
                // Find the submit button within the contact form
                const submitButton = contactSection.querySelector('button[type="submit"]');

                if (submitButton) {
                    const buttonRect = submitButton.getBoundingClientRect();
                    // Show button only when user has scrolled past the submit button
                    setIsVisible(buttonRect.bottom < 0);
                } else {
                    // Fallback: show after scrolling past contact section
                    const contactRect = contactSection.getBoundingClientRect();
                    setIsVisible(contactRect.bottom < window.innerHeight / 2);
                }
            }
        };

        // Add scroll listener
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Check initial state
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
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
