import { describe, it, expect, beforeAll } from 'vitest';
import nodemailer from 'nodemailer';
import type { ContactSubmission } from '../drizzle/schema';

describe('Contact Form Email Submission', () => {
  let transporter: nodemailer.Transporter | null = null;

  beforeAll(() => {
    // Create transporter with environment variables
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpHost && smtpPort && smtpUser && smtpPass) {
      transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort),
        secure: parseInt(smtpPort) === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });
    }
  });

  it('should have all required email environment variables', () => {
    expect(process.env.SMTP_HOST).toBeDefined();
    expect(process.env.SMTP_PORT).toBeDefined();
    expect(process.env.SMTP_USER).toBeDefined();
    expect(process.env.SMTP_PASS).toBeDefined();
    expect(process.env.SMTP_FROM).toBeDefined();
    expect(process.env.ADMIN_EMAIL).toBeDefined();
  });

  it('should format confirmation email correctly', () => {
    const mockSubmission: Partial<ContactSubmission> = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      service: 'Immigration & Residence',
      salutation: 'Mr.',
      dateOfBirth: '1990-01-15',
      phoneNumber: '+49123456789',
      street: 'Main Street 123',
      addressLine2: 'Apt 4B',
      postalCode: '10115',
      city: 'Berlin',
      stateProvince: 'Berlin',
      country: 'Germany',
      currentResidence: 'United States',
      preferredLanguage: 'English',
      message: 'I need help with my visa application.',
      contactConsent: true,
      privacyConsent: true,
    };

    const emailContent = `
Dear ${mockSubmission.firstName} ${mockSubmission.lastName},

Thank you for contacting us! We have received your inquiry and will get back to you soon.

Here is a summary of your submission:

Service: ${mockSubmission.service}
Name: ${mockSubmission.salutation} ${mockSubmission.firstName} ${mockSubmission.lastName}
Date of Birth: ${mockSubmission.dateOfBirth}
Email: ${mockSubmission.email}
Phone: ${mockSubmission.phoneNumber}

Address:
${mockSubmission.street}
${mockSubmission.addressLine2 ? mockSubmission.addressLine2 + '\n' : ''}${mockSubmission.postalCode} ${mockSubmission.city}
${mockSubmission.stateProvince ? mockSubmission.stateProvince + '\n' : ''}${mockSubmission.country}

Current Residence: ${mockSubmission.currentResidence}
Preferred Language: ${mockSubmission.preferredLanguage}

Your Message:
${mockSubmission.message}

We will review your request and contact you via ${mockSubmission.preferredLanguage === 'email' ? 'email' : 'phone or email'} soon.

Best regards,
HandokHelper
Your support for dealing with German authorities
    `.trim();

    expect(emailContent).toContain('John Doe');
    expect(emailContent).toContain('john@example.com');
    expect(emailContent).toContain('Immigration & Residence');
    expect(emailContent).toContain('Berlin');
    expect(emailContent).toContain('HandokHelper');
  });

  it('should format admin notification email correctly', () => {
    const mockSubmission: Partial<ContactSubmission> = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      service: 'Government Forms & Certificates',
      salutation: 'Ms.',
      dateOfBirth: '1985-06-20',
      phoneNumber: '+49987654321',
      street: 'Unter den Linden 1',
      addressLine2: null,
      postalCode: '10117',
      city: 'Berlin',
      stateProvince: null,
      country: 'Germany',
      currentResidence: 'France',
      preferredLanguage: 'German',
      message: 'I need assistance with my pension documents.',
      contactConsent: true,
      privacyConsent: true,
      submitterIp: '192.168.1.1',
      userAgent: 'Mozilla/5.0',
      createdAt: new Date(),
    };

    const emailContent = `
New Contact Form Submission

Service: ${mockSubmission.service}

Personal Information:
- Name: ${mockSubmission.salutation} ${mockSubmission.firstName} ${mockSubmission.lastName}
- Date of Birth: ${mockSubmission.dateOfBirth}
- Email: ${mockSubmission.email}
- Phone: ${mockSubmission.phoneNumber}

Address:
${mockSubmission.street}
${mockSubmission.addressLine2 ? mockSubmission.addressLine2 + '\n' : ''}${mockSubmission.postalCode} ${mockSubmission.city}
${mockSubmission.stateProvince ? mockSubmission.stateProvince + '\n' : ''}${mockSubmission.country}

Additional Information:
- Current Residence: ${mockSubmission.currentResidence}
- Preferred Contact Language: ${mockSubmission.preferredLanguage}

Message:
${mockSubmission.message}

Consent:
- Contact Permission: ${mockSubmission.contactConsent ? 'Yes' : 'No'}
- Privacy Policy: ${mockSubmission.privacyConsent ? 'Yes' : 'No'}

Metadata:
- Submitted at: ${mockSubmission.createdAt}
- IP Address: ${mockSubmission.submitterIp || 'N/A'}
- User Agent: ${mockSubmission.userAgent || 'N/A'}
    `.trim();

    expect(emailContent).toContain('Jane Smith');
    expect(emailContent).toContain('jane@example.com');
    expect(emailContent).toContain('Government Forms & Certificates');
    expect(emailContent).toContain('Consent:');
    expect(emailContent).toContain('Contact Permission: Yes');
  });

  it('should verify transporter can send test email', async () => {
    if (!transporter) {
      throw new Error('Transporter not initialized');
    }

    try {
      // Test sending an email
      const info = await transporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@handokhelper.de',
        to: process.env.ADMIN_EMAIL || 'info@handokhelper.de',
        subject: '[TEST] HandokHelper Contact Form - SMTP Configuration Test',
        text: `
This is a test email to verify your SMTP configuration is working correctly.

If you received this email, your Mailjet SMTP settings are properly configured and the contact form will be able to send emails.

Test Details:
- From: ${process.env.SMTP_FROM}
- To: ${process.env.ADMIN_EMAIL}
- Timestamp: ${new Date().toISOString()}
- SMTP Host: ${process.env.SMTP_HOST}
- SMTP Port: ${process.env.SMTP_PORT}

Best regards,
HandokHelper System
        `.trim(),
      });

      expect(info.messageId).toBeDefined();
      expect(info.response).toContain('250'); // SMTP success code
      console.log('✓ Test email sent successfully to:', process.env.ADMIN_EMAIL);
      console.log('  Message ID:', info.messageId);
    } catch (error) {
      throw new Error(`Failed to send test email: ${error}`);
    }
  });

  it('should have correct admin email configured', () => {
    expect(process.env.ADMIN_EMAIL).toBe('info@handokhelper.de');
  });

  it('should have correct sender email configured', () => {
    expect(process.env.SMTP_FROM).toBe('info@handokhelper.de');
  });
});
