import { describe, it, expect, beforeAll } from 'vitest';
import nodemailer from 'nodemailer';

describe('SMTP Configuration', () => {
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

  it('should have SMTP credentials configured', () => {
    expect(process.env.SMTP_HOST).toBeDefined();
    expect(process.env.SMTP_PORT).toBeDefined();
    expect(process.env.SMTP_USER).toBeDefined();
    expect(process.env.SMTP_PASS).toBeDefined();
    expect(process.env.SMTP_FROM).toBeDefined();
    expect(process.env.ADMIN_EMAIL).toBeDefined();
  });

  it('should have correct SMTP values', () => {
    expect(process.env.SMTP_HOST).toBe('in-v3.mailjet.com');
    expect(process.env.SMTP_PORT).toBe('587');
    expect(process.env.SMTP_FROM).toBe('info@handokhelper.de');
    expect(process.env.ADMIN_EMAIL).toBe('info@handokhelper.de');
  });

  it('should verify SMTP connection', async () => {
    if (!transporter) {
      throw new Error('Transporter not initialized');
    }

    try {
      await transporter.verify();
      expect(true).toBe(true); // Connection successful
    } catch (error) {
      throw new Error(`SMTP connection failed: ${error}`);
    }
  });

  it('should create transporter with correct configuration', () => {
    expect(transporter).toBeDefined();
    if (transporter) {
      const config = transporter.options as any;
      expect(config.host).toBe('in-v3.mailjet.com');
      expect(config.port).toBe(587);
      expect(config.secure).toBe(false); // TLS, not SSL
    }
  });
});
