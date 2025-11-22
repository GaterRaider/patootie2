import { useState } from "react";

import SubmissionsTable from "@/components/SubmissionsTable";
import { trpc } from "@/lib/trpc";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Search, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { SortingState } from "@tanstack/react-table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function AdminDashboard() {
    const [rowSelection, setRowSelection] = useState({});
    const utils = trpc.useContext();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [sorting, setSorting] = useState<SortingState>([]);
    const [serviceFilter, setServiceFilter] = useState<string>("all");
    const [bulkStatus, setBulkStatus] = useState<string>("");

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

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Dashboard</h1>
            </div>

            {/* Stats Cards (Placeholder for now) */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.total || 0}</div>
                    </CardContent>
                </Card>
            </div>

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
