export interface FAQItem {
    question: string;
    answer: string;
}

export interface FAQData {
    "@context": string;
    "@type": string;
    mainEntity: Array<{
        "@type": string;
        name: string;
        acceptedAnswer: {
            "@type": string;
            text: string;
        };
    }>;
}

export interface FAQResponse {
    items: FAQItem[];
    jsonLd: FAQData;
}
