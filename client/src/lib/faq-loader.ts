import type { FAQData, FAQItem, FAQResponse } from '@/types/faq';

/**
 * Transform FAQ JSON-LD data into simplified FAQ items
 */
export function transformFAQData(jsonLd: FAQData): FAQItem[] {
    return jsonLd.mainEntity.map((entity) => ({
        question: entity.name,
        answer: entity.acceptedAnswer.text,
    }));
}

/**
 * Load FAQ data for a given locale
 * Works in both browser (fetch) and Node.js (fs.readFileSync)
 */
export async function loadFAQ(locale: 'en' | 'ko' | 'de'): Promise<FAQResponse> {
    // Determine which file to load
    const fileName = locale === 'ko'
        ? 'handokhelper_faq_korean_final.json'
        : 'handokhelper_faq_en.json'; // Use English for 'de' as fallback for now

    // Check if we're in Node.js (SSR/prerender) or browser
    if (typeof window === 'undefined') {
        // Node.js environment (prerender)
        const fs = await import('fs');
        const path = await import('path');

        const filePath = path.join(process.cwd(), 'client/public', fileName);
        const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as FAQData;

        return {
            items: transformFAQData(jsonData),
            jsonLd: jsonData,
        };
    } else {
        // Browser environment
        const response = await fetch(`/${fileName}`);
        if (!response.ok) {
            throw new Error(`Failed to load FAQ: ${response.statusText}`);
        }

        const jsonData = (await response.json()) as FAQData;

        return {
            items: transformFAQData(jsonData),
            jsonLd: jsonData,
        };
    }
}
