import { getDb } from "./db";
import { emailTemplates, type EmailTemplate, type InsertEmailTemplate } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";
import {
    getConfirmationEmailHTML_EN,
    getConfirmationEmailHTML_KOR,
    getConfirmationEmailText_EN,
    getConfirmationEmailText_KOR,
    getAdminEmailHTML_EN,
    getAdminEmailHTML_KOR,
    getAdminEmailText_EN,
    getAdminEmailText_KOR
} from "./email";
import { getInvoiceEmailHTML } from "./email";

// Define template types and their default content
const DEFAULT_TEMPLATES = [
    {
        key: 'form_submission',
        language: 'en',
        subject: 'Request Confirmation',
        html: getConfirmationEmailHTML_EN({ firstName: '{{firstName}}', lastName: '{{lastName}}', service: '{{service}}', refId: '{{refId}}', email: '{{email}}' } as any),
        text: getConfirmationEmailText_EN({ firstName: '{{firstName}}', lastName: '{{lastName}}', service: '{{service}}', refId: '{{refId}}', email: '{{email}}' } as any)
    },
    {
        key: 'form_submission',
        language: 'ko',
        subject: '요청 접수 확인',
        html: getConfirmationEmailHTML_KOR({ firstName: '{{firstName}}', lastName: '{{lastName}}', service: '{{service}}', refId: '{{refId}}', email: '{{email}}' } as any),
        text: getConfirmationEmailText_KOR({ firstName: '{{firstName}}', lastName: '{{lastName}}', service: '{{service}}', refId: '{{refId}}', email: '{{email}}' } as any)
    },
    {
        key: 'admin_notification',
        language: 'en',
        subject: 'New Contact Form Submission - {{service}}',
        html: getAdminEmailHTML_EN({ service: '{{service}}', refId: '{{refId}}', salutation: '{{salutation}}', firstName: '{{firstName}}', lastName: '{{lastName}}', dateOfBirth: '{{dateOfBirth}}', email: '{{email}}', phoneNumber: '{{phoneNumber}}', street: '{{street}}', postalCode: '{{postalCode}}', city: '{{city}}', country: '{{country}}', currentResidence: '{{currentResidence}}', preferredLanguage: '{{preferredLanguage}}', message: '{{message}}', createdAt: '{{createdAt}}' } as any),
        text: getAdminEmailText_EN({ service: '{{service}}', refId: '{{refId}}', salutation: '{{salutation}}', firstName: '{{firstName}}', lastName: '{{lastName}}', dateOfBirth: '{{dateOfBirth}}', email: '{{email}}', phoneNumber: '{{phoneNumber}}', street: '{{street}}', postalCode: '{{postalCode}}', city: '{{city}}', country: '{{country}}', currentResidence: '{{currentResidence}}', preferredLanguage: '{{preferredLanguage}}', message: '{{message}}', createdAt: '{{createdAt}}' } as any)
    },
    {
        key: 'admin_notification',
        language: 'ko',
        subject: '새 문의 접수 알림 - {{service}}',
        html: getAdminEmailHTML_KOR({ service: '{{service}}', refId: '{{refId}}', salutation: '{{salutation}}', firstName: '{{firstName}}', lastName: '{{lastName}}', dateOfBirth: '{{dateOfBirth}}', email: '{{email}}', phoneNumber: '{{phoneNumber}}', street: '{{street}}', postalCode: '{{postalCode}}', city: '{{city}}', country: '{{country}}', currentResidence: '{{currentResidence}}', preferredLanguage: '{{preferredLanguage}}', message: '{{message}}', createdAt: '{{createdAt}}' } as any),
        text: getAdminEmailText_KOR({ service: '{{service}}', refId: '{{refId}}', salutation: '{{salutation}}', firstName: '{{firstName}}', lastName: '{{lastName}}', dateOfBirth: '{{dateOfBirth}}', email: '{{email}}', phoneNumber: '{{phoneNumber}}', street: '{{street}}', postalCode: '{{postalCode}}', city: '{{city}}', country: '{{country}}', currentResidence: '{{currentResidence}}', preferredLanguage: '{{preferredLanguage}}', message: '{{message}}', createdAt: '{{createdAt}}' } as any)
    },
    {
        key: 'invoice_creation',
        language: 'en',
        subject: 'Invoice {{invoiceNumber}} from HandokHelper',
        html: getInvoiceEmailHTML({ invoiceNumber: '{{invoiceNumber}}', clientName: '{{clientName}}', issueDate: '2023-01-01', dueDate: '2023-01-14', total: 0, currency: 'EUR' } as any),
        text: `Dear {{clientName}},

Please find attached invoice {{invoiceNumber}} for your recent services.

Invoice Details:
Invoice Number: {{invoiceNumber}}
Issue Date: {{issueDate}}
Due Date: {{dueDate}}
Total Amount: {{formattedTotal}}

Please arrange for payment by the due date.

If you have any questions regarding this invoice, please do not hesitate to contact us.

Best regards,
HandokHelper Team`
    },
    // Invoice creation Korean version could be added here if needed, defaulting to English for now or duplicate EN
    {
        key: 'invoice_creation',
        language: 'ko',
        subject: 'HandokHelper 송장 {{invoiceNumber}}',
        html: getInvoiceEmailHTML({ invoiceNumber: '{{invoiceNumber}}', clientName: '{{clientName}}', issueDate: '2023-01-01', dueDate: '2023-01-14', total: 0, currency: 'EUR' } as any), // Using EN HTML for now as base
        text: `{{clientName}}님,

최근 이용하신 서비스에 대한 송장 {{invoiceNumber}}을(를) 첨부해 드립니다.

송장 상세:
송장 번호: {{invoiceNumber}}
발행일: {{issueDate}}
납기일: {{dueDate}}
총액: {{formattedTotal}}

납기일까지 결제 부탁드립니다.

문의 사항이 있으시면 언제든지 연락 주시기 바랍니다.

감사합니다.
HandokHelper 팀 드림`
    }
];

export const PLACEHOLDERS = {
    form_submission: [
        '{{firstName}}', '{{lastName}}', '{{service}}', '{{refId}}', '{{email}}'
    ],
    admin_notification: [
        '{{service}}', '{{refId}}', '{{salutation}}', '{{firstName}}', '{{lastName}}',
        '{{dateOfBirth}}', '{{email}}', '{{phoneNumber}}', '{{street}}', '{{postalCode}}',
        '{{city}}', '{{country}}', '{{currentResidence}}', '{{preferredLanguage}}',
        '{{message}}', '{{createdAt}}', '{{addressLine2}}', '{{stateProvince}}',
        '{{contactConsent}}', '{{privacyConsent}}', '{{submitterIp}}', '{{userAgent}}'
    ],
    invoice_creation: [
        '{{invoiceNumber}}', '{{clientName}}', '{{issueDate}}', '{{dueDate}}',
        '{{formattedTotal}}', '{{currency}}'
    ]
};

/**
 * Initialize email templates in the database if they don't exist
 */
export async function initializeEmailTemplates() {
    const db = await getDb();
    if (!db) {
        console.error("[EmailTemplates] Database not available for initialization");
        return;
    }

    console.log('[EmailTemplates] Checking for missing templates...');

    for (const template of DEFAULT_TEMPLATES) {
        const existing = await db.select().from(emailTemplates).where(
            and(
                eq(emailTemplates.templateKey, template.key),
                eq(emailTemplates.language, template.language)
            )
        ).limit(1);

        if (existing.length === 0) {
            console.log(`[EmailTemplates] Creating default template for ${template.key} (${template.language})`);
            await db.insert(emailTemplates).values({
                templateKey: template.key,
                language: template.language,
                subject: template.subject,
                htmlContent: template.html,
                textContent: template.text,
                updatedAt: new Date()
            });
        }
    }
    console.log('[EmailTemplates] Initialization complete.');
}

/**
 * Get a specific email template
 */
export async function getEmailTemplate(key: string, language: string): Promise<EmailTemplate | null> {
    const db = await getDb();
    if (!db) return null;

    const templates = await db.select().from(emailTemplates).where(
        and(
            eq(emailTemplates.templateKey, key),
            eq(emailTemplates.language, language)
        )
    ).limit(1);

    return templates.length > 0 ? templates[0] : null;
}

/**
 * Get all email templates
 */
export async function getAllEmailTemplates() {
    const db = await getDb();
    if (!db) return [];

    return await db.select().from(emailTemplates).orderBy(emailTemplates.templateKey, emailTemplates.language);
}

/**
 * Update an email template
 */
export async function updateEmailTemplate(
    id: number,
    data: { subject: string; htmlContent: string; textContent?: string; senderName?: string; senderEmail?: string },
    userId: number
) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Explicitly set only the fields we want to update, excluding id
    const result = await db.update(emailTemplates)
        .set({
            subject: data.subject,
            htmlContent: data.htmlContent,
            textContent: data.textContent,
            senderName: data.senderName,
            senderEmail: data.senderEmail,
            updatedAt: new Date(),
            updatedBy: userId
        })
        .where(eq(emailTemplates.id, id))
        .returning();

    return result;
}

/**
 * Helper to replace placeholders in content
 */
export function replacePlaceholders(content: string, data: Record<string, any>): string {
    let result = content;
    for (const [key, value] of Object.entries(data)) {
        // Replace {{key}} globally
        const regex = new RegExp(`{{${key}}}`, 'g');
        result = result.replace(regex, String(value || ''));
    }
    return result;
}
