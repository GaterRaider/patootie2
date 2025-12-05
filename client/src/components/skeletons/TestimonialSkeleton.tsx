import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function TestimonialSkeleton() {
    return (
        <div className="flex flex-col gap-2 max-w-full md:max-w-md mx-auto md:mx-0 animate-in fade-in duration-500">
            <div className="flex items-center gap-3">
                {/* Avatar Skeleton */}
                <Skeleton className="h-9 w-9 md:h-10 md:w-10 rounded-full shrink-0" />

                {/* Name and Rating Row */}
                <div className="flex items-center gap-2">
                    {/* Name */}
                    <Skeleton className="h-4 w-24" />

                    {/* Separator Pipe Placeholder */}
                    <div className="w-px h-3 bg-border mx-0.5" />

                    {/* Stars and Rating */}
                    <div className="flex items-center gap-1.5 shrink-0">
                        <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Skeleton key={i} className="w-3.5 h-3.5 rounded-sm" />
                            ))}
                        </div>
                        <Skeleton className="h-4 w-6" />
                    </div>
                </div>
            </div>

            {/* Testimonial Text Lines */}
            <div className="space-y-1.5 mt-1">
                <Skeleton className="h-4 w-full md:w-[320px]" />
                <Skeleton className="h-4 w-[85%] md:w-[280px]" />
            </div>
        </div>
    );
}
