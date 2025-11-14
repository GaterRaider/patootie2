import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";
import { FileText, Users, Plane, HelpCircle, CheckCircle, Send, Mail, Moon, Sun, Monitor } from "lucide-react";
import { countries } from "@/lib/countries";

export default function Home() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [selectedService, setSelectedService] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const submitMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      setShowSuccess(true);
      setIsSubmitting(false);
      toast.success(t.formSuccessMessage);
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    onError: (error) => {
      setIsSubmitting(false);
      toast.error(error.message);
    },
  });

  const handleServiceCardClick = (service: string) => {
    setSelectedService(service);
    // Scroll to contact form
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      service: formData.get("service") as string,
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
      currentResidence: formData.get("currentResidence") as string,
      preferredLanguage: formData.get("preferredLanguage") as string,
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
    if (theme === "light") return <Sun className="h-4 w-4" />;
    if (theme === "dark") return <Moon className="h-4 w-4" />;
    return <Monitor className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Accent Bar */}
      <div className="h-1 bg-gradient-to-r from-primary via-blue-500 to-primary"></div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container flex h-20 items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/images/logo-icon.png" alt="Logo" className="h-10 w-10" />
            <div>
              <h1 className="text-lg md:text-xl font-bold leading-tight">{t.siteTitle}</h1>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => scrollToSection("services")} 
              className="text-sm font-medium hover:text-primary transition-colors relative group"
            >
              {t.navServices}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </button>
            <button 
              onClick={() => scrollToSection("process")} 
              className="text-sm font-medium hover:text-primary transition-colors relative group"
            >
              {t.navProcess}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </button>
            <button 
              onClick={() => scrollToSection("about")} 
              className="text-sm font-medium hover:text-primary transition-colors relative group"
            >
              {t.navAbout}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </button>
            <Button 
              onClick={() => scrollToSection("contact")} 
              size="sm"
              className="shadow-md hover:shadow-lg transition-shadow"
            >
              {t.navContact}
            </Button>
          </nav>

          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50">
              <button
                onClick={() => setLanguage("en")}
                className={`text-sm font-medium transition-colors px-2 py-0.5 rounded ${language === "en" ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"}`}
              >
                EN
              </button>
              <span className="text-muted-foreground text-xs">|</span>
              <button
                onClick={() => setLanguage("ko")}
                className={`text-sm font-medium transition-colors px-2 py-0.5 rounded ${language === "ko" ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"}`}
              >
                KO
              </button>
            </div>

            {/* Theme Toggle */}
            {toggleTheme && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-secondary/80 transition-colors"
                title={`Current theme: ${theme}`}
              >
                {getThemeIcon()}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800">
          <div className="container py-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              <div>
                <h3 className="font-semibold text-green-900 dark:text-green-100">{t.formSuccessTitle}</h3>
                <p className="text-sm text-green-700 dark:text-green-300">{t.formSuccessMessage}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-secondary/50 to-background">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{t.heroTitle}</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{t.heroDescription}</p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-foreground">{t.heroBullet1}</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-foreground">{t.heroBullet2}</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-foreground">{t.heroBullet3}</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-foreground">{t.heroBullet4}</p>
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
                  alt="Patootie"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 md:py-24">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t.servicesHeading}</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all" onClick={() => handleServiceCardClick(t.serviceCard1Title)}>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Plane className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t.serviceCard1Title}</CardTitle>
                <CardDescription>{t.serviceCard1Desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{t.serviceCard1Pricing}</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all" onClick={() => handleServiceCardClick(t.serviceCard2Title)}>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t.serviceCard2Title}</CardTitle>
                <CardDescription>{t.serviceCard2Desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{t.serviceCard2Pricing}</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all" onClick={() => handleServiceCardClick(t.serviceCard3Title)}>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t.serviceCard3Title}</CardTitle>
                <CardDescription>{t.serviceCard3Desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{t.serviceCard3Pricing}</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all" onClick={() => handleServiceCardClick(t.serviceCard4Title)}>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <HelpCircle className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t.serviceCard4Title}</CardTitle>
                <CardDescription>{t.serviceCard4Desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{t.serviceCard4Pricing}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-16 md:py-24 bg-secondary/30">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t.processHeading}</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">{t.processStep1Title}</h3>
              <p className="text-muted-foreground">{t.processStep1Desc}</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">{t.processStep2Title}</h3>
              <p className="text-muted-foreground">{t.processStep2Desc}</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">{t.processStep3Title}</h3>
              <p className="text-muted-foreground">{t.processStep3Desc}</p>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8 max-w-2xl mx-auto">
            {t.processNote}
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="py-16 md:py-24">
        <div className="container max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t.contactHeading}</h2>
          
          <Card className="shadow-xl">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Honeypot field - hidden from users */}
                <input type="text" name="honeypot" className="hidden" tabIndex={-1} autoComplete="off" />

                {/* Service */}
                <div className="space-y-2">
                  <Label htmlFor="service">{t.formService} *</Label>
                  <Select name="service" value={selectedService} onValueChange={setSelectedService} required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={t.serviceCard1Title}>{t.serviceCard1Title}</SelectItem>
                      <SelectItem value={t.serviceCard2Title}>{t.serviceCard2Title}</SelectItem>
                      <SelectItem value={t.serviceCard3Title}>{t.serviceCard3Title}</SelectItem>
                      <SelectItem value={t.serviceCard4Title}>{t.serviceCard4Title}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Salutation */}
                <div className="space-y-2">
                  <Label htmlFor="salutation">{t.formSalutation} *</Label>
                  <Select name="salutation" required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mr">{t.formSalutationMr}</SelectItem>
                      <SelectItem value="Ms">{t.formSalutationMs}</SelectItem>
                      <SelectItem value="Mx">{t.formSalutationMx}</SelectItem>
                      <SelectItem value="Prefer not to say">{t.formSalutationPreferNot}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Name */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{t.formFirstName} *</Label>
                    <Input id="firstName" name="firstName" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">{t.formLastName} *</Label>
                    <Input id="lastName" name="lastName" required />
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">{t.formDateOfBirth} *</Label>
                  <Input id="dateOfBirth" name="dateOfBirth" type="date" required />
                </div>

                {/* Contact Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t.formEmail} *</Label>
                    <Input id="email" name="email" type="email" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">{t.formPhone} *</Label>
                    <Input id="phoneNumber" name="phoneNumber" type="tel" required placeholder="+49 123 456789" />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="street">{t.formStreet} *</Label>
                    <Input id="street" name="street" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="addressLine2">{t.formAddressLine2}</Label>
                    <Input id="addressLine2" name="addressLine2" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">{t.formPostalCode} *</Label>
                      <Input id="postalCode" name="postalCode" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">{t.formCity} *</Label>
                      <Input id="city" name="city" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stateProvince">{t.formStateProvince}</Label>
                    <Input id="stateProvince" name="stateProvince" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">{t.formCountry} *</Label>
                    <Select name="country" required>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.code} value={country.name}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Current Residence and Language */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentResidence">{t.formCurrentResidence} *</Label>
                    <Select name="currentResidence" required>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.code} value={country.name}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preferredLanguage">{t.formPreferredLanguage} *</Label>
                    <Select name="preferredLanguage" required>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Korean">Korean (한국어)</SelectItem>
                        <SelectItem value="German">German (Deutsch)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message">{t.formMessage} *</Label>
                  <Textarea id="message" name="message" rows={6} required minLength={10} />
                </div>

                {/* Consent Checkboxes */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Checkbox id="contactConsent" name="contactConsent" required />
                    <label htmlFor="contactConsent" className="text-sm leading-relaxed cursor-pointer">
                      {t.formContactConsent} *
                    </label>
                  </div>
                  <div className="flex items-start gap-3">
                    <Checkbox id="privacyConsent" name="privacyConsent" required />
                    <label htmlFor="privacyConsent" className="text-sm leading-relaxed cursor-pointer">
                      {t.formPrivacyConsent}{" "}
                      <button
                        type="button"
                        onClick={() => scrollToSection("privacy")}
                        className="text-primary hover:underline"
                      >
                        {t.formPrivacyConsentLink}
                      </button>{" "}
                      *
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <Button type="submit" size="lg" className="w-full shadow-lg hover:shadow-xl transition-shadow" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Send className="mr-2 h-4 w-4 animate-spin" />
                      {t.formSubmitting}
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      {t.formSubmit}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 md:py-24 bg-secondary/30">
        <div className="container max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t.aboutHeading}</h2>
          
          <div className="space-y-6 text-lg leading-relaxed">
            <p>{t.aboutParagraph1}</p>
            <p>{t.aboutParagraph2}</p>
            <p>{t.aboutParagraph3}</p>
            <p className="font-semibold text-center pt-4">{t.aboutLanguages}</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="privacy" className="py-12 border-t bg-muted/30">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-3">{t.footerImpressum}</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{t.impressumContent}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">{t.footerPrivacy}</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{t.privacyContent}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">{t.footerContact}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <a href="mailto:info@patootie-germany.com" className="hover:text-primary transition-colors">
                  info@patootie-germany.com
                </a>
              </div>
            </div>
          </div>
          
          <div className="text-center text-sm text-muted-foreground pt-8 border-t">
            <p>© 2025 Patootie - {t.siteTitle}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
