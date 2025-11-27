export type Language = 'en' | 'ko' | 'de';

export interface Translations {
  // Header
  siteTitle: string;
  navServices: string;
  navProcess: string;
  navAbout: string;
  navContact: string;
  navLegal: string;

  // Hero Section
  heroTitle: string;
  heroDescription: string;
  heroBullet1: string;
  heroBullet2: string;
  heroBullet3: string;
  heroBullet4: string;
  heroBullet5: string;

  // Service Cards
  servicesHeading: string;
  servicesLabel: string;
  serviceCard1Title: string;
  serviceCard1Desc: string;
  serviceCard1Services: string[];
  serviceCard1CTA: string;
  serviceCard2Title: string;
  serviceCard2Desc: string;
  serviceCard2Services: string[];
  serviceCard2CTA: string;
  serviceCard3Title: string;
  serviceCard3Desc: string;
  serviceCard3Services: string[];
  serviceCard3CTA: string;
  serviceCard4Title: string;
  serviceCard4Desc: string;
  serviceCard4Services: string[];
  serviceCard4CTA: string;

  // Process Section
  processHeading: string;
  processLabel: string;
  processStep1Title: string;
  processStep1Desc: string;
  processStep2Title: string;
  processStep2Desc: string;
  processStep3Title: string;
  processStep3Desc: string;
  processNote: string;

  // Contact Form
  contactHeading: string;
  contactLabel: string;
  formService: string;
  formServicePlaceholder: string;
  formSubService: string;
  formSubServicePlaceholder: string;
  formSectionPersonal: string;
  formSectionContact: string;
  formSectionAddress: string;
  formValidationMessage: string;
  formSalutation: string;
  formSalutationPlaceholder: string;
  formSalutationMr: string;
  formSalutationMs: string;
  formSalutationMx: string;
  formSalutationPreferNot: string;
  formFirstName: string;
  formLastName: string;
  formDateOfBirth: string;
  formEmail: string;
  formPhone: string;
  formStreet: string;
  formAddressLine2: string;
  formPostalCode: string;
  formCity: string;
  formStateProvince: string;
  formCountry: string;
  formCountryPlaceholder: string;
  formCurrentResidence: string;
  formCurrentResidencePlaceholder: string;
  formPreferredLanguage: string;
  formPreferredLanguagePlaceholder: string;
  formMessage: string;
  formContactConsent: string;
  formPrivacyConsent: string;
  formPrivacyConsentLink: string;
  formSubmit: string;
  formSubmitting: string;
  formSuccessTitle: string;
  formSuccessMessage: string;

  // New additions
  formMessagePlaceholder: string;
  formStateRequiredUSA: string;
  formProvinceRequiredCanada: string;
  formSuggestedCountries: string;
  formAllCountries: string;
  formErrorGeneral: string;
  formSuccessGreeting: string;
  formSuccessBody: string;
  formSentTo: string;
  formReferenceId: string;
  formStatusReceived: string;
  formStatusReviewing: string;
  formStatusResponse: string;
  formSendAnother: string;
  formProgress: string;
  formSelectedOption: string;
  formCharacters: string;
  serviceSelectOptional: string;
  serviceLearnMore: string;

  // About Section
  aboutHeading: string;
  aboutLabel: string;
  aboutParagraph1: string;
  aboutParagraph2: string;
  aboutParagraph3: string;
  aboutLanguages: string;

  // Footer
  footerAboutTitle: string;
  footerAboutDesc: string;
  footerQuickLinks: string;
  footerLegal: string;
  footerPrivacy: string;
  footerImpressum: string;
  footerCopyright: string;

  // Legal Pages
  impressumTitle: string;
  impressumContent: string;
  privacyTitle: string;
  privacyContent: string;

  // Errors
  errorRequired: string;
  errorEmail: string;
  errorMinLength: string;
  errorConsent: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    // Header
    siteTitle: "HandokHelper",
    navServices: "Services",
    navProcess: "Process",
    navAbout: "About",
    navContact: "Contact",
    navLegal: "Impressum / Privacy",

    // Hero Section
    heroTitle: "Your support for German housing and bureaucracy",
    heroDescription: "Moving to Germany or dealing with German authorities can be overwhelming, especially from abroad. HandokHelper assists with finding housing, immigration matters, official registrations, pension requests, and any task that requires someone in Germany to handle the process for you.",
    heroBullet1: "For clients inside and outside Germany",
    heroBullet2: "Housing search, viewings, and relocation support",
    heroBullet3: "Assistance with authorities, documents, and official procedures",
    heroBullet4: "Fixed price, hourly rate, or percentage depending on service",
    heroBullet5: "Fast and personal communication via phone or email",

    // Service Cards
    servicesHeading: "Our Services",
    servicesLabel: "WHAT WE OFFER",
    serviceCard1Title: "Housing & Relocation",
    serviceCard1Desc: "Find your perfect home and settle in smoothly. We assist with property search, viewings, contracts, and all registration formalities.",
    serviceCard1Services: [
      "Apartment/house search assistance",
      "Property viewing accompaniment & interpretation",
      "Rental contract review & negotiation support",
      "Anmeldung support (document preparation, on-site accompaniment & interpretation)",
      "Deregistration (Abmeldung) assistance",
      "Cancellation support before departure (e.g. housing, contracts)"
    ],
    serviceCard1CTA: "Select Housing & Relocation",
    serviceCard2Title: "Immigration & Legal Services",
    serviceCard2Desc: "Expert support for all your visa and legal needs. From work permits to driver's license exchange, we guide you through the German legal system.",
    serviceCard2Services: [
      "Expat assignment visa application & extension",
      "Expat family visa application & extension",
      "Work visa consultation & application support",
      "Visa interview accompaniment & interpretation",
      "Visa pickup service on behalf of client",
      "Driver's license exchange support & interpretation",
      "Tax class (Steuerklasse) change application"
    ],
    serviceCard2CTA: "Select Immigration & Legal Services",
    serviceCard3Title: "Benefits & Financial Services",
    serviceCard3Desc: "Maximize your financial benefits. We help with pension refunds, child benefits, and setting up your banking foundations.",
    serviceCard3Services: [
      "Pension refund application service",
      "Child benefit (Kindergeld) application",
      "Bank account opening assistance"
    ],
    serviceCard3CTA: "Select Benefits & Financial Services",
    serviceCard4Title: "Integration & Daily Life",
    serviceCard4Desc: "Essential support for your daily life in Germany. We handle utilities, insurance, and other contracts so you can focus on living.",
    serviceCard4Services: [
      "Internet & electricity contract setup",
      "Insurance enrollment support (liability & legal insurance)"
    ],
    serviceCard4CTA: "Select Integration & Daily Life",

    // Process Section
    processHeading: "How It Works",
    processLabel: "OUR PROCESS",
    processStep1Title: "Submit your request",
    processStep1Desc: "Select your service and send your details.",
    processStep2Title: "Consultation",
    processStep2Desc: "HandokHelper reviews your situation and contacts you.",
    processStep3Title: "Start working together",
    processStep3Desc: "After agreement on fees, HandokHelper assists with your case.",
    processNote: "Note: submitting the form does not create a binding contract; HandokHelper will first provide an offer.",

    // Contact Form
    contactHeading: "Get in Touch",
    contactLabel: "CONTACT",
    formService: "Service",
    formServicePlaceholder: "Select a category",
    formSubService: "Specific Service (Optional)",
    formSubServicePlaceholder: "Select a specific service",
    formSectionPersonal: "Personal Information",
    formSectionContact: "Contact Information",
    formSectionAddress: "Address",
    formValidationMessage: "Please complete all required fields to submit",
    formSalutation: "Salutation",
    formSalutationPlaceholder: "Select salutation",
    formSalutationMr: "Mr",
    formSalutationMs: "Ms",
    formSalutationMx: "Mx",
    formSalutationPreferNot: "Prefer not to say",
    formFirstName: "First Name",
    formLastName: "Last Name",
    formDateOfBirth: "Date of Birth",
    formEmail: "Email",
    formPhone: "Phone Number",
    formStreet: "Street & House Number",
    formAddressLine2: "Address Line 2 (optional)",
    formPostalCode: "Postal Code",
    formCity: "City",
    formStateProvince: "State/Province (optional)",
    formCountry: "Country",
    formCountryPlaceholder: "Select country",
    formCurrentResidence: "Country of Current Residence",
    formCurrentResidencePlaceholder: "Select country",
    formPreferredLanguage: "Preferred Contact Language",
    formPreferredLanguagePlaceholder: "Select language",
    formMessage: "Describe your situation",
    formContactConsent: "I agree to be contacted by email and/or phone",
    formPrivacyConsent: "I have read and agree to the",
    formPrivacyConsentLink: "Privacy Policy",
    formSubmit: "Submit Inquiry",
    formSubmitting: "Submitting...",
    formSuccessTitle: "Thank You!",
    formSuccessMessage: "Your inquiry has been submitted successfully. We will contact you soon!",

    // About Section
    aboutHeading: "About HandokHelper",
    aboutLabel: "WHO WE ARE",
    aboutParagraph1: "HandokHelper is experienced in dealing with German authorities and understands the complexities of German bureaucracy. With years of experience navigating the system, HandokHelper provides personalized assistance to make your journey smoother.",
    aboutParagraph2: "Whether you are an immigrant, a foreign resident in Germany, or someone living abroad who needs to interact with German authorities, we can help. From visa applications to pension claims, every case receives dedicated attention and professional guidance.",
    aboutParagraph3: "We specialize in helping individuals abroad obtain German pension payments and other social benefits, ensuring that distance is never a barrier to accessing what you're entitled to.",
    aboutLanguages: "Languages Spoken",

    // Footer
    footerAboutTitle: "About HandokHelper",
    footerAboutDesc: "Support for handling German authorities from anywhere in the world. Assistance with forms, certificates, residence matters, pension support, and more.",
    footerQuickLinks: "Quick Links",
    footerLegal: "Legal",
    footerPrivacy: "Privacy Policy",
    footerImpressum: "Imprint",
    footerCopyright: "Support for German Authorities Worldwide",

    // Legal Pages
    impressumTitle: "Impressum",
    impressumContent: "HandokHelper\n\nContact:\nEmail: info ( at ) handokhelper.de\n\nThis is a placeholder impressum. Please update with actual legal information as required by German law (┬º5 TMG).",
    privacyTitle: "Privacy Policy",
    privacyContent: "This Privacy Policy describes how we collect, use, and protect your personal information.\n\n1. Data Collection\nWe collect personal information that you provide through our contact form, including your name, email, phone number, address, and message content.\n\n2. Purpose of Data Processing\nYour data is used solely for the purpose of handling your inquiry and providing our services. We will contact you via email or phone as you have consented.\n\n3. Data Storage\nYour data is stored securely in our database and is only accessible to authorized personnel.\n\n4. Your Rights\nYou have the right to access, correct, or delete your personal data at any time. Please contact us at info@patootie-germany.com.\n\n5. Consent\nBy submitting the contact form, you consent to the processing of your personal data as described in this policy.\n\nThis is a placeholder privacy policy. Please update with complete legal information as required by GDPR and German data protection laws.",

    // Errors
    errorRequired: "This field is required",
    errorEmail: "Please enter a valid email address",
    errorMinLength: "Please provide more details",
    errorConsent: "You must agree to continue",

    // New additions
    formMessagePlaceholder: "Please describe your specific situation, what services you need, and any relevant details about your case.",
    formStateRequiredUSA: "State is required for USA",
    formProvinceRequiredCanada: "Province is required for Canada",
    formSuggestedCountries: "Suggested",
    formAllCountries: "All Countries",
    formErrorGeneral: "Please correct the highlighted errors to proceed.",
    formSuccessGreeting: "Thanks for reaching out, ",
    formSuccessBody: "We have received your request. We will review it and get back to you as soon as possible.",
    formSentTo: "Sent to",
    formReferenceId: "Reference ID",
    formStatusReceived: "Received",
    formStatusReviewing: "Reviewing",
    formStatusResponse: "Response",
    formSendAnother: "Send another request",
    formProgress: "Form Progress",
    formSelectedOption: "Selected Option:",
    formCharacters: "characters",
    serviceSelectOptional: "Select a Service (Optional)",
    serviceLearnMore: "Learn more",
  },
  ko: {
    // Header
    siteTitle: "HandokHelper",
    navServices: "∞ä£δ╣ä∞èñ",
    navProcess: "∞ºäφûë Ω│╝∞áò",
    navAbout: "∞åîΩ░£",
    navContact: "δ¼╕∞¥ÿφòÿΩ╕░",
    navLegal: "δ▓ò∞áü Ω│á∞ºÇ / Ω░£∞¥╕∞áòδ│┤",

    // Hero Section
    heroTitle: "δÅà∞¥╝ ∞ú╝Ω▒░ δ░Å Ω┤ÇΩ│╡∞ä£ ∞ùàδ¼┤δÑ╝ ∞£äφò£ δôáδôáφò£ ∞ºÇ∞¢ÉΩ╡░",
    heroDescription: "δÅà∞¥╝δí£ ∞¥┤∞ú╝φòÿΩ▒░δéÿ δÅà∞¥╝ Ω┤ÇΩ│╡∞ä£δÑ╝ ∞âüδîÇφòÿδèö ∞¥╝∞¥Ç φè╣φ₧ê φò┤∞Ö╕∞ùÉ ∞₧ê∞¥ä δòî δºëδºëφòá ∞êÿ ∞₧ê∞è╡δïêδïñ. HandokHelperδèö ∞ú╝Ω▒░ ∞░╛Ω╕░, ∞¥┤δ»╝ δ¼╕∞á£, Ω▒░∞ú╝ δô▒δí¥, ∞ù░Ω╕ê ∞ïá∞▓¡ δô▒ δÅà∞¥╝ φÿä∞ºÇ∞ùÉ∞ä£ δêäΩ╡░Ω░ÇΩ░Ç δîÇ∞ïá ∞▓ÿδª¼φò┤∞ò╝ φòÿδèö δ¬¿δôá ∞ùàδ¼┤δÑ╝ δÅä∞ÖÇδô£δª╜δïêδïñ.",
    heroBullet1: "δÅà∞¥╝ δé┤∞Ö╕ Ω│áΩ░¥ δ¬¿δæÉ ∞ºÇ∞¢É",
    heroBullet2: "∞ú╝Ω▒░ φâÉ∞âë, δ░⌐δ¼╕ δ░Å ∞áò∞░⌐ ∞ºÇ∞¢É",
    heroBullet3: "Ω┤ÇΩ│╡∞ä£, ∞ä£δÑÿ δ░Å Ω│╡∞ï¥ ∞áê∞░¿ ∞ºÇ∞¢É",
    heroBullet4: "∞ä£δ╣ä∞èñ∞ùÉ δö░δ¥╝ Ω│á∞áò Ω░ÇΩ▓⌐, ∞ï£Ω░äδï╣ ∞ÜöΩ╕ê δÿÉδèö δ╣ä∞£¿ ∞áü∞Ü⌐",
    heroBullet5: "∞áäφÖö δÿÉδèö ∞¥┤δ⌐ö∞¥╝∞¥ä φå╡φò£ δ╣áδÑ┤Ω│á Ω░£∞¥╕∞áü∞¥╕ ∞åîφå╡",

    // Service Cards
    servicesHeading: "∞ä£δ╣ä∞èñ ∞òêδé┤",
    servicesLabel: "∞á£Ω│╡ ∞ä£δ╣ä∞èñ",
    serviceCard1Title: "∞ú╝Ω▒░ δ░Å ∞áò∞░⌐",
    serviceCard1Desc: "∞Öäδ▓╜φò£ ∞ºæ∞¥ä ∞░╛Ω│á φÄ╕∞òêφòÿΩ▓î ∞áò∞░⌐φòÿ∞ä╕∞Üö. δ╢ÇδÅÖ∞é░ Ω▓Ç∞âë, δ░⌐δ¼╕, Ω│ä∞ò╜ δ░Å δ¬¿δôá Ω▒░∞ú╝ δô▒δí¥ ∞áê∞░¿δÑ╝ ∞ºÇ∞¢Éφò⌐δïêδïñ.",
    serviceCard1Services: [
      "∞òäφîîφè╕/∞ú╝φâ¥ Ω▓Ç∞âë ∞ºÇ∞¢É",
      "δ╢ÇδÅÖ∞é░ δ░⌐δ¼╕ δÅÖφûë δ░Å φå╡∞ù¡",
      "∞₧äδîÇ Ω│ä∞ò╜ Ω▓Çφåá δ░Å φÿæ∞âü ∞ºÇ∞¢É",
      "∞òêδ⌐£δæÑ(Ω▒░∞ú╝∞ºÇ δô▒δí¥) ∞ºÇ∞¢É (∞ä£δÑÿ ∞ñÇδ╣ä, φÿä∞₧Ñ δÅÖφûë δ░Å φå╡∞ù¡)",
      "∞òòδ⌐£δæÑ(Ω▒░∞ú╝∞ºÇ δºÉ∞åî) ∞ºÇ∞¢É",
      "∞╢£Ω╡¡ ∞áä φò┤∞ºÇ ∞ºÇ∞¢É (∞ú╝φâ¥, Ω░ü∞óà Ω│ä∞ò╜ δô▒)"
    ],
    serviceCard1CTA: "∞ú╝Ω▒░ δ░Å ∞áò∞░⌐ ∞äáφâ¥",
    serviceCard2Title: "∞¥┤δ»╝ δ░Å δ▓òδÑá ∞ä£δ╣ä∞èñ",
    serviceCard2Desc: "δ╣ä∞₧É δ░Å δ▓òδÑá δ¼╕∞á£∞ùÉ δîÇφò£ ∞áäδ¼╕∞áü∞¥╕ ∞ºÇ∞¢É∞¥ä δ░¢∞£╝∞ä╕∞Üö. ∞╖¿∞ùà δ╣ä∞₧Éδ╢Çφä░ ∞Ü┤∞áäδ⌐┤φùê Ω╡ÉφÖÿΩ╣î∞ºÇ δÅà∞¥╝ δ▓òδÑá ∞ï£∞èñφà£∞¥ä ∞òêδé┤φò┤ δô£δª╜δïêδïñ.",
    serviceCard2Services: [
      "∞ú╝∞₧¼∞¢É δ╣ä∞₧É ∞ïá∞▓¡ δ░Å ∞ù░∞₧Ñ",
      "∞ú╝∞₧¼∞¢É Ω░Ç∞í▒ δ╣ä∞₧É ∞ïá∞▓¡ δ░Å ∞ù░∞₧Ñ",
      "∞╖¿∞ùà δ╣ä∞₧É ∞âüδï┤ δ░Å ∞ïá∞▓¡ ∞ºÇ∞¢É",
      "δ╣ä∞₧É ∞¥╕φä░δ╖░ δÅÖφûë δ░Å φå╡∞ù¡",
      "δ╣ä∞₧É ∞êÿδá╣ δîÇφûë ∞ä£δ╣ä∞èñ",
      "∞Ü┤∞áäδ⌐┤φùê Ω╡ÉφÖÿ ∞ºÇ∞¢É δ░Å φå╡∞ù¡",
      "∞ä╕Ω╕ê δô▒Ω╕ë(Steuerklasse) δ│ÇΩ▓╜ ∞ïá∞▓¡"
    ],
    serviceCard2CTA: "∞¥┤δ»╝ δ░Å δ▓òδÑá ∞ä£δ╣ä∞èñ ∞äáφâ¥",
    serviceCard3Title: "φÿ£φâ¥ δ░Å Ω╕ê∞£╡ ∞ä£δ╣ä∞èñ",
    serviceCard3Desc: "∞₧¼∞áò∞áü φÿ£φâ¥∞¥ä Ω╖╣δîÇφÖöφòÿ∞ä╕∞Üö. ∞ù░Ω╕ê φÖÿΩ╕ë, ∞òäδÅÖ ∞êÿδï╣ ∞ïá∞▓¡ δ░Å ∞¥Çφûë ∞ùàδ¼┤ Ω╕░∞┤ê ∞äñ∞áò∞¥ä δÅä∞ÖÇδô£δª╜δïêδïñ.",
    serviceCard3Services: [
      "∞ù░Ω╕ê φÖÿΩ╕ë ∞ïá∞▓¡ ∞ä£δ╣ä∞èñ",
      "∞òäδÅÖ ∞êÿδï╣(Kindergeld) ∞ïá∞▓¡",
      "∞¥Çφûë Ω│ä∞óî Ω░£∞äñ ∞ºÇ∞¢É"
    ],
    serviceCard3CTA: "φÿ£φâ¥ δ░Å Ω╕ê∞£╡ ∞ä£δ╣ä∞èñ ∞äáφâ¥",
    serviceCard4Title: "∞áò∞░⌐ δ░Å ∞¥╝∞âü ∞â¥φÖ£",
    serviceCard4Desc: "δÅà∞¥╝ ∞â¥φÖ£∞ùÉ φòä∞êÿ∞áü∞¥╕ ∞ºÇ∞¢É∞¥ä ∞á£Ω│╡φò⌐δïêδïñ. Ω│╡Ω│╝Ω╕ê, δ│┤φùÿ δ░Å Ω╕░φâÇ Ω│ä∞ò╜∞¥ä ∞▓ÿδª¼φòÿ∞ù¼ φÄ╕∞òêφò£ ∞â¥φÖ£∞ùÉ ∞ºæ∞ñæφòá ∞êÿ ∞₧êδÅäδí¥ δÅò∞è╡δïêδïñ.",
    serviceCard4Services: [
      "∞¥╕φä░δä╖ δ░Å ∞áäΩ╕░ Ω│ä∞ò╜ ∞äñ∞╣ÿ",
      "δ│┤φùÿ Ω░Ç∞₧à ∞ºÇ∞¢É (∞▒à∞₧ä δ░Å δ▓òδÑá δ│┤φùÿ)"
    ],
    serviceCard4CTA: "∞áò∞░⌐ δ░Å ∞¥╝∞âü ∞â¥φÖ£ ∞äáφâ¥",

    // Process Section
    processHeading: "∞ºäφûë δ░⌐δ▓ò",
    processLabel: "∞ºäφûë Ω│╝∞áò",
    processStep1Title: "δ¼╕∞¥ÿ ∞á£∞╢£",
    processStep1Desc: "∞ä£δ╣ä∞èñδÑ╝ ∞äáφâ¥φòÿΩ│á ∞ä╕δ╢Ç ∞áòδ│┤δÑ╝ δ│┤δé┤∞ú╝∞ä╕∞Üö.",
    processStep2Title: "∞âüδï┤",
    processStep2Desc: "HandokHelperΩ░Ç ∞âüφÖ⌐∞¥ä Ω▓ÇφåáφòÿΩ│á ∞ù░δ¥╜δô£δª╜δïêδïñ.",
    processStep3Title: "φÿæδáÑ ∞ï£∞₧æ",
    processStep3Desc: "δ╣ä∞Ü⌐ φò⌐∞¥ÿ φ¢ä HandokHelperΩ░Ç Ω╖Çφòÿ∞¥ÿ ∞é¼δíÇδÑ╝ ∞ºÇ∞¢Éφò⌐δïêδïñ.",
    processNote: "∞░╕Ω│á: ∞ûæ∞ï¥ ∞á£∞╢£∞¥┤ Ω╡¼∞åìδáÑ ∞₧êδèö Ω│ä∞ò╜∞¥ä ∞â¥∞ä▒φòÿ∞ºÇ ∞òè∞è╡δïêδïñ. HandokHelperΩ░Ç δ¿╝∞áÇ Ω▓¼∞áü∞¥ä ∞á£Ω│╡φò⌐δïêδïñ.",

    // Contact Form
    contactHeading: "δ¼╕∞¥ÿφòÿΩ╕░",
    contactLabel: "δ¼╕∞¥ÿ",
    formService: "∞ä£δ╣ä∞èñ",
    formServicePlaceholder: "∞╣┤φàîΩ│áδª¼ ∞äáφâ¥",
    formSubService: "∞ä╕δ╢Ç ∞ä£δ╣ä∞èñ (∞äáφâ¥∞é¼φò¡)",
    formSubServicePlaceholder: "∞ä╕δ╢Ç ∞ä£δ╣ä∞èñ ∞äáφâ¥",
    formSectionPersonal: "Ω░£∞¥╕ ∞áòδ│┤",
    formSectionContact: "∞ù░δ¥╜∞▓ÿ ∞áòδ│┤",
    formSectionAddress: "∞ú╝∞åî",
    formValidationMessage: "∞á£∞╢£φòÿδáñδ⌐┤ δ¬¿δôá φòä∞êÿ φò¡δ¬⌐∞¥ä ∞₧æ∞ä▒φò┤∞ú╝∞ä╕∞Üö",
    formSalutation: "φÿ╕∞╣¡",
    formSalutationPlaceholder: "φÿ╕∞╣¡ ∞äáφâ¥",
    formSalutationMr: "Mr",
    formSalutationMs: "Ms",
    formSalutationMx: "Mx",
    formSalutationPreferNot: "δ░¥φ₧ê∞ºÇ ∞òè∞¥î",
    formFirstName: "∞¥┤δªä",
    formLastName: "∞ä▒",
    formDateOfBirth: "∞â¥δàä∞¢ö∞¥╝",
    formEmail: "∞¥┤δ⌐ö∞¥╝",
    formPhone: "∞áäφÖöδ▓êφÿ╕",
    formStreet: "Ω▒░δª¼ δ░Å δ▓ê∞ºÇ",
    formAddressLine2: "∞ú╝∞åî 2 (∞äáφâ¥∞é¼φò¡)",
    formPostalCode: "∞Ü░φÄ╕δ▓êφÿ╕",
    formCity: "δÅä∞ï£",
    formStateProvince: "∞ú╝/δÅä (∞äáφâ¥∞é¼φò¡)",
    formCountry: "Ω╡¡Ω░Ç",
    formCountryPlaceholder: "Ω╡¡Ω░Ç ∞äáφâ¥",
    formCurrentResidence: "φÿä∞₧¼ Ω▒░∞ú╝ Ω╡¡Ω░Ç",
    formCurrentResidencePlaceholder: "Ω╡¡Ω░Ç ∞äáφâ¥",
    formPreferredLanguage: "∞äáφÿ╕ ∞ù░δ¥╜ ∞û╕∞û┤",
    formPreferredLanguagePlaceholder: "∞û╕∞û┤ ∞äáφâ¥",
    formMessage: "∞âüφÖ⌐∞¥ä ∞äñδ¬àφò┤∞ú╝∞ä╕∞Üö",
    formContactConsent: "∞¥┤δ⌐ö∞¥╝ δ░Å/δÿÉδèö ∞áäφÖöδí£ ∞ù░δ¥╜δ░¢δèö Ω▓â∞ùÉ δÅÖ∞¥ÿφò⌐δïêδïñ",
    formPrivacyConsent: "Ω░£∞¥╕∞áòδ│┤ ∞▓ÿδª¼δ░⌐∞╣¿∞¥ä ∞¥╜Ω│á δÅÖ∞¥ÿφò⌐δïêδïñ",
    formPrivacyConsentLink: "Ω░£∞¥╕∞áòδ│┤ ∞▓ÿδª¼δ░⌐∞╣¿",
    formSubmit: "δ¼╕∞¥ÿ ∞á£∞╢£",
    formSubmitting: "∞á£∞╢£ ∞ñæ...",
    formSuccessTitle: "Ω░É∞é¼φò⌐δïêδïñ!",
    formSuccessMessage: "δ¼╕∞¥ÿΩ░Ç ∞ä▒Ω│╡∞áü∞£╝δí£ ∞á£∞╢£δÉÿ∞ùê∞è╡δïêδïñ. Ω│º ∞ù░δ¥╜δô£δª¼Ω▓á∞è╡δïêδïñ!",

    // About Section
    aboutHeading: "HandokHelper ∞åîΩ░£",
    aboutLabel: "∞åîΩ░£",
    aboutParagraph1: "HandokHelperδèö δÅà∞¥╝ Ω┤ÇΩ│╡∞ä£ ∞ùàδ¼┤∞ùÉ δîÇφò£ Ω▓╜φùÿ∞¥┤ φÆìδ╢Çφòÿδ⌐░ δÅà∞¥╝ Ω┤Çδúî∞á£∞¥ÿ δ│╡∞₧í∞ä▒∞¥ä ∞¥┤φò┤φòÿΩ│á ∞₧ê∞è╡δïêδïñ. ∞êÿδàäΩ░ä∞¥ÿ ∞ï£∞èñφà£ φâÉ∞âë Ω▓╜φùÿ∞¥ä δ░öφâò∞£╝δí£ Ω╖Çφòÿ∞¥ÿ ∞ù¼∞áò∞¥ä δìö ∞¢ÉφÖ£φòÿΩ▓î δºîδôñ∞û┤δô£δª╜δïêδïñ.",
    aboutParagraph2: "∞¥┤δ»╝∞₧É, δÅà∞¥╝ Ω▒░∞ú╝ ∞Ö╕Ω╡¡∞¥╕ δÿÉδèö δÅà∞¥╝ Ω┤ÇΩ│╡∞ä£∞ÖÇ ∞åîφå╡φò┤∞ò╝ φòÿδèö φò┤∞Ö╕ Ω▒░∞ú╝∞₧É δ¬¿δæÉδÑ╝ δÅä∞ÖÇδô£δª╜δïêδïñ. δ╣ä∞₧É ∞ïá∞▓¡δ╢Çφä░ ∞ù░Ω╕ê ∞▓¡Ω╡¼Ω╣î∞ºÇ δ¬¿δôá ∞é¼δíÇ∞ùÉ ∞áäδï┤ ∞ºÇ∞¢ÉΩ│╝ ∞áäδ¼╕∞áü∞¥╕ ∞òêδé┤δÑ╝ ∞á£Ω│╡φò⌐δïêδïñ.",
    aboutParagraph3: "HandokHelperδèö φò┤∞Ö╕ Ω▒░∞ú╝∞₧ÉΩ░Ç δÅà∞¥╝ ∞ù░Ω╕ê δ░Å Ω╕░φâÇ ∞é¼φÜî δ│╡∞ºÇδÑ╝ δ░¢∞¥ä ∞êÿ ∞₧êδÅäδí¥ ∞áäδ¼╕∞áü∞£╝δí£ ∞ºÇ∞¢Éφòÿδ⌐░, Ω▒░δª¼Ω░Ç Ω╖Çφòÿ∞¥ÿ Ω╢îδª¼δÑ╝ δ░¢δèö δì░ ∞₧Ñ∞òáΩ░Ç δÉÿ∞ºÇ ∞òèδÅäδí¥ φò⌐δïêδïñ.",
    aboutLanguages: "∞ºÇ∞¢É ∞û╕∞û┤",

    // Footer
    footerAboutTitle: "HandokHelper ∞åîΩ░£",
    footerAboutDesc: "∞áä ∞ä╕Ω│ä ∞û┤δöö∞ä£δéÿ δÅà∞¥╝ Ω┤ÇΩ│╡∞ä£ ∞ùàδ¼┤δÑ╝ ∞ºÇ∞¢Éφò⌐δïêδïñ. ∞ä£δÑÿ, ∞ª¥δ¬à∞ä£, Ω▒░∞ú╝ δ¼╕∞á£, ∞ù░Ω╕ê ∞ºÇ∞¢É δô▒∞¥ä δÅä∞ÖÇδô£δª╜δïêδïñ.",
    footerQuickLinks: "δ╣áδÑ╕ δºüφü¼",
    footerLegal: "δ▓ò∞áü ∞áòδ│┤",
    footerPrivacy: "Ω░£∞¥╕∞áòδ│┤ ∞▓ÿδª¼δ░⌐∞╣¿",
    footerImpressum: "δ▓ò∞áü Ω│á∞ºÇ",
    footerCopyright: "∞áä ∞ä╕Ω│ä δÅà∞¥╝ Ω┤ÇΩ│╡∞ä£ ∞ºÇ∞¢É",

    // Legal Pages
    impressumTitle: "δ▓ò∞áü Ω│á∞ºÇ (Impressum)",
    impressumContent: "HandokHelper\n\n∞ù░δ¥╜∞▓ÿ:\n∞¥┤δ⌐ö∞¥╝: info@patootie-germany.com\n\n∞¥┤Ω▓â∞¥Ç ∞₧ä∞ï£ δ▓ò∞áü Ω│á∞ºÇ∞₧àδïêδïñ. δÅà∞¥╝ δ▓òδÑá(┬º5 TMG)∞ùÉ δö░δ¥╝ ∞ïñ∞á£ δ▓ò∞áü ∞áòδ│┤δí£ ∞ùàδì░∞¥┤φè╕φòÿ∞ï¡∞ï£∞ÿñ.",
    privacyTitle: "Ω░£∞¥╕∞áòδ│┤ ∞▓ÿδª¼δ░⌐∞╣¿",
    privacyContent: "δ│╕ Ω░£∞¥╕∞áòδ│┤ ∞▓ÿδª¼δ░⌐∞╣¿∞¥Ç Ω╖Çφòÿ∞¥ÿ Ω░£∞¥╕∞áòδ│┤δÑ╝ ∞êÿ∞ºæ, ∞é¼∞Ü⌐ δ░Å δ│┤φÿ╕φòÿδèö δ░⌐δ▓ò∞¥ä ∞äñδ¬àφò⌐δïêδïñ.\n\n1. δì░∞¥┤φä░ ∞êÿ∞ºæ\nδ¼╕∞¥ÿ ∞ûæ∞ï¥∞¥ä φå╡φò┤ ∞á£Ω│╡φòÿ∞ïá ∞¥┤δªä, ∞¥┤δ⌐ö∞¥╝, ∞áäφÖöδ▓êφÿ╕, ∞ú╝∞åî δ░Å δ⌐ö∞ï£∞ºÇ δé┤∞Ü⌐∞¥ä φÅ¼φò¿φò£ Ω░£∞¥╕∞áòδ│┤δÑ╝ ∞êÿ∞ºæφò⌐δïêδïñ.\n\n2. δì░∞¥┤φä░ ∞▓ÿδª¼ δ¬⌐∞áü\nΩ╖Çφòÿ∞¥ÿ δì░∞¥┤φä░δèö δ¼╕∞¥ÿ ∞▓ÿδª¼ δ░Å ∞ä£δ╣ä∞èñ ∞á£Ω│╡ δ¬⌐∞áü∞£╝δí£δºî ∞é¼∞Ü⌐δÉ⌐δïêδïñ. Ω╖ÇφòÿΩ░Ç δÅÖ∞¥ÿφò£ δîÇδí£ ∞¥┤δ⌐ö∞¥╝ δÿÉδèö ∞áäφÖöδí£ ∞ù░δ¥╜δô£δª╜δïêδïñ.\n\n3. δì░∞¥┤φä░ ∞áÇ∞₧Ñ\nΩ╖Çφòÿ∞¥ÿ δì░∞¥┤φä░δèö δì░∞¥┤φä░δ▓á∞¥┤∞èñ∞ùÉ ∞òê∞áäφòÿΩ▓î ∞áÇ∞₧ÑδÉÿδ⌐░ Ω╢îφò£∞¥┤ ∞₧êδèö ∞ºü∞¢Éδºî ∞òí∞ä╕∞èñφòá ∞êÿ ∞₧ê∞è╡δïêδïñ.\n\n4. Ω╖Çφòÿ∞¥ÿ Ω╢îδª¼\n∞û╕∞á£δôá∞ºÇ Ω░£∞¥╕ δì░∞¥┤φä░∞ùÉ ∞òí∞ä╕∞èñφòÿΩ▒░δéÿ ∞êÿ∞áò δÿÉδèö ∞é¡∞á£φòá Ω╢îδª¼Ω░Ç ∞₧ê∞è╡δïêδïñ. info@patootie-germany.com∞£╝δí£ δ¼╕∞¥ÿφòÿ∞ï¡∞ï£∞ÿñ.\n\n5. δÅÖ∞¥ÿ\nδ¼╕∞¥ÿ ∞ûæ∞ï¥∞¥ä ∞á£∞╢£φò¿∞£╝δí£∞ì¿ δ│╕ δ░⌐∞╣¿∞ùÉ ∞äñδ¬àδÉ£ δîÇδí£ Ω░£∞¥╕ δì░∞¥┤φä░ ∞▓ÿδª¼∞ùÉ δÅÖ∞¥ÿφò⌐δïêδïñ.\n\n∞¥┤Ω▓â∞¥Ç ∞₧ä∞ï£ Ω░£∞¥╕∞áòδ│┤ ∞▓ÿδª¼δ░⌐∞╣¿∞₧àδïêδïñ. GDPR δ░Å δÅà∞¥╝ δì░∞¥┤φä░ δ│┤φÿ╕δ▓ò∞ùÉ δö░δ¥╝ ∞Öä∞áäφò£ δ▓ò∞áü ∞áòδ│┤δí£ ∞ùàδì░∞¥┤φè╕φòÿ∞ï¡∞ï£∞ÿñ.",

    // Errors
    errorRequired: "φòä∞êÿ φò¡δ¬⌐∞₧àδïêδïñ",
    errorEmail: "∞£áφÜ¿φò£ ∞¥┤δ⌐ö∞¥╝ ∞ú╝∞åîδÑ╝ ∞₧àδáÑφòÿ∞ä╕∞Üö",
    errorMinLength: "δìö ∞₧É∞ä╕φò£ ∞áòδ│┤δÑ╝ ∞á£Ω│╡φò┤∞ú╝∞ä╕∞Üö",
    errorConsent: "Ω│ä∞åìφòÿδáñδ⌐┤ δÅÖ∞¥ÿφò┤∞ò╝ φò⌐δïêδïñ",

    // New additions
    formMessagePlaceholder: "Ω╡¼∞▓┤∞áü∞¥╕ ∞âüφÖ⌐, φòä∞Üöφò£ ∞ä£δ╣ä∞èñ δ░Å Ω┤Çδá¿ ∞ä╕δ╢Ç ∞áòδ│┤δÑ╝ ∞äñδ¬àφò┤∞ú╝∞ä╕∞Üö.",
    formStateRequiredUSA: "δ»╕Ω╡¡∞¥ÿ Ω▓╜∞Ü░ ∞ú╝(State) ∞₧àδáÑ∞¥Ç φòä∞êÿ∞₧àδïêδïñ",
    formProvinceRequiredCanada: "∞║Éδéÿδïñ∞¥ÿ Ω▓╜∞Ü░ ∞ú╝(Province) ∞₧àδáÑ∞¥Ç φòä∞êÿ∞₧àδïêδïñ",
    formSuggestedCountries: "∞╢ö∞▓£ Ω╡¡Ω░Ç",
    formAllCountries: "δ¬¿δôá Ω╡¡Ω░Ç",
    formErrorGeneral: "∞ºäφûëφòÿδáñδ⌐┤ Ω░ò∞í░ φæ£∞ï£δÉ£ ∞ÿñδÑÿδÑ╝ ∞êÿ∞áòφò┤∞ú╝∞ä╕∞Üö.",
    formSuccessGreeting: "δ¼╕∞¥ÿφò┤ ∞ú╝∞àö∞ä£ Ω░É∞é¼φò⌐δïêδïñ, ",
    formSuccessBody: "∞Üö∞▓¡∞¥┤ ∞áæ∞êÿδÉÿ∞ùê∞è╡δïêδïñ. Ω▓Çφåá φ¢ä Ω░ÇδèÑφò£ φò£ δ╣¿δª¼ ∞ù░δ¥╜δô£δª¼Ω▓á∞è╡δïêδïñ.",
    formSentTo: "∞êÿ∞ïá",
    formReferenceId: "∞░╕∞í░ ID",
    formStatusReceived: "∞áæ∞êÿδÉ¿",
    formStatusReviewing: "Ω▓Çφåá ∞ñæ",
    formStatusResponse: "δï╡δ│Ç ∞Öäδúî",
    formSendAnother: "δïñδÑ╕ δ¼╕∞¥ÿ δ│┤δé┤Ω╕░",
    formProgress: "∞ûæ∞ï¥ ∞ºäφûëδÑá",
    formSelectedOption: "∞äáφâ¥δÉ£ ∞ÿ╡∞àÿ:",
    formCharacters: "∞₧É",
    serviceSelectOptional: "∞ä£δ╣ä∞èñ ∞äáφâ¥ (∞äáφâ¥∞é¼φò¡)",
    serviceLearnMore: "∞₧É∞ä╕φ₧ê δ│┤Ω╕░",
  },
  de: {
    // Header
    siteTitle: "HandokHelper",
    navServices: "Services",
    navProcess: "Ablauf",
    navAbout: "├£ber uns",
    navContact: "Kontakt",
    navLegal: "Impressum / Datenschutz",

    // Hero Section
    heroTitle: "Ihre Unterst├╝tzung f├╝r deutsche Beh├╢rden und Wohnen",
    heroDescription: "Der Umzug nach Deutschland oder der Umgang mit deutschen Beh├╢rden kann ├╝berw├ñltigend sein, besonders aus dem Ausland. HandokHelper unterst├╝tzt Sie bei der Wohnungssuche, Einwanderungsfragen, beh├╢rdlichen Anmeldungen, Rentenantr├ñgen und allen Aufgaben, die jemanden vor Ort in Deutschland erfordern.",
    heroBullet1: "F├╝r Kunden innerhalb und au├ƒerhalb Deutschlands",
    heroBullet2: "Wohnungssuche, Besichtigungen und Umzugsunterst├╝tzung",
    heroBullet3: "Unterst├╝tzung bei Beh├╢rden, Dokumenten und offiziellen Verfahren",
    heroBullet4: "Festpreis, Stundensatz oder Prozentsatz je nach Service",
    heroBullet5: "Schnelle und pers├╢nliche Kommunikation per Telefon oder E-Mail",

    // Service Cards
    servicesHeading: "Unsere Leistungen",
    servicesLabel: "WAS WIR BIETEN",
    serviceCard1Title: "Wohnen & Umzug",
    serviceCard1Desc: "Finden Sie Ihr perfektes Zuhause und leben Sie sich reibungslos ein. Wir unterst├╝tzen bei der Immobiliensuche, Besichtigungen, Vertr├ñgen und allen Anmeldeformalit├ñten.",
    serviceCard1Services: [
      "Wohnungs-/Haussuche",
      "Begleitung bei Besichtigungen & Dolmetschen",
      "Pr├╝fung von Mietvertr├ñgen & Verhandlungsunterst├╝tzung",
      "Anmeldung (Vorbereitung der Unterlagen, Begleitung & Dolmetschen)",
      "Abmeldung",
      "K├╝ndigungsunterst├╝tzung vor Abreise (z.B. Wohnung, Vertr├ñge)"
    ],
    serviceCard1CTA: "Wohnen & Umzug w├ñhlen",
    serviceCard2Title: "Einwanderung & Rechtliches",
    serviceCard2Desc: "Expertenunterst├╝tzung f├╝r alle Ihre Visa- und Rechtsfragen. Von Arbeitserlaubnissen bis zum F├╝hrerscheinumtausch f├╝hren wir Sie durch das deutsche Rechtssystem.",
    serviceCard2Services: [
      "Visumantrag & Verl├ñngerung f├╝r Expat-Entsendungen",
      "Visumantrag & Verl├ñngerung f├╝r Expat-Familien",
      "Beratung & Antragsunterst├╝tzung f├╝r Arbeitsvisa",
      "Begleitung bei Visa-Interviews & Dolmetschen",
      "Visumabholung im Auftrag des Kunden",
      "Unterst├╝tzung beim F├╝hrerscheinumtausch & Dolmetschen",
      "Antrag auf Steuerklassenwechsel"
    ],
    serviceCard2CTA: "Einwanderung & Rechtliches w├ñhlen",
    serviceCard3Title: "Leistungen & Finanzen",
    serviceCard3Desc: "Maximieren Sie Ihre finanziellen Vorteile. Wir helfen bei Rentenerstattungen, Kindergeld und der Einrichtung Ihrer Bankgesch├ñfte.",
    serviceCard3Services: [
      "Antragsservice f├╝r Rentenerstattung",
      "Kindergeldantrag",
      "Unterst├╝tzung bei der Kontoer├╢ffnung"
    ],
    serviceCard3CTA: "Leistungen & Finanzen w├ñhlen",
    serviceCard4Title: "Integration & Alltag",
    serviceCard4Desc: "Wesentliche Unterst├╝tzung f├╝r Ihren Alltag in Deutschland. Wir k├╝mmern uns um Versorgungsunternehmen, Versicherungen und andere Vertr├ñge, damit Sie sich auf das Leben konzentrieren k├╢nnen.",
    serviceCard4Services: [
      "Einrichtung von Internet- & Stromvertr├ñgen",
      "Unterst├╝tzung bei Versicherungsanmeldungen (Haftpflicht- & Rechtsschutzversicherung)"
    ],
    serviceCard4CTA: "Integration & Alltag w├ñhlen",

    // Process Section
    processHeading: "Wie es funktioniert",
    processLabel: "UNSER ABLAUF",
    processStep1Title: "Anfrage senden",
    processStep1Desc: "W├ñhlen Sie Ihren Service und senden Sie Ihre Details.",
    processStep2Title: "Beratung",
    processStep2Desc: "HandokHelper pr├╝ft Ihre Situation und kontaktiert Sie.",
    processStep3Title: "Zusammenarbeit starten",
    processStep3Desc: "Nach Einigung ├╝ber die Kosten unterst├╝tzt HandokHelper Ihren Fall.",
    processNote: "Hinweis: Das Absenden des Formulars begr├╝ndet keinen verbindlichen Vertrag; HandokHelper erstellt zun├ñchst ein Angebot.",

    // Contact Form
    contactHeading: "Kontakt aufnehmen",
    contactLabel: "KONTAKT",
    formService: "Service",
    formServicePlaceholder: "Kategorie w├ñhlen",
    formSubService: "Spezifischer Service (Optional)",
    formSubServicePlaceholder: "Spezifischen Service w├ñhlen",
    formSectionPersonal: "Pers├╢nliche Informationen",
    formSectionContact: "Kontaktinformationen",
    formSectionAddress: "Adresse",
    formValidationMessage: "Bitte f├╝llen Sie alle Pflichtfelder aus",
    formSalutation: "Anrede",
    formSalutationPlaceholder: "Anrede w├ñhlen",
    formSalutationMr: "Herr",
    formSalutationMs: "Frau",
    formSalutationMx: "Mx",
    formSalutationPreferNot: "Keine Angabe",
    formFirstName: "Vorname",
    formLastName: "Nachname",
    formDateOfBirth: "Geburtsdatum",
    formEmail: "E-Mail",
    formPhone: "Telefonnummer",
    formStreet: "Stra├ƒe & Hausnummer",
    formAddressLine2: "Adresszusatz (optional)",
    formPostalCode: "Postleitzahl",
    formCity: "Stadt",
    formStateProvince: "Bundesland/Provinz (optional)",
    formCountry: "Land",
    formCountryPlaceholder: "Land w├ñhlen",
    formCurrentResidence: "Land des aktuellen Wohnsitzes",
    formCurrentResidencePlaceholder: "Land w├ñhlen",
    formPreferredLanguage: "Bevorzugte Kontaktsprache",
    formPreferredLanguagePlaceholder: "Sprache w├ñhlen",
    formMessage: "Beschreiben Sie Ihre Situation",
    formContactConsent: "Ich stimme der Kontaktaufnahme per E-Mail und/oder Telefon zu",
    formPrivacyConsent: "Ich habe die Datenschutzerkl├ñrung gelesen und stimme zu",
    formPrivacyConsentLink: "Datenschutzerkl├ñrung",
    formSubmit: "Anfrage senden",
    formSubmitting: "Wird gesendet...",
    formSuccessTitle: "Vielen Dank!",
    formSuccessMessage: "Ihre Anfrage wurde erfolgreich gesendet. Wir werden uns bald bei Ihnen melden!",

    // About Section
    aboutHeading: "├£ber HandokHelper",
    aboutLabel: "WER WIR SIND",
    aboutParagraph1: "HandokHelper ist erfahren im Umgang mit deutschen Beh├╢rden und versteht die Komplexit├ñt der deutschen B├╝rokratie. Mit jahrelanger Erfahrung im System bietet HandokHelper pers├╢nliche Unterst├╝tzung, um Ihren Weg reibungsloser zu gestalten.",
    aboutParagraph2: "Ob Sie Einwanderer, ausl├ñndischer Einwohner in Deutschland oder im Ausland lebend sind und mit deutschen Beh├╢rden interagieren m├╝ssen, wir k├╢nnen helfen. Von Visumantr├ñgen bis zu Rentenanspr├╝chen erh├ñlt jeder Fall engagierte Aufmerksamkeit und professionelle Beratung.",
    aboutParagraph3: "Wir sind darauf spezialisiert, Einzelpersonen im Ausland bei der Erlangung deutscher Rentenzahlungen und anderer Sozialleistungen zu helfen und sicherzustellen, dass Entfernung kein Hindernis f├╝r den Zugang zu Ihren Anspr├╝chen darstellt.",
    aboutLanguages: "Gesprochene Sprachen",

    // Footer
    footerAboutTitle: "├£ber HandokHelper",
    footerAboutDesc: "Unterst├╝tzung beim Umgang mit deutschen Beh├╢rden von ├╝berall auf der Welt. Hilfe bei Formularen, Bescheinigungen, Wohnsitzangelegenheiten, Rentenunterst├╝tzung und mehr.",
    footerQuickLinks: "Schnelllinks",
    footerLegal: "Rechtliches",
    footerPrivacy: "Datenschutzerkl├ñrung",
    footerImpressum: "Impressum",
    footerCopyright: "Unterst├╝tzung f├╝r deutsche Beh├╢rden weltweit",

    // Legal Pages
    impressumTitle: "Impressum",
    impressumContent: "HandokHelper\n\nKontakt:\nE-Mail: info ( at ) handokhelper.de\n\nDies ist ein Platzhalter-Impressum. Bitte aktualisieren Sie es mit den tats├ñchlichen rechtlichen Informationen gem├ñ├ƒ ┬º5 TMG.",
    privacyTitle: "Datenschutzerkl├ñrung",
    privacyContent: "Diese Datenschutzerkl├ñrung beschreibt, wie wir Ihre personenbezogenen Daten erfassen, verwenden und sch├╝tzen.\n\n1. Datenerfassung\nWir erfassen personenbezogene Daten, die Sie ├╝ber unser Kontaktformular bereitstellen, einschlie├ƒlich Name, E-Mail, Telefonnummer, Adresse und Nachrichteninhalt.\n\n2. Zweck der Datenverarbeitung\nIhre Daten werden ausschlie├ƒlich zur Bearbeitung Ihrer Anfrage und zur Erbringung unserer Dienstleistungen verwendet. Wir kontaktieren Sie per E-Mail oder Telefon, wie von Ihnen zugestimmt.\n\n3. Datenspeicherung\nIhre Daten werden sicher in unserer Datenbank gespeichert und sind nur autorisiertem Personal zug├ñnglich.\n\n4. Ihre Rechte\nSie haben das Recht, jederzeit auf Ihre personenbezogenen Daten zuzugreifen, diese zu korrigieren oder zu l├╢schen. Bitte kontaktieren Sie uns unter info@patootie-germany.com.\n\n5. Einwilligung\nDurch das Absenden des Kontaktformulars stimmen Sie der Verarbeitung Ihrer personenbezogenen Daten wie in dieser Richtlinie beschrieben zu.\n\nDies ist eine Platzhalter-Datenschutzerkl├ñrung. Bitte aktualisieren Sie sie mit vollst├ñndigen rechtlichen Informationen gem├ñ├ƒ DSGVO und deutschen Datenschutzgesetzen.",

    // Errors
    errorRequired: "Dieses Feld ist erforderlich",
    errorEmail: "Bitte geben Sie eine g├╝ltige E-Mail-Adresse ein",
    errorMinLength: "Bitte geben Sie mehr Details an",
    errorConsent: "Sie m├╝ssen zustimmen, um fortzufahren",

    // New additions
    formMessagePlaceholder: "Bitte beschreiben Sie Ihre spezifische Situation, welche Dienstleistungen Sie ben├╢tigen und alle relevanten Details zu Ihrem Fall.",
    formStateRequiredUSA: "Bundesstaat ist f├╝r USA erforderlich",
    formProvinceRequiredCanada: "Provinz ist f├╝r Kanada erforderlich",
    formSuggestedCountries: "Vorgeschlagen",
    formAllCountries: "Alle L├ñnder",
    formErrorGeneral: "Bitte korrigieren Sie die markierten Fehler, um fortzufahren.",
    formSuccessGreeting: "Danke f├╝r Ihre Nachricht, ",
    formSuccessBody: "Wir haben Ihre Anfrage erhalten. Wir werden sie pr├╝fen und uns so schnell wie m├╢glich bei Ihnen melden.",
    formSentTo: "Gesendet an",
    formReferenceId: "Referenz-ID",
    formStatusReceived: "Empfangen",
    formStatusReviewing: "In Pr├╝fung",
    formStatusResponse: "Antwort",
    formSendAnother: "Weitere Anfrage senden",
    formProgress: "Formularfortschritt",
    formSelectedOption: "Gew├ñhlte Option:",
    formCharacters: "Zeichen",
    serviceSelectOptional: "Service w├ñhlen (Optional)",
    serviceLearnMore: "Mehr erfahren",
  },
};

export function getTranslations(lang: Language): Translations {
  return translations[lang] || translations.en;
}
