import { useState } from "react";
import { trpc } from "@/lib/trpc";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Loader2, Search, Filter, X } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AnimatedTableRow } from "@/components/motion";

const ACTIONS = [
    "LOGIN",
    "LOGOUT",
    "CREATE_ADMIN",
    "DELETE_ADMIN",
    "UPDATE_ADMIN_PASSWORD",
    "UPDATE_STATUS",
    "BULK_UPDATE",
    "ADD_NOTE",
    "CREATE_INVOICE",
    "UPDATE_SETTINGS",
];

const ENTITY_TYPES = [
    "ADMIN",
    "SUBMISSION",
    "INVOICE",
    "SETTINGS",
];

export default function ActivityLog() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(25);
    const [search, setSearch] = useState("");
    const [actionFilter, setActionFilter] = useState<string | undefined>(undefined);
    const [entityTypeFilter, setEntityTypeFilter] = useState<string | undefined>(undefined);

    const debouncedSearch = useDebounce(search, 500);

    const { data, isLoading } = trpc.admin.activity.getAll.useQuery({
        limit,
        offset: (page - 1) * limit,
        search: debouncedSearch || undefined,
        action: actionFilter === "ALL" ? undefined : actionFilter,
        entityType: entityTypeFilter === "ALL" ? undefined : entityTypeFilter,
    }, {
        placeholderData: (previousData) => previousData,
    });

    const logs = data?.logs || [];
    const total = data?.total || 0;
    const totalPages = Math.ceil(total / limit);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const clearFilters = () => {
        setSearch("");
        setActionFilter(undefined);
        setEntityTypeFilter(undefined);
        setPage(1);
    };

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Activity Log"
                description="Recent administrative actions and security events."
            />

            <div className="flex flex-col gap-4 md:flex-row md:items-center bg-card p-4 rounded-lg border">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search logs..."
                        className="pl-8"
                        value={search}
                        onChange={handleSearchChange}
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    <Select value={actionFilter || "ALL"} onValueChange={(val) => { setActionFilter(val === "ALL" ? undefined : val); setPage(1); }}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by Action" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Actions</SelectItem>
                            {ACTIONS.map(action => (
                                <SelectItem key={action} value={action}>{action}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={entityTypeFilter || "ALL"} onValueChange={(val) => { setEntityTypeFilter(val === "ALL" ? undefined : val); setPage(1); }}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by Entity" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Entities</SelectItem>
                            {ENTITY_TYPES.map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {(search || actionFilter || entityTypeFilter) && (
                        <Button variant="ghost" size="icon" onClick={clearFilters} title="Clear filters">
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Time</TableHead>
                            <TableHead>Admin</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead>Entity</TableHead>
                            <TableHead>Details</TableHead>
                            <TableHead>IP Address</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && !logs.length ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                </TableCell>
                            </TableRow>
                        ) : logs.length > 0 ? (
                            logs.map((log, index) => (
                                <AnimatedTableRow key={log.id} index={index}>
                                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                                        {format(new Date(log.createdAt), "MMM d, HH:mm:ss")}
                                    </TableCell>
                                    <TableCell className="font-medium text-sm">
                                        {log.adminUsername || `ID: ${log.adminId}`}
                                    </TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 dark:bg-gray-900 dark:text-gray-300">
                                            {log.action}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {log.entityType} {log.entityId ? `#${log.entityId}` : ""}
                                    </TableCell>
                                    <TableCell className="max-w-xs truncate text-xs text-muted-foreground" title={JSON.stringify(log.details, null, 2)}>
                                        {log.details ? JSON.stringify(log.details) : "-"}
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {log.ipAddress || "-"}
                                    </TableCell>
                                </AnimatedTableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    No logs found matching your criteria.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                        Showing {logs.length} of {total} entries
                    </p>
                    <Select value={limit.toString()} onValueChange={(val) => { setLimit(parseInt(val)); setPage(1); }}>
                        <SelectTrigger className="w-[70px] h-8">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1 || isLoading}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page >= totalPages || isLoading}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
