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
  serviceCard1Tagline: string;
  serviceCard1Badge: string;
  serviceCard1Desc: string;
  serviceCard1Services: string[];
  serviceCard1Descriptions: string[];
  relocationBundleItems: string[];
  serviceCard1CTA: string;
  serviceCard2Title: string;
  serviceCard2Desc: string;
  serviceCard2Services: string[];
  serviceCard2Descriptions: string[];
  serviceCard2CTA: string;
  serviceCard3Title: string;
  serviceCard3Desc: string;
  serviceCard3Services: string[];
  serviceCard3Descriptions: string[];
  serviceCard3CTA: string;
  serviceCard4Title: string;
  serviceCard4Desc: string;
  serviceCard4Services: string[];
  serviceCard4Descriptions: string[];
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
  formSectionConsent: string;
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
  formPrivacyConsentSuffix?: string;
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
  serviceSelectChoice: string;

  // Wizard Steps
  stepService: string;
  stepPersonal: string;
  stepContact: string;
  stepReview: string;
  stepNext: string;
  stepBack: string;
  stepSubmit: string;
  stepExitWarning: string;

  // About Section
  aboutHeading: string;
  aboutLabel: string;
  aboutParagraph1: string;
  aboutParagraph2: string;
  aboutParagraph3: string;
  aboutLanguages: string;

  // FAQ Section
  faqHeading: string;
  faqSubheading: string;

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

  // Contact Form Steps
  contactFormTitle: string;
  contactFormStep1Subtitle: string;
  contactFormStep1Headline: string;
  contactFormStep2Subtitle: string;
  contactFormStep2Headline: string;
  contactFormStep3Subtitle: string;
  contactFormStep3Headline: string;
  stepIndicator: string;
  stepOf: string;
  includedInBundle: string;

  // Category Step Captions
  categoryCard2Caption: string;
  categoryCard3Caption: string;
  categoryCard4Caption: string;
  categoryServicesCount: string;
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
    serviceCard1Tagline: "Complete housing search to move-in support",
    serviceCard1Badge: "",
    serviceCard1Desc: "Find your perfect home and settle in smoothly. We assist with property search, viewings, contracts, and all registration formalities.",
    serviceCard1Services: [
      "Relocation Bundle",
      "Anmeldung support (document preparation, on-site accompaniment & interpretation)",
      "Deregistration (Abmeldung) assistance",
      "Cancellation support before departure (e.g. housing, contracts)"
    ],
    serviceCard1Descriptions: [
      "Comprehensive support including search, viewings, and contract negotiation.",
      "We prepare your forms, book the appointment, and accompany you to the office.",
      "Leaving Germany? We handle the official deregistration process for you.",
      "Assistance with cancelling housing, internet, and other contracts before you leave."
    ],
    relocationBundleItems: [
      "Apartment/house search assistance",
      "Property viewing accompaniment & interpretation",
      "Rental contract review & negotiation support"
    ],
    serviceCard1CTA: "Select Housing & Relocation",
    serviceCard2Title: "Immigration & Administrative Support",
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
    serviceCard2Descriptions: [
      "Full support for company transfers and assignments.",
      "Reunite with your family in Germany.",
      "Guidance for employment-based residence permits.",
      "We go with you to the immigration office.",
      "Save time by letting us pick up your documents.",
      "Convert your foreign license to a German one.",
      "Optimize your monthly net income."
    ],
    serviceCard2CTA: "Select Immigration & Legal Services",
    serviceCard3Title: "Benefits & Financial Services",
    serviceCard3Desc: "Maximize your financial benefits. We help with pension refunds, child benefits, and setting up your banking foundations.",
    serviceCard3Services: [
      "Pension refund application service",
      "Child benefit (Kindergeld) application"
    ],
    serviceCard3Descriptions: [
      "Claim back your pension contributions if leaving.",
      "Monthly financial support for your children."
    ],
    serviceCard3CTA: "Select Benefits & Financial Services",
    serviceCard4Title: "Integration & Daily Life",
    serviceCard4Desc: "Essential support for your daily life in Germany. We handle utilities, insurance, and other contracts so you can focus on living.",
    serviceCard4Services: [
      "Internet & electricity contract setup",
      "Insurance enrollment support (liability & legal insurance)",
      "Bank account opening assistance"
    ],
    serviceCard4Descriptions: [
      "Get connected with the best providers.",
      "Protect yourself with essential German insurance.",
      "Set up a Girokonto for your salary and rent."
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
    formSectionConsent: "Consent",
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
    formPrivacyConsent: "I have read and agree to the ",
    formPrivacyConsentLink: "Privacy Policy",
    formPrivacyConsentSuffix: "",
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

    // FAQ Section
    faqHeading: "Frequently Asked Questions",
    faqSubheading: "Find answers to common questions about our services",

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
    impressumContent: "HandokHelper\n\nContact:\nEmail: info ( at ) handokhelper.de\n\nThis is a placeholder impressum. Please update with actual legal information as required by German law (§5 TMG).",
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
    formSuccessGreeting: "Thanks for reaching out!",
    formSuccessBody: "We have received your request and sent a confirmation email. We will review it and get back to you as soon as possible.",
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
    serviceSelectChoice: "Select choice",

    // Wizard Steps
    stepService: "Service",
    stepPersonal: "Personal",
    stepContact: "Contact",
    stepReview: "Review",
    stepNext: "Next",
    stepBack: "Back",
    stepSubmit: "Submit Inquiry",
    stepExitWarning: "You have unsaved changes. Are you sure you want to leave?",

    // Contact Form Steps
    contactFormTitle: "Contact form",
    contactFormStep1Subtitle: "Answer a few quick questions so we can match you with the right support.",
    contactFormStep1Headline: "How can we help you?",
    contactFormStep2Subtitle: "Select a specific service",
    contactFormStep2Headline: "Select your services",
    contactFormStep3Subtitle: "We need a few details to get in touch and start your journey.",
    contactFormStep3Headline: "Tell us about yourself",
    stepIndicator: "Step",
    stepOf: "of",
    includedInBundle: "Included in Bundle:",

    // Category Step Captions
    categoryCard2Caption: "Visa & Legal Support",
    categoryCard3Caption: "Benefits & Banking",
    categoryCard4Caption: "Utilities & Insurance",
    categoryServicesCount: "services",
  },
  ko: {
    // Header
    siteTitle: "HandokHelper",
    navServices: "서비스",
    navProcess: "진행 과정",
    navAbout: "소개",
    navContact: "문의하기",
    navLegal: "법적 고지 / 개인정보",

    // Hero Section
    heroTitle: "독일 주거 및 관공서 업무를 위한 든든한 지원군",
    heroDescription: "독일로 이주하거나 독일 관공서를 상대하는 일은 특히 해외에 있을 때 막막할 수 있습니다. 한독헬퍼는 독일 집 찾기, 이민 문제, 거주 등록, 연금 환급 신청 등 독일 현지에서 누군가가 대신 처리해야 하는 모든 업무를 도와드립니다.",
    heroBullet1: "독일 내외 고객 모두 지원",
    heroBullet2: "독일 집 구하기, 방문 및 정착 지원",
    heroBullet3: "암트, 외국인청, 서류 및 공식 절차 지원",
    heroBullet4: "서비스에 따라 고정 가격, 시간당 요금 또는 비율 적용",
    heroBullet5: "전화 또는 이메일을 통한 빠르고 개인적인 소통",

    // Service Cards
    servicesHeading: "서비스 안내",
    servicesLabel: "제공 서비스",
    serviceCard1Title: "주거 및 정착",
    serviceCard1Tagline: "완벽한 주택 검색부터 입주 지원까지",
    serviceCard1Badge: "",
    serviceCard1Desc: "완벽한 집을 찾고 편안하게 정착하세요. 부동산 검색, 방문, 계약 및 모든 거주 등록 절차를 지원합니다.",
    serviceCard1Services: [
      "이주 패키지",
      "안멜둥(거주지 등록) 지원 (서류 준비, 현장 동행 및 통역)",
      "압멜둥(거주지 말소) 지원",
      "출국 전 해지 지원 (주택, 각종 계약 등)"
    ],
    serviceCard1Descriptions: [
      "주택 검색, 방문, 계약 협상을 포함한 종합적인 지원.",
      "서류 준비, 예약, 암트, 외국인청 동행 및 통역을 지원합니다.",
      "독일을 떠나시나요? 거주지 말소 절차를 대신 처리해 드립니다.",
      "출국 전 주택, 인터넷 및 기타 계약 해지를 도와드립니다."
    ],
    relocationBundleItems: [
      "아파트/주택 검색 지원",
      "부동산 방문 동행 및 통역",
      "임대 계약서 검토 및 협상 지원"
    ],
    serviceCard1CTA: "주거 및 정착 선택",
    serviceCard2Title: "이민 & 행정지원 서비스",
    serviceCard2Desc: "비자 및 법률 문제에 대한 전문적인 지원을 받으세요. 취업 비자부터 운전면허 교환까지 독일 법률 시스템을 안내해 드립니다.",
    serviceCard2Services: [
      "주재원 비자 신청 및 연장",
      "주재원 가족 비자 신청 및 연장",
      "취업 비자 상담 및 신청 지원",
      "비자 인터뷰 동행 및 통역",
      "비자 수령 대행 서비스",
      "운전면허 교환 지원 및 통역",
      "세금 등급(Steuerklasse) 변경 신청"
    ],
    serviceCard2Descriptions: [
      "회사 파견 및 주재원을 위한 완벽한 지원.",
      "독일에서의 가족 재결합을 돕습니다.",
      "취업 거주 허가에 대한 전문 안내.",
      "외국인청 인터뷰에 동행하여 통역합니다.",
      "시간을 절약하세요, 저희가 대신 수령합니다.",
      "외국 운전면허증을 독일 면허증으로 교환.",
      "월 실수령액을 최적화하세요."
    ],
    serviceCard2CTA: "이민 및 법률 서비스 선택",
    serviceCard3Title: "킨더겔드 및 연금 환급 서비스",
    serviceCard3Desc: "재정적 혜택을 극대화하세요. 연금 환급, 아동 수당 신청 및 은행 업무 기초 설정을 도와드립니다.",
    serviceCard3Services: [
      "연금 환급 신청 서비스",
      "아동 수당(Kindergeld) 신청"
    ],
    serviceCard3Descriptions: [
      "귀국 시 연금 납부액을 환급받으세요.",
      "자녀를 위한 매월 재정 지원금."
    ],
    serviceCard3CTA: "혜택 및 금융 서비스 선택",
    serviceCard4Title: "정착 및 일상 생활",
    serviceCard4Desc: "독일 생활에 필수적인 지원을 제공합니다. 공과금, 보험 및 기타 계약을 처리하여 편안한 생활에 집중할 수 있도록 돕습니다.",
    serviceCard4Services: [
      "인터넷 및 전기 계약 설치",
      "보험 가입 지원 (책임 및 법률 보험)",
      "은행 계좌 개설 지원"
    ],
    serviceCard4Descriptions: [
      "최고의 통신사 및 전력 회사 연결.",
      "필수 독일 보험으로 자신을 보호하세요.",
      "급여와 월세를 위한 입출금 계좌 개설."
    ],
    serviceCard4CTA: "정착 및 일상 생활 선택",

    // Process Section
    processHeading: "진행 방법",
    processLabel: "진행 과정",
    processStep1Title: "문의 제출",
    processStep1Desc: "서비스를 선택하고 세부 정보를 보내주세요.",
    processStep2Title: "상담",
    processStep2Desc: "한독헬퍼가 상황을 검토하고 연락드립니다.",
    processStep3Title: "협력 시작",
    processStep3Desc: "비용 합의 후 한독헬퍼가 귀하의 사례를 지원합니다.",
    processNote: "참고: 양식 제출이 구속력 있는 계약을 생성하지 않습니다. 한독헬퍼가 먼저 견적을 제공합니다.",

    // Contact Form
    contactHeading: "문의하기",
    contactLabel: "문의",
    formService: "서비스",
    formServicePlaceholder: "카테고리 선택",
    formSubService: "세부 서비스 (선택사항)",
    formSubServicePlaceholder: "세부 서비스 선택",
    formSectionPersonal: "개인 정보",
    formSectionContact: "연락처 정보",
    formSectionAddress: "주소",
    formSectionConsent: "동의",
    formValidationMessage: "제출하려면 모든 필수 항목을 작성해주세요",
    formSalutation: "호칭",
    formSalutationPlaceholder: "호칭 선택",
    formSalutationMr: "Mr",
    formSalutationMs: "Ms",
    formSalutationMx: "Mx",
    formSalutationPreferNot: "밝히지 않음",
    formFirstName: "이름",
    formLastName: "성",
    formDateOfBirth: "생년월일",
    formEmail: "이메일",
    formPhone: "전화번호",
    formStreet: "거리 및 번지",
    formAddressLine2: "주소 2 (선택사항)",
    formPostalCode: "우편번호",
    formCity: "도시",
    formStateProvince: "주/도 (선택사항)",
    formCountry: "국가",
    formCountryPlaceholder: "국가 선택",
    formCurrentResidence: "현재 거주 국가",
    formCurrentResidencePlaceholder: "국가 선택",
    formPreferredLanguage: "선호 연락 언어",
    formPreferredLanguagePlaceholder: "언어 선택",
    formMessage: "상황을 설명해주세요",
    formContactConsent: "이메일 및/또는 전화로 연락받는 것에 동의합니다",
    formPrivacyConsent: "",
    formPrivacyConsentLink: "개인정보 처리방침",
    formPrivacyConsentSuffix: "을 읽고 동의합니다",
    formSubmit: "문의 제출",
    formSubmitting: "제출 중...",
    formSuccessTitle: "감사합니다!",
    formSuccessMessage: "문의가 성공적으로 제출되었습니다. 곧 연락드리겠습니다!",

    // About Section
    aboutHeading: "한독헬퍼 소개",
    aboutLabel: "소개",
    aboutParagraph1: "한독헬퍼는 독일 관공서 업무에 대한 경험이 풍부하며 독일 관료제의 복잡성을 이해하고 있습니다. 수년간의 시스템 탐색 경험을 바탕으로 귀하의 여정을 더 원활하게 만들어드립니다.",
    aboutParagraph2: "이민자, 독일 거주 외국인 또는 독일 관공서와 소통해야 하는 해외 거주자 모두를 도와드립니다. 비자 신청부터 연금 청구까지 모든 사례에 전담 지원과 전문적인 안내를 제공합니다.",
    aboutParagraph3: "한독헬퍼는 해외 거주자가 독일 연금 및 기타 사회 복지를 받을 수 있도록 전문적으로 지원하며, 거리가 귀하의 권리를 받는 데 장애가 되지 않도록 합니다.",
    aboutLanguages: "지원 언어",

    // FAQ Section
    faqHeading: "자주 묻는 질문",
    faqSubheading: "서비스에 대한 일반적인 질문과 답변을 확인하세요",

    // Footer
    footerAboutTitle: "HandokHelper 소개",
    footerAboutDesc: "전 세계 어디서나 독일 관공서 업무를 지원합니다. 서류, 증명서, 거주 문제, 연금 지원 등을 도와드립니다.",
    footerQuickLinks: "빠른 링크",
    footerLegal: "법적 정보",
    footerPrivacy: "개인정보 처리방침",
    footerImpressum: "법적 고지",
    footerCopyright: "전 세계 독일 관공서 지원",

    // Legal Pages
    impressumTitle: "법적 고지 (Impressum)",
    impressumContent: "한독헬퍼\n\n연락처:\n이메일: info@patootie-germany.com\n\n이것은 임시 법적 고지입니다. 독일 법률(§5 TMG)에 따라 실제 법적 정보로 업데이트하십시오.",
    privacyTitle: "개인정보 처리방침",
    privacyContent: "본 개인정보 처리방침은 귀하의 개인정보를 수집, 사용 및 보호하는 방법을 설명합니다.\n\n1. 데이터 수집\n문의 양식을 통해 제공하신 이름, 이메일, 전화번호, 주소 및 메시지 내용을 포함한 개인정보를 수집합니다.\n\n2. 데이터 처리 목적\n귀하의 데이터는 문의 처리 및 서비스 제공 목적으로만 사용됩니다. 귀하가 동의한 대로 이메일 또는 전화로 연락드립니다.\n\n3. 데이터 저장\n귀하의 데이터는 데이터베이스에 안전하게 저장되며 권한이 있는 직원만 액세스할 수 있습니다.\n\n4. 귀하의 권리\n언제든지 개인 데이터에 액세스하거나 수정 또는 삭제할 권리가 있습니다. info@patootie-germany.com으로 문의하십시오.\n\n5. 동의\n문의 양식을 제출함으로써 본 방침에 설명된 대로 개인 데이터 처리에 동의합니다.\n\n이것은 임시 개인정보 처리방침입니다. GDPR 및 독일 데이터 보호법에 따라 완전한 법적 정보로 업데이트하십시오.",

    // Errors
    errorRequired: "필수 항목입니다",
    errorEmail: "유효한 이메일 주소를 입력하세요",
    errorMinLength: "더 자세한 정보를 제공해주세요",
    errorConsent: "계속하려면 동의해야 합니다",

    // New additions
    formMessagePlaceholder: "구체적인 상황, 필요한 서비스 및 관련 세부 정보를 설명해주세요.",
    formStateRequiredUSA: "미국의 경우 주(State) 입력은 필수입니다",
    formProvinceRequiredCanada: "캐나다의 경우 주(Province) 입력은 필수입니다",
    formSuggestedCountries: "추천 국가",
    formAllCountries: "모든 국가",
    formErrorGeneral: "진행하려면 강조 표시된 오류를 수정해주세요.",
    formSuccessGreeting: "문의해 주셔서 감사합니다!",
    formSuccessBody: "요청이 접수되었으며 확인 이메일이 발송되었습니다. 검토 후 가능한 한 빨리 연락드리겠습니다.",
    formSentTo: "수신",
    formReferenceId: "참조 ID",
    formStatusReceived: "접수됨",
    formStatusReviewing: "검토 중",
    formStatusResponse: "답변 완료",
    formSendAnother: "다른 문의 보내기",
    formProgress: "양식 진행률",
    formSelectedOption: "선택된 옵션:",
    formCharacters: "자",
    serviceSelectOptional: "서비스 선택 (선택사항)",
    serviceLearnMore: "자세히 보기",
    serviceSelectChoice: "선택하기",

    // Wizard Steps
    stepService: "서비스",
    stepPersonal: "개인 정보",
    stepContact: "연락처",
    stepReview: "검토",
    stepNext: "다음",
    stepBack: "이전",
    stepSubmit: "문의 제출",
    stepExitWarning: "저장되지 않은 변경 사항이 있습니다. 정말 나가시겠습니까?",

    // Contact Form Steps
    contactFormTitle: "문의 양식",
    contactFormStep1Subtitle: "적절한 지원을 제공해 드릴 수 있도록 몇 가지 질문에 답해 주세요.",
    contactFormStep1Headline: "무엇을 도와드릴까요?",
    contactFormStep2Subtitle: "구체적인 서비스를 선택하세요",
    contactFormStep2Headline: "서비스 선택",
    contactFormStep3Subtitle: "연락을 취하고 절차를 시작하기 위해 몇 가지 정보가 필요합니다.",
    contactFormStep3Headline: "본인 소개",
    stepIndicator: "단계",
    stepOf: "/",
    includedInBundle: "패키지 포함 내역:",

    // Category Step Captions
    categoryCard2Caption: "비자 및 법률 지원",
    categoryCard3Caption: "혜택 및 금융",
    categoryCard4Caption: "공과금 및 보험",
    categoryServicesCount: "서비스",
  },
  de: {
    // Header
    siteTitle: "HandokHelper",
    navServices: "Services",
    navProcess: "Ablauf",
    navAbout: "Über uns",
    navContact: "Kontakt",
    navLegal: "Impressum / Datenschutz",

    // Hero Section
    heroTitle: "Ihre Unterstützung für deutsche Behörden und Wohnen",
    heroDescription: "Der Umzug nach Deutschland oder der Umgang mit deutschen Behörden kann überwältigend sein, besonders aus dem Ausland. HandokHelper unterstützt Sie bei der Wohnungssuche, Einwanderungsfragen, behördlichen Anmeldungen, Rentenanträgen und allen Aufgaben, die jemanden vor Ort in Deutschland erfordern.",
    heroBullet1: "Für Kunden innerhalb und außerhalb Deutschlands",
    heroBullet2: "Wohnungssuche, Besichtigungen und Umzugsunterstützung",
    heroBullet3: "Unterstützung bei Behörden, Dokumenten und offiziellen Verfahren",
    heroBullet4: "Festpreis, Stundensatz oder Prozentsatz je nach Service",
    heroBullet5: "Schnelle und persönliche Kommunikation per Telefon oder E-Mail",

    // Service Cards
    servicesHeading: "Unsere Leistungen",
    servicesLabel: "WAS WIR BIETEN",
    serviceCard1Title: "Wohnen & Umzug",
    serviceCard1Tagline: "Komplette Wohnungssuche bis zum Einzug",
    serviceCard1Badge: "",
    serviceCard1Desc: "Finden Sie Ihr perfektes Zuhause und leben Sie sich reibungslos ein. Wir unterstützen bei der Immobiliensuche, Besichtigungen, Verträgen und allen Anmeldeformalitäten.",
    serviceCard1Services: [
      "Umzugspaket",
      "Anmeldung (Vorbereitung der Unterlagen, Begleitung & Dolmetschen)",
      "Abmeldung",
      "Kündigungsunterstützung vor Abreise (z.B. Wohnung, Verträge)"
    ],
    serviceCard1Descriptions: [
      "Umfassende Unterstützung bei Suche, Besichtigungen und Vertragsverhandlungen.",
      "Wir bereiten Ihre Formulare vor, buchen den Termin und begleiten Sie zum Amt.",
      "Verlassen Sie Deutschland? Wir erledigen die offizielle Abmeldung für Sie.",
      "Unterstützung bei der Kündigung von Wohnung, Internet und anderen Verträgen."
    ],
    relocationBundleItems: [
      "Wohnungs-/Haussuche",
      "Begleitung bei Besichtigungen & Dolmetschen",
      "Prüfung von Mietverträgen & Verhandlungsunterstützung"
    ],
    serviceCard1CTA: "Wohnen & Umzug wählen",
    serviceCard2Title: "Einwanderung & Behördenservice",
    serviceCard2Desc: "Expertenunterstützung für alle Ihre Visa- und Rechtsfragen. Von Arbeitserlaubnissen bis zum Führerscheinumtausch führen wir Sie durch das deutsche Rechtssystem.",
    serviceCard2Services: [
      "Visumantrag & Verlängerung für Expat-Entsendungen",
      "Visumantrag & Verlängerung für Expat-Familien",
      "Beratung & Antragsunterstützung für Arbeitsvisa",
      "Begleitung bei Visa-Interviews & Dolmetschen",
      "Visumabholung im Auftrag des Kunden",
      "Unterstützung beim Führerscheinumtausch & Dolmetschen",
      "Antrag auf Steuerklassenwechsel"
    ],
    serviceCard2Descriptions: [
      "Volle Unterstützung für Firmenentsendungen.",
      "Familienzusammenführung in Deutschland.",
      "Beratung für Aufenthaltstitel zur Erwerbstätigkeit.",
      "Wir begleiten Sie zur Ausländerbehörde.",
      "Sparen Sie Zeit, wir holen Ihre Dokumente ab.",
      "Umschreibung Ihres ausländischen Führerscheins.",
      "Optimieren Sie Ihr monatliches Nettoeinkommen."
    ],
    serviceCard2CTA: "Einwanderung & Rechtliches wählen",
    serviceCard3Title: "Leistungen & Finanzen",
    serviceCard3Desc: "Maximieren Sie Ihre finanziellen Vorteile. Wir helfen bei Rentenerstattungen, Kindergeld und der Einrichtung Ihrer Bankgeschäfte.",
    serviceCard3Services: [
      "Antragsservice für Rentenerstattung",
      "Kindergeldantrag"
    ],
    serviceCard3Descriptions: [
      "Rentenbeiträge bei Ausreise zurückfordern.",
      "Monatliche finanzielle Unterstützung für Ihre Kinder."
    ],
    serviceCard3CTA: "Leistungen & Finanzen wählen",
    serviceCard4Title: "Integration & Alltag",
    serviceCard4Desc: "Wesentliche Unterstützung für Ihren Alltag in Deutschland. Wir kümmern uns um Versorgungsunternehmen, Versicherungen und andere Verträge, damit Sie sich auf das Leben konzentrieren können.",
    serviceCard4Services: [
      "Einrichtung von Internet- & Stromverträgen",
      "Unterstützung bei Versicherungsanmeldungen (Haftpflicht- & Rechtsschutzversicherung)",
      "Unterstützung bei der Kontoeröffnung"
    ],
    serviceCard4Descriptions: [
      "Anschluss bei den besten Anbietern.",
      "Schutz durch wichtige deutsche Versicherungen.",
      "Einrichtung eines Girokontos für Gehalt und Miete."
    ],
    serviceCard4CTA: "Integration & Alltag wählen",

    // Process Section
    processHeading: "Wie es funktioniert",
    processLabel: "UNSER ABLAUF",
    processStep1Title: "Anfrage senden",
    processStep1Desc: "Wählen Sie Ihren Service und senden Sie Ihre Details.",
    processStep2Title: "Beratung",
    processStep2Desc: "HandokHelper prüft Ihre Situation und kontaktiert Sie.",
    processStep3Title: "Zusammenarbeit starten",
    processStep3Desc: "Nach Einigung über die Kosten unterstützt HandokHelper Ihren Fall.",
    processNote: "Hinweis: Das Absenden des Formulars stellt keinen verbindlichen Vertragsabschluss dar. HandokHelper wird Ihnen zunächst ein unverbindliches Angebot unterbreiten.",

    // Contact Form
    contactHeading: "Kontakt aufnehmen",
    contactLabel: "KONTAKT",
    formService: "Service",
    formServicePlaceholder: "Kategorie wählen",
    formSubService: "Spezifischer Service (Optional)",
    formSubServicePlaceholder: "Spezifischen Service wählen",
    formSectionPersonal: "Persönliche Informationen",
    formSectionContact: "Kontaktinformationen",
    formSectionAddress: "Adresse",
    formSectionConsent: "Einwilligung",
    formValidationMessage: "Bitte füllen Sie alle Pflichtfelder aus",
    formSalutation: "Anrede",
    formSalutationPlaceholder: "Anrede wählen",
    formSalutationMr: "Herr",
    formSalutationMs: "Frau",
    formSalutationMx: "Mx",
    formSalutationPreferNot: "Keine Angabe",
    formFirstName: "Vorname",
    formLastName: "Nachname",
    formDateOfBirth: "Geburtsdatum",
    formEmail: "E-Mail",
    formPhone: "Telefonnummer",
    formStreet: "Straße & Hausnummer",
    formAddressLine2: "Adresszusatz (optional)",
    formPostalCode: "Postleitzahl",
    formCity: "Stadt",
    formStateProvince: "Bundesland/Provinz (optional)",
    formCountry: "Land",
    formCountryPlaceholder: "Land wählen",
    formCurrentResidence: "Land des aktuellen Wohnsitzes",
    formCurrentResidencePlaceholder: "Land wählen",
    formPreferredLanguage: "Bevorzugte Kontaktsprache",
    formPreferredLanguagePlaceholder: "Sprache wählen",
    formMessage: "Beschreiben Sie Ihre Situation",
    formContactConsent: "Ich stimme der Kontaktaufnahme per E-Mail und/oder Telefon zu",
    formPrivacyConsent: "Ich habe die ",
    formPrivacyConsentLink: "Datenschutzerklärung",
    formPrivacyConsentSuffix: " gelesen und stimme zu",
    formSubmit: "Anfrage senden",
    formSubmitting: "Wird gesendet...",
    formSuccessTitle: "Vielen Dank!",
    formSuccessMessage: "Ihre Anfrage wurde erfolgreich gesendet. Wir werden uns bald bei Ihnen melden!",

    // About Section
    aboutHeading: "Über HandokHelper",
    aboutLabel: "WER WIR SIND",
    aboutParagraph1: "HandokHelper ist erfahren im Umgang mit deutschen Behörden und versteht die Komplexität der deutschen Bürokratie. Mit jahrelanger Erfahrung im System bietet HandokHelper persönliche Unterstützung, um Ihren Weg reibungsloser zu gestalten.",
    aboutParagraph2: "Ob Sie Einwanderer, ausländischer Einwohner in Deutschland oder im Ausland lebend sind und mit deutschen Behörden interagieren müssen, wir können helfen. Von Visumanträgen bis zu Rentenansprüchen erhält jeder Fall engagierte Aufmerksamkeit und professionelle Beratung.",
    aboutParagraph3: "Wir sind darauf spezialisiert, Einzelpersonen im Ausland bei der Erlangung deutscher Rentenzahlungen und anderer Sozialleistungen zu helfen und sicherzustellen, dass Entfernung kein Hindernis für den Zugang zu Ihren Ansprüchen darstellt.",
    aboutLanguages: "Gesprochene Sprachen",

    // FAQ Section
    faqHeading: "Häufig gestellte Fragen",
    faqSubheading: "Finden Sie Antworten auf häufige Fragen zu unseren Dienstleistungen",

    // Footer
    footerAboutTitle: "Über HandokHelper",
    footerAboutDesc: "Unterstützung beim Umgang mit deutschen Behörden von überall auf der Welt. Hilfe bei Formularen, Bescheinigungen, Wohnsitzangelegenheiten, Rentenunterstützung und mehr.",
    footerQuickLinks: "Schnelllinks",
    footerLegal: "Rechtliches",
    footerPrivacy: "Datenschutzerklärung",
    footerImpressum: "Impressum",
    footerCopyright: "Unterstützung für deutsche Behörden weltweit",

    // Legal Pages
    impressumTitle: "Impressum",
    impressumContent: "HandokHelper\n\nKontakt:\nE-Mail: info ( at ) handokhelper.de\n\nDies ist ein Platzhalter-Impressum. Bitte aktualisieren Sie es mit den tatsächlichen rechtlichen Informationen gemäß §5 TMG.",
    privacyTitle: "Datenschutzerklärung",
    privacyContent: "Diese Datenschutzerklärung beschreibt, wie wir Ihre personenbezogenen Daten erfassen, verwenden und schützen.\n\n1. Datenerfassung\nWir erfassen personenbezogene Daten, die Sie über unser Kontaktformular bereitstellen, einschließlich Name, E-Mail, Telefonnummer, Adresse und Nachrichteninhalt.\n\n2. Zweck der Datenverarbeitung\nIhre Daten werden ausschließlich zur Bearbeitung Ihrer Anfrage und zur Erbringung unserer Dienstleistungen verwendet. Wir kontaktieren Sie per E-Mail oder Telefon, wie von Ihnen zugestimmt.\n\n3. Datenspeicherung\nIhre Daten werden sicher in unserer Datenbank gespeichert und sind nur autorisiertem Personal zugänglich.\n\n4. Ihre Rechte\nSie haben das Recht, jederzeit auf Ihre personenbezogenen Daten zuzugreifen, diese zu korrigieren oder zu löschen. Bitte kontaktieren Sie uns unter info@patootie-germany.com.\n\n5. Einwilligung\nDurch das Absenden des Kontaktformulars stimmen Sie der Verarbeitung Ihrer personenbezogenen Daten wie in dieser Richtlinie beschrieben zu.\n\nDies ist eine Platzhalter-Datenschutzerklärung. Bitte aktualisieren Sie sie mit vollständigen rechtlichen Informationen gemäß DSGVO und deutschen Datenschutzgesetzen.",

    // Errors
    errorRequired: "Dieses Feld ist erforderlich",
    errorEmail: "Bitte geben Sie eine gültige E-Mail-Adresse ein",
    errorMinLength: "Bitte geben Sie mehr Details an",
    errorConsent: "Sie müssen zustimmen, um fortzufahren",

    // New additions
    formMessagePlaceholder: "Bitte beschreiben Sie Ihre spezifische Situation, welche Dienstleistungen Sie benötigen und alle relevanten Details zu Ihrem Fall.",
    formStateRequiredUSA: "Bundesstaat ist für USA erforderlich",
    formProvinceRequiredCanada: "Provinz ist für Kanada erforderlich",
    formSuggestedCountries: "Vorgeschlagen",
    formAllCountries: "Alle Länder",
    formErrorGeneral: "Bitte korrigieren Sie die markierten Fehler, um fortzufahren.",
    formSuccessGreeting: "Danke für Ihre Nachricht!",
    formSuccessBody: "Wir haben Ihre Anfrage erhalten und eine Bestätigungs-E-Mail gesendet. Wir werden sie prüfen und uns so schnell wie möglich bei Ihnen melden.",
    formSentTo: "Gesendet an",
    formReferenceId: "Referenz-ID",
    formStatusReceived: "Empfangen",
    formStatusReviewing: "In Prüfung",
    formStatusResponse: "Antwort",
    formSendAnother: "Weitere Anfrage senden",
    formProgress: "Formularfortschritt",
    formSelectedOption: "Gewählte Option:",
    formCharacters: "Zeichen",
    serviceSelectOptional: "Service wählen (Optional)",
    serviceLearnMore: "Mehr erfahren",
    serviceSelectChoice: "Auswählen",

    // Wizard Steps
    stepService: "Service",
    stepPersonal: "Persönlich",
    stepContact: "Kontakt",
    stepReview: "Überprüfung",
    stepNext: "Weiter",
    stepBack: "Zurück",
    stepSubmit: "Anfrage senden",
    stepExitWarning: "Sie haben ungespeicherte Änderungen. Sind Sie sicher, dass Sie die Seite verlassen möchten?",

    // Contact Form Steps
    contactFormTitle: "Kontaktformular",
    contactFormStep1Subtitle: "Beantworten Sie ein paar kurze Fragen, damit wir Ihnen die richtige Unterstützung bieten können.",
    contactFormStep1Headline: "Wie können wir Ihnen helfen?",
    contactFormStep2Subtitle: "Wählen Sie einen spezifischen Service",
    contactFormStep2Headline: "Wählen Sie Ihre Services",
    contactFormStep3Subtitle: "Wir benötigen ein paar Details, um Sie zu kontaktieren und zu starten.",
    contactFormStep3Headline: "Erzählen Sie uns von sich",
    stepIndicator: "Schritt",
    stepOf: "von",
    includedInBundle: "Im Paket enthalten:",

    // Category Step Captions
    categoryCard2Caption: "Visa & Rechtsberatung",
    categoryCard3Caption: "Leistungen & Finanzen",
    categoryCard4Caption: "Versorgung & Versicherung",
    categoryServicesCount: "Leistungen",
  },
};

export function getTranslations(lang: Language): Translations {
  return translations[lang] || translations.en;
}
