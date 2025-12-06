import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Search, FileQuestion, ChevronDown, ChevronUp, HelpCircle, X } from 'lucide-react';
import { useState, useMemo, useRef } from 'react';

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
    const faqContainerRef = useRef<HTMLDivElement>(null);

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
        ? '답변 찾기...'
        : language === 'de'
            ? 'Antworten finden...'
            : 'Find answers...';

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
            ref={faqContainerRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
        >
            {/* Enhanced Search Input */}
            <div className="mb-10">
                <div className="relative max-w-2xl mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-blue-500/10 to-primary/10 rounded-2xl blur-xl opacity-50"></div>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary z-10" />
                        <Input
                            type="text"
                            placeholder={searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            aria-label={searchPlaceholder}
                            className="pl-12 pr-12 h-14 text-base shadow-lg border-2 border-primary/20 rounded-xl focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all duration-300 bg-background/95 backdrop-blur-sm"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground hover:text-foreground transition-colors z-10 flex items-center justify-center"
                                aria-label="Clear search"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* FAQ Items - Single Column */}
            {filteredItems.length > 0 ? (
                <>
                    <Accordion type="multiple" className="w-full space-y-4">
                        {displayedItems.map((item, index) => (
                            <AccordionItem
                                key={index}
                                value={`item-${index}`}
                                className="group relative border-2 border-border/50 rounded-2xl bg-gradient-to-br from-card/80 via-card/60 to-card/80 backdrop-blur-sm shadow-md hover:shadow-xl hover:border-primary/30 transition-all duration-300 overflow-hidden data-[state=open]:border-primary/40"
                            >
                                {/* Subtle gradient overlay on hover */}
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>

                                <div className="relative px-6 py-3">
                                    <AccordionTrigger className="text-left hover:no-underline py-4 text-base md:text-lg font-semibold group-hover:text-primary transition-colors duration-300">
                                        <div className="flex items-start gap-3 pr-4">
                                            <HelpCircle className="h-5 w-5 mt-0.5 text-primary group-hover:text-primary transition-colors flex-shrink-0" />
                                            <span>{item.question}</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground leading-relaxed pt-2 pb-4 text-sm md:text-base pl-8">
                                        {item.answer}
                                    </AccordionContent>
                                </div>
                            </AccordionItem>
                        ))}
                    </Accordion>

                    {/* Enhanced Show More/Less Button */}
                    {hasMoreItems && !searchQuery.trim() && (
                        <motion.div
                            className="flex justify-center mt-8"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                        >
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => {
                                    if (showAll) {
                                        // Scroll to FAQ section when collapsing
                                        faqContainerRef.current?.scrollIntoView({
                                            behavior: 'smooth',
                                            block: 'start'
                                        });
                                    }
                                    setShowAll(!showAll);
                                }}
                                className="gap-2 px-8 py-6 text-base font-semibold rounded-xl border-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 shadow-md hover:shadow-lg group"
                            >
                                {showAll ? (
                                    <>
                                        <ChevronUp className="h-5 w-5 group-hover:-translate-y-0.5 transition-transform" />
                                        {showLessText}
                                    </>
                                ) : (
                                    <>
                                        <ChevronDown className="h-5 w-5 group-hover:translate-y-0.5 transition-transform" />
                                        {showMoreText}
                                    </>
                                )}
                            </Button>
                        </motion.div>
                    )}
                </>
            ) : (
                <motion.div
                    className="text-center py-16"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl"></div>
                        <FileQuestion className="relative h-20 w-20 mx-auto text-muted-foreground mb-6" />
                    </div>
                    <p className="text-muted-foreground text-lg font-medium">
                        {noResultsText}
                    </p>
                </motion.div>
            )}
        </motion.div>
    );
}
