import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import { useLocation } from "wouter";

export default function PrivacyPolicy() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [, setLocation] = useLocation();

  const getThemeIcon = () => {
    return theme === "light" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />;
  };

  const privacyContent = language === "ko" ? {
    title: "개인정보처리방침",
    lastUpdated: "최종 업데이트: 2025년 1월",
    sections: [
      {
        title: "",
        content: `HandokHelper("본 서비스", "저", "저의")는 이용자의 개인정보 보호를 중요하게 생각합니다. 본 개인정보처리방침은 본 서비스가 어떤 개인정보를 수집하며, 어떻게 이용하는지, 그리고 이용자가 가진 권리를 설명합니다. 본 정책은 EU 일반개인정보보호법(GDPR)을 준수합니다.`
      },
      {
        title: "1. 개인정보 처리자",
        content: `HandokHelper\n이메일: info@handokhelper.de\n주소: [주소 입력]\n\n본 서비스 운영자가 개인정보 처리 책임자입니다.`
      },
      {
        title: "2. 수집되는 개인정보",
        content: `사용자가 문의 양식을 제출하거나 본 서비스에 연락할 때 다음 정보를 수집할 수 있습니다.\n\n2.1 개인 정보\n• 이름\n• 성별 / 호칭\n• 생년월일\n• 이메일 주소\n• 전화번호\n• 전체 주소(도로명, 번지, 도시, 우편번호, 주/도/지역, 국가)\n• 현재 거주 국가\n• 선호 연락 언어\n• 사용자가 자유 입력란에 제공한 내용\n\n2.2 서비스 관련 정보\n• 요청한 서비스 종류 (예: 독일 이민, 독일 관공서 서류, 연금 관련 요청 등)\n\n2.3 기술 정보 (자동 수집)\n• IP 주소 (자동 언어 선택에 사용)\n• 브라우저 종류 및 버전\n• 접속 일시\n• 방문 페이지\n\n이 정보는 웹사이트 운영 및 보안 유지 목적입니다.`
      },
      {
        title: "3. 개인정보 처리 목적",
        content: `수집된 개인정보는 다음의 목적으로 처리됩니다:\n\n• 사용자의 문의에 답변하기 위함\n• 사용자가 동의한 연락수단(이메일 또는 전화)으로 연락하기 위함\n• 요청한 서비스를 제공하거나 서비스 제공 전 단계 수행\n• 문의 접수 후 사용자가 제출한 내용을 확인시키기 위한 확인 이메일 발송\n• 스팸 방지 및 보안 목적\n• 웹사이트 기능을 위한 자동 언어 표시\n\n개인정보는 사용자의 명시적 동의 없이 마케팅 목적으로 사용되지 않습니다.`
      },
      {
        title: "4. 개인정보 처리의 법적 근거",
        content: `• GDPR 제6조 1항 (b) — 계약 체결 전 단계 또는 요청 처리 목적\n• GDPR 제6조 1항 (a) — 이메일/전화 연락에 대한 사용자의 동의\n• GDPR 제6조 1항 (f) — 웹사이트 운영 및 보안 유지에 대한 정당한 이익(IP 기반 언어 선택 포함)`
      },
      {
        title: "5. 개인정보 보관 기간",
        content: `개인정보는 다음의 기간 동안 보관됩니다:\n\n• 문의에 응답하는 데 필요한 기간\n• 서비스 제공 기간\n• 법적 의무 보유 기간\n\n협력이 이루어지지 않는 문의는 최대 12개월 후 삭제됩니다.\n협력이 이루어지면 독일 법률에 따른 보관 기간이 적용됩니다.`
      },
      {
        title: "6. 개인정보 제공",
        content: `개인정보는 다음 경우에만 제3자에게 제공될 수 있습니다:\n\n• 이메일 발송 서비스 제공업체\n• 웹사이트 호스팅 업체\n• 법적 요구가 있을 경우(사용자의 동의가 필요한 경우 포함)\n\n광고 목적을 위한 판매 또는 공유는 절대 하지 않습니다.`
      },
      {
        title: "7. 국제 데이터 이전",
        content: `일부 기술 서비스가 EU 외 국가에 위치할 경우 GDPR 준수를 위해 다음 조치를 적용합니다:\n\n• 표준계약조항(SCCs)\n• 적정성 결정\n\n요청 시 관련 정보를 제공합니다.`
      },
      {
        title: "8. 이용자의 권리(GDPR)",
        content: `이용자는 다음과 같은 권리를 가집니다:\n\n• 개인정보 열람권\n• 정정 요청권\n• 삭제 요청권("잊혀질 권리")\n• 처리 제한 요청권\n• 데이터 이동권\n• 동의 철회권(향후 처리에만 적용)\n• 정당한 이익에 근거한 처리에 대한 반대권\n• 감독 기관에 대한 불만 제기권\n\n권리 행사 요청: info@handokhelper.de`
      },
      {
        title: "9. 미성년자",
        content: `본 서비스는 만 16세 미만을 대상으로 하지 않습니다.\n해당 연령대의 개인정보를 고의로 수집하지 않습니다.`
      },
      {
        title: "10. 보안",
        content: `개인정보의 분실, 오용, 무단 접근 또는 공개를 방지하기 위해 적절한 기술적·조직적 보호 조치를 시행합니다.`
      },
      {
        title: "11. 개인정보처리방침 변경",
        content: `본 정책은 필요에 따라 업데이트될 수 있습니다.\n최신 버전은 항상 본 웹사이트에서 확인할 수 있습니다.`
      }
    ]
  } : {
    title: "Privacy Policy",
    lastUpdated: "Last updated: November 2025",
    sections: [
      {
        title: "",
        content: `HandokHelper ("I", "me", "my", or "the Service") takes the protection of your personal data seriously. This Privacy Policy explains what personal information I collect, how it is used, and your rights under the EU General Data Protection Regulation (GDPR).`
      },
      {
        title: "1. Data Controller",
        content: `HandokHelper\nEmail: info@handokhelper.de\nAddress: Soyoung Kwon, Michaelstraße 26, 65936, Frankfurt am Main\n\nThe controller responsible for the processing of your personal data is the individual operating this service.`
      },
      {
        title: "2. Data I Collect",
        content: `When you submit the contact form or communicate with me, I may collect the following information:\n\n2.1 Personal Information\n• Full name\n• Gender / salutation\n• Date of birth\n• Email address\n• Phone number\n• Full address (street, number, postal code, city, state/province, country)\n• Country of residence\n• Preferred contact language\n• Details you include in your free-text message\n\n2.2 Service-related Information\n• The service you request (e.g., immigration, government forms, pension assistance, other official matters)\n\n2.3 Technical Information\nAutomatically collected when visiting the website:\n• IP address (used to display the correct language)\n• Browser type and version\n• Date and time of access\n• Pages viewed\n\nThis technical data is processed to ensure the website functions correctly.`
      },
      {
        title: "3. Purpose of Processing",
        content: `Your data is processed for the following purposes:\n\n• To respond to your inquiry and assess your case\n• To contact you via the channels you explicitly selected (email and/or phone)\n• To provide the requested service or prepare an offer\n• To send you a confirmation email after form submission\n• To prevent spam or misuse (rate limiting, security monitoring)\n• To operate the website, including language detection\n\nYour data will not be used for marketing unless you explicitly opt in.`
      },
      {
        title: "4. Legal Basis for Processing",
        content: `Your data is processed on the following legal bases:\n\n• Art. 6(1)(b) GDPR – processing necessary to respond to your request or take steps prior to entering a contract\n• Art. 6(1)(a) GDPR – your consent for contact by email and/or phone\n• Art. 6(1)(f) GDPR – legitimate interest in website security, preventing abuse, and correct website functioning (e.g., IP-based language detection)`
      },
      {
        title: "5. Data Storage & Retention",
        content: `Your data is stored only as long as necessary for:\n\n• Responding to your request\n• Providing services\n• Legal retention obligations\n\nTypically, requests that do not lead to cooperation are deleted after 12 months.\nIf cooperation begins, data may be stored longer as required by German law (e.g., tax retention periods).`
      },
      {
        title: "6. Data Sharing",
        content: `Your personal data is not shared with third parties, except when necessary for:\n\n• Email delivery (email service provider or mail server)\n• Website hosting provider\n• Legal obligations (e.g., if a German authority requires proof of representation — only with your permission)\n\nNo data is sold or shared for advertising purposes.`
      },
      {
        title: "7. International Data Transfers",
        content: `If technical services (such as email or hosting) are located outside the EU, I ensure compliance with GDPR through:\n\n• Standard Contractual Clauses (SCCs), or\n• Adequacy decisions\n\nYou may request details at any time.`
      },
      {
        title: "8. Your Rights (GDPR)",
        content: `You have the following rights regarding your personal data:\n\n• Right to access\n• Right to rectification\n• Right to deletion ("right to be forgotten")\n• Right to restrict processing\n• Right to data portability\n• Right to withdraw consent (affects future processing only)\n• Right to object to processing based on legitimate interests\n• Right to lodge a complaint with your local supervisory authority\n\nTo exercise any rights, contact me at: info@handokhelper.de`
      },
      {
        title: "9. Children",
        content: `This service is not intended for individuals under 16 years of age.\nI do not knowingly collect children's data.`
      },
      {
        title: "10. Security",
        content: `I implement technical and organizational measures to protect your data against loss, misuse, unauthorized access, or disclosure.`
      },
      {
        title: "11. Updates to This Policy",
        content: `This Privacy Policy may be updated occasionally.\nThe latest version will always be available on this website.`
      }
    ]
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
            <div className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-full bg-secondary/50">
              <button
                onClick={() => setLanguage("en")}
                className={`text-xs md:text-sm font-medium transition-colors px-1.5 md:px-2 py-0.5 rounded ${language === "en" ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"}`}
              >
                EN
              </button>
              <span className="text-muted-foreground text-xs">|</span>
              <button
                onClick={() => setLanguage("ko")}
                className={`text-xs md:text-sm font-medium transition-colors px-1.5 md:px-2 py-0.5 rounded ${language === "ko" ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"}`}
              >
                KO
              </button>
            </div>

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
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{privacyContent.title}</h1>
          <p className="text-sm text-muted-foreground mb-8">{privacyContent.lastUpdated}</p>

          <div className="space-y-8">
            {privacyContent.sections.map((section, index) => (
              <div key={index}>
                {section.title && (
                  <h2 className="text-xl md:text-2xl font-semibold mb-3">{section.title}</h2>
                )}
                <div className="text-muted-foreground whitespace-pre-line leading-relaxed">
                  {section.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t bg-muted/30">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2025 HandokHelper - {t.siteTitle}</p>
        </div>
      </footer>
    </div>
  );
}
