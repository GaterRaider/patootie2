import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import { useLocation } from "wouter";
import { Footer } from "@/components/Footer";

export default function PrivacyPolicy() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [, setLocation] = useLocation();

  const getThemeIcon = () => {
    return theme === "light" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />;
  };

  const privacyContent = language === "ko" ? {
    title: "개인정보 처리방침",
    lastUpdated: "최종 업데이트: 2025년 1월",
    sections: [
      {
        title: "1. 한눈에 보는 개인정보 보호",
        content: [
          {
            subheadline: "일반 안내",
            text: `다음 안내는 귀하가 이 웹사이트를 방문할 때 귀하의 개인정보에 어떤 일이 일어나는지에 대한 간단한 개요를 제공합니다. 개인정보란 귀하를 개인적으로 식별할 수 있는 모든 데이터를 말합니다. 개인정보 보호에 관한 자세한 정보는 아래에 제시된 본 개인정보 처리방침에서 확인하실 수 있습니다.`
          },
          {
            subheadline: "이 웹사이트에서의 데이터 수집",
            text: ""
          },
          {
            subheadline: "이 웹사이트에서의 데이터 처리는 누가 책임지나요?",
            text: `이 웹사이트에서의 데이터 처리는 웹사이트 운영자가 담당합니다. 운영자의 연락처는 본 개인정보 처리방침의 “책임자에 대한 안내” 항목에서 확인하실 수 있습니다.`
          },
          {
            subheadline: "우리는 어떻게 귀하의 데이터를 수집하나요?",
            text: `한편으로 귀하의 데이터는 귀하가 우리에게 직접 제공할 때 수집됩니다. 예를 들어, 문의 양식에 입력하는 데이터가 이에 해당합니다.

그 외의 데이터는 귀하가 이 웹사이트를 방문할 때, 귀하의 동의 후 또는 자동으로 당사의 IT 시스템에 의해 수집됩니다. 주로 브라우저, 운영 체제, 페이지 조회 시간과 같은 기술적 데이터입니다. 이러한 데이터는 귀하가 이 웹사이트에 접속하는 즉시 자동으로 수집됩니다.`
          },
          {
            subheadline: "우리는 귀하의 데이터를 어떤 목적으로 사용하나요?",
            text: `일부 데이터는 웹사이트를 오류 없이 제공하기 위해 수집됩니다. 다른 데이터는 이용자의 방문 행태 분석에 사용될 수 있습니다. 웹사이트를 통해 계약이 체결되거나 준비될 수 있는 경우, 전송된 데이터는 계약 제안, 주문 또는 기타 주문 관련 문의 처리를 위해서도 처리됩니다.`
          },
          {
            subheadline: "귀하는 귀하의 데이터와 관련하여 어떤 권리를 가지나요?",
            text: `귀하는 언제든지 무료로 귀하의 저장된 개인정보의 출처, 수신자 및 처리 목적에 대해 정보 제공을 요청할 권리가 있습니다. 또한 이러한 데이터를 정정하거나 삭제할 것을 요구할 권리가 있습니다. 귀하가 데이터 처리에 동의하신 경우, 향후 효력을 발생하도록 언제든지 동의를 철회할 수 있습니다. 또한 특정 요건 하에서 귀하의 개인정보 처리 제한을 요구할 권리가 있습니다. 아울러 관할 감독 기관에 불만을 제기할 권리도 있습니다.
이 외에도 개인정보 보호와 관련된 기타 모든 질문에 대해 언제든지 저희에게 문의하실 수 있습니다.`
          },
          {
            subheadline: "분석 도구 및 제3자 도구",
            text: `귀하가 이 웹사이트를 방문할 때 귀하의 이용 행태가 통계적으로 분석될 수 있습니다. 이는 주로 이른바 분석 프로그램을 사용하여 이루어집니다.
이러한 분석 프로그램에 대한 자세한 내용은 아래의 개인정보 처리방침에서 확인하실 수 있습니다.`
          }
        ]
      },
      {
        title: "2. 호스팅",
        content: [
          {
            text: `당사는 다음 제공업체를 통해 웹사이트 콘텐츠를 호스팅합니다.`
          },
          {
            subheadline: "외부 호스팅",
            text: `이 웹사이트는 외부에서 호스팅됩니다. 이 웹사이트에서 수집된 개인정보는 호스팅 제공업체의 서버에 저장됩니다. 여기에는 주로 IP 주소, 문의 내용, 메타 및 통신 데이터, 계약 데이터, 연락처 정보, 이름, 웹사이트 접속 데이터 및 웹사이트를 통해 생성되는 기타 데이터가 포함될 수 있습니다.

외부 호스팅은 잠재적 고객 및 기존 고객과의 계약 이행( GDPR 제6조 제1항 (b)호)에 따른 목적 및 전문 제공업체를 통한 안전하고 신속하며 효율적인 온라인 서비스 제공에 대한 정당한 이익(제6조 제1항 (f)호)에 근거하여 이루어집니다. 별도의 동의를 요청한 경우, 처리는 오로지 귀하의 동의( GDPR 제6조 제1항 (a)호 및 TDDDG 제25조 제1항)에 기반하여 이루어지며, 여기에는 TDDDG의 의미에서 쿠키 저장 또는 이용자 단말기(예: 디바이스 핑거프린팅)에 대한 정보 접근에 대한 동의가 포함될 수 있습니다. 동의는 언제든지 철회할 수 있습니다.

당사가 사용하는 호스팅 제공업체는 자신의 서비스 의무를 이행하는 데 필요한 범위 내에서만 귀하의 데이터를 처리하며, 해당 데이터와 관련하여 당사의 지침을 따릅니다.`
          },
          {
            subheadline: "당사가 사용하는 호스팅 제공업체는 다음과 같습니다.",
            text: `Render
525 Brannan St
300, San Francisco, California 94107
미국`
          }
        ]
      },
      {
        title: "3. 일반 안내 및 의무 정보",
        content: [
          {
            subheadline: "개인정보 보호",
            text: `이 페이지의 운영자는 귀하의 개인정보 보호를 매우 중요하게 생각합니다. 당사는 귀하의 개인정보를 기밀로 취급하며, 관련 법률 및 본 개인정보 처리방침에 따라 처리합니다.

귀하가 이 웹사이트를 이용할 때 다양한 개인정보가 수집됩니다. 개인정보란 귀하를 개인적으로 식별할 수 있는 모든 데이터를 의미합니다. 본 개인정보 처리방침은 당사가 어떤 데이터를 수집하고 이를 어떤 목적으로 사용하는지 설명합니다. 또한 이러한 처리가 어떤 방식과 목적으로 이루어지는지도 설명합니다.

또한 인터넷을 통한 데이터 전송(예: 이메일 통신)의 경우 보안 상의 취약점이 있을 수 있음을 알려 드립니다. 제3자의 접근으로부터 데이터를 완벽하게 보호하는 것은 불가능합니다.`
          },
          {
            subheadline: "책임자에 대한 안내",
            text: `이 웹사이트에서의 데이터 처리를 담당하는 책임자는 다음과 같습니다.

Soyoung Kwon
Michaelstraße 26
65936, Frankfurt am Main
독일
전화: [책임자의 전화번호]
이메일: info (at) handokhelper.de

책임자란 단독 또는 타인과 공동으로 개인정보(예: 이름, 이메일 주소 등)의 처리 목적과 수단을 결정하는 자연인 또는 법인을 말합니다.`
          },
          {
            subheadline: "보관 기간",
            text: `본 개인정보 처리방침에서 구체적인 보관 기간이 명시되지 않은 경우, 귀하의 개인정보는 해당 데이터 처리 목적이 더 이상 적용되지 않을 때까지 당사에 보관됩니다. 귀하가 정당한 삭제 요청을 하거나 데이터 처리에 대한 동의를 철회하는 경우, 당사는 귀하의 개인정보를 삭제합니다. 다만 세법 또는 상법상 보존 의무 등 귀하의 개인정보를 계속 보관해야 하는 다른 법적 사유가 있는 경우에는 그러하지 않으며, 이러한 사유가 더 이상 존재하지 않을 때 삭제가 이루어집니다.`
          },
          {
            subheadline: "이 웹사이트에서의 데이터 처리에 대한 법적 근거에 관한 일반 정보",
            text: `귀하가 데이터 처리에 동의한 경우, 당사는 GDPR 제6조 제1항 (a)호 및 제9조 제2항 (a)호에 근거하여 귀하의 개인정보를 처리합니다(제9조 제1항의 특별한 범주의 데이터가 처리되는 경우). 개인정보를 제3국으로 전송하는 데 대해 명시적인 동의를 하신 경우, 데이터 처리는 또한 GDPR 제49조 제1항 (a)호에 근거하여 이루어집니다. 귀하가 쿠키 저장 또는 귀하의 단말기(예: 디바이스 핑거프린팅)에 대한 정보 접근에 동의한 경우, 데이터 처리는 추가적으로 TDDDG 제25조 제1항에 근거합니다. 동의는 언제든지 철회할 수 있습니다. 귀하의 데이터가 계약 이행 또는 계약 체결 전 조치 이행을 위해 필요한 경우, 당사는 GDPR 제6조 제1항 (b)호에 근거하여 귀하의 데이터를 처리합니다. 또한 당사는 법적 의무를 이행하기 위해 데이터 처리가 필요한 경우 GDPR 제6조 제1항 (c)호에 근거하여 데이터를 처리합니다. 그 밖에 데이터 처리는 당사의 정당한 이익에 근거하여 GDPR 제6조 제1항 (f)호에 따라 이루어질 수 있습니다. 각 처리 상황에서 적용되는 구체적인 법적 근거는 아래 각 항목에서 별도로 안내합니다.`
          },
          {
            subheadline: "개인정보 수신자",
            text: `당사는 사업 활동 수행 과정에서 여러 외부 기관과 협력합니다. 이 과정에서 개인정보가 이러한 외부 기관에 전달되는 경우가 있습니다. 당사는 계약 이행에 필요한 경우, 법적으로 의무가 있는 경우(예: 세무 당국에 대한 데이터 제공), GDPR 제6조 제1항 (f)호에 따른 정당한 이익이 있는 경우 또는 다른 법적 근거가 허용하는 경우에만 개인정보를 외부 기관에 전달합니다. 수탁 처리자를 이용하는 경우, 당사는 유효한 데이터 처리 계약에 근거하여서만 고객의 개인정보를 전달합니다. 공동으로 처리를 수행하는 경우에는 공동 책임자에 관한 계약을 체결합니다.`
          },
          {
            subheadline: "동의 철회권",
            text: `많은 데이터 처리 절차는 귀하의 명시적인 동의가 있어야만 가능하며, 귀하는 이미 부여한 동의를 언제든지 철회할 수 있습니다. 철회 이전에 이루어진 데이터 처리의 적법성은 철회의 영향을 받지 않습니다.`
          },
          {
            subheadline: "특별한 상황에서의 데이터 처리 및 직접 마케팅에 대한 반대권 (GDPR 제21조)",
            text: `데이터 처리가 GDPR 제6조 제1항 (e)호 또는 (f)호를 근거로 하는 경우, 귀하는 언제든지 귀하의 특별한 상황과 관련된 사유로 인해 귀하의 개인정보 처리에 이의를 제기할 권리가 있습니다. 이는 이러한 규정에 근거한 프로파일링에도 동일하게 적용됩니다. 각 처리의 법적 근거는 본 개인정보 처리방침에서 확인하실 수 있습니다. 귀하가 이의를 제기하는 경우, 우리는 귀하의 개인정보를 더 이상 처리하지 않습니다. 다만, 귀하의 이익, 권리 및 자유보다 우선하는 중대한 정당한 사유가 있거나, 처리 행위가 법적 청구의 제기, 행사 또는 방어를 위한 것임을 입증할 수 있는 경우는 예외입니다( GDPR 제21조 제1항에 따른 이의 제기).

귀하의 개인정보가 직접 마케팅을 위해 처리되는 경우, 귀하는 언제든지 귀하에 관한 개인정보의 이러한 마케팅 목적상의 처리에 이의를 제기할 권리가 있습니다. 이는 그러한 직접 마케팅과 관련된 프로파일링에도 해당됩니다. 귀하가 이의를 제기하는 경우, 귀하의 개인정보는 이후 더 이상 직접 마케팅 목적에 사용되지 않습니다( GDPR 제21조 제2항에 따른 이의 제기).`
          },
          {
            subheadline: "관할 감독 기관에 대한 불만 제기권",
            text: `GDPR 위반 시, 정보주체는 특히 상시 거주지, 직장 소재지 또는 의심되는 위반 장소가 속한 회원국의 감독 기관에 불만을 제기할 권리가 있습니다. 불만 제기권은 다른 행정적 또는 사법적 구제수단에 영향을 주지 않습니다.`
          },
          {
            subheadline: "데이터 이동권",
            text: `귀하는 동의 또는 계약 이행을 근거로 자동 처리되는 데이터를 일반적으로 사용되는 기계 판독 가능한 형식으로 본인 또는 제3자에게 제공받을 권리가 있습니다. 다른 책임자에게 데이터의 직접 전송을 요구하는 경우, 이는 기술적으로 가능한 범위에서만 이루어집니다.`
          },
          {
            subheadline: "열람, 정정 및 삭제",
            text: `적용 법령의 범위 내에서 귀하는 언제든지 귀하의 저장된 개인정보, 그 출처와 수신자, 데이터 처리 목적에 대한 무료 정보 제공 및 필요한 경우 해당 데이터의 정정 또는 삭제를 요구할 권리를 가집니다. 개인정보와 관련된 기타 질문이 있는 경우에도 언제든지 저희에게 문의하실 수 있습니다.`
          },
          {
            subheadline: "처리 제한권",
            text: `귀하는 귀하의 개인정보 처리 제한을 요구할 권리가 있습니다. 이를 위해 언제든지 저희에게 연락하실 수 있습니다. 처리 제한권은 다음의 경우에 해당합니다.

- 당사가 보관 중인 귀하의 개인정보의 정확성에 대해 귀하가 이의를 제기하는 경우, 우리는 이를 확인할 시간이 필요합니다. 확인 기간 동안 귀하는 귀하의 개인정보 처리 제한을 요구할 권리가 있습니다.
- 귀하의 개인정보 처리 행위가 위법하게 이루어졌거나 이루어지고 있는 경우, 귀하는 삭제 대신 처리 제한을 요구할 수 있습니다.
- 우리가 더 이상 귀하의 개인정보를 필요로 하지 않지만, 귀하가 법적 청구의 행사, 방어 또는 주장에 이를 필요로 하는 경우, 귀하는 삭제 대신 귀하의 개인정보 처리 제한을 요구할 권리가 있습니다.
- 귀하가 GDPR 제21조 제1항에 따라 이의를 제기한 경우, 귀하의 이익과 당사의 이익을 저울질해야 합니다. 어느 쪽의 이익이 우선하는지 결정될 때까지 귀하는 귀하의 개인정보 처리 제한을 요구할 권리가 있습니다.

귀하의 개인정보 처리 제한이 이루어진 경우, 이러한 데이터는 보관 이외의 목적으로는 귀하의 동의가 있는 경우, 법적 청구의 제기, 행사 또는 방어를 위한 경우, 다른 자연인 또는 법인의 권리를 보호하기 위한 경우, 또는 유럽연합이나 회원국의 중요한 공익상 이유가 있는 경우에만 처리될 수 있습니다.`
          },
          {
            subheadline: "SSL 또는 TLS 암호화",
            text: `본 사이트는 보안을 위해, 그리고 귀하가 사이트 운영자인 우리에게 전송하는 주문이나 문의와 같은 기밀 콘텐츠의 전송을 보호하기 위해 SSL 또는 TLS 암호화를 사용합니다. 암호화된 연결은 브라우저의 주소 표시줄이 “http://”에서 “https://”로 변경되고, 브라우저 표시줄에 자물쇠 아이콘이 표시되는 것으로 확인할 수 있습니다.

SSL 또는 TLS 암호화가 활성화된 경우, 귀하가 당사로 전송하는 데이터는 제3자가 읽을 수 없습니다.`
          },
          {
            subheadline: "광고 이메일에 대한 거부",
            text: `법적 고지 의무(인프레숨)를 통해 공개된 연락처 정보는 명시적으로 요청하지 않은 광고 및 정보 자료를 발송하는 데 사용하는 것을 금지합니다. 이 페이지의 운영자는 스팸 이메일과 같은 원치 않는 광고 정보의 발송 시 법적 조치를 취할 권리를 명시적으로 보유합니다.`
          }
        ]
      },
      {
        title: "4. 이 웹사이트에서의 데이터 수집",
        content: [
          {
            subheadline: "문의 양식",
            text: `귀하가 문의 양식을 통해 문의를 보내는 경우, 당사는 문의 양식에 기재된 정보 및 귀하가 제공한 연락처 정보를 문의 처리 및 후속 문의 대응 목적으로 저장합니다. 이 데이터는 귀하의 동의 없이 제3자에게 제공되지 않습니다.

이 데이터 처리는 귀하의 요청이 계약 이행과 관련이 있거나 계약 전 조치 수행에 필요한 경우 GDPR 제6조 제1항 (b)호에 근거하여 이루어집니다. 그 밖의 모든 경우에는 우리에게 제기되는 문의를 효과적으로 처리하기 위한 정당한 이익( GDPR 제6조 제1항 (f)호) 또는 귀하의 동의( GDPR 제6조 제1항 (a)호, 요청된 경우)에 근거합니다. 동의는 언제든지 철회할 수 있습니다.

귀하가 문의 양식에 입력한 데이터는 귀하가 삭제를 요청하거나 저장에 대한 동의를 철회하거나 데이터 저장 목적이 더 이상 적용되지 않을 때(예: 문의 처리가 완료된 경우)까지 당사에 보관됩니다. 법정 보존 기간 등 강행 법규는 이에 영향을 받지 않습니다.`
          },
          {
            subheadline: "이메일, 전화 또는 팩스를 통한 문의",
            text: `귀하가 이메일, 전화 또는 팩스로 문의하는 경우, 귀하의 문의 내용과 그와 관련하여 발생하는 모든 개인정보(이름, 문의 내용)는 귀하의 요청 처리를 위해 당사에 저장 및 처리됩니다. 이 데이터는 귀하의 동의 없이 제3자에게 제공되지 않습니다.

이 데이터 처리는 귀하의 요청이 계약 이행과 관련이 있거나 계약 전 조치 수행에 필요한 경우 GDPR 제6조 제1항 (b)호에 근거하여 이루어집니다. 그 밖의 모든 경우에는 우리에게 제기되는 문의를 효과적으로 처리하기 위한 정당한 이익( GDPR 제6조 제1항 (f)호) 또는 귀하의 동의( GDPR 제6조 제1항 (a)호, 요청된 경우)에 근거합니다. 동의는 언제든지 철회할 수 있습니다.

귀하가 문의를 통해 당사에 전송한 데이터는 귀하가 삭제를 요청하거나 저장에 대한 동의를 철회하거나 데이터 저장 목적이 더 이상 적용되지 않을 때(예: 귀하의 요청 처리가 완료된 경우)까지 당사에 보관됩니다. 법정 보존 기간 등 강행 법규는 이에 영향을 받지 않습니다.`
          }
        ]
      },
      {
        title: "5. 뉴스레터",
        content: [
          {
            subheadline: "뉴스레터 데이터",
            text: `귀하가 웹사이트에서 제공하는 뉴스레터를 수신하고자 하는 경우, 우리는 귀하의 이메일 주소와 더불어 귀하가 해당 이메일 주소의 소유자이며 뉴스레터 수신에 동의한다는 사실을 확인할 수 있는 정보가 필요합니다. 그 밖의 데이터는 수집되지 않거나, 자발적으로 제공하는 경우에만 수집됩니다. 이 데이터는 요청한 정보 발송에만 사용되며, 제3자에게 제공되지 않습니다.

뉴스레터 신청 양식에 입력된 데이터 처리는 오로지 귀하의 동의( GDPR 제6조 제1항 (a)호)에 근거하여 이루어집니다. 귀하는 데이터 및 이메일 주소 저장과 뉴스레터 발송을 위한 이용에 대한 동의를 언제든지 철회할 수 있으며, 이는 예를 들어 뉴스레터 내 “수신 거부” 링크를 통해 가능합니다. 철회 이전에 이루어진 데이터 처리의 적법성은 철회의 영향을 받지 않습니다.

뉴스레터 수신을 위해 당사가 보관하고 있는 데이터는 귀하가 뉴스레터에서 수신 거부를 할 때까지 당사 또는 뉴스레터 서비스 제공업체에 의해 보관되며, 뉴스레터를 해지하거나 목적이 더 이상 존재하지 않는 경우 뉴스레터 발송 목록에서 삭제됩니다. 당사는 GDPR 제6조 제1항 (f)호에 따른 정당한 이익의 범위 내에서 자체 재량으로 뉴스레터 발송 목록에서 이메일 주소를 삭제하거나 차단할 권리를 보유합니다.

다른 목적으로 당사가 저장한 데이터는 이에 영향을 받지 않습니다.

귀하가 뉴스레터 발송 목록에서 수신 거부를 한 후에도 향후 발송을 방지하기 위해 귀하의 이메일 주소가 당사 또는 뉴스레터 서비스 제공업체의 블랙리스트에 저장될 수 있습니다. 블랙리스트의 데이터는 이 목적을 위해서만 사용되며 다른 데이터와 병합되지 않습니다. 이는 뉴스레터 발송과 관련된 법적 요구 사항을 준수하려는 귀하의 이익과 당사의 이익을 동시에 보호하기 위한 것입니다( GDPR 제6조 제1항 (f)호에 따른 정당한 이익). 블랙리스트에 저장되는 기간에는 제한이 없습니다. 귀하의 이익이 당사의 정당한 이익보다 우선하는 경우, 귀하는 해당 저장에 이의를 제기할 수 있습니다.`
          }
        ]
      },
      {
        title: "6. 플러그인 및 도구",
        content: [
          {
            subheadline: "Google Fonts",
            text: `본 사이트는 글꼴을 통일성 있게 표시하기 위해 Google에서 제공하는 Google Fonts를 사용합니다. 페이지를 호출하면, 브라우저는 텍스트와 글꼴을 올바르게 표시하기 위해 필요한 글꼴을 브라우저 캐시에 로드합니다.

이를 위해 귀하가 사용하는 브라우저는 Google 서버와 연결해야 합니다. 이 과정에서 Google은 귀하의 IP 주소를 통해 이 웹사이트에 접속했다는 사실을 인지하게 됩니다. Google Fonts 사용은 GDPR 제6조 제1항 (f)호에 근거합니다. 웹사이트 운영자는 웹사이트에서 글꼴을 통일성 있게 표시하는 데 정당한 이익을 가지고 있습니다. 별도의 동의를 요청한 경우, 처리는 오로지 귀하의 동의( GDPR 제6조 제1항 (a)호 및 TDDDG 제25조 제1항)에 근거하여 이루어지며, 여기에는 TDDDG의 의미에서 쿠키 저장 또는 이용자 단말기에 대한 정보 접근(예: 디바이스 핑거프린팅)에 대한 동의가 포함될 수 있습니다. 동의는 언제든지 철회할 수 있습니다.

귀하의 브라우저가 Google Fonts를 지원하지 않는 경우, 귀하의 컴퓨터에 기본적으로 설치된 글꼴이 사용됩니다.

Google Fonts에 대한 자세한 정보는
https://developers.google.com/fonts/faq 에서 확인하실 수 있으며, Google의 개인정보 처리방침은
https://policies.google.com/privacy 에서 확인하실 수 있습니다.

해당 회사는 “EU‑US 데이터 프라이버시 프레임워크”(DPF)에 따라 인증을 받았습니다. DPF는 미국에서 이루어지는 데이터 처리에 대해 유럽의 개인정보 보호 기준 준수를 보장하기 위해 유럽연합과 미국 간에 체결된 협정입니다. DPF에 따라 인증을 받은 모든 회사는 이러한 개인정보 보호 기준을 준수할 것을 약속합니다. 이에 대한 자세한 정보는 다음 링크에서 제공업체를 통해 확인하실 수 있습니다.
https://www.dataprivacyframework.gov/participant/5780`
          }
        ]
      }
    ]
  } : {
    title: "Privacy Policy",
    lastUpdated: "Last updated: November 2025",
    sections: [
      {
        title: "1. Data Protection at a Glance",
        content: [
          {
            subheadline: "General Information",
            text: `The following notes provide a simple overview of what happens to your personal data when you visit this website. Personal data is all data by which you can be personally identified. Detailed information on the subject of data protection can be found in our privacy policy set out below.`
          },
          {
            subheadline: "Data Collection on This Website",
            text: ""
          },
          {
            subheadline: "Who is responsible for data collection on this website?",
            text: `Data processing on this website is carried out by the website operator. You can find the operator's contact details in the section "Notice concerning the responsible party" in this privacy policy.`
          },
          {
            subheadline: "How do we collect your data?",
            text: `On the one hand, your data is collected when you provide it to us. This can, for example, be data that you enter into a contact form.

Other data is collected automatically or after your consent by our IT systems when you visit the website. This is primarily technical data (e.g. internet browser, operating system or time of page access). This data is collected automatically as soon as you enter this website.`
          },
          {
            subheadline: "What do we use your data for?",
            text: `Part of the data is collected to ensure the error-free provision of the website. Other data can be used to analyze your user behavior. If contracts can be concluded or initiated via the website, the data transmitted is also processed for contract offers, orders or other order-related inquiries.`
          },
          {
            subheadline: "What rights do you have regarding your data?",
            text: `You have the right at any time to receive information free of charge about the origin, recipients and purpose of your stored personal data. You also have the right to request the rectification or deletion of this data. If you have given your consent to data processing, you may revoke this consent at any time for the future. You also have the right, under certain circumstances, to request the restriction of the processing of your personal data. Furthermore, you have a right to lodge a complaint with the competent supervisory authority.
You can contact us at any time regarding this and other questions on the subject of data protection.`
          },
          {
            subheadline: "Analytics Tools and Tools from Third Parties",
            text: `When you visit this website, your surfing behavior may be statistically evaluated. This is done mainly with so-called analysis programs.
Detailed information on these analysis programs can be found in the following privacy policy.`
          }
        ]
      },
      {
        title: "2. Hosting",
        content: [
          {
            text: `We host the content of our website with the following provider:`
          },
          {
            subheadline: "External Hosting",
            text: `This website is hosted externally. The personal data collected on this website is stored on the servers of the host(s). This may primarily include IP addresses, contact requests, meta and communication data, contract data, contact details, names, website access data and other data generated via a website.

External hosting is carried out for the purpose of fulfilling contracts with our potential and existing customers (Art. 6(1)(b) GDPR) and in the interest of a secure, fast and efficient provision of our online offering by a professional provider (Art. 6(1)(f) GDPR). Where corresponding consent has been requested, processing is carried out exclusively on the basis of Art. 6(1)(a) GDPR and § 25(1) TDDDG, insofar as the consent includes the storage of cookies or access to information on the user's device (e.g. device fingerprinting) within the meaning of the TDDDG. Consent can be revoked at any time.

Our host(s) will process your data only to the extent necessary to fulfill their performance obligations and will follow our instructions with regard to this data.`
          },
          {
            subheadline: "We use the following host:",
            text: `Render
525 Brannan St
300, San Francisco, California 94107
US`
          }
        ]
      },
      {
        title: "3. General Notes and Mandatory Information",
        content: [
          {
            subheadline: "Data Protection",
            text: `The operators of these pages take the protection of your personal data very seriously. We treat your personal data confidentially and in accordance with the statutory data protection regulations and this privacy policy.

When you use this website, various personal data is collected. Personal data is data with which you can be personally identified. This privacy policy explains which data we collect and what we use it for. It also explains how and for what purpose this is done.

We would like to point out that data transmission on the internet (e.g. when communicating by e‑mail) may have security gaps. Complete protection of data from access by third parties is not possible.`
          },
          {
            subheadline: "Notice concerning the responsible party",
            text: `The party responsible for data processing on this website is:

Soyoung Kwon
Michaelstraße 26
65936, Frankfurt am Main
Germany
Phone: [Telephone number of the responsible party]
E‑mail: info (at) handokhelper.de

The responsible party is the natural or legal person who, alone or jointly with others, decides on the purposes and means of processing personal data (e.g. names, e‑mail addresses, etc.).`
          },
          {
            subheadline: "Storage Period",
            text: `Unless a more specific storage period is stated in this privacy policy, your personal data will remain with us until the purpose for processing the data no longer applies. If you make a justified request for deletion or revoke your consent to data processing, your data will be deleted unless we have other legally permissible reasons for storing your personal data (e.g. retention periods under tax or commercial law); in the latter case, deletion will take place once these reasons no longer apply.`
          },
          {
            subheadline: "General Information on the Legal Bases of Data Processing on This Website",
            text: `If you have consented to data processing, we process your personal data on the basis of Art. 6(1)(a) GDPR and Art. 9(2)(a) GDPR, insofar as special categories of data under Art. 9(1) GDPR are processed. In the case of express consent to the transfer of personal data to third countries, data processing is also based on Art. 49(1)(a) GDPR. If you have consented to the storage of cookies or to access to information on your device (e.g. via device fingerprinting), data processing is additionally based on § 25(1) TDDDG. Consent may be revoked at any time. If your data is required for the performance of a contract or for the implementation of pre‑contractual measures, we process your data on the basis of Art. 6(1)(b) GDPR. Furthermore, we process your data if this is necessary to fulfill a legal obligation on the basis of Art. 6(1)(c) GDPR. Data processing may also be based on our legitimate interest pursuant to Art. 6(1)(f) GDPR. The relevant legal bases in each individual case are explained in the following paragraphs of this privacy policy.`
          },
          {
            subheadline: "Recipients of Personal Data",
            text: `In the course of our business activities, we work with various external parties. In some cases, the transfer of personal data to these external parties is also necessary. We only pass on personal data to external parties if this is necessary in the context of fulfilling a contract, if we are legally obliged to do so (e.g. passing on data to tax authorities), if we have a legitimate interest in the transfer within the meaning of Art. 6(1)(f) GDPR or if another legal basis permits the data transfer. When using processors, we only pass on personal data from our customers on the basis of a valid data processing agreement. In the case of joint processing, a joint controller agreement is concluded.`
          },
          {
            subheadline: "Revocation of Your Consent to Data Processing",
            text: `Many data processing operations are only possible with your express consent. You can revoke any consent you have already given at any time. The legality of the data processing carried out up to the revocation remains unaffected by the revocation.`
          },
          {
            subheadline: "Right to Object to Data Collection in Special Cases and to Direct Marketing (Art. 21 GDPR)",
            text: `IF DATA PROCESSING IS BASED ON ART. 6(1)(E) OR (F) GDPR, YOU HAVE THE RIGHT, AT ANY TIME AND ON GROUNDS RELATING TO YOUR PARTICULAR SITUATION, TO OBJECT TO THE PROCESSING OF YOUR PERSONAL DATA; THIS ALSO APPLIES TO PROFILING BASED ON THESE PROVISIONS. THE RELEVANT LEGAL BASIS ON WHICH PROCESSING IS BASED CAN BE FOUND IN THIS PRIVACY POLICY. IF YOU OBJECT, WE WILL NO LONGER PROCESS YOUR AFFECTED PERSONAL DATA UNLESS WE CAN DEMONSTRATE COMPELLING LEGITIMATE GROUNDS FOR THE PROCESSING WHICH OVERRIDE YOUR INTERESTS, RIGHTS AND FREEDOMS OR THE PROCESSING SERVES THE ESTABLISHMENT, EXERCISE OR DEFENCE OF LEGAL CLAIMS (OBJECTION PURSUANT TO ART. 21(1) GDPR).

IF YOUR PERSONAL DATA IS PROCESSED FOR DIRECT MARKETING PURPOSES, YOU HAVE THE RIGHT TO OBJECT AT ANY TIME TO THE PROCESSING OF PERSONAL DATA CONCERNING YOU FOR SUCH MARKETING; THIS ALSO APPLIES TO PROFILING TO THE EXTENT THAT IT IS RELATED TO SUCH DIRECT MARKETING. IF YOU OBJECT, YOUR PERSONAL DATA WILL THEREAFTER NO LONGER BE USED FOR DIRECT MARKETING PURPOSES (OBJECTION PURSUANT TO ART. 21(2) GDPR).`
          },
          {
            subheadline: "Right to Lodge a Complaint with the Competent Supervisory Authority",
            text: `In the event of breaches of the GDPR, data subjects have the right to lodge a complaint with a supervisory authority, in particular in the Member State of their habitual residence, their place of work or the place of the alleged infringement. The right to lodge a complaint is without prejudice to other administrative or judicial remedies.`
          },
          {
            subheadline: "Right to Data Portability",
            text: `You have the right to have data which we process automatically on the basis of your consent or in performance of a contract handed over to you or to a third party in a commonly used, machine‑readable format. If you request the direct transfer of the data to another controller, this will only be done where technically feasible.`
          },
          {
            subheadline: "Access, Rectification and Erasure",
            text: `Within the framework of the applicable legal provisions, you have the right at any time to obtain information free of charge about your stored personal data, its origin and recipients and the purpose of the data processing and, if necessary, a right to rectification or erasure of this data. You can contact us at any time regarding this and other questions on the subject of personal data.`
          },
          {
            subheadline: "Right to Restriction of Processing",
            text: `You have the right to request the restriction of the processing of your personal data. You can contact us at any time for this purpose. The right to restriction of processing exists in the following cases:

• If you dispute the accuracy of your personal data stored by us, we usually need time to verify this. For the duration of this verification, you have the right to request the restriction of the processing of your personal data.
• If the processing of your personal data happened or is happening unlawfully, you may request the restriction of data processing instead of erasure.
• If we no longer need your personal data, but you need it for the exercise, defence or establishment of legal claims, you have the right to request the restriction of the processing of your personal data instead of its erasure.
• If you have lodged an objection pursuant to Art. 21(1) GDPR, a balance must be struck between your interests and ours. As long as it has not yet been determined whose interests prevail, you have the right to request the restriction of the processing of your personal data.

If you have restricted the processing of your personal data, such data may – with the exception of storage – only be processed with your consent or for the establishment, exercise or defence of legal claims or for the protection of the rights of another natural or legal person or for reasons of important public interest of the European Union or of a Member State.`
          },
          {
            subheadline: "SSL or TLS Encryption",
            text: `For security reasons and to protect the transmission of confidential content, such as orders or inquiries that you send to us as the site operator, this site uses SSL or TLS encryption. You can recognize an encrypted connection by the fact that the address line of the browser changes from “http://” to “https://” and by the lock symbol in your browser line.

If SSL or TLS encryption is activated, the data you transmit to us cannot be read by third parties.`
          },
          {
            subheadline: "Objection to Advertising E‑mails",
            text: `The use of contact details published within the framework of the legal notice obligation for the purpose of sending unsolicited advertising and information material is hereby rejected. The operators of the pages expressly reserve the right to take legal action in the event of unsolicited sending of advertising information, for example by spam e‑mails.`
          }
        ]
      },
      {
        title: "4. Data Collection on This Website",
        content: [
          {
            subheadline: "Contact Form",
            text: `If you send us inquiries via the contact form, the information you provide in the inquiry form, including the contact details you enter there, will be stored by us for the purpose of processing the inquiry and in the event of follow‑up questions. We do not pass on this data without your consent.

The processing of this data is based on Art. 6(1)(b) GDPR, provided that your request is related to the performance of a contract or is necessary for the implementation of pre‑contractual measures. In all other cases, processing is based on our legitimate interest in the effective handling of inquiries addressed to us (Art. 6(1)(f) GDPR) or on your consent (Art. 6(1)(a) GDPR) if this has been requested; consent can be revoked at any time.

The data you enter in the contact form will remain with us until you request its deletion, revoke your consent to storage or the purpose for data storage no longer applies (e.g. after your inquiry has been completely processed). Mandatory statutory provisions – in particular retention periods – remain unaffected.`
          },
          {
            subheadline: "Inquiry by E‑mail, Telephone or Fax",
            text: `If you contact us by e‑mail, telephone or fax, your inquiry including all resulting personal data (name, inquiry) will be stored and processed by us for the purpose of handling your request. We do not pass on this data without your consent.

The processing of this data is based on Art. 6(1)(b) GDPR, provided that your request is related to the performance of a contract or is necessary for the implementation of pre‑contractual measures. In all other cases, processing is based on our legitimate interest in the effective handling of inquiries addressed to us (Art. 6(1)(f) GDPR) or on your consent (Art. 6(1)(a) GDPR), if this has been requested; consent can be revoked at any time.

The data you send to us via contact inquiries will remain with us until you request its deletion, revoke your consent to storage or the purpose for data storage no longer applies (e.g. after your request has been completely processed). Mandatory statutory provisions – in particular statutory retention periods – remain unaffected.`
          }
        ]
      },
      {
        title: "5. Newsletter",
        content: [
          {
            subheadline: "Newsletter Data",
            text: `If you would like to receive the newsletter offered on the website, we require an e‑mail address from you as well as information that allows us to verify that you are the owner of the specified e‑mail address and that you agree to receive the newsletter. No further data is collected or only on a voluntary basis. We use this data exclusively for sending the requested information and do not pass it on to third parties.

The processing of the data entered in the newsletter registration form is based exclusively on your consent (Art. 6(1)(a) GDPR). You can revoke the consent given to the storage of the data, the e‑mail address and their use for sending the newsletter at any time, for example via the “unsubscribe” link in the newsletter. The lawfulness of the data processing operations already carried out remains unaffected by the revocation.

The data stored by us for the purpose of receiving the newsletter will be stored by us or the newsletter service provider until you unsubscribe from the newsletter and will be deleted from the newsletter distribution list after you unsubscribe from the newsletter or after the purpose no longer applies. We reserve the right to delete or block e‑mail addresses from our newsletter distribution list at our own discretion within the scope of our legitimate interest pursuant to Art. 6(1)(f) GDPR.

Data that has been stored by us for other purposes remains unaffected by this.

After you have unsubscribed from the newsletter distribution list, your e‑mail address may be stored by us or the newsletter service provider in a blacklist if this is necessary to prevent future mailings. The data from the blacklist will only be used for this purpose and will not be merged with other data. This serves both your interest and our interest in complying with the legal requirements for sending newsletters (legitimate interest within the meaning of Art. 6(1)(f) GDPR). Storage in the blacklist is not limited in time. You can object to this storage if your interests outweigh our legitimate interest.`
          }
        ]
      },
      {
        title: "6. Plugins and Tools",
        content: [
          {
            subheadline: "Google Fonts",
            text: `This site uses so‑called Google Fonts, provided by Google, for the uniform display of fonts. When you call up a page, your browser loads the required fonts into its browser cache in order to display texts and fonts correctly.

For this purpose, the browser you use must connect to Google’s servers. As a result, Google becomes aware that this website has been accessed via your IP address. The use of Google Fonts is based on Art. 6(1)(f) GDPR. The website operator has a legitimate interest in the uniform presentation of the typeface on its website. If corresponding consent has been requested, processing is carried out exclusively on the basis of Art. 6(1)(a) GDPR and § 25(1) TDDDG, insofar as the consent includes the storage of cookies or access to information on the user’s device (e.g. device fingerprinting) within the meaning of the TDDDG. Consent can be revoked at any time.

If your browser does not support Google Fonts, a standard font from your computer will be used.

Further information on Google Fonts can be found at
https://developers.google.com/fonts/faq and in Google’s privacy policy:
https://policies.google.com/privacy.

The company is certified under the “EU‑US Data Privacy Framework” (DPF). The DPF is an agreement between the European Union and the USA intended to ensure compliance with European data protection standards for data processing in the USA. Every company certified under the DPF undertakes to comply with these data protection standards. Further information can be obtained from the provider at the following link:
https://www.dataprivacyframework.gov/participant/5780`
          }
        ]
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
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{privacyContent.title}</h1>
          <p className="text-sm text-muted-foreground mb-8">{privacyContent.lastUpdated}</p>

          <div className="space-y-8">
            {privacyContent.sections.map((section, index) => (
              <div key={index}>
                {section.title && (
                  <h2 className="text-xl md:text-2xl font-semibold mb-3">{section.title}</h2>
                )}
                <div className="space-y-4">
                  {section.content.map((block, blockIndex) => (
                    <div key={blockIndex}>
                      {block.subheadline && (
                        <h3 className="text-lg font-semibold mb-2 text-foreground">{block.subheadline}</h3>
                      )}
                      <div className="text-muted-foreground whitespace-pre-line leading-relaxed">
                        {block.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
