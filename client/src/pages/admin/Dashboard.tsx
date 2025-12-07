import { useState, useEffect } from "react";

import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Loader2, Settings2, GripVertical } from "lucide-react";
import { DashboardSkeleton } from "@/components/ui/skeleton";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SummaryCards } from "@/components/analytics/SummaryCards";
import { SubmissionsOverTimeChart } from "@/components/analytics/SubmissionsOverTimeChart";
import { SubmissionsByServiceChart } from "@/components/analytics/SubmissionsByServiceChart";
import { RevenueTrendsChart } from "@/components/analytics/RevenueTrendsChart";
import { InvoiceStatusChart } from "@/components/analytics/InvoiceStatusChart";
import { ResponseTimeChart } from "@/components/analytics/ResponseTimeChart";
import { TopServicesChart } from "@/components/analytics/TopServicesChart";
import { DateRangePicker } from "@/components/analytics/DateRangePicker";
import { ExportButton, downloadCSV } from "@/components/analytics/ExportButton";
import { RecentActivityWidget } from "@/components/analytics/RecentActivityWidget";
import { QuickActionsPanel } from "@/components/analytics/QuickActionsPanel";
import { toast } from "sonner";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/motion';

type ChartId = 'submissionsOverTime' | 'submissionsByService' | 'revenueTrends' | 'invoiceStatus' | 'responseTime' | 'topServices' | 'recentActivity' | 'quickActions';

interface SortableChartProps {
    id: ChartId;
    children: React.ReactNode;
}

function SortableChart({ id, children }: SortableChartProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="relative group h-full flex flex-col">
            <div
                {...attributes}
                {...listeners}
                className="absolute top-2 right-2 z-10 cursor-grab active:cursor-grabbing p-2 rounded-md bg-background/80 backdrop-blur-sm border border-border opacity-0 group-hover:opacity-100 transition-opacity"
                title="Drag to reorder"
            >
                <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 flex flex-col">
                {children}
            </div>
        </div>
    );
}

export default function AdminDashboard() {
    const { data: user } = trpc.admin.auth.me.useQuery();
    const [submissionsGroupBy, setSubmissionsGroupBy] = useState<'day' | 'week' | 'month'>('day');
    const [dateRange, setDateRange] = useState<{ startDate?: string; endDate?: string }>({});
    const [debouncedDateRange, setDebouncedDateRange] = useState<{ startDate?: string; endDate?: string }>({});
    const [isUpdating, setIsUpdating] = useState(false);

    // Chart visibility state
    const [visibleCharts, setVisibleCharts] = useState<Record<ChartId, boolean>>(() => {
        const defaultVisibility: Record<ChartId, boolean> = {
            submissionsOverTime: true,
            submissionsByService: true,
            revenueTrends: true,
            invoiceStatus: true,
            responseTime: true,
            topServices: true,
            recentActivity: true,
            quickActions: true,
        };

        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem("dashboard-visible-charts");
            if (saved) {
                try {
                    const parsedVisibility = JSON.parse(saved) as any;

                    // Migration: Add new widgets if they don't exist in saved visibility
                    if (!('recentActivity' in parsedVisibility)) {
                        parsedVisibility.recentActivity = true;
                    }
                    if (!('quickActions' in parsedVisibility)) {
                        parsedVisibility.quickActions = true;
                    }

                    return parsedVisibility as Record<ChartId, boolean>;
                } catch (e) {
                    console.error("Failed to parse visible charts settings", e);
                }
            }
        }
        return defaultVisibility;
    });

    // Chart order state
    const [chartOrder, setChartOrder] = useState<ChartId[]>(() => {
        const defaultOrder: ChartId[] = ['recentActivity', 'quickActions', 'submissionsOverTime', 'submissionsByService', 'revenueTrends', 'invoiceStatus', 'responseTime', 'topServices'];

        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem("dashboard-chart-order");
            if (saved) {
                try {
                    const parsedOrder = JSON.parse(saved) as ChartId[];

                    // Migration: Add new widgets if they don't exist in saved order
                    const hasRecentActivity = parsedOrder.includes('recentActivity');
                    const hasQuickActions = parsedOrder.includes('quickActions');

                    if (!hasRecentActivity || !hasQuickActions) {
                        const migratedOrder = [...parsedOrder];
                        if (!hasRecentActivity) {
                            migratedOrder.unshift('recentActivity');
                        }
                        if (!hasQuickActions) {
                            // Insert after recentActivity if it exists, otherwise at the beginning
                            const insertIndex = migratedOrder.indexOf('recentActivity') + 1;
                            migratedOrder.splice(insertIndex, 0, 'quickActions');
                        }
                        return migratedOrder;
                    }

                    return parsedOrder;
                } catch (e) {
                    console.error("Failed to parse chart order", e);
                }
            }
        }
        return defaultOrder;
    });

    useEffect(() => {
        localStorage.setItem("dashboard-visible-charts", JSON.stringify(visibleCharts));
    }, [visibleCharts]);

    useEffect(() => {
        localStorage.setItem("dashboard-chart-order", JSON.stringify(chartOrder));
    }, [chartOrder]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedDateRange(dateRange);
            setIsUpdating(false);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [dateRange]);

    const handleDateRangeChange = (startDate?: string, endDate?: string) => {
        setDateRange({ startDate, endDate });
        setIsUpdating(true);
    };

    // Analytics queries - use debounced date range and add staleTime
    const queryOptions = {
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false, // Don't refetch on window focus
    };

    const { data: summaryMetrics, isLoading: metricsLoading } = trpc.admin.analytics.getSummaryMetrics.useQuery(
        debouncedDateRange,
        queryOptions
    );
    const { data: submissionsOverTime } = trpc.admin.analytics.getSubmissionsOverTime.useQuery(
        { ...debouncedDateRange, groupBy: submissionsGroupBy },
        queryOptions
    );
    const { data: submissionsByService } = trpc.admin.analytics.getSubmissionsByService.useQuery(
        debouncedDateRange,
        queryOptions
    );
    const { data: revenueTrends } = trpc.admin.analytics.getRevenueTrends.useQuery(
        debouncedDateRange,
        queryOptions
    );
    const { data: invoiceStatus } = trpc.admin.analytics.getInvoiceStatusDistribution.useQuery(
        debouncedDateRange,
        queryOptions
    );
    const { data: topServices } = trpc.admin.analytics.getTopServicesByRevenue.useQuery(
        { ...debouncedDateRange, limit: 5 },
        queryOptions
    );

    // Drag and drop sensors
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setChartOrder((items) => {
                const oldIndex = items.indexOf(active.id as ChartId);
                const newIndex = items.indexOf(over.id as ChartId);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    // Export handlers
    const handleExportCSV = () => {
        if (!summaryMetrics) {
            toast.error("No data available to export");
            return;
        }

        // Create CSV content
        const headers = ["Metric", "Value"];
        const rows = [
            ["Total Submissions", summaryMetrics.submissions.total.toString()],
            ["Submissions This Month", summaryMetrics.submissions.thisMonth.toString()],
            ["Submissions Last Month", summaryMetrics.submissions.lastMonth.toString()],
            ["Total Invoices", summaryMetrics.totalInvoices.toString()],
            ["Revenue This Month", `${summaryMetrics.revenue.thisMonth} ${summaryMetrics.revenue.currency}`],
            ["Revenue YTD", `${summaryMetrics.revenue.ytd} ${summaryMetrics.revenue.currency}`],
            ["Unpaid Invoices Count", summaryMetrics.unpaidInvoices.count.toString()],
            ["Unpaid Invoices Amount", `${summaryMetrics.unpaidInvoices.totalAmount} ${summaryMetrics.unpaidInvoices.currency}`],
            ["Average Response Time (hours)", summaryMetrics.responseTime.averageHours.toString()],
            ["Conversion Rate", `${summaryMetrics.conversionRate.conversionRate}%`],
        ];

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.join(","))
        ].join("\n");

        const filename = `analytics_export_${new Date().toISOString().split('T')[0]}.csv`;
        downloadCSV(csvContent, filename);
        toast.success("Analytics exported successfully");
    };

    const pdfMutation = trpc.admin.analytics.generatePdf.useMutation();

    const handleExportPDF = async () => {
        try {
            toast.info("Generating PDF...");

            const result = await pdfMutation.mutateAsync(debouncedDateRange);

            // Convert base64 to blob and download
            const byteCharacters = atob(result.pdf);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const pdfBlob = new Blob([byteArray], { type: 'application/pdf' });

            const url = URL.createObjectURL(pdfBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = result.filename;
            link.click();
            URL.revokeObjectURL(url);

            toast.success("PDF exported successfully");
        } catch (error) {
            console.error("PDF export failed:", error);
            toast.error("Failed to export PDF");
        }
    };

    return (
        <PageTransition>
            <AdminPageHeader
                title="Dashboard"
                description={`Welcome back, ${user?.username || 'Admin'}! Here's what's happening.`}
            >
                <div className="flex gap-2 flex-wrap">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <Settings2 className="mr-2 h-4 w-4" />
                                <span className="hidden sm:inline">Customize</span>
                                <span className="sm:hidden">Charts</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Toggle Charts</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuCheckboxItem
                                checked={visibleCharts.recentActivity}
                                onCheckedChange={(checked) =>
                                    setVisibleCharts((prev) => ({ ...prev, recentActivity: checked }))
                                }
                            >
                                Recent Activity
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={visibleCharts.quickActions}
                                onCheckedChange={(checked) =>
                                    setVisibleCharts((prev) => ({ ...prev, quickActions: checked }))
                                }
                            >
                                Quick Actions
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={visibleCharts.submissionsOverTime}
                                onCheckedChange={(checked) =>
                                    setVisibleCharts((prev) => ({ ...prev, submissionsOverTime: checked }))
                                }
                            >
                                Submissions Over Time
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={visibleCharts.submissionsByService}
                                onCheckedChange={(checked) =>
                                    setVisibleCharts((prev) => ({ ...prev, submissionsByService: checked }))
                                }
                            >
                                Submissions by Service
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={visibleCharts.revenueTrends}
                                onCheckedChange={(checked) =>
                                    setVisibleCharts((prev) => ({ ...prev, revenueTrends: checked }))
                                }
                            >
                                Revenue Trends
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={visibleCharts.invoiceStatus}
                                onCheckedChange={(checked) =>
                                    setVisibleCharts((prev) => ({ ...prev, invoiceStatus: checked }))
                                }
                            >
                                Invoice Status
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={visibleCharts.responseTime}
                                onCheckedChange={(checked) =>
                                    setVisibleCharts((prev) => ({ ...prev, responseTime: checked }))
                                }
                            >
                                Response Time
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={visibleCharts.topServices}
                                onCheckedChange={(checked) =>
                                    setVisibleCharts((prev) => ({ ...prev, topServices: checked }))
                                }
                            >
                                Top Services
                            </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <ExportButton onExportPDF={handleExportPDF} onExportCSV={handleExportCSV} />
                </div>
            </AdminPageHeader>

            {/* Date Range Picker */}
            <div className="mb-6">
                <DateRangePicker onDateRangeChange={handleDateRangeChange} />
                {isUpdating && (
                    <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Updating analytics...
                    </p>
                )}
            </div>

            {/* Analytics Section */}
            {metricsLoading && !summaryMetrics ? (
                <DashboardSkeleton />
            ) : summaryMetrics ? (
                <div className="space-y-6 mb-8">
                    {/* Summary Cards */}
                    <SummaryCards data={summaryMetrics} />

                    {/* Charts Grid with Drag and Drop */}
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={chartOrder}
                            strategy={rectSortingStrategy}
                        >
                            <div className="grid gap-4 md:grid-cols-2">
                                {chartOrder.map((chartId) => {
                                    if (!visibleCharts[chartId]) return null;

                                    return (
                                        <SortableChart key={chartId} id={chartId}>
                                            {chartId === 'submissionsOverTime' && (
                                                <SubmissionsOverTimeChart
                                                    data={submissionsOverTime || []}
                                                    onGroupByChange={setSubmissionsGroupBy}
                                                />
                                            )}
                                            {chartId === 'submissionsByService' && (
                                                <SubmissionsByServiceChart data={submissionsByService || []} />
                                            )}
                                            {chartId === 'revenueTrends' && revenueTrends && (
                                                <RevenueTrendsChart data={revenueTrends} />
                                            )}
                                            {chartId === 'invoiceStatus' && (
                                                <InvoiceStatusChart data={invoiceStatus || []} />
                                            )}
                                            {chartId === 'responseTime' && (
                                                <ResponseTimeChart />
                                            )}
                                            {chartId === 'topServices' && (
                                                <TopServicesChart data={topServices || []} />
                                            )}
                                            {chartId === 'recentActivity' && (
                                                <RecentActivityWidget />
                                            )}
                                            {chartId === 'quickActions' && (
                                                <QuickActionsPanel />
                                            )}
                                        </SortableChart>
                                    );
                                })}
                            </div>
                        </SortableContext>
                    </DndContext>
                </div>
            ) : null}
        </PageTransition>
    );
}
