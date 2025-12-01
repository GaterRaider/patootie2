import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface LanguageOption {
    code: 'en' | 'ko' | 'de';
    name: string;
    flag: string;
}

const languages: LanguageOption[] = [
    { code: 'en', name: 'English', flag: '/flags/usa.svg' },
    { code: 'ko', name: '한국어', flag: '/flags/south-korea.svg' },
    { code: 'de', name: 'Deutsch', flag: '/flags/germany.svg' },
];

export function LanguageSelector() {
    const { language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedLanguage = languages.find(lang => lang.code === language) || languages[0];

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 ${isOpen
                        ? 'bg-background border-primary/50 shadow-sm ring-2 ring-primary/10'
                        : 'bg-secondary/80 hover:bg-secondary hover:border-primary/30 border-transparent hover:shadow-sm'
                    }`}
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <img
                    src={selectedLanguage.flag}
                    alt={`${selectedLanguage.name} Flag`}
                    className="h-4 w-auto object-contain shadow-sm rounded-[1px]"
                />
                <span className="text-sm font-medium hidden sm:inline-block">
                    {selectedLanguage.name}
                </span>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-xl bg-card border border-border/50 shadow-xl py-0 z-50 animate-in fade-in zoom-in-95 duration-100 ring-1 ring-black/5 overflow-hidden">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => {
                                setLanguage(lang.code);
                                setIsOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors ${language === lang.code
                                    ? 'bg-primary/10 text-primary font-medium'
                                    : 'text-foreground hover:bg-muted/80'
                                }`}
                        >
                            <img
                                src={lang.flag}
                                alt={`${lang.name} Flag`}
                                className="h-4 w-auto object-contain shadow-sm rounded-[1px]"
                            />
                            {lang.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
