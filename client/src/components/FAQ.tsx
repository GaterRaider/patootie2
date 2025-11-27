import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { motion } from 'framer-motion';
import type { FAQItem } from '@/types/faq';

interface FAQProps {
    items: FAQItem[];
    language: 'en' | 'ko' | 'de';
}

export function FAQ({ items, language }: FAQProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Accordion type="multiple" className="w-full space-y-3">
                {items.map((item, index) => (
                    <AccordionItem
                        key={index}
                        value={`item-${index}`}
                        className="border border-border/50 rounded-xl bg-muted/20 px-6 py-2 shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                        <AccordionTrigger className="text-left hover:no-underline py-4 text-base md:text-lg font-semibold">
                            {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed pt-2 pb-4 text-sm md:text-base">
                            {item.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </motion.div>
    );
}
