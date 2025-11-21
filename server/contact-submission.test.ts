import { describe, it, expect } from 'vitest';
import type { ContactSubmission } from '../drizzle/schema';
import {
  getConfirmationEmailText_EN,
  getConfirmationEmailHTML_EN,
  getConfirmationEmailText_KOR,
  getConfirmationEmailHTML_KOR,
  getAdminEmailText_EN,
  getAdminEmailHTML_EN,
  getAdminEmailText_KOR,
  getAdminEmailHTML_KOR,
} from './email';

describe('Contact Form Email Templates', () => {
  const mockSubmission: ContactSubmission = {
    id: 1,
    refId: 'REF-20231027-ABCD',
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
    submitterIp: '192.168.1.1',
    userAgent: 'Mozilla/5.0',
    createdAt: new Date('2023-10-27T10:00:00Z'),
  };

  describe('User Confirmation Email (English)', () => {
    it('should generate correct text content', () => {
      const content = getConfirmationEmailText_EN(mockSubmission);
      expect(content).toContain('Hello John Doe');
      expect(content).toContain('Service: Immigration & Residence');
      expect(content).toContain('Reference ID: REF-20231027-ABCD');
      expect(content).toContain('Email: john@example.com');
      expect(content).toContain('HandokHelper Team');
    });

    it('should generate correct HTML content', () => {
      const content = getConfirmationEmailHTML_EN(mockSubmission);
      expect(content).toContain('Hello John Doe');
      expect(content).toContain('Immigration & Residence');
      expect(content).toContain('REF-20231027-ABCD');
      expect(content).toContain('john@example.com');
      expect(content).toContain('<!doctype html>');
    });
  });

  describe('User Confirmation Email (Korean)', () => {
    it('should generate correct text content', () => {
      const content = getConfirmationEmailText_KOR(mockSubmission);
      expect(content).toContain('John Doe님, 안녕하세요.');
      expect(content).toContain('서비스: Immigration & Residence');
      expect(content).toContain('참조 ID: REF-20231027-ABCD');
      expect(content).toContain('이메일: john@example.com');
      expect(content).toContain('HandokHelper 팀 드림');
    });

    it('should generate correct HTML content', () => {
      const content = getConfirmationEmailHTML_KOR(mockSubmission);
      expect(content).toContain('John Doe님, 안녕하세요.');
      expect(content).toContain('Immigration & Residence');
      expect(content).toContain('REF-20231027-ABCD');
      expect(content).toContain('john@example.com');
      expect(content).toContain('<!doctype html>');
    });
  });

  describe('Admin Notification Email (English)', () => {
    it('should generate correct text content', () => {
      const content = getAdminEmailText_EN(mockSubmission);
      expect(content).toContain('New form submission received');
      expect(content).toContain('Service: Immigration & Residence');
      expect(content).toContain('Reference ID: REF-20231027-ABCD');
      expect(content).toContain('Name: Mr. John Doe');
      expect(content).toContain('Date of Birth: 1990-01-15');
      expect(content).toContain('Contact Permission: Yes');
      expect(content).toContain('Privacy Policy: Accepted');
    });

    it('should generate correct HTML content', () => {
      const content = getAdminEmailHTML_EN(mockSubmission);
      expect(content).toContain('New form submission received');
      expect(content).toContain('Immigration & Residence');
      expect(content).toContain('REF-20231027-ABCD');
      expect(content).toContain('Mr. John Doe');
      expect(content).toContain('1990-01-15');
      expect(content).toContain('Contact Permission: Yes');
      expect(content).toContain('Privacy Policy: Accepted');
      expect(content).toContain('<!doctype html>');
    });
  });

  describe('Admin Notification Email (Korean)', () => {
    it('should generate correct text content', () => {
      const content = getAdminEmailText_KOR(mockSubmission);
      expect(content).toContain('새로운 문의가 접수되었습니다');
      expect(content).toContain('서비스: Immigration & Residence');
      expect(content).toContain('참조 ID: REF-20231027-ABCD');
      expect(content).toContain('이름: Mr. John Doe');
      expect(content).toContain('생년월일: 1990-01-15');
      expect(content).toContain('연락 동의: Yes');
      expect(content).toContain('개인정보 처리방침: Accepted');
    });

    it('should generate correct HTML content', () => {
      const content = getAdminEmailHTML_KOR(mockSubmission);
      // Check for dynamic data to verify template usage
      expect(content).toContain('새로운 문의가 접수되었습니다');
      expect(content).toContain('Immigration & Residence');
      expect(content).toContain('REF-20231027-ABCD');
      expect(content).toContain('Mr. John Doe');
      expect(content).toContain('1990-01-15');
      expect(content).toContain('연락 동의: Yes');
      expect(content).toContain('개인정보 처리방침: Accepted');
      expect(content).toContain('<!doctype html>');
    });
  });
});
