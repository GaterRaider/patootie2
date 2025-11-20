import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import { useLocation } from "wouter";
import { Footer } from "@/components/Footer";

export default function Imprint() {
    const { language, setLanguage, t } = useLanguage();
    const { theme, toggleTheme } = useTheme();
    const [, setLocation] = useLocation();

    const getThemeIcon = () => {
        return theme === "light" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />;
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Accent Bar */}
            <div className="h-1 bg-gradient-to-r from-primary via-blue-500 to-primary"></div>

            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-sm">
                <div className="container flex h-20 items-center justify-between gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setLocation("/")}
                        className="gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        {language === "ko" ? "홈으로 돌아가기" : "Back to Home"}
                    </Button>

                    <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                        {/* Language Toggle */}
                        <LanguageSelector />

                        {/* Theme Toggle */}
                        {toggleTheme && (
                            <button
                                onClick={toggleTheme}
                                className="p-1.5 md:p-2 rounded-full hover:bg-secondary/80 transition-colors flex-shrink-0"
                                title={`Current theme: ${theme}`}
                            >
                                {getThemeIcon()}
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 py-12 md:py-16">
                <div className="container max-w-4xl">
                    <h1 className="text-3xl md:text-4xl font-bold mb-8">Impressum</h1>

                    <div className="space-y-8 text-muted-foreground leading-relaxed">
                        <div>
                            <p>Soyoung Kwon</p>
                            <p>Michaelstraße 26</p>
                            <p>65936 Frankfurt am Main</p>
                        </div>

                        <div>
                            <h2 className="text-xl md:text-2xl font-semibold mb-3 text-foreground">Kontakt</h2>
                            <p>E-Mail: info (at) handokhelper.de</p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
