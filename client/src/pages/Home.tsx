import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";
import { FileText, Users, Plane, HelpCircle, CheckCircle, Send, Mail, Moon, Sun, MapPin, Phone, Menu, X } from "lucide-react";
import { ServicesBentoGrid } from "@/components/ServicesBentoGrid";
import { ContactForm } from "@/components/ContactForm";
import { countries } from "@/lib/countries";
import { useLocation } from "wouter";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet-async";

export default function Home() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [, setLocation] = useLocation();
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedSubService, setSelectedSubService] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [refId, setRefId] = useState<string | undefined>(undefined);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const submitMutation = trpc.contact.submit.useMutation({
    onSuccess: (data) => {
      setShowSuccess(true);
      setIsSubmitting(false);
      setRefId(data.refId);
    },
    onError: (error) => {
      setIsSubmitting(false);
      toast.error(error.message);
    },
  });

  const handleReset = () => {
    setShowSuccess(false);
    setSelectedService("");
    setRefId(undefined);
  };

  const handleServiceCardClick = (service: string, subService?: string) => {
    setSelectedService(service);
    if (subService) {
      setSelectedSubService(subService);
    } else {
      setSelectedSubService("");
    }
    // Scroll to contact form
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      service: formData.get("service") as string,
      subService: selectedSubService || undefined,
      salutation: formData.get("salutation") as string,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      dateOfBirth: formData.get("dateOfBirth") as string,
      email: formData.get("email") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      street: formData.get("street") as string,
      addressLine2: formData.get("addressLine2") as string || undefined,
      postalCode: formData.get("postalCode") as string,
      city: formData.get("city") as string,
      stateProvince: formData.get("stateProvince") as string || undefined,
      country: formData.get("country") as string,
      message: formData.get("message") as string,
      contactConsent: formData.get("contactConsent") === "on",
      privacyConsent: formData.get("privacyConsent") === "on",
      honeypot: formData.get("honeypot") as string || undefined,
    };

    submitMutation.mutate(data);
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const getThemeIcon = () => {
    return theme === "light" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <html lang={language} />
        <title>{`${t.siteTitle} - ${t.heroTitle}`}</title>
        <meta name="description" content={t.heroDescription} />
        <meta property="og:title" content={`${t.siteTitle} - ${t.heroTitle}`} />
        <meta property="og:description" content={t.heroDescription} />
        <meta property="og:type" content="website" />

        {/* Structured Data (JSON-LD) for SEO */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            "name": "HandokHelper",
            "description": language === "ko"
              ? "독일 관공서 업무 처리를 위한 전문 지원 서비스"
              : "Professional assistance for dealing with German authorities",
            "url": "https://handokhelper.de",
            "logo": "https://handokhelper.de/images/HandokHelperLogoOnly.png",
            "image": "https://handokhelper.de/images/HandokHelperLogoOnly.png",
            "email": "info@handokhelper.de",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "DE"
            },
            "areaServed": [
              {
                "@type": "Country",
                "name": "Germany"
              },
              {
                "@type": "Country",
                "name": "South Korea"
              }
            ],
            "serviceType": [
              "Immigration & Residence Services",
              "Registration & Bureaucracy",
              "Pension & Social Benefits",
              "German Authority Support"
            ],
            "priceRange": "$$",
            "availableLanguage": [
              {
                "@type": "Language",
                "name": "English"
              },
              {
                "@type": "Language",
                "name": "Korean"
              },
              {
                "@type": "Language",
                "name": "German"
              }
            ],
            "knowsAbout": [
              "German Immigration Law",
              "Visa Applications",
              "Residence Permits",
              "German Bureaucracy",
              "Pension Claims",
              "Social Benefits"
            ]
          })}
        </script>
      </Helmet>
      {/* Accent Bar */}
      <div className="h-1 bg-gradient-to-r from-primary via-blue-500 to-primary"></div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container flex h-20 items-center gap-2 md:gap-4">
          {/* Mobile Hamburger Menu Button - Left */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 -ml-2 rounded-md hover:bg-secondary/80 transition-colors flex-shrink-0"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Logo + Text - Centered on mobile, left-aligned on desktop */}
          <div className="flex items-center gap-2 md:gap-3 flex-1 md:flex-initial justify-center md:justify-start min-w-0">
            <img src="/images/HandokHelperLogoOnly.png" alt="HandokHelper Logo" className="h-8 md:h-10 w-auto flex-shrink-0 object-contain" />
            <h1 className="text-base md:text-xl font-bold leading-tight whitespace-nowrap">
              <span className="hidden sm:inline">{t.siteTitle}</span>
              <span className="sm:hidden">HandokHelper</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 flex-1 justify-center">
            <button
              onClick={() => scrollToSection("services")}
              className="text-sm font-medium hover:text-primary transition-all duration-300 relative group hover:-translate-y-0.5"
            >
              {t.navServices}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 ease-out group-hover:w-full"></span>
            </button>
            <button
              onClick={() => scrollToSection("process")}
              className="text-sm font-medium hover:text-primary transition-all duration-300 relative group hover:-translate-y-0.5"
            >
              {t.navProcess}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 ease-out group-hover:w-full"></span>
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="text-sm font-medium hover:text-primary transition-all duration-300 relative group hover:-translate-y-0.5"
            >
              {t.navAbout}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 ease-out group-hover:w-full"></span>
            </button>
            <Button
              onClick={() => scrollToSection("contact")}
              size="sm"
              className="shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:scale-105"
            >
              {t.navContact}
            </Button>
          </nav>

          {/* Language & Theme Toggles - Right */}
          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
            {/* Language Toggle with Flag Icons - Responsive Scaling */}
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

      {/* Mobile Slide-out Menu - Outside Header */}
      {mobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-[9999] md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-out Panel */}
          <div className="fixed top-0 left-0 h-full w-64 bg-background border-r shadow-xl z-[10000] md:hidden animate-in slide-in-from-left duration-300">
            <div className="flex flex-col h-full">
              {/* Menu Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="font-semibold text-lg">Menu</h2>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-md hover:bg-secondary/80 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col p-4 gap-2">
                <button
                  onClick={() => {
                    scrollToSection("services");
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-4 py-3 rounded-md hover:bg-secondary/80 transition-colors font-medium"
                >
                  {t.navServices}
                </button>
                <button
                  onClick={() => {
                    scrollToSection("process");
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-4 py-3 rounded-md hover:bg-secondary/80 transition-colors font-medium"
                >
                  {t.navProcess}
                </button>
                <button
                  onClick={() => {
                    scrollToSection("about");
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-4 py-3 rounded-md hover:bg-secondary/80 transition-colors font-medium"
                >
                  {t.navAbout}
                </button>
                <Button
                  onClick={() => {
                    scrollToSection("contact");
                    setMobileMenuOpen(false);
                  }}
                  className="mt-2 w-full"
                >
                  {t.navContact}
                </Button>
              </nav>
            </div>
          </div>
        </>
      )}



      {/* Hero Section */}
      <section className="py-8 md:py-14 bg-gradient-to-b from-secondary/50 to-background">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight">{t.heroTitle}</h2>
              <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 leading-relaxed">{t.heroDescription}</p>

              <div className="space-y-2 md:space-y-3 mb-6 md:mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm md:text-base text-foreground">{t.heroBullet1}</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm md:text-base text-foreground">{t.heroBullet2}</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm md:text-base text-foreground">{t.heroBullet3}</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm md:text-base text-foreground">{t.heroBullet4}</p>
                </div>
              </div>

              <Button size="lg" onClick={() => scrollToSection("contact")} className="shadow-lg hover:shadow-xl transition-shadow">
                {t.navContact}
              </Button>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/images/patootie-portrait.jpg"
                  alt="Kwon EasyBureau"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-8 md:py-14">
        <div className="container">
          <div className="text-center mb-12 md:mb-16">
            <span className="text-blue-600 font-bold tracking-wide uppercase text-xs md:text-sm mb-2 block">WHAT WE OFFER</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">{t.servicesHeading}</h2>
            <div className="h-1 w-20 bg-blue-600 rounded-full mx-auto mb-6"></div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {language === "ko"
                ? "독일 관료 업무를 전문적으로 지원합니다. 서비스를 선택하여 자세히 알아보세요."
                : "Professional support for German bureaucracy. Select a service to learn more."}
            </p>
          </div>

          <ServicesBentoGrid
            services={[
              {
                id: "immigration",
                icon: Plane,
                title: t.serviceCard1Title,
                description: t.serviceCard1Desc,
                servicesList: t.serviceCard1Services,
                ctaText: t.serviceCard1CTA,
              },
              {
                id: "registration",
                icon: FileText,
                title: t.serviceCard2Title,
                description: t.serviceCard2Desc,
                servicesList: t.serviceCard2Services,
                ctaText: t.serviceCard2CTA,
              },
              {
                id: "pension",
                icon: Users,
                title: t.serviceCard3Title,
                description: t.serviceCard3Desc,
                servicesList: t.serviceCard3Services,
                ctaText: t.serviceCard3CTA,
              },
              {
                id: "other",
                icon: HelpCircle,
                title: t.serviceCard4Title,
                description: t.serviceCard4Desc,
                servicesList: t.serviceCard4Services,
                ctaText: t.serviceCard4CTA,
              },
            ]}
            onSelect={handleServiceCardClick}
            language={language}
          />
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-8 md:py-14 bg-slate-50 dark:bg-background/50">
        <div className="container">
          <div className="text-center mb-12 md:mb-16">
            <span className="text-blue-600 font-bold tracking-wide uppercase text-xs md:text-sm mb-2 block">OUR PROCESS</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">{t.processHeading}</h2>
            <div className="h-1 w-20 bg-blue-600 rounded-full mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">
                1
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">{t.processStep1Title}</h3>
              <p className="text-sm md:text-base text-muted-foreground">{t.processStep1Desc}</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">
                2
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">{t.processStep2Title}</h3>
              <p className="text-sm md:text-base text-muted-foreground">{t.processStep2Desc}</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">
                3
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">{t.processStep3Title}</h3>
              <p className="text-sm md:text-base text-muted-foreground">{t.processStep3Desc}</p>
            </div>
          </div>

          <p className="text-center text-xs md:text-sm text-muted-foreground mt-6 md:mt-8 max-w-2xl mx-auto">
            {t.processNote}
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="py-8 md:py-14">
        <div className="container max-w-4xl">
          <div className="text-center mb-12 md:mb-16">
            <span className="text-blue-600 font-bold tracking-wide uppercase text-xs md:text-sm mb-2 block">CONTACT</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">{t.contactHeading}</h2>
            <div className="h-1 w-20 bg-blue-600 rounded-full mx-auto"></div>
          </div>

          <Card className="shadow-xl border-2">
            <CardContent className="pt-8 px-6 md:px-10">
              <ContactForm
                t={t}
                selectedService={selectedService}
                selectedSubService={selectedSubService}
                setSelectedService={setSelectedService}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                onLocationChange={setLocation}
                isSuccess={showSuccess}
                onReset={handleReset}
                refId={refId}
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-8 md:py-14 bg-slate-50 dark:bg-background/50">
        <div className="container max-w-4xl">
          <div className="text-center mb-12 md:mb-16">
            <span className="text-blue-600 font-bold tracking-wide uppercase text-xs md:text-sm mb-2 block">WHO WE ARE</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">{t.aboutHeading}</h2>
            <div className="h-1 w-20 bg-blue-600 rounded-full mx-auto"></div>
          </div>

          <div className="space-y-4 md:space-y-6 text-base md:text-lg leading-relaxed">
            <p>{t.aboutParagraph1}</p>
            <p>{t.aboutParagraph2}</p>
            <p>{t.aboutParagraph3}</p>

            <div className="flex flex-col items-center gap-4 pt-8">
              <h3 className="font-semibold text-muted-foreground uppercase tracking-wider text-sm">{t.aboutLanguages}</h3>
              <div className="flex flex-wrap justify-center gap-3">
                <Badge variant="outline" className="px-4 py-2 text-base font-medium bg-background/50 dark:bg-secondary backdrop-blur-sm border-primary/20 text-foreground hover:bg-primary/5 dark:hover:bg-primary/20 hover:border-primary/40 dark:hover:border-primary/60 transition-all duration-300 cursor-default shadow-sm">
                  🇺🇸 English
                </Badge>
                <Badge variant="outline" className="px-4 py-2 text-base font-medium bg-background/50 dark:bg-secondary backdrop-blur-sm border-primary/20 text-foreground hover:bg-primary/5 dark:hover:bg-primary/20 hover:border-primary/40 dark:hover:border-primary/60 transition-all duration-300 cursor-default shadow-sm">
                  🇰🇷 Korean (한국어)
                </Badge>
                <Badge variant="outline" className="px-4 py-2 text-base font-medium bg-background/50 dark:bg-secondary backdrop-blur-sm border-primary/20 text-foreground hover:bg-primary/5 dark:hover:bg-primary/20 hover:border-primary/40 dark:hover:border-primary/60 transition-all duration-300 cursor-default shadow-sm">
                  🇩🇪 German (Deutsch)
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
