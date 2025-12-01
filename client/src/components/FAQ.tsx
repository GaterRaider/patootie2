import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Search, FileQuestion, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useMemo } from 'react';

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQProps {
    items: FAQItem[];
    language: 'en' | 'ko' | 'de';
}

export function FAQ({ items, language }: FAQProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [showAll, setShowAll] = useState(false);

    // Filter FAQ items based on search query
    const filteredItems = useMemo(() => {
        if (!searchQuery.trim()) return items;

        const query = searchQuery.toLowerCase();
        return items.filter(item =>
            item.question.toLowerCase().includes(query) ||
            item.answer.toLowerCase().includes(query)
        );
    }, [items, searchQuery]);

    // Determine which items to display
    const displayedItems = searchQuery.trim() || showAll ? filteredItems : filteredItems.slice(0, 3);
    const hasMoreItems = filteredItems.length > 3;

    // Placeholder text based on language
    const searchPlaceholder = language === 'ko'
        ? 'FAQ 검색...'
        : language === 'de'
            ? 'FAQ durchsuchen...'
            : 'Search FAQ...';

    const noResultsText = language === 'ko'
        ? '검색 결과가 없습니다. 다른 키워드를 시도해보세요.'
        : language === 'de'
            ? 'Keine Ergebnisse gefunden. Versuchen Sie andere Suchbegriffe.'
            : 'No results found. Try different keywords.';

    const showMoreText = language === 'ko'
        ? '더 보기'
        : language === 'de'
            ? 'Mehr anzeigen'
            : 'Show more';

    const showLessText = language === 'ko'
        ? '간략히 보기'
        : language === 'de'
            ? 'Weniger anzeigen'
            : 'Show less';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
        >
            {/* Search Input */}
            <div className="mb-8">
                <div className="relative max-w-md mx-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-12 text-base shadow-sm"
                    />
                </div>
            </div>

            {/* FAQ Items - Single Column */}
            {filteredItems.length > 0 ? (
                <>
                    <Accordion type="multiple" className="w-full space-y-3">
                        {displayedItems.map((item, index) => (
                            <AccordionItem
                                key={index}
                                value={`item-${index}`}
                                className="border border-border/50 rounded-xl bg-card/50 backdrop-blur-sm px-6 py-2 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300"
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

                    {/* Show More/Less Button */}
                    {hasMoreItems && !searchQuery.trim() && (
                        <div className="flex justify-center mt-6">
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => setShowAll(!showAll)}
                                className="gap-2"
                            >
                                {showAll ? (
                                    <>
                                        <ChevronUp className="h-4 w-4" />
                                        {showLessText}
                                    </>
                                ) : (
                                    <>
                                        <ChevronDown className="h-4 w-4" />
                                        {showMoreText}
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-12">
                    <FileQuestion className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground text-lg">
                        {noResultsText}
                    </p>
                </div>
            )}
        </motion.div>
    );
}
