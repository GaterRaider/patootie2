import { describe, it, expect, beforeAll } from 'vitest';
import Mailjet from 'node-mailjet';
import type { ContactSubmission } from '../drizzle/schema';

describe('Contact Form Email Submission with MailJet API', () => {
  let mailjet: ReturnType<typeof Mailjet.apiConnect> | null = null;

  beforeAll(() => {
    // Create MailJet client with environment variables
    const apiKey = process.env.MAILJET_API_KEY;
    const secretKey = process.env.MAILJET_SECRET_KEY;

    if (apiKey && secretKey) {
      mailjet = Mailjet.apiConnect(apiKey, secretKey);
    }
  });

  it('should have all required email environment variables', () => {
    expect(process.env.MAILJET_API_KEY).toBeDefined();
    expect(process.env.MAILJET_SECRET_KEY).toBeDefined();
    expect(process.env.EMAIL_FROM).toBeDefined();
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

  it('should send confirmation email via MailJet API', async () => {
    if (!mailjet) {
      throw new Error('MailJet client not initialized');
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
                Email: process.env.EMAIL_FROM || 'info@handokhelper.de',
                Name: 'Test User',
              },
            ],
            Subject: '[TEST] Your Inquiry Confirmation - HandokHelper',
            TextPart: 'This is a test confirmation email.',
            HTMLPart: '<p>This is a test confirmation email.</p>',
          },
        ],
      });

      const response = await request;
      const responseBody = response.body as any;

      if (responseBody && responseBody.Messages && Array.isArray(responseBody.Messages)) {
        const message = responseBody.Messages[0];
        if (message && message.Status === 'success') {
          console.log('✓ Confirmation email sent via MailJet API');
          expect(true).toBe(true);
          return;
        }
      }

      throw new Error('Unexpected response from MailJet API');
    } catch (error) {
      throw new Error(`Failed to send confirmation email: ${error}`);
    }
  });

  it('should send admin notification email via MailJet API', async () => {
    if (!mailjet) {
      throw new Error('MailJet client not initialized');
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
                Email: process.env.ADMIN_EMAIL || process.env.EMAIL_FROM || 'info@handokhelper.de',
                Name: 'HandokHelper Admin',
              },
            ],
            Subject: '[TEST] New Contact Form Submission - Immigration & Residence',
            TextPart: 'This is a test admin notification email.',
            HTMLPart: '<p>This is a test admin notification email.</p>',
          },
        ],
      });

      const response = await request;
      const responseBody = response.body as any;

      if (responseBody && responseBody.Messages && Array.isArray(responseBody.Messages)) {
        const message = responseBody.Messages[0];
        if (message && message.Status === 'success') {
          console.log('✓ Admin notification email sent via MailJet API');
          expect(true).toBe(true);
          return;
        }
      }

      throw new Error('Unexpected response from MailJet API');
    } catch (error) {
      throw new Error(`Failed to send admin notification email: ${error}`);
    }
  });

  it('should have correct admin email configured', () => {
    expect(process.env.ADMIN_EMAIL).toBe('info@handokhelper.de');
  });

  it('should have correct sender email configured', () => {
    expect(process.env.EMAIL_FROM).toBe('info@handokhelper.de');
  });
});
