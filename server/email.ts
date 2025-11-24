import Mailjet from 'node-mailjet';
import type { ContactSubmission } from '../drizzle/schema';

// Initialize MailJet client with API credentials
const createMailjetClient = () => {
  const apiKey = process.env.MAILJET_API_KEY;
  const secretKey = process.env.MAILJET_SECRET_KEY;

  if (!apiKey || !secretKey) {
    console.warn('[Email] MailJet credentials not configured');
    return null;
  }

  return Mailjet.apiConnect(apiKey, secretKey);
};

/**
 * Send confirmation email to the user
 */
export async function sendConfirmationEmail(submission: ContactSubmission): Promise<boolean> {
  const mailjet = createMailjetClient();
  const isKorean = submission.preferredLanguage === 'Korean' || submission.preferredLanguage === 'ko';
  const language = isKorean ? 'ko' : 'en';

  // Fetch template from database
  let subject: string;
  let emailContentText: string;
  let emailContentHTML: string;
  let senderName = 'HandokHelper';
  let senderEmail = process.env.EMAIL_FROM || 'noreply@handokhelper.de';

  try {
    const { getEmailTemplate, replacePlaceholders } = await import('./email-templates');
    const template = await getEmailTemplate('form_submission', language);

    if (template) {
      subject = template.subject;
      emailContentText = replacePlaceholders(template.textContent || '', submission as any);
      emailContentHTML = replacePlaceholders(template.htmlContent, submission as any);
      if (template.senderName) senderName = template.senderName;
      if (template.senderEmail) senderEmail = template.senderEmail;
    } else {
      // Fallback to hardcoded
      subject = isKorean ? 'ìš”ì²­ ì ‘ìˆ˜ í™•ì¸' : 'Request Confirmation';
      emailContentText = isKorean ? getConfirmationEmailText_KOR(submission) : getConfirmationEmailText_EN(submission);
      emailContentHTML = isKorean ? getConfirmationEmailHTML_KOR(submission) : getConfirmationEmailHTML_EN(submission);
    }
  } catch (error) {
    console.error('[Email] Failed to fetch template, using fallback:', error);
    subject = isKorean ? 'ìš”ì²­ ì ‘ìˆ˜ í™•ì¸' : 'Request Confirmation';
    emailContentText = isKorean ? getConfirmationEmailText_KOR(submission) : getConfirmationEmailText_EN(submission);
    emailContentHTML = isKorean ? getConfirmationEmailHTML_KOR(submission) : getConfirmationEmailHTML_EN(submission);
  }

  if (!mailjet) {
    console.log('[Email] MailJet not configured, confirmation email (would be sent to user):');
    console.log('To:', submission.email);
    console.log('From:', `${senderName} <${senderEmail}>`);
    console.log('Subject:', subject);
    console.log(emailContentText);
    return true;
  }

  try {
    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: senderEmail,
            Name: senderName,
          },
          To: [
            {
              Email: submission.email,
              Name: `${submission.firstName} ${submission.lastName}`,
            },
          ],
          Subject: subject,
          TextPart: emailContentText,
          HTMLPart: emailContentHTML,
        },
      ],
    });

    const response = await request;

    // Handle MailJet response
    const responseBody = response.body as any;
    if (responseBody && responseBody.Messages && Array.isArray(responseBody.Messages)) {
      const message = responseBody.Messages[0];
      if (message && message.Status === 'success') {
        console.log('[Email] Confirmation email sent successfully to:', submission.email);
        return true;
      }
    }

    console.error('[Email] Unexpected response from MailJet:', responseBody);
    return false;
  } catch (error) {
    console.error('[Email] Failed to send confirmation email:', error);
    return false;
  }
}

/**
 * Send notification email to HandokHelper (admin)
 */
export async function sendAdminNotificationEmail(submission: ContactSubmission): Promise<boolean> {
  const mailjet = createMailjetClient();
  const isKorean = submission.preferredLanguage === 'Korean' || submission.preferredLanguage === 'ko';
  const language = isKorean ? 'ko' : 'en';

  // Fetch template from database
  let subject: string;
  let emailContentText: string;
  let emailContentHTML: string;
  let senderName = 'HandokHelper System';
  let senderEmail = process.env.EMAIL_FROM || 'noreply@handokhelper.de';

  try {
    const { getEmailTemplate, replacePlaceholders } = await import('./email-templates');
    const template = await getEmailTemplate('admin_notification', language);

    if (template) {
      subject = replacePlaceholders(template.subject, submission as any);
      emailContentText = replacePlaceholders(template.textContent || '', submission as any);
      emailContentHTML = replacePlaceholders(template.htmlContent, submission as any);
      if (template.senderName) senderName = template.senderName;
      if (template.senderEmail) senderEmail = template.senderEmail;
    } else {
      // Fallback to hardcoded
      subject = isKorean
        ? `ìƒˆ ë¬¸ì˜ ì ‘ìˆ˜ ì•Œë¦¼ - ${submission.service}`
        : `New Contact Form Submission - ${submission.service}`;
      emailContentText = isKorean ? getAdminEmailText_KOR(submission) : getAdminEmailText_EN(submission);
      emailContentHTML = isKorean ? getAdminEmailHTML_KOR(submission) : getAdminEmailHTML_EN(submission);
    }
  } catch (error) {
    console.error('[Email] Failed to fetch template, using fallback:', error);
    subject = isKorean
      ? `ìƒˆ ë¬¸ì˜ ì ‘ìˆ˜ ì•Œë¦¼ - ${submission.service}`
      : `New Contact Form Submission - ${submission.service}`;
    emailContentText = isKorean ? getAdminEmailText_KOR(submission) : getAdminEmailText_EN(submission);
    emailContentHTML = isKorean ? getAdminEmailHTML_KOR(submission) : getAdminEmailHTML_EN(submission);
  }

  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_FROM || 'info@handokhelper.de';

  if (!mailjet) {
    console.log('[Email] MailJet not configured, admin notification email (would be sent to HandokHelper):');
    console.log('To:', adminEmail);
    console.log('From:', `${senderName} <${senderEmail}>`);
    console.log('Subject:', subject);
    console.log(emailContentText);
    return true;
  }

  try {
    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: senderEmail,
            Name: senderName,
          },
          To: [
            {
              Email: adminEmail,
              Name: 'HandokHelper Admin',
            },
          ],
          Subject: subject,
          TextPart: emailContentText,
          HTMLPart: emailContentHTML,
        },
      ],
    });

    const response = await request;

    // Handle MailJet response
    const responseBody = response.body as any;
    if (responseBody && responseBody.Messages && Array.isArray(responseBody.Messages)) {
      const message = responseBody.Messages[0];
      if (message && message.Status === 'success') {
        console.log('[Email] Admin notification sent successfully to:', adminEmail);
        return true;
      }
    }

    console.error('[Email] Unexpected response from MailJet:', responseBody);
    return false;
  } catch (error) {
    console.error('[Email] Failed to send admin notification email:', error);
    return false;
  }
}

// ==========================================
// Template Helper Functions
// ==========================================

// --- User Confirmation (English) ---

export function getConfirmationEmailText_EN(submission: ContactSubmission): string {
  return `
Hello ${submission.firstName} ${submission.lastName},

thank you for submitting your request to HandokHelper. We have successfully received your details and will review them as soon as we can.

For your convenience, here is a short overview of your request:

Your submitted request
Service: ${submission.service}
Reference ID: ${submission.refId}
Email: ${submission.email}

If you have any questions in the meantime, please feel free to contact us. We are always happy to help.

Best regards,
HandokHelper Team

HandokHelper
MichaelstraÃŸe 26 Â· 65936 Frankfurt am Main Â· Germany
Imprint: https://www.handokhelper.de/imprint
Privacy policy: https://www.handokhelper.de/privacy-policy
  `.trim();
}

export function getConfirmationEmailHTML_EN(submission: ContactSubmission): string {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Request Confirmation</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style type="text/css">
      html, body { margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }
      body { background-color: #f3f4f6; }
      img { border: 0; line-height: 100%; text-decoration: none; -ms-interpolation-mode: bicubic; }
      table { border-collapse: collapse !important; }
      .email-container { width: 100%; max-width: 560px; }
      .logo-center img { display: block; height: auto; max-width: 56px; border-radius: 16px; }
      .button-td, .button-a { transition: all 100ms ease-in; }
      .button-a { font-family: Arial, sans-serif; font-size: 16px; text-decoration: none; line-height: 20px; font-weight: bold; display: inline-block; padding: 12px 24px; border-radius: 999px; background-color: #4f46e5; border: 1px solid #4f46e5; color: #ffffff; }
      .button-td:hover .button-a { background-color: #4338ca !important; border-color: #4338ca !important; }
      @media screen and (max-width: 600px) { .email-container { width: 100% !important; } .logo-center img { max-width: 48px !important; } .logo-center { padding-right: 12px !important; } .company-name { font-size: 22px !important; line-height: 26px !important; } }
      @media screen and (max-width: 400px) { .logo-center img { max-width: 40px !important; } .logo-center { padding-right: 10px !important; } .company-name { font-size: 20px !important; line-height: 24px !important; } }
      @media (prefers-color-scheme: dark) {
        body, table[bgcolor="#f3f4f6"] { background-color: #0f172a !important; }
        table.email-container, table[bgcolor="#ffffff"] { background-color: #1e293b !important; }
        .company-name, td, p, div, span { color: #e5e7eb !important; }
        h1, h2, h3 { color: #f1f5f9 !important; }
        td[style*="border-bottom"], td[style*="border-top"], table[style*="border: 1px solid"] { border-color: #334155 !important; }
        table[style*="background: #f9fafb"] { background: #334155 !important; }
        td[width="6"][style*="background:#4f46e5"] { background: #6366f1 !important; }
        .button-a { background-color: #4f46e5 !important; border-color: #4f46e5 !important; color: #ffffff !important; }
        .footer-text { color: #94a3b8 !important; }
      }
    </style>
  </head>
  <body yahoo="yahoo">
    <div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">
      We have received your HandokHelper request â€“ hereâ€™s your confirmation.
    </div>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#f3f4f6">
      <tr>
        <td align="center" style="padding: 30px 16px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" class="email-container" bgcolor="#ffffff" style="border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px -6px rgba(15, 23, 42, 0.06);">
            <tr>
              <td style="padding: 24px 24px 24px 24px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td class="logo-center" valign="middle" width="1%" style="padding-right: 16px;">
                      <img src="https://www.handokhelper.de/images/HandokHelperLogoOnly.png" width="56" alt="HandokHelper Logo">
                    </td>
                    <td class="company-name" valign="middle" style="font-family: Arial, sans-serif; font-size: 28px; line-height: 32px; color:#111827; font-weight:bold;">
                      HandokHelper
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 24px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr><td style="border-bottom: 1px solid #e5e7eb; font-size:0; line-height:0;">&nbsp;</td></tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 24px 24px 12px 24px; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color:#4b5563;">
                <p style="margin: 0 0 12px 0;"><b>Hello ${submission.firstName} ${submission.lastName},</b></p>
                <p style="margin: 0 0 12px 0;">thank you for submitting your request to HandokHelper. We have successfully received your details and will review them as soon as we can.</p>
                <p style="margin: 0 0 16px 0;">For your convenience, here is a short overview of your request:</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 24px 16px 24px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #f9fafb; border: 1px solid #e5e7eb;">
                  <tr>
                    <td width="6" style="background:#4f46e5;">&nbsp;</td>
                    <td style="padding: 14px 16px; font-family: Arial, sans-serif; font-size: 15px; line-height: 22px;">
                      <div style="font-size: 16px; font-weight:600; margin-bottom: 8px;">Your submitted request</div>
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr><td width="120" style="padding: 2px 0; font-weight:600; color:#6b7280;">Service:</td><td style="padding: 2px 0; color:#111827;">${submission.service}</td></tr>
                        <tr><td width="120" style="padding: 2px 0; font-weight:600; color:#6b7280;">Reference ID:</td><td style="padding: 2px 0; color:#111827;">${submission.refId}</td></tr>
                        <tr><td width="120" style="padding: 2px 0; font-weight:600; color:#6b7280;">Email:</td><td style="padding: 2px 0; color:#111827;">${submission.email}</td></tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 24px 8px 24px; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color:#4b5563;">
                 If you have any questions in the meantime, please feel free to contact us. We are always happy to help.
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 24px 16px 24px; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color:#4b5563;">
                Best regards,<br><strong style="color:#4b5563;">HandokHelper Team</strong>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 24px 0 24px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr><td style="border-top: 1px solid #e5e7eb; font-size:0; line-height:0;">&nbsp;</td></tr>
                </table>
              </td>
            </tr>
            <tr>
              <td class="footer-text" style="padding: 16px 24px 20px 24px; font-family: Arial, sans-serif; font-size: 13px; line-height: 20px; color:#9ca3af; text-align:left;">
                HandokHelper<br>MichaelstraÃŸe 26 Â· 65936 Frankfurt am Main Â· Germany<br><br>
                <a href="https://www.handokhelper.de/imprint" target="_blank" style="color:#6d28d9; text-decoration:none;">Imprint</a>
                &nbsp;â€¢&nbsp;
                <a href="https://www.handokhelper.de/privacy-policy" target="_blank" style="color:#6d28d9; text-decoration:none;">Privacy policy</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

// --- User Confirmation (Korean) ---

export function getConfirmationEmailText_KOR(submission: ContactSubmission): string {
  return `
${submission.firstName} ${submission.lastName}ë‹˜, ì•ˆë…•í•˜ì„¸ìš”.

HandokHelperì— ë¬¸ì˜í•´ ì£¼ì…”ì„œ ê°ì‚¬í•©ë‹ˆë‹¤. ê³ ê°ë‹˜ì´ ì œì¶œí•˜ì‹  ì •ë³´ëŠ” ì„±ê³µì ìœ¼ë¡œ ì ‘ìˆ˜ë˜ì—ˆìœ¼ë©°, ê°€ëŠ¥í•œ í•œ ë¹ ë¥´ê²Œ í™•ì¸ í›„ ì•ˆë‚´ë“œë¦¬ê² ìŠµë‹ˆë‹¤.

ì•„ëž˜ëŠ” ê³ ê°ë‹˜ê»˜ì„œ ì œì¶œí•´ ì£¼ì‹  ìš”ì²­ ë‚´ìš©ì˜ ê°„ë‹¨í•œ ìš”ì•½ìž…ë‹ˆë‹¤:

ì œì¶œí•˜ì‹  ìš”ì²­ ì •ë³´
ì„œë¹„ìŠ¤: ${submission.service}
ì°¸ì¡° ID: ${submission.refId}
ì´ë©”ì¼: ${submission.email}

ì¶”ê°€ë¡œ ê¶ê¸ˆí•˜ì‹  ì ì´ ìžˆìœ¼ì‹œë©´ ì–¸ì œë“ ì§€ íŽ¸í•˜ê²Œ ë¬¸ì˜í•´ ì£¼ì„¸ìš”. í•­ìƒ ë„ì™€ë“œë¦´ ì¤€ë¹„ê°€ ë˜ì–´ ìžˆìŠµë‹ˆë‹¤.

ê°ì‚¬í•©ë‹ˆë‹¤,
HandokHelper íŒ€ ë“œë¦¼

HandokHelper
MichaelstraÃŸe 26 Â· 65936 Frankfurt am Main Â· Germany
ë²•ì  ê³ ì§€ (Imprint): https://www.handokhelper.de/imprint
ê°œì¸ì •ë³´ ì²˜ë¦¬ë°©ì¹¨: https://www.handokhelper.de/privacy-policy
  `.trim();
}

export function getConfirmationEmailHTML_KOR(submission: ContactSubmission): string {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>ìš”ì²­ ì ‘ìˆ˜ í™•ì¸</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style type="text/css">
      html, body { margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }
      body { background-color: #f3f4f6; }
      img { border: 0; line-height: 100%; text-decoration: none; -ms-interpolation-mode: bicubic; }
      table { border-collapse: collapse !important; }
      .email-container { width: 100%; max-width: 560px; }
      .logo-center img { display: block; height: auto; max-width: 56px; border-radius: 16px; }
      .button-td, .button-a { transition: all 100ms ease-in; }
      .button-a { font-family: Arial, sans-serif; font-size: 16px; text-decoration: none; line-height: 20px; font-weight: bold; display: inline-block; padding: 12px 24px; border-radius: 999px; background-color: #4f46e5; border: 1px solid #4f46e5; color: #ffffff; }
      .button-td:hover .button-a { background-color: #4338ca !important; border-color: #4338ca !important; }
      @media screen and (max-width: 600px) { .email-container { width: 100% !important; } .logo-center img { max-width: 48px !important; } .logo-center { padding-right: 12px !important; } .company-name { font-size: 22px !important; line-height: 26px !important; } }
      @media screen and (max-width: 400px) { .logo-center img { max-width: 40px !important; } .logo-center { padding-right: 10px !important; } .company-name { font-size: 20px !important; line-height: 24px !important; } }
      @media (prefers-color-scheme: dark) {
        body, table[bgcolor="#f3f4f6"] { background-color: #0f172a !important; }
        table.email-container, table[bgcolor="#ffffff"] { background-color: #1e293b !important; }
        .company-name, td, p, div, span { color: #e5e7eb !important; }
        h1, h2, h3 { color: #f1f5f9 !important; }
        td[style*="border-bottom"], td[style*="border-top"], table[style*="border: 1px solid"] { border-color: #334155 !important; }
        table[style*="background: #f9fafb"] { background: #334155 !important; }
        td[width="6"][style*="background:#4f46e5"] { background: #6366f1 !important; }
        .button-a { background-color: #4f46e5 !important; border-color: #4f46e5 !important; color: #ffffff !important; }
        .footer-text { color: #94a3b8 !important; }
      }
    </style>
  </head>
  <body yahoo="yahoo">
    <div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">
      HandokHelperì— ë‚¨ê²¨ì£¼ì‹  ìš”ì²­ì´ ì ‘ìˆ˜ë˜ì—ˆìŠµë‹ˆë‹¤. ì´ ë©”ì¼ì—ì„œ ë‚´ìš©ì„ í™•ì¸í•˜ì‹¤ ìˆ˜ ìžˆìŠµë‹ˆë‹¤.
    </div>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#f3f4f6">
      <tr>
        <td align="center" style="padding: 30px 16px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" class="email-container" bgcolor="#ffffff" style="border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px -6px rgba(15, 23, 42, 0.06);">
            <tr>
              <td style="padding: 24px 24px 24px 24px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td class="logo-center" valign="middle" width="1%" style="padding-right: 16px;">
                      <img src="https://www.handokhelper.de/images/HandokHelperLogoOnly.png" width="56" alt="HandokHelper Logo">
                    </td>
                    <td class="company-name" valign="middle" style="font-family: Arial, sans-serif; font-size: 28px; line-height: 32px; color:#111827; font-weight:bold;">
                      HandokHelper
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 24px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr><td style="border-bottom: 1px solid #e5e7eb; font-size:0; line-height:0;">&nbsp;</td></tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 24px 24px 12px 24px; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color:#4b5563;">
                <p style="margin: 0 0 12px 0;"><b>${submission.firstName} ${submission.lastName}ë‹˜, ì•ˆë…•í•˜ì„¸ìš”.</b></p>
                <p style="margin: 0 0 12px 0;">HandokHelperì— ë¬¸ì˜í•´ ì£¼ì…”ì„œ ê°ì‚¬í•©ë‹ˆë‹¤. ê³ ê°ë‹˜ì´ ì œì¶œí•˜ì‹  ì •ë³´ëŠ” ì„±ê³µì ìœ¼ë¡œ ì ‘ìˆ˜ë˜ì—ˆìœ¼ë©°, ê°€ëŠ¥í•œ í•œ ë¹ ë¥´ê²Œ í™•ì¸ í›„ ì•ˆë‚´ë“œë¦¬ê² ìŠµë‹ˆë‹¤.</p>
                <p style="margin: 0 0 16px 0;">ì•„ëž˜ëŠ” ê³ ê°ë‹˜ê»˜ì„œ ì œì¶œí•´ ì£¼ì‹  ìš”ì²­ ë‚´ìš©ì˜ ê°„ë‹¨í•œ ìš”ì•½ìž…ë‹ˆë‹¤:</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 24px 16px 24px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #f9fafb; border: 1px solid #e5e7eb;">
                  <tr>
                    <td width="6" style="background:#4f46e5;">&nbsp;</td>
                    <td style="padding: 14px 16px; font-family: Arial, sans-serif; font-size: 15px; line-height: 22px;">
                      <div style="font-size: 16px; font-weight:600; margin-bottom: 8px;">ì œì¶œí•˜ì‹  ìš”ì²­ ì •ë³´</div>
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr><td width="120" style="padding: 2px 0; font-weight:600; color:#6b7280;">ì„œë¹„ìŠ¤:</td><td style="padding: 2px 0; color:#111827;">${submission.service}</td></tr>
                        <tr><td width="120" style="padding: 2px 0; font-weight:600; color:#6b7280;">ì°¸ì¡° ID:</td><td style="padding: 2px 0; color:#111827;">${submission.refId}</td></tr>
                        <tr><td width="120" style="padding: 2px 0; font-weight:600; color:#6b7280;">ì´ë©”ì¼:</td><td style="padding: 2px 0; color:#111827;">${submission.email}</td></tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 24px 8px 24px; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color:#4b5563;">
                 ì¶”ê°€ë¡œ ê¶ê¸ˆí•˜ì‹  ì ì´ ìžˆìœ¼ì‹œë©´ ì–¸ì œë“ ì§€ íŽ¸í•˜ê²Œ ë¬¸ì˜í•´ ì£¼ì„¸ìš”. í•­ìƒ ë„ì™€ë“œë¦´ ì¤€ë¹„ê°€ ë˜ì–´ ìžˆìŠµë‹ˆë‹¤.
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 24px 16px 24px; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color:#4b5563;">
                ê°ì‚¬í•©ë‹ˆë‹¤,<br><strong style="color:#4b5563;">HandokHelper íŒ€ ë“œë¦¼</strong>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 24px 0 24px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr><td style="border-top: 1px solid #e5e7eb; font-size:0; line-height:0;">&nbsp;</td></tr>
                </table>
              </td>
            </tr>
            <tr>
              <td class="footer-text" style="padding: 16px 24px 20px 24px; font-family: Arial, sans-serif; font-size: 13px; line-height: 20px; color:#9ca3af; text-align:left;">
                HandokHelper<br>MichaelstraÃŸe 26 Â· 65936 Frankfurt am Main Â· Germany<br><br>
                <a href="https://www.handokhelper.de/imprint" target="_blank" style="color:#6d28d9; text-decoration:none;">ë²•ì  ê³ ì§€ (Imprint)</a>
                &nbsp;â€¢&nbsp;
                <a href="https://www.handokhelper.de/privacy-policy" target="_blank" style="color:#6d28d9; text-decoration:none;">ê°œì¸ì •ë³´ ì²˜ë¦¬ë°©ì¹¨</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

// --- Admin Notification (English) ---

export function getAdminEmailText_EN(submission: ContactSubmission): string {
  return `
New form submission received

A new contact form has been submitted on HandokHelper. Below you will find all provided details.

Please review the information and follow up accordingly.

Submission Details

Service: ${submission.service}
Reference ID: ${submission.refId}

Personal Information
Name: ${submission.salutation} ${submission.firstName} ${submission.lastName}
Date of Birth: ${submission.dateOfBirth}
Email: ${submission.email}
Phone: ${submission.phoneNumber}

Address
${submission.street}
${submission.addressLine2 ? submission.addressLine2 + '\n' : ''}${submission.postalCode} ${submission.city}
${submission.stateProvince ? submission.stateProvince + '\n' : ''}${submission.country}

Additional Information
Current Residence: ${submission.currentResidence}
Preferred Language: ${submission.preferredLanguage}

Message from User
${submission.message}

Consent
Contact Permission: ${submission.contactConsent ? 'Yes' : 'No'}
Privacy Policy: ${submission.privacyConsent ? 'Accepted' : 'Not accepted'}

Metadata
Submitted at: ${submission.createdAt}
IP Address: ${submission.submitterIp || 'N/A'}
User Agent: ${submission.userAgent || 'N/A'}

Best regards,
HandokHelper Team
  `.trim();
}

export function getAdminEmailHTML_EN(submission: ContactSubmission): string {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Request Confirmation</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style type="text/css">
      html, body { margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }
      body { background-color: #f3f4f6; }
      img { border: 0; line-height: 100%; text-decoration: none; -ms-interpolation-mode: bicubic; }
      table { border-collapse: collapse !important; }
      .email-container { width: 100%; max-width: 560px; }
      .logo-center img { display: block; height: auto; max-width: 56px; border-radius: 16px; }
      .button-td, .button-a { transition: all 100ms ease-in; }
      .button-a { font-family: Arial, sans-serif; font-size: 16px; text-decoration: none; line-height: 20px; font-weight: bold; display: inline-block; padding: 12px 24px; border-radius: 999px; background-color: #4f46e5; border: 1px solid #4f46e5; color: #ffffff; }
      .button-td:hover .button-a { background-color: #4338ca !important; border-color: #4338ca !important; }
      @media screen and (max-width: 600px) { .email-container { width: 100% !important; } .logo-center img { max-width: 48px !important; } .logo-center { padding-right: 12px !important; } .company-name { font-size: 22px !important; line-height: 26px !important; } }
      @media screen and (max-width: 400px) { .logo-center img { max-width: 40px !important; } .logo-center { padding-right: 10px !important; } .company-name { font-size: 20px !important; line-height: 24px !important; } }
      @media (prefers-color-scheme: dark) {
        body, table[bgcolor="#f3f4f6"] { background-color: #0f172a !important; }
        table.email-container, table[bgcolor="#ffffff"] { background-color: #1e293b !important; }
        .company-name, td, p, div, span { color: #e5e7eb !important; }
        h1, h2, h3 { color: #f1f5f9 !important; }
        td[style*="border-bottom"], td[style*="border-top"], table[style*="border: 1px solid"] { border-color: #334155 !important; }
        table[style*="background: #f9fafb"] { background: #334155 !important; }
        td[width="6"][style*="background:#4f46e5"] { background: #6366f1 !important; }
        .button-a { background-color: #4f46e5 !important; border-color: #4f46e5 !important; color: #ffffff !important; }
        .footer-text { color: #94a3b8 !important; }
      }
    </style>
  </head>
  <body yahoo="yahoo">
    <div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">
      We have received your HandokHelper request â€“ hereâ€™s your confirmation.
    </div>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#f3f4f6">
      <tr>
        <td align="center" style="padding: 30px 16px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" class="email-container" bgcolor="#ffffff" style="border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px -6px rgba(15, 23, 42, 0.06);">
            <tr>
              <td style="padding: 24px 24px 24px 24px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td class="logo-center" valign="middle" width="1%" style="padding-right: 16px;">
                      <img src="https://www.handokhelper.de/images/HandokHelperLogoOnly.png" width="56" alt="HandokHelper Logo">
                    </td>
                    <td class="company-name" valign="middle" style="font-family: Arial, sans-serif; font-size: 28px; line-height: 32px; color:#111827; font-weight:bold;">
                      HandokHelper
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 24px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr><td style="border-bottom: 1px solid #e5e7eb; font-size:0; line-height:0;">&nbsp;</td></tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 24px 24px 12px 24px; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color:#4b5563;">
                <p style="margin: 0 0 12px 0;"><b>New form submission received</b></p>
                <p style="margin: 0 0 12px 0;">A new contact form has been submitted on HandokHelper. Below you will find all provided details.</p>
                <p style="margin: 0 0 16px 0;">Please review the information and follow up accordingly.</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 24px 16px 24px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #f9fafb; border: 1px solid #e5e7eb;">
                  <tr>
                    <td width="6" style="background:#4f46e5;">&nbsp;</td>
                    <td style="padding: 14px 16px; font-family: Arial, sans-serif; font-size: 15px; line-height: 22px;">
                      <div style="font-size: 16px; font-weight:600; margin-bottom: 8px;">Submission Details</div>
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr><td width="160" style="padding: 4px 0; font-weight:600; color:#6b7280;">Service:</td><td style="padding: 4px 0; color:#111827;">${submission.service}</td></tr>
                        <tr><td width="160" style="padding: 4px 0; font-weight:600; color:#6b7280;">Reference ID:</td><td style="padding: 4px 0; color:#111827;">${submission.refId}</td></tr>
                        <tr><td colspan="2" style="padding: 10px 0 4px 0; font-weight:600; color:#4b5563;">Personal Information</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">Name:</td><td style="padding: 2px 0; color:#111827;">${submission.salutation} ${submission.firstName} ${submission.lastName}</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">Date of Birth:</td><td style="padding: 2px 0; color:#111827;">${submission.dateOfBirth}</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">Email:</td><td style="padding: 2px 0; color:#111827;">${submission.email}</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">Phone:</td><td style="padding: 2px 0; color:#111827;">${submission.phoneNumber}</td></tr>
                        <tr><td colspan="2" style="padding: 10px 0 4px 0; font-weight:600; color:#4b5563;">Address</td></tr>
                        <tr><td colspan="2" style="padding: 2px 0; color:#111827;">${submission.street}<br>${submission.addressLine2 ? submission.addressLine2 + '<br>' : ''}${submission.postalCode} ${submission.city}<br>${submission.stateProvince ? submission.stateProvince + '<br>' : ''}${submission.country}</td></tr>
                        <tr><td colspan="2" style="padding: 10px 0 4px 0; font-weight:600; color:#4b5563;">Additional Information</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">Current Residence:</td><td style="padding: 2px 0; color:#111827;">${submission.currentResidence}</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">Preferred Language:</td><td style="padding: 2px 0; color:#111827;">${submission.preferredLanguage}</td></tr>
                        <tr><td colspan="2" style="padding: 10px 0 4px 0; font-weight:600; color:#4b5563;">Message from User</td></tr>
                        <tr><td colspan="2" style="padding: 2px 0; color:#111827; white-space:pre-line;">${submission.message}</td></tr>
                        <tr><td colspan="2" style="padding: 10px 0 4px 0; font-weight:600; color:#4b5563;">Consent</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">Contact Permission:</td><td style="padding: 2px 0; color:#111827;">${submission.contactConsent ? 'Yes' : 'No'}</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">Privacy Policy:</td><td style="padding: 2px 0; color:#111827;">${submission.privacyConsent ? 'Accepted' : 'Not accepted'}</td></tr>
                        <tr><td colspan="2" style="padding: 10px 0 4px 0; font-weight:600; color:#4b5563;">Metadata</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">Submitted at:</td><td style="padding: 2px 0; color:#111827;">${submission.createdAt}</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">IP Address:</td><td style="padding: 2px 0; color:#111827;">${submission.submitterIp || 'N/A'}</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">User Agent:</td><td style="padding: 2px 0; color:#111827;">${submission.userAgent || 'N/A'}</td></tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 24px 16px 24px; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color:#4b5563;">
                Best regards,<br><strong style="color:#4b5563;">HandokHelper Team</strong>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 24px 0 24px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr><td style="border-top: 1px solid #e5e7eb; font-size:0; line-height:0;">&nbsp;</td></tr>
                </table>
              </td>
            </tr>
            <tr>
              <td class="footer-text" style="padding: 16px 24px 20px 24px; font-family: Arial, sans-serif; font-size: 13px; line-height: 20px; color:#9ca3af; text-align:left;">
                HandokHelper<br>MichaelstraÃŸe 26 Â· 65936 Frankfurt am Main Â· Germany<br><br>
                <a href="https://www.handokhelper.de/imprint" target="_blank" style="color:#6d28d9; text-decoration:none;">Imprint</a>
                &nbsp;â€¢&nbsp;
                <a href="https://www.handokhelper.de/privacy-policy" target="_blank" style="color:#6d28d9; text-decoration:none;">Privacy policy</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

// --- Admin Notification (Korean) ---

export function getAdminEmailText_KOR(submission: ContactSubmission): string {
  return `
ìƒˆë¡œìš´ ë¬¸ì˜ê°€ ì ‘ìˆ˜ë˜ì—ˆìŠµë‹ˆë‹¤

HandokHelper ì›¹ì‚¬ì´íŠ¸ì—ì„œ ìƒˆë¡œìš´ ë¬¸ì˜ê°€ ì œì¶œë˜ì—ˆìŠµë‹ˆë‹¤. ì•„ëž˜ì—ì„œ ì œì¶œëœ ëª¨ë“  ì •ë³´ë¥¼ í™•ì¸í•˜ì‹¤ ìˆ˜ ìžˆìŠµë‹ˆë‹¤.

ë‚´ìš©ì„ ê²€í† í•˜ì‹œê³  í•„ìš”í•œ í›„ì† ì¡°ì¹˜ë¥¼ ì§„í–‰í•´ ì£¼ì„¸ìš”.

ì œì¶œ ì •ë³´

ì„œë¹„ìŠ¤: ${submission.service}
ì°¸ì¡° ID: ${submission.refId}

ê°œì¸ ì •ë³´
ì´ë¦„: ${submission.salutation} ${submission.firstName} ${submission.lastName}
ìƒë…„ì›”ì¼: ${submission.dateOfBirth}
ì´ë©”ì¼: ${submission.email}
ì „í™”ë²ˆí˜¸: ${submission.phoneNumber}

ì£¼ì†Œ
${submission.street}
${submission.addressLine2 ? submission.addressLine2 + '\n' : ''}${submission.postalCode} ${submission.city}
${submission.stateProvince ? submission.stateProvince + '\n' : ''}${submission.country}

ì¶”ê°€ ì •ë³´
í˜„ìž¬ ê±°ì£¼ì§€: ${submission.currentResidence}
ì„ í˜¸ ì–¸ì–´: ${submission.preferredLanguage}

ì‚¬ìš©ìž ë©”ì‹œì§€
${submission.message}

ë™ì˜ ì‚¬í•­
ì—°ë½ ë™ì˜: ${submission.contactConsent ? 'Yes' : 'No'}
ê°œì¸ì •ë³´ ì²˜ë¦¬ë°©ì¹¨: ${submission.privacyConsent ? 'Accepted' : 'Not accepted'}

ë©”íƒ€ë°ì´í„°
ì œì¶œ ì‹œê°: ${submission.createdAt}
IP ì£¼ì†Œ: ${submission.submitterIp || 'N/A'}
User Agent: ${submission.userAgent || 'N/A'}

ê°ì‚¬í•©ë‹ˆë‹¤,
HandokHelper íŒ€ ë“œë¦¼
  `.trim();
}

export function getAdminEmailHTML_KOR(submission: ContactSubmission): string {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>ìƒˆ ë¬¸ì˜ ì ‘ìˆ˜ ì•Œë¦¼</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style type="text/css">
      html, body { margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }
      body { background-color: #f3f4f6; }
      img { border: 0; line-height: 100%; text-decoration: none; -ms-interpolation-mode: bicubic; }
      table { border-collapse: collapse !important; }
      .email-container { width: 100%; max-width: 560px; }
      .logo-center img { display: block; height: auto; max-width: 56px; border-radius: 16px; }
      .button-td, .button-a { transition: all 100ms ease-in; }
      .button-a { font-family: Arial, sans-serif; font-size: 16px; text-decoration: none; line-height: 20px; font-weight: bold; display: inline-block; padding: 12px 24px; border-radius: 999px; background-color: #4f46e5; border: 1px solid #4f46e5; color: #ffffff; }
      .button-td:hover .button-a { background-color: #4338ca !important; border-color: #4338ca !important; }
      @media screen and (max-width: 600px) { .email-container { width: 100% !important; } .logo-center img { max-width: 48px !important; } .logo-center { padding-right: 12px !important; } .company-name { font-size: 22px !important; line-height: 26px !important; } }
      @media screen and (max-width: 400px) { .logo-center img { max-width: 40px !important; } .logo-center { padding-right: 10px !important; } .company-name { font-size: 20px !important; line-height: 24px !important; } }
      @media (prefers-color-scheme: dark) {
        body, table[bgcolor="#f3f4f6"] { background-color: #0f172a !important; }
        table.email-container, table[bgcolor="#ffffff"] { background-color: #1e293b !important; }
        .company-name, td, p, div, span { color: #e5e7eb !important; }
        h1, h2, h3 { color: #f1f5f9 !important; }
        td[style*="border-bottom"], td[style*="border-top"], table[style*="border: 1px solid"] { border-color: #334155 !important; }
        table[style*="background: #f9fafb"] { background: #334155 !important; }
        td[width="6"][style*="background:#4f46e5"] { background: #6366f1 !important; }
        .button-a { background-color: #4f46e5 !important; border-color: #4f46e5 !important; color: #ffffff !important; }
        .footer-text { color: #94a3b8 !important; }
      }
    </style>
  </head>
  <body yahoo="yahoo">
    <div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">
      HandokHelper ì‚¬ì´íŠ¸ì— ìƒˆë¡œìš´ ë¬¸ì˜ê°€ ì ‘ìˆ˜ë˜ì—ˆìŠµë‹ˆë‹¤.
    </div>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#f3f4f6">
      <tr>
        <td align="center" style="padding: 30px 16px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" class="email-container" bgcolor="#ffffff" style="border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px -6px rgba(15, 23, 42, 0.06);">
            <tr>
              <td style="padding: 24px 24px 24px 24px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td class="logo-center" valign="middle" width="1%" style="padding-right: 16px;">
                      <img src="https://www.handokhelper.de/images/HandokHelperLogoOnly.png" width="56" alt="HandokHelper Logo">
                    </td>
                    <td class="company-name" valign="middle" style="font-family: Arial, sans-serif; font-size: 28px; line-height: 32px; color:#111827; font-weight:bold;">
                      HandokHelper
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 24px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr><td style="border-bottom: 1px solid #e5e7eb; font-size:0; line-height:0;">&nbsp;</td></tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 24px 24px 12px 24px; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color:#4b5563;">
                <p style="margin: 0 0 12px 0;"><b>ìƒˆë¡œìš´ ë¬¸ì˜ê°€ ì ‘ìˆ˜ë˜ì—ˆìŠµë‹ˆë‹¤</b></p>
                <p style="margin: 0 0 12px 0;">HandokHelper ì›¹ì‚¬ì´íŠ¸ì—ì„œ ìƒˆë¡œìš´ ë¬¸ì˜ê°€ ì œì¶œë˜ì—ˆìŠµë‹ˆë‹¤. ì•„ëž˜ì—ì„œ ì œì¶œëœ ëª¨ë“  ì •ë³´ë¥¼ í™•ì¸í•˜ì‹¤ ìˆ˜ ìžˆìŠµë‹ˆë‹¤.</p>
                <p style="margin: 0 0 16px 0;">ë‚´ìš©ì„ ê²€í† í•˜ì‹œê³  í•„ìš”í•œ í›„ì† ì¡°ì¹˜ë¥¼ ì§„í–‰í•´ ì£¼ì„¸ìš”.</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 24px 16px 24px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #f9fafb; border: 1px solid #e5e7eb;">
                  <tr>
                    <td width="6" style="background:#4f46e5;">&nbsp;</td>
                    <td style="padding: 14px 16px; font-family: Arial, sans-serif; font-size: 15px; line-height: 22px;">
                      <div style="font-size: 16px; font-weight:600; margin-bottom: 8px;">ì œì¶œ ì •ë³´</div>
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr><td width="160" style="padding: 4px 0; font-weight:600; color:#6b7280;">ì„œë¹„ìŠ¤:</td><td style="padding: 4px 0; color:#111827;">${submission.service}</td></tr>
                        <tr><td width="160" style="padding: 4px 0; font-weight:600; color:#6b7280;">ì°¸ì¡° ID:</td><td style="padding: 4px 0; color:#111827;">${submission.refId}</td></tr>
                        <tr><td colspan="2" style="padding: 10px 0 4px 0; font-weight:600; color:#4b5563;">ê°œì¸ ì •ë³´</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">ì´ë¦„:</td><td style="padding: 2px 0; color:#111827;">${submission.salutation} ${submission.firstName} ${submission.lastName}</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">ìƒë…„ì›”ì¼:</td><td style="padding: 2px 0; color:#111827;">${submission.dateOfBirth}</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">ì´ë©”ì¼:</td><td style="padding: 2px 0; color:#111827;">${submission.email}</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">ì „í™”ë²ˆí˜¸:</td><td style="padding: 2px 0; color:#111827;">${submission.phoneNumber}</td></tr>
                        <tr><td colspan="2" style="padding: 10px 0 4px 0; font-weight:600; color:#4b5563;">ì£¼ì†Œ</td></tr>
                        <tr><td colspan="2" style="padding: 2px 0; color:#111827;">${submission.street}<br>${submission.addressLine2 ? submission.addressLine2 + '<br>' : ''}${submission.postalCode} ${submission.city}<br>${submission.stateProvince ? submission.stateProvince + '<br>' : ''}${submission.country}</td></tr>
                        <tr><td colspan="2" style="padding: 10px 0 4px 0; font-weight:600; color:#4b5563;">ì¶”ê°€ ì •ë³´</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">í˜„ìž¬ ê±°ì£¼ì§€:</td><td style="padding: 2px 0; color:#111827;">${submission.currentResidence}</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">ì„ í˜¸ ì–¸ì–´:</td><td style="padding: 2px 0; color:#111827;">${submission.preferredLanguage}</td></tr>
                        <tr><td colspan="2" style="padding: 10px 0 4px 0; font-weight:600; color:#4b5563;">ì‚¬ìš©ìž ë©”ì‹œì§€</td></tr>
                        <tr><td colspan="2" style="padding: 2px 0; color:#111827; white-space:pre-line;">${submission.message}</td></tr>
                        <tr><td colspan="2" style="padding: 10px 0 4px 0; font-weight:600; color:#4b5563;">ë™ì˜ ì‚¬í•­</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">ì—°ë½ ë™ì˜:</td><td style="padding: 2px 0; color:#111827;">${submission.contactConsent ? 'Yes' : 'No'}</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">ê°œì¸ì •ë³´ ì²˜ë¦¬ë°©ì¹¨:</td><td style="padding: 2px 0; color:#111827;">${submission.privacyConsent ? 'Accepted' : 'Not accepted'}</td></tr>
                        <tr><td colspan="2" style="padding: 10px 0 4px 0; font-weight:600; color:#4b5563;">ë©”íƒ€ë°ì´í„°</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">ì œì¶œ ì‹œê°:</td><td style="padding: 2px 0; color:#111827;">${submission.createdAt}</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">IP ì£¼ì†Œ:</td><td style="padding: 2px 0; color:#111827;">${submission.submitterIp || 'N/A'}</td></tr>
                        <tr><td width="160" style="padding: 2px 0; font-weight:600; color:#6b7280;">User Agent:</td><td style="padding: 2px 0; color:#111827;">${submission.userAgent || 'N/A'}</td></tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 24px 16px 24px; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color:#4b5563;">
                ê°ì‚¬í•©ë‹ˆë‹¤,<br><strong style="color:#4b5563;">HandokHelper íŒ€ ë“œë¦¼</strong>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 24px 0 24px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr><td style="border-top: 1px solid #e5e7eb; font-size:0; line-height:0;">&nbsp;</td></tr>
                </table>
              </td>
            </tr>
            <tr>
              <td class="footer-text" style="padding: 16px 24px 20px 24px; font-family: Arial, sans-serif; font-size: 13px; line-height: 20px; color:#9ca3af; text-align:left;">
                HandokHelper<br>MichaelstraÃŸe 26 Â· 65936 Frankfurt am Main Â· Germany<br><br>
                <a href="https://www.handokhelper.de/imprint" target="_blank" style="color:#6d28d9; text-decoration:none;">ë²•ì  ê³ ì§€ (Imprint)</a>
                &nbsp;â€¢&nbsp;
                <a href="https://www.handokhelper.de/privacy-policy" target="_blank" style="color:#6d28d9; text-decoration:none;">ê°œì¸ì •ë³´ ì²˜ë¦¬ë°©ì¹¨</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

// ==========================================
// Invoice Emails
// ==========================================

/**
 * Send invoice email to the client with PDF attachment
 */
export async function sendInvoiceEmail(invoice: any, pdfBase64: string): Promise<boolean> {
  const mailjet = createMailjetClient();
  const language = 'en'; // Invoice emails are currently English only by default

  // Fetch template from database
  let subject: string;
  let emailContentText: string;
  let emailContentHTML: string;
  let senderName = 'HandokHelper Accounting';
  let senderEmail = process.env.EMAIL_FROM || 'noreply@handokhelper.de';

  try {
    const { getEmailTemplate, replacePlaceholders } = await import('./email-templates');
    const template = await getEmailTemplate('invoice_creation', language);

    // Prepare data for placeholders
    const data = {
      ...invoice,
      formattedTotal: new Intl.NumberFormat('de-DE', { style: 'currency', currency: invoice.currency || 'EUR' }).format(invoice.total),
    };

    if (template) {
      subject = replacePlaceholders(template.subject, data);
      emailContentText = replacePlaceholders(template.textContent || '', data);
      emailContentHTML = replacePlaceholders(template.htmlContent, data);
      if (template.senderName) senderName = template.senderName;
      if (template.senderEmail) senderEmail = template.senderEmail;
    } else {
      // Fallback to hardcoded
      subject = `Invoice ${invoice.invoiceNumber} from HandokHelper`;
      emailContentText = getInvoiceEmailText(invoice);
      emailContentHTML = getInvoiceEmailHTML(invoice);
    }
  } catch (error) {
    console.error('[Email] Failed to fetch template, using fallback:', error);
    subject = `Invoice ${invoice.invoiceNumber} from HandokHelper`;
    emailContentText = getInvoiceEmailText(invoice);
    emailContentHTML = getInvoiceEmailHTML(invoice);
  }

  if (!mailjet) {
    console.log('[Email] MailJet not configured, invoice email (would be sent to client):');
    console.log('To:', invoice.clientEmail);
    console.log('From:', `${senderName} <${senderEmail}>`);
    console.log('Subject:', subject);
    console.log('Attachment:', `${invoice.invoiceNumber}.pdf (${Math.round(pdfBase64.length / 1024)} KB)`);
    return true;
  }

  try {
    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: senderEmail,
            Name: senderName,
          },
          To: [
            {
              Email: invoice.clientEmail,
              Name: invoice.clientName,
            },
          ],
          Subject: subject,
          TextPart: emailContentText,
          HTMLPart: emailContentHTML,
          Attachments: [
            {
              ContentType: "application/pdf",
              Filename: `${invoice.invoiceNumber}.pdf`,
              Base64Content: pdfBase64
            }
          ]
        },
      ],
    });

    const response = await request;

    // Handle MailJet response
    const responseBody = response.body as any;
    if (responseBody && responseBody.Messages && Array.isArray(responseBody.Messages)) {
      const message = responseBody.Messages[0];
      if (message && message.Status === 'success') {
        console.log('[Email] Invoice email sent successfully to:', invoice.clientEmail);
        return true;
      }
    }

    console.error('[Email] Unexpected response from MailJet:', responseBody);
    return false;
  } catch (error) {
    console.error('[Email] Failed to send invoice email:', error);
    return false;
  }
}

export function getInvoiceEmailText(invoice: any): string {
  return `
Invoice Details:
Invoice Number: ${invoice.invoiceNumber}
Issue Date: ${new Date(invoice.issueDate).toLocaleDateString()}
DueDate: ${new Date(invoice.dueDate).toLocaleDateString()}
Total Amount: ${new Intl.NumberFormat('de-DE', { style: 'currency', currency: invoice.currency || 'EUR' }).format(invoice.total)}

Please arrange for payment by the due date.

If you have any questions regarding this invoice, please do not hesitate to contact us.

Best regards,
HandokHelper Team
      `.trim();
}

export function getInvoiceEmailHTML(invoice: any): string {
  const formattedTotal = new Intl.NumberFormat('de-DE', { style: 'currency', currency: invoice.currency || 'EUR' }).format(invoice.total);
  const issueDate = new Date(invoice.issueDate).toLocaleDateString();
  const dueDate = new Date(invoice.dueDate).toLocaleDateString();

  return `<!doctype html>
    <html>
    <head>
    <meta charset="utf-8">
      <title>Invoice ${invoice.invoiceNumber}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style type="text/css">
            html, body { margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }
      body { background-color: #f3f4f6; }
      img { border: 0; line-height: 100%; text-decoration: none; -ms-interpolation-mode: bicubic; }
      table { border-collapse: collapse !important; }
      .email-container { width: 100%; max-width: 560px; }
      .logo-center img { display: block; height: auto; max-width: 56px; border-radius: 16px; }
      .button-td, .button-a { transition: all 100ms ease-in; }
      .button-a { font-family: Arial, sans-serif; font-size: 16px; text-decoration: none; line-height: 20px; font-weight: bold; display: inline-block; padding: 12px 24px; border-radius: 999px; background-color: #4f46e5; border: 1px solid #4f46e5; color: #ffffff; }
      .button-td:hover .button-a { background-color: #4338ca !important; border-color: #4338ca !important; }
  @media screen and (max-width: 600px) { .email-container { width: 100% !important; } .logo-center img { max-width: 48px !important; } .logo-center { padding-right: 12px !important; } .company-name { font-size: 22px !important; line-height: 26px !important; } }
  @media screen and (max-width: 400px) { .logo-center img { max-width: 40px !important; } .logo-center { padding-right: 10px !important; } .company-name { font-size: 20px !important; line-height: 24px !important; } }
  @media (prefers-color-scheme: dark) {
    body, table[bgcolor="#f3f4f6"] { background-color: #0f172a !important; }
    table.email-container, table[bgcolor="#ffffff"] { background-color: #1e293b !important; }
        .company-name, td, p, div, span { color: #e5e7eb !important; }
    h1, h2, h3 { color: #f1f5f9 !important; }
    td[style*="border-bottom"], td[style*="border-top"], table[style*="border: 1px solid"] { border-color: #334155 !important; }
    table[style*="background: #f9fafb"] { background: #334155 !important; }
    td[width="6"][style*="background:#4f46e5"] { background: #6366f1 !important; }
        .button-a { background-color: #4f46e5 !important; border-color: #4f46e5 !important; color: #ffffff !important; }
        .footer-text { color: #94a3b8 !important; }
  }
  </style>
    </head>
    <body yahoo="yahoo">
      <div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">
        Invoice ${invoice.invoiceNumber} from HandokHelper
          </div>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#f3f4f6">
            <tr>
            <td align="center" style="padding: 30px 16px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" class="email-container" bgcolor="#ffffff" style="border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px -6px rgba(15, 23, 42, 0.06);">
                <!-- HEADER -->
                  <tr>
                  <td style="padding: 24px 24px 24px 24px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                      <td class="logo-center" valign="middle" width="1%" style="padding-right: 16px;">
                        <img src="https://www.handokhelper.de/images/HandokHelperLogoOnly.png" width="56" alt="HandokHelper Logo">
                          </td>
                          <td class="company-name" valign="middle" style="font-family: Arial, sans-serif; font-size: 28px; line-height: 32px; color:#111827; font-weight:bold;">
                            HandokHelper
                            </td>
                            </tr>
                            </table>
                            </td>
                            </tr>
                            <!-- DIVIDER -->
                              <tr>
                              <td style="padding: 0 24px;">
                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                  <tr><td style="border-bottom: 1px solid #e5e7eb; font-size:0; line-height:0;">&nbsp;</td></tr>
                                    </table>
                                    </td>
                                    </tr>
                                    <!-- CONTENT -->
                                      <tr>
                                      <td style="padding: 24px 24px 12px 24px; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color:#4b5563;">
                                        <p style="margin: 0 0 12px 0;"><b>Dear ${invoice.clientName},</b></p>
                                          <p style="margin: 0 0 12px 0;">Please find attached invoice <b>${invoice.invoiceNumber}</b> for your recent services.</p>
                                            </td>
                                            </tr>
                                            <!-- INVOICE DETAILS BOX -->
                                              <tr>
                                              <td style="padding: 0 24px 16px 24px;">
                                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #f9fafb; border: 1px solid #e5e7eb;">
                                                  <tr>
                                                  <td width="6" style="background:#4f46e5;">&nbsp;</td>
                                                    <td style="padding: 14px 16px; font-family: Arial, sans-serif; font-size: 15px; line-height: 22px;">
                                                      <div style="font-size: 16px; font-weight:600; margin-bottom: 8px;">Invoice Details</div>
                                                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                                          <tr><td width="120" style="padding: 2px 0; font-weight:600; color:#6b7280;">Invoice Number:</td><td style="padding: 2px 0; color:#111827;">${invoice.invoiceNumber}</td></tr>
                                                            <tr><td width="120" style="padding: 2px 0; font-weight:600; color:#6b7280;">Issue Date:</td><td style="padding: 2px 0; color:#111827;">${issueDate}</td></tr>
                                                              <tr><td width="120" style="padding: 2px 0; font-weight:600; color:#6b7280;">Due Date:</td><td style="padding: 2px 0; color:#111827;">${dueDate}</td></tr>
                                                                <tr><td colspan="2" style="padding-top: 8px; border-top: 1px solid #e5e7eb; margin-top: 8px;"></td></tr>
                                                                  <tr><td width="120" style="padding: 2px 0; font-weight:600; color:#6b7280; font-size: 16px;">Total Amount:</td><td style="padding: 2px 0; color:#4f46e5; font-weight: bold; font-size: 16px;">${formattedTotal}</td></tr>
                                                                    </table>
                                                                    </td>
                                                                    </tr>
                                                                    </table>
                                                                    </td>
                                                                    </tr>
                                                                    <!-- CLOSING -->
                                                                      <tr>
                                                                      <td style="padding: 8px 24px 8px 24px; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color:#4b5563;">
                                                                        Please arrange for payment by the due date stated above.
                                                                        <br><br>
                                                                          If you have any questions regarding this invoice, please do not hesitate to contact us.
                                                                          </td>
                                                                          </tr>
                                                                          <tr>
                                                                          <td style="padding: 8px 24px 16px 24px; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color:#4b5563;">
                                                                            Best regards,<br><strong style="color:#4b5563;">HandokHelper Team</strong>
                                                                              </td>
                                                                              </tr>
                                                                              <!-- FOOTER DIVIDER -->
                                                                                <tr>
                                                                                <td style="padding: 0 24px 0 24px;">
                                                                                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                                                                    <tr><td style="border-top: 1px solid #e5e7eb; font-size:0; line-height:0;">&nbsp;</td></tr>
                                                                                      </table>
                                                                                      </td>
                                                                                      </tr>
                                                                                      <!-- FOOTER -->
                                                                                        <tr>
                                                                                        <td class="footer-text" style="padding: 16px 24px 20px 24px; font-family: Arial, sans-serif; font-size: 13px; line-height: 20px; color:#9ca3af; text-align:left;">
                                                                                          HandokHelper<br>MichaelstraÃŸe 26 Â· 65936 Frankfurt am Main Â· Germany<br><br>
                                                                                            <a href="https://www.handokhelper.de/imprint" target="_blank" style="color:#6d28d9; text-decoration:none;">Imprint</a>
                                                                                              &nbsp;â€¢&nbsp;
                                                                                              <a href="https://www.handokhelper.de/privacy-policy" target="_blank" style="color:#6d28d9; text-decoration:none;">Privacy policy</a>
                                                                                              </td>
                                                                                              </tr>
                                                                                              </table>
                                                                                              </td>
                                                                                              </tr>
                                                                                              </table>
                                                                                              </body>
                                                                                              </html>`;
}
