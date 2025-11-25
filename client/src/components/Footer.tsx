import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";

export function Footer() {
    const { t, language } = useLanguage();
    const [location, setLocation] = useLocation();

    const handleNavigation = (sectionId: string) => {
        // Check if we are on the home page (e.g. /en or /ko)
        const isHome = location === `/${language}` || location === `/${language}/`;

        if (isHome) {
            document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
        } else {
            setLocation(`/${language}`);
            // Small timeout to allow navigation to happen before scrolling
            setTimeout(() => {
                document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
            }, 100);
        }
    };

    return (
        <footer className="py-10 md:py-14 border-t bg-muted/20">
            <div className="container">
                <div className="grid md:grid-cols-3 gap-10 md:gap-12 mb-10">
                    {/* About Kwon EasyBureau */}
                    <div>
                        <h3 className="font-semibold text-base mb-3">{t.footerAboutTitle}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {t.footerAboutDesc}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-base mb-3">{t.footerQuickLinks}</h3>
                        <div className="space-y-2.5">
                            <a
                                href={`/${language}#services`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleNavigation("services");
                                }}
                                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                {t.navServices}
                            </a>
                            <a
                                href={`/${language}#process`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleNavigation("process");
                                }}
                                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                {t.navProcess}
                            </a>
                            <a
                                href={`/${language}#about`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleNavigation("about");
                                }}
                                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                {t.navAbout}
                            </a>
                            <a
                                href={`/${language}#contact`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleNavigation("contact");
                                }}
                                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                {t.navContact}
                            </a>
                        </div>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-semibold text-base mb-3">{t.footerLegal}</h3>
                        <div className="space-y-3">
                            <a
                                href={`/${language}/privacy-policy`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setLocation(`/${language}/privacy-policy`);
                                }}
                                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                {t.footerPrivacy}
                            </a>
                            <div className="text-sm text-muted-foreground pt-1">
                                <a
                                    href={`/${language}/imprint`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setLocation(`/${language}/imprint`);
                                    }}
                                    className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                    {t.footerImpressum}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center text-sm text-muted-foreground pt-8 border-t">
                    <p>© 2025 HandokHelper - {t.footerCopyright}</p>
                </div>
            </div>
        </footer>
    );
}
