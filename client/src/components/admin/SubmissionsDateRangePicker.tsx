
import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface SubmissionsDateRangePickerProps {
    dateFrom?: string;
    dateTo?: string;
    onUpdate: (dateFrom?: string, dateTo?: string) => void;
}

export function SubmissionsDateRangePicker({
    dateFrom,
    dateTo,
    onUpdate,
}: SubmissionsDateRangePickerProps) {
    // Safe parsing helper to handle YYYY-MM-DD as local date
    const parseDate = (dateStr: string) => {
        if (!dateStr) return undefined;
        // Handle "YYYY-MM-DD" manually to prevent timezone issues
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        }
        return new Date(dateStr);
    };

    const [date, setDate] = React.useState<DateRange | undefined>(() => {
        if (dateFrom) {
            return {
                from: parseDate(dateFrom),
                to: dateTo ? parseDate(dateTo) : undefined
            }
        }
        return undefined;
    });

    const [isOpen, setIsOpen] = React.useState(false);

    // Update local state when props change (e.g. clear filters)
    React.useEffect(() => {
        if (dateFrom) {
            setDate({
                from: parseDate(dateFrom),
                to: dateTo ? parseDate(dateTo) : undefined
            });
        } else {
            setDate(undefined);
        }
    }, [dateFrom, dateTo]);

    const handleSelect = (range: DateRange | undefined) => {
        setDate(range);
    };

    const handleApply = () => {
        if (date?.from) {
            // If range is selected (start + end)
            if (date.to) {
                onUpdate(format(date.from, 'yyyy-MM-dd'), format(date.to, 'yyyy-MM-dd'));
            } else {
                // If only start date (single day filter)
                onUpdate(format(date.from, 'yyyy-MM-dd'), undefined);
            }
        } else {
            // No date selected
            onUpdate(undefined, undefined);
        }
        setIsOpen(false);
    };

    return (
        <div className={cn("grid gap-2")}>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-[260px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "LLL dd, y")} -{" "}
                                    {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date range</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={handleSelect}
                        numberOfMonths={2}
                    />
                    <div className="p-3 border-t border-border flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => {
                            setDate(undefined);
                            onUpdate(undefined, undefined);
                            setIsOpen(false);
                        }}>
                            Clear
                        </Button>
                        <Button size="sm" onClick={handleApply} disabled={!date?.from}>
                            {date?.from && !date?.to ? "Filter for this day" : "Apply Range"}
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}
