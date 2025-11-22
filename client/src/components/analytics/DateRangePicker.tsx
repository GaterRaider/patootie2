import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths, subDays } from "date-fns";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

interface DateRangePickerProps {
    onDateRangeChange: (startDate?: string, endDate?: string) => void;
}

export function DateRangePicker({ onDateRangeChange }: DateRangePickerProps) {
    const [date, setDate] = useState<DateRange | undefined>();
    const [activePreset, setActivePreset] = useState<string>("");

    const handleSelect = (range: DateRange | undefined) => {
        setDate(range);
        setActivePreset(""); // Clear preset when manually selecting

        if (range?.from) {
            const start = range.from.toISOString();
            const end = range.to ? range.to.toISOString() : range.from.toISOString(); // Default to single day if no end date
            onDateRangeChange(start, end);
        } else {
            onDateRangeChange(undefined, undefined);
        }
    };

    const applyPreset = (preset: string) => {
        const now = new Date();
        let start: Date;
        let end: Date;

        switch (preset) {
            case "today":
                start = startOfDay(now);
                end = endOfDay(now);
                break;
            case "yesterday":
                const yesterday = subDays(now, 1);
                start = startOfDay(yesterday);
                end = endOfDay(yesterday);
                break;
            case "thisWeek":
                start = startOfWeek(now, { weekStartsOn: 1 }); // Monday start
                end = endOfWeek(now, { weekStartsOn: 1 });
                break;
            case "lastWeek":
                const lastWeek = subDays(now, 7);
                start = startOfWeek(lastWeek, { weekStartsOn: 1 });
                end = endOfWeek(lastWeek, { weekStartsOn: 1 });
                break;
            case "thisMonth":
                start = startOfMonth(now);
                end = endOfMonth(now);
                break;
            case "lastMonth":
                const lastMonth = subMonths(now, 1);
                start = startOfMonth(lastMonth);
                end = endOfMonth(lastMonth);
                break;
            case "last30days":
                start = subDays(now, 30);
                end = endOfDay(now);
                break;
            case "last90days":
                start = subDays(now, 90);
                end = endOfDay(now);
                break;
            case "thisYear":
                start = new Date(now.getFullYear(), 0, 1);
                end = new Date(now.getFullYear(), 11, 31);
                break;
            default:
                return;
        }

        setDate({ from: start, to: end });
        setActivePreset(preset);
        onDateRangeChange(start.toISOString(), end.toISOString());
    };

    return (
        <div className="flex flex-wrap gap-2 items-center">
            <div className="flex flex-wrap gap-2 mr-2">
                <Button
                    variant={activePreset === "today" ? "default" : "outline"}
                    size="sm"
                    onClick={() => applyPreset("today")}
                >
                    Today
                </Button>
                <Button
                    variant={activePreset === "thisWeek" ? "default" : "outline"}
                    size="sm"
                    onClick={() => applyPreset("thisWeek")}
                >
                    This Week
                </Button>
                <Button
                    variant={activePreset === "thisMonth" ? "default" : "outline"}
                    size="sm"
                    onClick={() => applyPreset("thisMonth")}
                >
                    This Month
                </Button>
                <Button
                    variant={activePreset === "lastMonth" ? "default" : "outline"}
                    size="sm"
                    onClick={() => applyPreset("lastMonth")}
                >
                    Last Month
                </Button>
                <Button
                    variant={activePreset === "thisYear" ? "default" : "outline"}
                    size="sm"
                    onClick={() => applyPreset("thisYear")}
                >
                    This Year
                </Button>
            </div>

            <div className="h-6 w-[1px] bg-border mx-2 hidden sm:block" />

            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        size="sm"
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
                </PopoverContent>
            </Popover>

            {(date?.from || activePreset) && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                        setDate(undefined);
                        setActivePreset("");
                        onDateRangeChange(undefined, undefined);
                    }}
                    className="text-muted-foreground hover:text-foreground"
                >
                    Clear
                </Button>
            )}
        </div>
    );
}
