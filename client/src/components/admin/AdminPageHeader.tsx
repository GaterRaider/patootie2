import { cn } from "@/lib/utils";

interface AdminPageHeaderProps {
    title: string;
    description?: string;
    children?: React.ReactNode;
    className?: string;
}

export function AdminPageHeader({
    title,
    description,
    children,
    className
}: AdminPageHeaderProps) {
    return (
        <div
            className={cn(
                "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
                "mb-8 pb-6",
                // Pull out of the parent padding
                "-mx-4 -mt-4 px-4 pt-4",
                "md:-mx-8 md:-mt-8 md:px-8 md:pt-8",
                // Background styling - same as content area in both modes
                "bg-gray-100 dark:bg-[#101922]",
                className
            )}
        >
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent inline-block">
                    {title}
                </h1>
                {description && (
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>
            {children && (
                <div className="flex items-center gap-2 flex-wrap">
                    {children}
                </div>
            )}
        </div>
    );
}
