import 'dotenv/config';
import { getDb } from "../server/db.js";
import { emailTemplates } from "../drizzle/schema.js";
import { eq, and } from "drizzle-orm";
import { readFileSync } from 'fs';
import { join } from 'path';

async function updateTemplates() {
    const db = await getDb();
    if (!db) {
        console.error("Database connection failed");
        process.exit(1);
    }

    console.log("Starting comprehensive template standardization...\n");

    // Read the Korean form_submission template as the base
    const koreanFormTemplate = await db.select().from(emailTemplates).where(
        and(
            eq(emailTemplates.templateKey, 'form_submission'),
            eq(emailTemplates.language, 'ko')
        )
    );

    if (!koreanFormTemplate || koreanFormTemplate.length === 0) {
        console.error("Korean form_submission template not found!");
        process.exit(1);
    }

    const baseHtml = koreanFormTemplate[0].htmlContent;

    // Extract the base template structure (everything except the content section)
    const styleMatch = baseHtml.match(/<style type="text\/css">([\s\S]*?)<\/style>/);
    const baseStyles = styleMatch ? styleMatch[1] : '';

    console.log("✓ Extracted base styles from form_submission (Korean)\n");

    // Helper function to create full HTML template
    function createTemplate(title: string, preheader: string, contentHtml: string, footerLinks: { imprint: string, privacy: string }) {
        return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>${title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <style type="text/css">
      ${baseStyles}
    </style>
  </head>

  <body yahoo="yahoo">
    <!-- Preheader -->
    <div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">
      ${preheader}
    </div>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#f3f4f6">
      <tr>
        <td align="center" style="padding: 30px 16px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" class="email-container" bgcolor="#ffffff"
                 style="border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);">
            <tr>
              <td style="padding: 24px 24px 24px 24px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td class="logo-center" valign="middle" width="1%" style="padding-right: 16px;">
                      <img src="https://www.handokhelper.de/images/HandokHelperLogoOnly.png" width="56" alt="HandokHelper Logo">
                    </td>
                    <td class="company-name" valign="middle"
                        style="font-family: Arial, sans-serif;
                               font-size: 28px;
                               line-height: 32px;
                               color:#111827;
                               font-weight:bold;">
                      HandokHelper
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 24px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td style="border-bottom: 1px solid #e5e7eb; font-size:0; line-height:0;">&nbsp;</td>
                  </tr>
                </table>
              </td>
            </tr>

            ${contentHtml}

            <tr>
              <td style="padding: 0 24px 0 24px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td style="border-top: 1px solid #e5e7eb; font-size:0; line-height:0;">&nbsp;</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td class="footer-text"
                  style="padding: 16px 24px 20px 24px; font-family: Arial, sans-serif; font-size: 13px; line-height: 20px; color:#9ca3af; text-align:left;">
                HandokHelper<br>
                Michaelstraße 26 · 65936 Frankfurt am Main · Germany
                <br><br>
                <a href="https://www.handokhelper.de/imprint" target="_blank" style="color:#6d28d9; text-decoration:none;">
                  ${footerLinks.imprint}
                </a>
                &nbsp;•&nbsp;
                <a href="https://www.handokhelper.de/privacy-policy" target="_blank" style="color:#6d28d9; text-decoration:none;">
                  ${footerLinks.privacy}
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
    }

    // Template content definitions
    const templates = {
        admin_notification: {
            en: {
                title: "New Contact Form Submission",
                preheader: "A new contact form has been submitted on HandokHelper.",
                subject: "New Contact Form Submission - {{service}}",
                content: `<tr>
              <td style="padding: 24px 24px 12px 24px; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color:#4b5563;">
                <p style="margin: 0 0 12px 0;"><b>New form submission received</b></p>
                <p style="margin: 0 0 12px 0;">A new contact form has been submitted on HandokHelper. Below you will find all provided details.</p>
                <p style="margin: 0 0 16px 0;">Please review the information and follow up accordingly.</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 24px 16px 24px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                       style="background: #f9fafb; border: 1px solid #e5e7eb;">
                  <tr>
                    <td width="6" style="background:#4f46e5;">&nbsp;</td>
                    <td style="padding: 14px 16px; font-family: Arial, sans-serif; font-size: 15px; line-height: 22px;">
                      <div style="font-size: 16px; font-weight:600; margin-bottom: 8px;">Submission Details</div>
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr><td width="160" style="padding: 4px 0; font-weight:600; color:#6b7280;">Service:</td><td style="padding: 4px 0; color:#111827;">{{service}}</td></tr>
                        <tr><td width="160" style="padding: 4px 0; font-weight:600; color:#6b7280;">Reference ID:</td><td style="padding: 4px 0; color:#111827;">{{refId}}</td></tr>
                        <tr><td colspan="2" style="padding: 10px 0 4px 0; font-weight:600; color:#4b5563;">Personal Information</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">Name:</td><td style="padding: 2px 0; color:#111827;">{{salutation}} {{firstName}} {{lastName}}</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">Date of Birth:</td><td style="padding: 2px 0; color:#111827;">{{dateOfBirth}}</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">Email:</td><td style="padding: 2px 0; color:#111827;">{{email}}</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">Phone:</td><td style="padding: 2px 0; color:#111827;">{{phoneNumber}}</td></tr>
                        <tr><td colspan="2" style="padding: 10px 0 4px 0; font-weight:600; color:#4b5563;">Address</td></tr>
                        <tr><td colspan="2" style="padding: 2px 0; color:#111827;">{{street}}<br>{{addressLine2}}<br>{{postalCode}} {{city}}<br>{{stateProvince}}<br>{{country}}</td></tr>
                        <tr><td colspan="2" style="padding: 10px 0 4px 0; font-weight:600; color:#4b5563;">Additional Information</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">Current Residence:</td><td style="padding: 2px 0; color:#111827;">{{currentResidence}}</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">Preferred Language:</td><td style="padding: 2px 0; color:#111827;">{{preferredLanguage}}</td></tr>
                        <tr><td colspan="2" style="padding: 10px 0 4px 0; font-weight:600; color:#4b5563;">Message from User</td></tr>
                        <tr><td colspan="2" style="padding: 2px 0; color:#111827; white-space:pre-line;">{{message}}</td></tr>
                        <tr><td colspan="2" style="padding: 10px 0 4px 0; font-weight:600; color:#4b5563;">Consent</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">Contact Permission:</td><td style="padding: 2px 0; color:#111827;">{{contactConsent}}</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">Privacy Policy:</td><td style="padding: 2px 0; color:#111827;">{{privacyConsent}}</td></tr>
                        <tr><td colspan="2" style="padding: 10px 0 4px 0; font-weight:600; color:#4b5563;">Metadata</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">Submitted at:</td><td style="padding: 2px 0; color:#111827;">{{createdAt}}</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">IP Address:</td><td style="padding: 2px 0; color:#111827;">{{submitterIp}}</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">User Agent:</td><td style="padding: 2px 0; color:#111827;">{{userAgent}}</td></tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 24px 16px 24px; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color:#4b5563;">
                Best regards,<br>
                <strong style="color:#4b5563;">HandokHelper Team</strong>
              </td>
            </tr>`,
                footer: { imprint: "Imprint", privacy: "Privacy policy" }
            },
            ko: {
                title: "새 문의 접수 알림",
                preheader: "HandokHelper 사이트에 새로운 문의가 접수되었습니다.",
                subject: "새 문의 접수 알림 - {{service}}",
                content: `<tr>
              <td style="padding: 24px 24px 12px 24px; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color:#4b5563;">
                <p style="margin: 0 0 12px 0;"><b>새로운 문의가 접수되었습니다</b></p>
                <p style="margin: 0 0 12px 0;">HandokHelper 웹사이트에서 새로운 문의가 제출되었습니다. 아래에서 제출된 모든 정보를 확인하실 수 있습니다.</p>
                <p style="margin: 0 0 16px 0;">내용을 검토하시고 필요한 후속 조치를 진행해 주세요.</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 24px 16px 24px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                       style="background: #f9fafb; border: 1px solid #e5e7eb;">
                  <tr>
                    <td width="6" style="background:#4f46e5;">&nbsp;</td>
                    <td style="padding: 14px 16px; font-family: Arial, sans-serif; font-size: 15px; line-height: 22px;">
                      <div style="font-size: 16px; font-weight:600; margin-bottom: 8px;">제출 정보</div>
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr><td width="160" style="padding: 4px 0; font-weight:600; color:#6b7280;">서비스:</td><td style="padding: 4px 0; color:#111827;">{{service}}</td></tr>
                        <tr><td width="160" style="padding: 4px 0; font-weight:600; color:#6b7280;">참조 ID:</td><td style="padding: 4px 0; color:#111827;">{{refId}}</td></tr>
                        <tr><td colspan="2" style="padding: 10px 0 4px 0; font-weight:600; color:#4b5563;">개인 정보</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">이름:</td><td style="padding: 2px 0; color:#111827;">{{salutation}} {{firstName}} {{lastName}}</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">생년월일:</td><td style="padding: 2px 0; color:#111827;">{{dateOfBirth}}</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">이메일:</td><td style="padding: 2px 0; color:#111827;">{{email}}</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">전화번호:</td><td style="padding: 2px 0; color:#111827;">{{phoneNumber}}</td></tr>
                        <tr><td colspan="2" style="padding: 10px 0 4px 0; font-weight:600; color:#4b5563;">주소</td></tr>
                        <tr><td colspan="2" style="padding: 2px 0; color:#111827;">{{street}}<br>{{addressLine2}}<br>{{postalCode}} {{city}}<br>{{stateProvince}}<br>{{country}}</td></tr>
                        <tr><td colspan="2" style="padding: 10px 0 4px 0; font-weight:600; color:#4b5563;">추가 정보</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">현재 거주지:</td><td style="padding: 2px 0; color:#111827;">{{currentResidence}}</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">선호 언어:</td><td style="padding: 2px 0; color:#111827;">{{preferredLanguage}}</td></tr>
                        <tr><td colspan="2" style="padding: 10px 0 4px 0; font-weight:600; color:#4b5563;">사용자 메시지</td></tr>
                        <tr><td colspan="2" style="padding: 2px 0; color:#111827; white-space:pre-line;">{{message}}</td></tr>
                        <tr><td colspan="2" style="padding: 10px 0 4px 0; font-weight:600; color:#4b5563;">동의 사항</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">연락 동의:</td><td style="padding: 2px 0; color:#111827;">{{contactConsent}}</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">개인정보 처리방침:</td><td style="padding: 2px 0; color:#111827;">{{privacyConsent}}</td></tr>
                        <tr><td colspan="2" style="padding: 10px 0 4px 0; font-weight:600; color:#4b5563;">메타데이터</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">제출 시각:</td><td style="padding: 2px 0; color:#111827;">{{createdAt}}</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">IP 주소:</td><td style="padding: 2px 0; color:#111827;">{{submitterIp}}</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">User Agent:</td><td style="padding: 2px 0; color:#111827;">{{userAgent}}</td></tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 24px 16px 24px; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color:#4b5563;">
                감사합니다,<br>
                <strong style="color:#4b5563;">HandokHelper 팀 드림</strong>
              </td>
            </tr>`,
                footer: { imprint: "법적 고지 (Imprint)", privacy: "개인정보 처리방침" }
            },
            de: {
                title: "Neue Kontaktformular-Einreichung",
                preheader: "Ein neues Kontaktformular wurde auf HandokHelper eingereicht.",
                subject: "Neue Kontaktformular-Einreichung - {{service}}",
                content: `<tr>
              <td style="padding: 24px 24px 12px 24px; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color:#4b5563;">
                <p style="margin: 0 0 12px 0;"><b>Neue Formulareinreichung erhalten</b></p>
                <p style="margin: 0 0 12px 0;">Ein neues Kontaktformular wurde auf HandokHelper eingereicht. Unten finden Sie alle bereitgestellten Details.</p>
                <p style="margin: 0 0 16px 0;">Bitte überprüfen Sie die Informationen und führen Sie entsprechende Folgemaßnahmen durch.</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 24px 16px 24px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                       style="background: #f9fafb; border: 1px solid #e5e7eb;">
                  <tr>
                    <td width="6" style="background:#4f46e5;">&nbsp;</td>
                    <td style="padding: 14px 16px; font-family: Arial, sans-serif; font-size: 15px; line-height: 22px;">
                      <div style="font-size: 16px; font-weight:600; margin-bottom: 8px;">Einreichungsdetails</div>
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr><td width="160" style="padding: 4px 0; font-weight:600; color:#6b7280;">Dienst:</td><td style="padding: 4px 0; color:#111827;">{{service}}</td></tr>
                        <tr><td width="160" style="padding: 4px 0; font-weight:600; color:#6b7280;">Referenz-ID:</td><td style="padding: 4px 0; color:#111827;">{{refId}}</td></tr>
                        <tr><td colspan="2" style="padding: 10px 0 4px 0; font-weight:600; color:#4b5563;">Persönliche Informationen</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">Name:</td><td style="padding: 2px 0; color:#111827;">{{salutation}} {{firstName}} {{lastName}}</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">Geburtsdatum:</td><td style="padding: 2px 0; color:#111827;">{{dateOfBirth}}</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">E-Mail:</td><td style="padding: 2px 0; color:#111827;">{{email}}</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">Telefon:</td><td style="padding: 2px 0; color:#111827;">{{phoneNumber}}</td></tr>
                        <tr><td colspan="2" style="padding: 10px 0 4px 0; font-weight:600; color:#4b5563;">Adresse</td></tr>
                        <tr><td colspan="2" style="padding: 2px 0; color:#111827;">{{street}}<br>{{addressLine2}}<br>{{postalCode}} {{city}}<br>{{stateProvince}}<br>{{country}}</td></tr>
                        <tr><td colspan="2" style="padding: 10px 0 4px 0; font-weight:600; color:#4b5563;">Zusätzliche Informationen</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">Aktueller Wohnort:</td><td style="padding: 2px 0; color:#111827;">{{currentResidence}}</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">Bevorzugte Sprache:</td><td style="padding: 2px 0; color:#111827;">{{preferredLanguage}}</td></tr>
                        <tr><td colspan="2" style="padding: 10px 0 4px 0; font-weight:600; color:#4b5563;">Nachricht vom Benutzer</td></tr>
                        <tr><td colspan="2" style="padding: 2px 0; color:#111827; white-space:pre-line;">{{message}}</td></tr>
                        <tr><td colspan="2" style="padding: 10px 0 4px 0; font-weight:600; color:#4b5563;">Einwilligung</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">Kontakterlaubnis:</td><td style="padding: 2px 0; color:#111827;">{{contactConsent}}</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">Datenschutzerklärung:</td><td style="padding: 2px 0; color:#111827;">{{privacyConsent}}</td></tr>
                        <tr><td colspan="2" style="padding: 10px 0 4px 0; font-weight:600; color:#4b5563;">Metadaten</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">Eingereicht am:</td><td style="padding: 2px 0; color:#111827;">{{createdAt}}</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">IP-Adresse:</td><td style="padding: 2px 0; color:#111827;">{{submitterIp}}</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">User Agent:</td><td style="padding: 2px 0; color:#111827;">{{userAgent}}</td></tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 24px 16px 24px; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color:#4b5563;">
                Mit freundlichen Grüßen,<br>
                <strong style="color:#4b5563;">HandokHelper Team</strong>
              </td>
            </tr>`,
                footer: { imprint: "Impressum", privacy: "Datenschutzerklärung" }
            }
        },
        form_submission: {
            de: {
                title: "Anfrage-Bestätigung",
                preheader: "Wir haben Ihre HandokHelper-Anfrage erhalten – hier ist Ihre Bestätigung.",
                subject: "Anfrage-Bestätigung",
                content: `<tr>
              <td style="padding: 24px 24px 12px 24px; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color:#4b5563;">
                <p style="margin: 0 0 12px 0;">
                  <b>Hallo {{firstName}} {{lastName}},</b>
                </p>

                <p style="margin: 0 0 12px 0;">
                  vielen Dank für Ihre Anfrage bei HandokHelper. Wir haben Ihre Angaben erfolgreich erhalten und werden diese schnellstmöglich prüfen.
                </p>

                <p style="margin: 0 0 16px 0;">
                  Zur Übersicht finden Sie hier eine kurze Zusammenfassung Ihrer Anfrage:
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding: 0 24px 16px 24px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                       style="background: #f9fafb; border: 1px solid #e5e7eb;">
                  <tr>
                    <td width="6" style="background:#4f46e5;">&nbsp;</td>

                    <td style="padding: 14px 16px; font-family: Arial, sans-serif; font-size: 15px; line-height: 22px;">
                      <div style="font-size: 16px; font-weight:600; margin-bottom: 8px;">
                        Ihre eingereichte Anfrage
                      </div>

                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>
                          <td width="120" style="padding: 2px 0; font-weight:600; color:#6b7280;">Dienst:</td>
                          <td style="padding: 2px 0; color:#111827;">{{service}}</td>
                        </tr>
                        <tr>
                          <td width="120" style="padding: 2px 0; font-weight:600; color:#6b7280;">Referenz-ID:</td>
                          <td style="padding: 2px 0; color:#111827;">{{refId}}</td>
                        </tr>
                        <tr>
                          <td width="120" style="padding: 2px 0; font-weight:600; color:#6b7280;">E-Mail:</td>
                          <td style="padding: 2px 0; color:#111827;">{{email}}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding: 8px 24px 8px 24px; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color:#4b5563;">
                 Sollten Sie in der Zwischenzeit Fragen haben, können Sie sich jederzeit gerne an uns wenden. Wir helfen Ihnen gerne weiter.
              </td>
            </tr>

            <tr>
              <td style="padding: 8px 24px 16px 24px; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color:#4b5563;">
                Mit freundlichen Grüßen,<br>
                <strong style="color:#4b5563;">HandokHelper Team</strong>
              </td>
            </tr>`,
                footer: { imprint: "Impressum", privacy: "Datenschutzerklärung" }
            }
        },
        invoice_creation: {
            en: {
                title: "Invoice from HandokHelper",
                preheader: "Your invoice from HandokHelper is ready.",
                subject: "Invoice {{invoiceNumber}} from HandokHelper",
                content: `<tr>
              <td style="padding: 24px 24px 12px 24px; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color:#4b5563;">
                <p style="margin: 0 0 12px 0;">
                  <b>Dear {{clientName}},</b>
                </p>

                <p style="margin: 0 0 12px 0;">
                  Please find attached invoice {{invoiceNumber}} for your recent services.
                </p>

                <p style="margin: 0 0 16px 0;">
                  Below is a summary of your invoice:
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding: 0 24px 16px 24px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                       style="background: #f9fafb; border: 1px solid #e5e7eb;">
                  <tr>
                    <td width="6" style="background:#4f46e5;">&nbsp;</td>

                    <td style="padding: 14px 16px; font-family: Arial, sans-serif; font-size: 15px; line-height: 22px;">
                      <div style="font-size: 16px; font-weight:600; margin-bottom: 8px;">
                        Invoice Details
                      </div>

                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>
                          <td width="120" style="padding: 2px 0; font-weight:600; color:#6b7280;">Invoice Number:</td>
                          <td style="padding: 2px 0; color:#111827;">{{invoiceNumber}}</td>
                        </tr>
                        <tr>
                          <td width="120" style="padding: 2px 0; font-weight:600; color:#6b7280;">Issue Date:</td>
                          <td style="padding: 2px 0; color:#111827;">{{issueDate}}</td>
                        </tr>
                        <tr>
                          <td width="120" style="padding: 2px 0; font-weight:600; color:#6b7280;">Due Date:</td>
                          <td style="padding: 2px 0; color:#111827;">{{dueDate}}</td>
                        </tr>
                        <tr>
                          <td width="120" style="padding: 2px 0; font-weight:600; color:#6b7280;">Total Amount:</td>
                          <td style="padding: 2px 0; color:#111827;">{{formattedTotal}}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding: 8px 24px 8px 24px; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color:#4b5563;">
                 Please arrange for payment by the due date. If you have any questions regarding this invoice, please do not hesitate to contact us.
              </td>
            </tr>

            <tr>
              <td style="padding: 8px 24px 16px 24px; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color:#4b5563;">
                Best regards,<br>
                <strong style="color:#4b5563;">HandokHelper Team</strong>
              </td>
            </tr>`,
                footer: { imprint: "Imprint", privacy: "Privacy policy" }
            },
            ko: {
                title: "HandokHelper 송장",
                preheader: "HandokHelper 송장이 준비되었습니다.",
                subject: "HandokHelper 송장 {{invoiceNumber}}",
                content: `<tr>
              <td style="padding: 24px 24px 12px 24px; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color:#4b5563;">
                <p style="margin: 0 0 12px 0;">
                  <b>{{clientName}}님,</b>
                </p>

                <p style="margin: 0 0 12px 0;">
                  최근 이용하신 서비스에 대한 송장 {{invoiceNumber}}을(를) 첨부해 드립니다.
                </p>

                <p style="margin: 0 0 16px 0;">
                  아래는 송장 요약입니다:
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding: 0 24px 16px 24px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                       style="background: #f9fafb; border: 1px solid #e5e7eb;">
                  <tr>
                    <td width="6" style="background:#4f46e5;">&nbsp;</td>

                    <td style="padding: 14px 16px; font-family: Arial, sans-serif; font-size: 15px; line-height: 22px;">
                      <div style="font-size: 16px; font-weight:600; margin-bottom: 8px;">
                        송장 상세
                      </div>

                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>
                          <td width="120" style="padding: 2px 0; font-weight:600; color:#6b7280;">송장 번호:</td>
                          <td style="padding: 2px 0; color:#111827;">{{invoiceNumber}}</td>
                        </tr>
                        <tr>
                          <td width="120" style="padding: 2px 0; font-weight:600; color:#6b7280;">발행일:</td>
                          <td style="padding: 2px 0; color:#111827;">{{issueDate}}</td>
                        </tr>
                        <tr>
                          <td width="120" style="padding: 2px 0; font-weight:600; color:#6b7280;">납기일:</td>
                          <td style="padding: 2px 0; color:#111827;">{{dueDate}}</td>
                        </tr>
                        <tr>
                          <td width="120" style="padding: 2px 0; font-weight:600; color:#6b7280;">총액:</td>
                          <td style="padding: 2px 0; color:#111827;">{{formattedTotal}}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding: 8px 24px 8px 24px; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color:#4b5563;">
                 납기일까지 결제 부탁드립니다. 문의 사항이 있으시면 언제든지 연락 주시기 바랍니다.
              </td>
            </tr>

            <tr>
              <td style="padding: 8px 24px 16px 24px; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color:#4b5563;">
                감사합니다,<br>
                <strong style="color:#4b5563;">HandokHelper 팀 드림</strong>
              </td>
            </tr>`,
                footer: { imprint: "법적 고지 (Imprint)", privacy: "개인정보 처리방침" }
            },
            de: {
                title: "Rechnung von HandokHelper",
                preheader: "Ihre Rechnung von HandokHelper ist bereit.",
                subject: "Rechnung {{invoiceNumber}} von HandokHelper",
                content: `<tr>
              <td style="padding: 24px 24px 12px 24px; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color:#4b5563;">
                <p style="margin: 0 0 12px 0;">
                  <b>Sehr geehrte/r {{clientName}},</b>
                </p>

                <p style="margin: 0 0 12px 0;">
                  anbei finden Sie die Rechnung {{invoiceNumber}} für Ihre kürzlich in Anspruch genommenen Dienstleistungen.
                </p>

                <p style="margin: 0 0 16px 0;">
                  Nachfolgend eine Zusammenfassung Ihrer Rechnung:
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding: 0 24px 16px 24px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                       style="background: #f9fafb; border: 1px solid #e5e7eb;">
                  <tr>
                    <td width="6" style="background:#4f46e5;">&nbsp;</td>

                    <td style="padding: 14px 16px; font-family: Arial, sans-serif; font-size: 15px; line-height: 22px;">
                      <div style="font-size: 16px; font-weight:600; margin-bottom: 8px;">
                        Rechnungsdetails
                      </div>

                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>
                          <td width="120" style="padding: 2px 0; font-weight:600; color:#6b7280;">Rechnungsnummer:</td>
                          <td style="padding: 2px 0; color:#111827;">{{invoiceNumber}}</td>
                        </tr>
                        <tr>
                          <td width="120" style="padding: 2px 0; font-weight:600; color:#6b7280;">Ausstellungsdatum:</td>
                          <td style="padding: 2px 0; color:#111827;">{{issueDate}}</td>
                        </tr>
                        <tr>
                          <td width="120" style="padding: 2px 0; font-weight:600; color:#6b7280;">Fälligkeitsdatum:</td>
                          <td style="padding: 2px 0; color:#111827;">{{dueDate}}</td>
                        </tr>
                        <tr>
                          <td width="120" style="padding: 2px 0; font-weight:600; color:#6b7280;">Gesamtbetrag:</td>
                          <td style="padding: 2px 0; color:#111827;">{{formattedTotal}}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding: 8px 24px 8px 24px; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color:#4b5563;">
                 Bitte veranlassen Sie die Zahlung bis zum Fälligkeitsdatum. Sollten Sie Fragen zu dieser Rechnung haben, zögern Sie bitte nicht, uns zu kontaktieren.
              </td>
            </tr>

            <tr>
              <td style="padding: 8px 24px 16px 24px; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color:#4b5563;">
                Mit freundlichen Grüßen,<br>
                <strong style="color:#4b5563;">HandokHelper Team</strong>
              </td>
            </tr>`,
                footer: { imprint: "Impressum", privacy: "Datenschutzerklärung" }
            }
        }
    };

    // Update all templates
    for (const [templateKey, languages] of Object.entries(templates)) {
        for (const [lang, data] of Object.entries(languages)) {
            console.log(`Updating ${templateKey} (${lang})...`);

            const html = createTemplate(data.title, data.preheader, data.content, data.footer);

            // Check if template exists
            const existing = await db.select().from(emailTemplates).where(
                and(
                    eq(emailTemplates.templateKey, templateKey),
                    eq(emailTemplates.language, lang)
                )
            );

            if (existing.length > 0) {
                // Update existing
                await db.update(emailTemplates)
                    .set({
                        subject: data.subject,
                        htmlContent: html,
                        updatedAt: new Date()
                    })
                    .where(
                        and(
                            eq(emailTemplates.templateKey, templateKey),
                            eq(emailTemplates.language, lang)
                        )
                    );
                console.log(`✓ Updated ${templateKey} (${lang})`);
            } else {
                // Create new
                await db.insert(emailTemplates).values({
                    templateKey: templateKey,
                    language: lang,
                    subject: data.subject,
                    htmlContent: html,
                    senderName: "HandokHelper",
                    senderEmail: "info@handokhelper.de",
                    updatedAt: new Date()
                });
                console.log(`✓ Created ${templateKey} (${lang})`);
            }
        }
    }

    console.log("\n✅ All templates standardized successfully!");
    process.exit(0);
}

updateTemplates().catch(console.error);
