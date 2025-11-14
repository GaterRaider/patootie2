import nodemailer from 'nodemailer';
import type { ContactSubmission } from '../drizzle/schema';

// Create a transporter using SMTP
// For production, you'll need to configure this with actual SMTP credentials
const createTransporter = () => {
  // Check if SMTP credentials are available
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpHost && smtpPort && smtpUser && smtpPass) {
    return nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort),
      secure: parseInt(smtpPort) === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
  }

  // Fallback to console logging if SMTP is not configured
  console.warn('[Email] SMTP not configured, emails will be logged to console');
  return null;
};

/**
 * Send confirmation email to the user
 */
export async function sendConfirmationEmail(submission: ContactSubmission): Promise<boolean> {
  const transporter = createTransporter();

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
Patootie
Help for Your Journey to Germany
  `.trim();

  if (!transporter) {
    console.log('[Email] Confirmation email (would be sent to user):');
    console.log('To:', submission.email);
    console.log('Subject: Your Inquiry Confirmation');
    console.log(emailContent);
    return true;
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@patootie.com',
      to: submission.email,
      subject: 'Your Inquiry Confirmation - Help for Your Journey to Germany',
      text: emailContent,
    });
    return true;
  } catch (error) {
    console.error('[Email] Failed to send confirmation email:', error);
    return false;
  }
}

/**
 * Send notification email to Patootie (admin)
 */
export async function sendAdminNotificationEmail(submission: ContactSubmission): Promise<boolean> {
  const transporter = createTransporter();

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

  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;

  if (!transporter) {
    console.log('[Email] Admin notification email (would be sent to Patootie):');
    console.log('To:', adminEmail);
    console.log('Subject: New Contact Form Submission');
    console.log(emailContent);
    return true;
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@patootie.com',
      to: adminEmail,
      subject: `New Contact Form Submission - ${submission.service}`,
      text: emailContent,
    });
    return true;
  } catch (error) {
    console.error('[Email] Failed to send admin notification email:', error);
    return false;
  }
}
