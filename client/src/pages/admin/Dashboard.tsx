import { useState, useEffect } from "react";

import SubmissionsTable from "@/components/SubmissionsTable";
import { trpc } from "@/lib/trpc";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search, ChevronLeft, ChevronRight, Filter, Settings2 } from "lucide-react";
import { SortingState } from "@tanstack/react-table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
import { toast } from "sonner";

export default function AdminDashboard() {
    const [rowSelection, setRowSelection] = useState({});
    const utils = trpc.useContext();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [sorting, setSorting] = useState<SortingState>([]);
    const [serviceFilter, setServiceFilter] = useState<string>("all");
    const [bulkStatus, setBulkStatus] = useState<string>("");
    const [submissionsGroupBy, setSubmissionsGroupBy] = useState<'day' | 'week' | 'month'>('day');
    const [dateRange, setDateRange] = useState<{ startDate?: string; endDate?: string }>({});
    const [debouncedDateRange, setDebouncedDateRange] = useState<{ startDate?: string; endDate?: string }>({});
    const [isUpdating, setIsUpdating] = useState(false);

    // Chart visibility state
    const [visibleCharts, setVisibleCharts] = useState<{
        submissionsOverTime: boolean;
        submissionsByService: boolean;
        revenueTrends: boolean;
        invoiceStatus: boolean;
        responseTime: boolean;
        topServices: boolean;
    }>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem("dashboard-visible-charts");
            if (saved) {
                try {
                    return JSON.parse(saved);
                } catch (e) {
                    console.error("Failed to parse visible charts settings", e);
                }
            }
        }
        return {
            submissionsOverTime: true,
            submissionsByService: true,
            revenueTrends: true,
            invoiceStatus: true,
            responseTime: true,
            topServices: true,
        };
    });

    useEffect(() => {
        localStorage.setItem("dashboard-visible-charts", JSON.stringify(visibleCharts));
    }, [visibleCharts]);

    const handleDateRangeChange = (startDate?: string, endDate?: string) => {
        const newRange = { startDate, endDate };
        setDateRange(newRange);
        setIsUpdating(true);

        // Debounce the actual query trigger by 500ms
        const timeoutId = setTimeout(() => {
            setDebouncedDateRange(newRange);
            setIsUpdating(false);
        }, 500);

        return () => clearTimeout(timeoutId);
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

    // Debounce search
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        const timeoutId = setTimeout(() => {
            setDebouncedSearch(e.target.value);
            setPage(1); // Reset to first page on search
        }, 500);
        return () => clearTimeout(timeoutId);
    };

    const bulkUpdateMutation = trpc.admin.submissions.bulkUpdate.useMutation({
        onSuccess: () => {
            utils.admin.submissions.getAll.invalidate();
            setRowSelection({});
        },
    });

    const exportMutation = trpc.admin.submissions.export.useMutation({
        onSuccess: (data) => {
            if (!data || data.length === 0) return;

            // Convert to CSV
            const headers = ["ID", "Ref ID", "First Name", "Last Name", "Email", "Service", "Status", "Created At"];
            const csvContent = [
                headers.join(","),
                ...data.map(row => [
                    row.id,
                    row.refId,
                    `"${row.firstName}"`,
                    `"${row.lastName}"`,
                    row.email,
                    row.service,
                    row.status.charAt(0).toUpperCase() + row.status.slice(1),
                    row.createdAt
                ].join(","))
            ].join("\n");

            // Download
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const link = document.createElement("a");
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", `submissions_export_${new Date().toISOString().slice(0, 10)}.csv`);
                link.style.visibility = "hidden";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }

            setRowSelection({});
        },
    });

    const handleBulkStatusUpdate = (status: string) => {
        const selectedIds = Object.keys(rowSelection).map(Number);
        if (selectedIds.length === 0) return;

        // Reset selection immediately to allow re-selecting the same value
        setBulkStatus("");

        bulkUpdateMutation.mutate({ ids: selectedIds, status });
    };

    const handleExport = () => {
        const selectedIds = Object.keys(rowSelection).map(Number);
        if (selectedIds.length === 0) return;
        exportMutation.mutate({ ids: selectedIds });
    };

    const { data, isLoading } = trpc.admin.submissions.getAll.useQuery({
        page,
        limit: 20,
        search: debouncedSearch,
        sortBy: sorting.length > 0 ? sorting[0].id : undefined,
        sortOrder: sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : undefined,
        service: serviceFilter !== "all" ? serviceFilter : undefined,
    });

    const selectedCount = Object.keys(rowSelection).length;

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

    const handleExportPDF = async () => {
        // PDF export would require server-side generation
        // For now, show a message
        toast.info("PDF export with charts coming soon");
    };

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <div className="flex gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <Settings2 className="mr-2 h-4 w-4" />
                                Customize
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Toggle Charts</DropdownMenuLabel>
                            <DropdownMenuSeparator />
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
            </div>

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
                <div className="flex justify-center py-8 mb-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : summaryMetrics ? (
                <div className="space-y-6 mb-8">
                    {/* Summary Cards */}
                    <SummaryCards data={summaryMetrics} />

                    {/* Charts Grid */}
                    <div className="grid gap-4 md:grid-cols-2">
                        {visibleCharts.submissionsOverTime && submissionsOverTime && (
                            <SubmissionsOverTimeChart
                                data={submissionsOverTime}
                                onGroupByChange={setSubmissionsGroupBy}
                            />
                        )}
                        {visibleCharts.submissionsByService && submissionsByService && (
                            <SubmissionsByServiceChart data={submissionsByService} />
                        )}
                        {visibleCharts.revenueTrends && revenueTrends && (
                            <RevenueTrendsChart data={revenueTrends} />
                        )}
                        {visibleCharts.invoiceStatus && invoiceStatus && (
                            <InvoiceStatusChart data={invoiceStatus} />
                        )}
                        {visibleCharts.responseTime && (
                            <ResponseTimeChart />
                        )}
                        {visibleCharts.topServices && topServices && (
                            <TopServicesChart data={topServices} />
                        )}
                    </div>
                </div>
            ) : null}

            {/* Divider */}
            <div className="border-t my-8" />

            {/* Submissions Table Section */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-end sm:items-center">
                    <div className="flex gap-2 items-center w-full sm:w-auto">
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search submissions..."
                                value={search}
                                onChange={handleSearchChange}
                                className="pl-8"
                            />
                        </div>
                        <Select value={serviceFilter} onValueChange={setServiceFilter}>
                            <SelectTrigger className="w-[180px]">
                                <Filter className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Filter by Service" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Services</SelectItem>
                                <SelectItem value="Anmeldung">Anmeldung</SelectItem>
                                <SelectItem value="Abmeldung">Abmeldung</SelectItem>
                                <SelectItem value="Ummeldung">Ummeldung</SelectItem>
                                <SelectItem value="Rundfunkbeitrag">Rundfunkbeitrag</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 mr-4 bg-muted px-3 py-1 rounded-md">
                            <span className="text-sm font-medium">{selectedCount} selected</span>
                            <div className="h-4 w-[1px] bg-border mx-2" />
                            <Select
                                value={bulkStatus}
                                onValueChange={handleBulkStatusUpdate}
                                disabled={selectedCount === 0}
                            >
                                <SelectTrigger className="h-8 w-[160px]">
                                    <SelectValue placeholder="Update Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="new">New</SelectItem>
                                    <SelectItem value="processing">Processing</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="archived">Archived</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8"
                                onClick={handleExport}
                                disabled={selectedCount === 0 || exportMutation.status === "pending"}
                            >
                                {exportMutation.status === "pending" ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : null}
                                Export
                            </Button>
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1 || isLoading}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm">Page {page}</span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage((p) => p + 1)}
                            disabled={!data || data.submissions.length < 20 || isLoading}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : (
                    <SubmissionsTable
                        data={data?.submissions || []}
                        sorting={sorting}
                        onSortingChange={setSorting}
                        rowSelection={rowSelection}
                        onRowSelectionChange={setRowSelection}
                    />
                )}
            </div>
        </>
    );
}
