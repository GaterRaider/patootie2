export type Language = 'en' | 'ko';

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

  // Service Cards
  servicesHeading: string;
  serviceCard1Title: string;
  serviceCard1Desc: string;
  serviceCard1FullDesc: string;
  serviceCard1Pricing: string;
  serviceCard1CTA: string;
  serviceCard2Title: string;
  serviceCard2Desc: string;
  serviceCard2FullDesc: string;
  serviceCard2Pricing: string;
  serviceCard2CTA: string;
  serviceCard3Title: string;
  serviceCard3Desc: string;
  serviceCard3FullDesc: string;
  serviceCard3Pricing: string;
  serviceCard3CTA: string;
  serviceCard4Title: string;
  serviceCard4Desc: string;
  serviceCard4FullDesc: string;
  serviceCard4Pricing: string;
  serviceCard4CTA: string;

  // Process Section
  processHeading: string;
  processStep1Title: string;
  processStep1Desc: string;
  processStep2Title: string;
  processStep2Desc: string;
  processStep3Title: string;
  processStep3Desc: string;
  processNote: string;

  // Contact Form
  contactHeading: string;
  formService: string;
  formServicePlaceholder: string;
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

  // About Section
  aboutHeading: string;
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
    siteTitle: "Help for Your Journey to Germany",
    navServices: "Services",
    navProcess: "Process",
    navAbout: "About",
    navContact: "Contact",
    navLegal: "Impressum / Privacy",

    // Hero Section
    heroTitle: "Your support for dealing with German authorities",
    heroDescription: "German bureaucracy can be overwhelming, especially when you're not in the country. Patootie assists with immigration matters, official certificates, paperwork, pension requests, and any task that requires someone in Germany to handle the process for you.",
    heroBullet1: "For clients inside and outside Germany",
    heroBullet2: "Assistance with authorities, documents, and official procedures",
    heroBullet3: "Fixed price, hourly rate, or percentage depending on service",
    heroBullet4: "Fast and personal communication via phone or email",

    // Service Cards
    servicesHeading: "Our Services",
    serviceCard1Title: "Immigration & Residence",
    serviceCard1Desc: "Help with visas, residence permits, appointments, and official documents related to living in Germany.",
    serviceCard1FullDesc: "Navigating the Ausländerbehörde can be confusing—Patootie assists with applications, documents, translations, and scheduling appointments on your behalf.",
    serviceCard1Pricing: "Pricing: hourly or fixed package",
    serviceCard1CTA: "Select Immigration & Residence",
    serviceCard2Title: "Government Forms & Certificates",
    serviceCard2Desc: "Assistance with filling out and submitting official German documents and requests.",
    serviceCard2FullDesc: "Many forms require detailed information, strict formatting, or confirmation from inside Germany. Patootie helps you complete, submit, and track your official paperwork.",
    serviceCard2Pricing: "Pricing: fixed package",
    serviceCard2CTA: "Select Forms & Certificates",
    serviceCard3Title: "German Pension & Social Benefits from Abroad",
    serviceCard3Desc: "Support for receiving German pension payments or social benefits when you live outside of Germany.",
    serviceCard3FullDesc: "Patootie helps collect the correct documents, communicate with German offices, and ensure payments are processed correctly—especially useful for former workers who moved abroad.",
    serviceCard3Pricing: "Pricing: percentage of payout amount",
    serviceCard3CTA: "Select Pension Support",
    serviceCard4Title: "Other Requests",
    serviceCard4Desc: "Any situation that involves a German authority but doesn't fit in the categories above.",
    serviceCard4FullDesc: "Whether it's a certificate, a complicated document request, or something unusual you cannot do from abroad—Patootie can handle most German bureaucratic matters.",
    serviceCard4Pricing: "Pricing: based on time required",
    serviceCard4CTA: "Select Other Requests",

    // Process Section
    processHeading: "How It Works",
    processStep1Title: "Submit your request",
    processStep1Desc: "Select your service and send your details.",
    processStep2Title: "Consultation",
    processStep2Desc: "Patootie reviews your situation and contacts you.",
    processStep3Title: "Start working together",
    processStep3Desc: "After agreement on fees, Patootie assists with your case.",
    processNote: "Note: submitting the form does not create a binding contract; Patootie will first provide an offer.",

    // Contact Form
    contactHeading: "Get in Touch",
    formService: "Service",
    formServicePlaceholder: "Select a service",
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
    formPhone: "Phone Number (with country code)",
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
    formContactConsent: "I agree to be contacted by email or phone",
    formPrivacyConsent: "I have read and agree to the",
    formPrivacyConsentLink: "Privacy Policy",
    formSubmit: "Submit Inquiry",
    formSubmitting: "Submitting...",
    formSuccessTitle: "Thank You!",
    formSuccessMessage: "Your inquiry has been submitted successfully. We will contact you soon!",

    // About Section
    aboutHeading: "About Patootie",
    aboutParagraph1: "Patootie is experienced in dealing with German authorities and understands the complexities of German bureaucracy. With years of experience navigating the system, Patootie provides personalized assistance to make your journey smoother.",
    aboutParagraph2: "Whether you are an immigrant, a foreign resident in Germany, or someone living abroad who needs to interact with German authorities, Patootie can help. From visa applications to pension claims, every case receives dedicated attention and professional guidance.",
    aboutParagraph3: "Patootie specializes in helping individuals abroad obtain German pension payments and other social benefits, ensuring that distance is never a barrier to accessing what you're entitled to.",
    aboutLanguages: "Languages spoken: English, Korean, German",

    // Footer
    footerAboutTitle: "About Patootie",
    footerAboutDesc: "Support for handling German authorities from anywhere in the world. Assistance with forms, certificates, residence matters, pension support, and more.",
    footerQuickLinks: "Quick Links",
    footerLegal: "Legal",
    footerPrivacy: "Privacy Policy",
    footerImpressum: "Impressum",
    footerCopyright: "Support for German Authorities Worldwide",

    // Legal Pages
    impressumTitle: "Impressum",
    impressumContent: "Patootie\nHelp for Your Journey to Germany\n\nContact:\nEmail: info@patootie-germany.com\n\nThis is a placeholder impressum. Please update with actual legal information as required by German law (§5 TMG).",
    privacyTitle: "Privacy Policy",
    privacyContent: "This Privacy Policy describes how we collect, use, and protect your personal information.\n\n1. Data Collection\nWe collect personal information that you provide through our contact form, including your name, email, phone number, address, and message content.\n\n2. Purpose of Data Processing\nYour data is used solely for the purpose of handling your inquiry and providing our services. We will contact you via email or phone as you have consented.\n\n3. Data Storage\nYour data is stored securely in our database and is only accessible to authorized personnel.\n\n4. Your Rights\nYou have the right to access, correct, or delete your personal data at any time. Please contact us at info@patootie-germany.com.\n\n5. Consent\nBy submitting the contact form, you consent to the processing of your personal data as described in this policy.\n\nThis is a placeholder privacy policy. Please update with complete legal information as required by GDPR and German data protection laws.",

    // Errors
    errorRequired: "This field is required",
    errorEmail: "Please enter a valid email address",
    errorMinLength: "Please provide more details",
    errorConsent: "You must agree to continue",
  },
  ko: {
    // Header
    siteTitle: "독일 이민 지원 서비스",
    navServices: "서비스",
    navProcess: "진행 과정",
    navAbout: "소개",
    navContact: "문의하기",
    navLegal: "법적 고지 / 개인정보",

    // Hero Section
    heroTitle: "독일 관공서 업무 처리를 위한 당신의 파트너",
    heroDescription: "독일 관료주의는 특히 현지에 있지 않을 때 부담스러울 수 있습니다. Patootie는 이민 문제, 공식 증명서, 서류 작업, 연금 신청, 그리고 독일 현지에서 누군가가 처리해야 하는 모든 업무를 도와드립니다.",
    heroBullet1: "독일 내외 고객 모두 지원",
    heroBullet2: "관공서, 서류, 공식 절차 지원",
    heroBullet3: "서비스에 따라 고정 가격, 시간당 요금 또는 비율",
    heroBullet4: "전화 또는 이메일을 통한 빠르고 개인적인 소통",

    // Service Cards
    servicesHeading: "서비스 안내",
    serviceCard1Title: "이민 및 거주",
    serviceCard1Desc: "독일 거주와 관련된 비자, 거주 허가, 예약 및 공식 서류 지원.",
    serviceCard1FullDesc: "외국인청(Ausländerbehörde) 업무는 복잡할 수 있습니다. Patootie가 신청서, 서류, 번역 및 예약 일정을 대신 도와드립니다.",
    serviceCard1Pricing: "요금: 시간당 또는 고정 패키지",
    serviceCard1CTA: "이민 및 거주 선택",
    serviceCard2Title: "정부 양식 및 증명서",
    serviceCard2Desc: "독일 공식 서류 및 요청서 작성 및 제출 지원.",
    serviceCard2FullDesc: "많은 양식은 상세한 정보, 엄격한 형식 또는 독일 내 확인이 필요합니다. Patootie가 공식 서류 작성, 제출 및 추적을 도와드립니다.",
    serviceCard2Pricing: "요금: 고정 패키지",
    serviceCard2CTA: "양식 및 증명서 선택",
    serviceCard3Title: "해외에서 독일 연금 및 사회 복지 수령",
    serviceCard3Desc: "해외 거주 시 독일 연금 또는 사회 복지 수령 지원.",
    serviceCard3FullDesc: "Patootie가 올바른 서류 수집, 독일 관공서와의 소통, 지급 처리를 도와드립니다. 특히 해외로 이주한 전직 근로자에게 유용합니다.",
    serviceCard3Pricing: "요금: 지급액의 일정 비율",
    serviceCard3CTA: "연금 지원 선택",
    serviceCard4Title: "기타 요청",
    serviceCard4Desc: "위 카테고리에 해당하지 않는 독일 관공서 관련 모든 상황.",
    serviceCard4FullDesc: "증명서, 복잡한 서류 요청 또는 해외에서 처리할 수 없는 특이한 상황이든, Patootie가 대부분의 독일 관료 업무를 처리할 수 있습니다.",
    serviceCard4Pricing: "요금: 소요 시간에 따라",
    serviceCard4CTA: "기타 요청 선택",

    // Process Section
    processHeading: "진행 방법",
    processStep1Title: "문의 제출",
    processStep1Desc: "서비스를 선택하고 세부 정보를 보내주세요.",
    processStep2Title: "상담",
    processStep2Desc: "Patootie가 상황을 검토하고 연락드립니다.",
    processStep3Title: "협력 시작",
    processStep3Desc: "비용 합의 후 Patootie가 귀하의 사례를 지원합니다.",
    processNote: "참고: 양식 제출이 구속력 있는 계약을 생성하지 않습니다. Patootie가 먼저 견적을 제공합니다.",

    // Contact Form
    contactHeading: "문의하기",
    formService: "서비스",
    formServicePlaceholder: "서비스 선택",
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
    formPhone: "전화번호 (국가 코드 포함)",
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
    formContactConsent: "이메일 또는 전화로 연락받는 것에 동의합니다",
    formPrivacyConsent: "개인정보 처리방침을 읽고 동의합니다",
    formPrivacyConsentLink: "개인정보 처리방침",
    formSubmit: "문의 제출",
    formSubmitting: "제출 중...",
    formSuccessTitle: "감사합니다!",
    formSuccessMessage: "문의가 성공적으로 제출되었습니다. 곧 연락드리겠습니다!",

    // About Section
    aboutHeading: "Patootie 소개",
    aboutParagraph1: "Patootie는 독일 관공서 업무에 대한 경험이 풍부하며 독일 관료제의 복잡성을 이해하고 있습니다. 수년간의 시스템 탐색 경험을 바탕으로 귀하의 여정을 더 원활하게 만들어드립니다.",
    aboutParagraph2: "이민자, 독일 거주 외국인 또는 독일 관공서와 소통해야 하는 해외 거주자 모두를 도와드립니다. 비자 신청부터 연금 청구까지 모든 사례에 전담 지원과 전문적인 안내를 제공합니다.",
    aboutParagraph3: "Patootie는 해외 거주자가 독일 연금 및 기타 사회 복지를 받을 수 있도록 전문적으로 지원하며, 거리가 귀하의 권리를 받는 데 장애가 되지 않도록 합니다.",
    aboutLanguages: "사용 언어: 영어, 한국어, 독일어",

    // Footer
    footerAboutTitle: "Patootie 소개",
    footerAboutDesc: "전 세계 어디서나 독일 관공서 업무를 지원합니다. 서류, 증명서, 거주 문제, 연금 지원 등을 도와드립니다.",
    footerQuickLinks: "빠른 링크",
    footerLegal: "법적 정보",
    footerPrivacy: "개인정보 처리방침",
    footerImpressum: "Impressum",
    footerCopyright: "전 세계 독일 관공서 지원",

    // Legal Pages
    impressumTitle: "법적 고지 (Impressum)",
    impressumContent: "Patootie\n독일 이민 지원 서비스\n\n연락처:\n이메일: info@patootie-germany.com\n\n이것은 임시 법적 고지입니다. 독일 법률(§5 TMG)에 따라 실제 법적 정보로 업데이트하십시오.",
    privacyTitle: "개인정보 처리방침",
    privacyContent: "본 개인정보 처리방침은 귀하의 개인정보를 수집, 사용 및 보호하는 방법을 설명합니다.\n\n1. 데이터 수집\n문의 양식을 통해 제공하신 이름, 이메일, 전화번호, 주소 및 메시지 내용을 포함한 개인정보를 수집합니다.\n\n2. 데이터 처리 목적\n귀하의 데이터는 문의 처리 및 서비스 제공 목적으로만 사용됩니다. 귀하가 동의한 대로 이메일 또는 전화로 연락드립니다.\n\n3. 데이터 저장\n귀하의 데이터는 데이터베이스에 안전하게 저장되며 권한이 있는 직원만 액세스할 수 있습니다.\n\n4. 귀하의 권리\n언제든지 개인 데이터에 액세스하거나 수정 또는 삭제할 권리가 있습니다. info@patootie-germany.com으로 문의하십시오.\n\n5. 동의\n문의 양식을 제출함으로써 본 방침에 설명된 대로 개인 데이터 처리에 동의합니다.\n\n이것은 임시 개인정보 처리방침입니다. GDPR 및 독일 데이터 보호법에 따라 완전한 법적 정보로 업데이트하십시오.",

    // Errors
    errorRequired: "필수 항목입니다",
    errorEmail: "유효한 이메일 주소를 입력하세요",
    errorMinLength: "더 자세한 정보를 제공해주세요",
    errorConsent: "계속하려면 동의해야 합니다",
  },
};

export function getTranslations(lang: Language): Translations {
  return translations[lang] || translations.en;
}
