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

  const emailContent = `
Dear ${submission.firstName} ${submission.lastName},

Thank you for contacting us! We have received your inquiry and will get back to you soon.

Here is a summary of your submission:

Service: ${submission.service}
Name: ${submission.salutation} ${submission.firstName} ${submission.lastName}
Date of Birth: ${submission.dateOfBirth}
Email: ${submission.email}
Phone: ${submission.phoneNumber}

Address:
${submission.street}
${submission.addressLine2 ? submission.addressLine2 + '\n' : ''}${submission.postalCode} ${submission.city}
${submission.stateProvince ? submission.stateProvince + '\n' : ''}${submission.country}

Current Residence: ${submission.currentResidence}
Preferred Language: ${submission.preferredLanguage}

Your Message:
${submission.message}

We will review your request and contact you via ${submission.preferredLanguage === 'email' ? 'email' : 'phone or email'} soon.

Best regards,
HandokHelper
Your support for dealing with German authorities
  `.trim();

  if (!mailjet) {
    console.log('[Email] MailJet not configured, confirmation email (would be sent to user):');
    console.log('To:', submission.email);
    console.log('Subject: Your Inquiry Confirmation');
    console.log(emailContent);
    return true;
  }

  try {
    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: process.env.EMAIL_FROM || 'noreply@handokhelper.de',
            Name: 'HandokHelper',
          },
          To: [
            {
              Email: submission.email,
              Name: `${submission.firstName} ${submission.lastName}`,
            },
          ],
          Subject: 'Your Inquiry Confirmation - HandokHelper',
          TextPart: emailContent,
          HTMLPart: `<pre>${emailContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`,
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

  const emailContent = `
New Contact Form Submission

Service: ${submission.service}

Personal Information:
- Name: ${submission.salutation} ${submission.firstName} ${submission.lastName}
- Date of Birth: ${submission.dateOfBirth}
- Email: ${submission.email}
- Phone: ${submission.phoneNumber}

Address:
${submission.street}
${submission.addressLine2 ? submission.addressLine2 + '\n' : ''}${submission.postalCode} ${submission.city}
${submission.stateProvince ? submission.stateProvince + '\n' : ''}${submission.country}

Additional Information:
- Current Residence: ${submission.currentResidence}
- Preferred Contact Language: ${submission.preferredLanguage}

Message:
${submission.message}

Consent:
- Contact Permission: ${submission.contactConsent ? 'Yes' : 'No'}
- Privacy Policy: ${submission.privacyConsent ? 'Yes' : 'No'}

Metadata:
- Submitted at: ${submission.createdAt}
- IP Address: ${submission.submitterIp || 'N/A'}
- User Agent: ${submission.userAgent || 'N/A'}
  `.trim();

  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_FROM || 'info@handokhelper.de';

  if (!mailjet) {
    console.log('[Email] MailJet not configured, admin notification email (would be sent to HandokHelper):');
    console.log('To:', adminEmail);
    console.log('Subject: New Contact Form Submission');
    console.log(emailContent);
    return true;
  }

  try {
    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: process.env.EMAIL_FROM || 'noreply@handokhelper.de',
            Name: 'HandokHelper System',
          },
          To: [
            {
              Email: adminEmail,
              Name: 'HandokHelper Admin',
            },
          ],
          Subject: `New Contact Form Submission - ${submission.service}`,
          TextPart: emailContent,
          HTMLPart: `<pre>${emailContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`,
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
