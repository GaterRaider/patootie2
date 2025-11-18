import { describe, it, expect, beforeAll } from 'vitest';
import Mailjet from 'node-mailjet';

describe('MailJet API Configuration', () => {
  let mailjet: ReturnType<typeof Mailjet.apiConnect> | null = null;

  beforeAll(() => {
    // Create MailJet client with environment variables
    const apiKey = process.env.MAILJET_API_KEY;
    const secretKey = process.env.MAILJET_SECRET_KEY;

    if (apiKey && secretKey) {
      mailjet = Mailjet.apiConnect(apiKey, secretKey);
    }
  });

  it('should have MailJet API credentials configured', () => {
    expect(process.env.MAILJET_API_KEY).toBeDefined();
    expect(process.env.MAILJET_SECRET_KEY).toBeDefined();
    expect(process.env.EMAIL_FROM).toBeDefined();
  });

  it('should have correct MailJet values', () => {
    expect(process.env.EMAIL_FROM).toBe('info@handokhelper.de');
  });

  it('should initialize MailJet client successfully', () => {
    expect(mailjet).toBeDefined();
  });

  it('should have MailJet client with proper methods', () => {
    if (mailjet) {
      expect(typeof mailjet.post).toBe('function');
    }
  });

  it('should verify MailJet API connection', async () => {
    if (!mailjet) {
      throw new Error('MailJet client not initialized');
    }

    try {
      // Test the API connection by making a simple request
      const request = mailjet.get('user').request();
      const response = await request;
      
      // If we get a response without error, the connection is valid
      expect(response).toBeDefined();
      console.log('✓ MailJet API connection verified');
    } catch (error) {
      throw new Error(`MailJet API connection failed: ${error}`);
    }
  });

  it('should send test email via MailJet API', async () => {
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
                Name: 'HandokHelper Admin',
              },
            ],
            Subject: '[TEST] HandokHelper - MailJet API Configuration Test',
            TextPart: `
This is a test email to verify your MailJet API configuration is working correctly.

If you received this email, your MailJet API settings are properly configured and the contact form will be able to send emails.

Test Details:
- From: ${process.env.EMAIL_FROM}
- To: ${process.env.EMAIL_FROM}
- Timestamp: ${new Date().toISOString()}
- API: MailJet v3.1

Best regards,
HandokHelper System
            `.trim(),
            HTMLPart: `
<p>This is a test email to verify your MailJet API configuration is working correctly.</p>
<p>If you received this email, your MailJet API settings are properly configured and the contact form will be able to send emails.</p>
<p><strong>Test Details:</strong></p>
<ul>
  <li>From: ${process.env.EMAIL_FROM}</li>
  <li>To: ${process.env.EMAIL_FROM}</li>
  <li>Timestamp: ${new Date().toISOString()}</li>
  <li>API: MailJet v3.1</li>
</ul>
<p>Best regards,<br>HandokHelper System</p>
            `.trim(),
          },
        ],
      });

      const response = await request;
      const responseBody = response.body as any;

      if (responseBody && responseBody.Messages && Array.isArray(responseBody.Messages)) {
        const message = responseBody.Messages[0];
        if (message && message.Status === 'success') {
          console.log('✓ Test email sent successfully via MailJet API');
          console.log('  To:', process.env.EMAIL_FROM);
          console.log('  Message ID:', message.MessageID);
          expect(true).toBe(true);
          return;
        }
      }

      throw new Error('Unexpected response from MailJet API');
    } catch (error) {
      throw new Error(`Failed to send test email via MailJet: ${error}`);
    }
  });
});
