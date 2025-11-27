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
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FileText, Users, Plane, HelpCircle, CheckCircle, Send, Mail, Moon, Sun, MapPin, Phone, Menu, X } from "lucide-react";
import { ServicesBentoGrid } from "@/components/ServicesBentoGrid";
import { ContactForm } from "@/components/ContactForm";
import { countries } from "@/lib/countries";
import { useLocation } from "wouter";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { FAQ } from "@/components/FAQ";

export default function Home() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [location, setLocation] = useLocation();
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedSubService, setSelectedSubService] = useState<string>("");
  const [selectedSubServices, setSelectedSubServices] = useState<string[]>([]);
  const [selectedViaCard, setSelectedViaCard] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [refId, setRefId] = useState<string | undefined>(undefined);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Load FAQ data from database via tRPC
  const { data: faqData } = trpc.faq.getByLanguage.useQuery({
    language: language as 'en' | 'ko' | 'de',
  });

  // Handle scroll to section from URL query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("scrollTo") === "contact") {
      // Small timeout to ensure DOM is ready
      setTimeout(() => {
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
        // Optional: Clean up URL
        window.history.replaceState({}, "", "/");
      }, 100);
    }
  }, []);

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

  const handleServiceCardClick = (service: string, subService?: string, subServices?: string[]) => {
    setSelectedService(service);
    setSelectedViaCard(true);
    if (subService) {
      setSelectedSubService(subService);
    } else {
      setSelectedSubService("");
    }
    if (subServices) {
      setSelectedSubServices(subServices);
    } else {
      setSelectedSubServices([]);
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
      subServices: selectedSubServices.length > 0 ? selectedSubServices : undefined,
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
      country: formData.get("country")?.toString().replace("suggested__", "") as string,
      message: formData.get("message") as string,
      contactConsent: formData.get("contactConsent") === "on",
      privacyConsent: formData.get("privacyConsent") === "on",
      honeypot: formData.get("honeypot") as string || undefined,
    };

    submitMutation.mutate(data);
  };

  const scrollToSection = (id: string) => {
    const isHome = location === `/${language}` || location === `/${language}/`;

    if (isHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      setLocation(`/${language}`);
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const getThemeIcon = () => {
    return theme === "light" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <html lang={language} />

        {/* Primary Meta Tags */}
        <title>
          {language === "ko"
            ? "독일 관료 업무 지원 | 주택, 비자 & 이민 서비스 - HandokHelper"
            : "German Bureaucracy Help for Expats | Housing, Visa & Immigration Support"}
        </title>
        <meta
          name="description"
          content={language === "ko"
            ? "독일 관료, 주택, 비자 및 Anmeldung 전문 지원. 독일 거주 외국인을 위한 전문 서비스. 영어, 한국어, 독일어 지원."
            : "Expert help with German bureaucracy, housing, visas & Anmeldung. Professional support for expats in Germany. English, Korean & German service."}
        />
        <meta name="keywords" content="German bureaucracy, expat services Germany, housing Germany, visa assistance, Anmeldung, immigration help, German authorities, 독일 관료, 독일 비자, 독일 주택" />
        <meta name="author" content="HandokHelper" />

        {/* Canonical URL */}
        <link rel="canonical" href={`https://www.handokhelper.de/${language}/`} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://www.handokhelper.de/${language}/`} />
        <meta property="og:site_name" content="HandokHelper" />
        <meta
          property="og:title"
          content={language === "ko"
            ? "독일 관료 업무 지원 | HandokHelper"
            : "German Bureaucracy Help for Expats | HandokHelper"}
        />
        <meta
          property="og:description"
          content={language === "ko"
            ? "독일 관료, 주택, 비자 및 Anmeldung 전문 지원. 독일 거주 외국인을 위한 전문 서비스."
            : "Expert help with German bureaucracy, housing, visas & Anmeldung. Professional support for expats in Germany."}
        />
        <meta property="og:image" content="https://www.handokhelper.de/images/HandokHelperLogoOnly.webp" />
        <meta property="og:image:width" content="512" />
        <meta property="og:image:height" content="512" />
        <meta property="og:locale" content={language === "ko" ? "ko_KR" : "en_US"} />
        <meta property="og:locale:alternate" content="en_US" />
        <meta property="og:locale:alternate" content="ko_KR" />
        <meta property="og:locale:alternate" content="de_DE" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={language === "ko"
            ? "독일 관료 업무 지원 | HandokHelper"
            : "German Bureaucracy Help for Expats | HandokHelper"}
        />
        <meta
          name="twitter:description"
          content={language === "ko"
            ? "독일 관료, 주택, 비자 및 Anmeldung 전문 지원. 영어, 한국어, 독일어 서비스."
            : "Expert help with German bureaucracy, housing, visas & Anmeldung. English, Korean & German service."}
        />
        <meta name="twitter:image" content="https://www.handokhelper.de/images/HandokHelperLogoOnly.webp" />

        {/* Multilingual / hreflang */}
        <link rel="alternate" hrefLang="en" href="https://www.handokhelper.de/en/" />
        <link rel="alternate" hrefLang="ko" href="https://www.handokhelper.de/ko/" />
        <link rel="alternate" hrefLang="de" href="https://www.handokhelper.de/de/" />
        <link rel="alternate" hrefLang="x-default" href="https://www.handokhelper.de/en/" />

        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

        {/* Theme Color */}
        <meta name="theme-color" content="#3b82f6" />

        {/* Structured Data (JSON-LD) for SEO */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            "name": "HandokHelper",
            "description": language === "ko"
              ? "독일 관공서 업무 처리를 위한 전문 지원 서비스"
              : "Professional assistance for dealing with German authorities",
            "url": `https://www.handokhelper.de/${language}/`,
            "logo": "https://www.handokhelper.de/images/HandokHelperLogoOnly.webp",
            "image": "https://www.handokhelper.de/images/HandokHelperLogoOnly.webp",
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
            "priceRange": "€€",
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
              "Social Benefits",
              "Anmeldung",
              "Housing Search Germany",
              "Expat Services"
            ]
          })}
        </script>
        {/* FAQ Schema */}
        {faqData?.jsonLd && (
          <script type="application/ld+json">
            {JSON.stringify(faqData.jsonLd)}
          </script>
        )}

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
            <div className="text-base md:text-xl font-bold leading-tight whitespace-nowrap">
              <span className="hidden sm:inline">{t.siteTitle}</span>
              <span className="sm:hidden">HandokHelper</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 flex-1 justify-center">
            <a
              href={`/${language}#services`}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("services");
              }}
              className="text-sm font-medium hover:text-primary transition-all duration-300 relative group hover:-translate-y-0.5"
            >
              {t.navServices}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 ease-out group-hover:w-full"></span>
            </a>
            <a
              href={`/${language}#process`}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("process");
              }}
              className="text-sm font-medium hover:text-primary transition-all duration-300 relative group hover:-translate-y-0.5"
            >
              {t.navProcess}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 ease-out group-hover:w-full"></span>
            </a>
            <a
              href={`/${language}#about`}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("about");
              }}
              className="text-sm font-medium hover:text-primary transition-all duration-300 relative group hover:-translate-y-0.5"
            >
              {t.navAbout}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 ease-out group-hover:w-full"></span>
            </a>
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


      {/* Main Content */}
      <main>
        {/* Hero Section */}
        {/* Hero Section */}
        <section className="py-8 md:py-14 bg-gradient-to-b from-primary/5 to-background dark:from-primary/10 dark:to-background">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight">{t.heroTitle}</h1>
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
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm md:text-base text-foreground">{t.heroBullet5}</p>
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
        <section id="services" className="py-8 md:py-14 scroll-mt-20">
          <div className="container">
            <div className="text-center mb-12 md:mb-16">
              <span className="text-blue-600 font-bold tracking-wide uppercase text-xs md:text-sm mb-2 block">{t.servicesLabel}</span>
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
                  tagline: t.serviceCard1Tagline,
                  badge: t.serviceCard1Badge,
                  isBundle: true,
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
        <section id="process" className="py-8 md:py-14 bg-slate-50 dark:bg-secondary/10 scroll-mt-20">
          <div className="container">
            <div className="text-center mb-12 md:mb-16">
              <span className="text-blue-600 font-bold tracking-wide uppercase text-xs md:text-sm mb-2 block">{t.processLabel}</span>
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
        <section id="contact" className="py-8 md:py-14 scroll-mt-20">
          <div className="container max-w-4xl">
            <div className="text-center mb-12 md:mb-16">
              <span className="text-blue-600 font-bold tracking-wide uppercase text-xs md:text-sm mb-2 block">{t.contactLabel}</span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">{t.contactHeading}</h2>
              <div className="h-1 w-20 bg-blue-600 rounded-full mx-auto"></div>
            </div>

            <Card className="shadow-xl border-2">
              <CardContent className="pt-8 px-6 md:px-10">
                <ContactForm
                  t={t}
                  selectedService={selectedService}
                  selectedSubService={selectedSubService}
                  selectedSubServices={selectedSubServices}
                  setSelectedService={setSelectedService}
                  setSelectedSubService={setSelectedSubService}
                  setSelectedSubServices={setSelectedSubServices}
                  selectedViaCard={selectedViaCard}
                  setSelectedViaCard={setSelectedViaCard}
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
        <section id="about" className="py-8 md:py-14 bg-slate-50 dark:bg-secondary/10 scroll-mt-20">
          <div className="container max-w-4xl">
            <div className="text-center mb-12 md:mb-16">
              <span className="text-blue-600 font-bold tracking-wide uppercase text-xs md:text-sm mb-2 block">{t.aboutLabel}</span>
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
                  <Badge variant="outline" className="px-4 py-2 text-base font-medium bg-background/50 dark:bg-secondary backdrop-blur-sm border-primary/20 text-foreground hover:bg-primary/5 dark:hover:bg-primary/20 hover:border-primary/40 dark:hover:border-primary/60 transition-all duration-300 cursor-default shadow-sm gap-2">
                    <img src="/flags/usa.svg" alt="USA Flag" className="h-4 w-auto object-contain" />
                    English
                  </Badge>
                  <Badge variant="outline" className="px-4 py-2 text-base font-medium bg-background/50 dark:bg-secondary backdrop-blur-sm border-primary/20 text-foreground hover:bg-primary/5 dark:hover:bg-primary/20 hover:border-primary/40 dark:hover:border-primary/60 transition-all duration-300 cursor-default shadow-sm gap-2">
                    <img src="/flags/south-korea.svg" alt="South Korea Flag" className="h-4 w-auto object-contain" />
                    Korean (한국어)
                  </Badge>
                  <Badge variant="outline" className="px-4 py-2 text-base font-medium bg-background/50 dark:bg-secondary backdrop-blur-sm border-primary/20 text-foreground hover:bg-primary/5 dark:hover:bg-primary/20 hover:border-primary/40 dark:hover:border-primary/60 transition-all duration-300 cursor-default shadow-sm gap-2">
                    <img src="/flags/germany.svg" alt="Germany Flag" className="h-4 w-auto object-contain" />
                    German (Deutsch)
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-8 md:py-14 scroll-mt-20">
          <div className="container max-w-4xl">
            <div className="text-center mb-12 md:mb-16">
              <span className="text-blue-600 font-bold tracking-wide uppercase text-xs md:text-sm mb-2 block">
                FAQ
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
                {t.faqHeading}
              </h2>
              <div className="h-1 w-20 bg-blue-600 rounded-full mx-auto mb-6"></div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t.faqSubheading}
              </p>
            </div>

            {faqData?.items && (
              <FAQ items={faqData.items} language={language as 'en' | 'ko' | 'de'} />
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
