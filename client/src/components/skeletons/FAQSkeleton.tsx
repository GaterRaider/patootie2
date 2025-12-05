import { Skeleton } from "@/components/ui/skeleton";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";

export function FAQSkeleton() {
    return (
        <div className="w-full space-y-4 animate-in fade-in duration-500">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="border-b pb-4">
                    <div className="flex items-center justify-between py-4">
                        <Skeleton className="h-6 w-3/4 md:w-1/2" />
                        <Skeleton className="h-4 w-4 rounded-full" />
                    </div>
                </div>
            ))}
        </div>
    );
}
