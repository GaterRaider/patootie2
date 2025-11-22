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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

export default function ActivityLog() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(25);

    // Fetch enough data to support pagination
    const { data: logs, isLoading } = trpc.admin.activity.getAll.useQuery({ limit: 1000 });

    if (isLoading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    // Client-side pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedLogs = logs?.slice(startIndex, endIndex) || [];
    const totalPages = logs ? Math.ceil(logs.length / limit) : 0;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Activity Log</h1>
                    <p className="text-muted-foreground">
                        Recent administrative actions and security events.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Show:</span>
                    <Select value={limit.toString()} onValueChange={(value) => {
                        setLimit(parseInt(value));
                        setPage(1); // Reset to first page when changing limit
                    }}>
                        <SelectTrigger className="w-[100px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                            <SelectItem value="250">250</SelectItem>
                        </SelectContent>
                    </Select>
                    <span className="text-sm text-muted-foreground">entries</span>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Time</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead>Entity</TableHead>
                            <TableHead>Details</TableHead>
                            <TableHead>IP Address</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedLogs.map((log) => (
                            <TableRow key={log.id}>
                                <TableCell className="whitespace-nowrap">
                                    {format(new Date(log.createdAt), "MMM d, HH:mm:ss")}
                                </TableCell>
                                <TableCell className="font-medium">{log.action}</TableCell>
                                <TableCell>
                                    {log.entityType} {log.entityId ? `#${log.entityId}` : ""}
                                </TableCell>
                                <TableCell className="max-w-md truncate">
                                    {log.details ? JSON.stringify(log.details) : "-"}
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm">
                                    {log.ipAddress || "-"}
                                </TableCell>
                            </TableRow>
                        ))}
                        {!paginatedLogs.length && (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No activity logs found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Showing {startIndex + 1} to {Math.min(endIndex, logs?.length || 0)} of {logs?.length || 0} entries
                    </p>
                    <div className="flex items-center gap-2">
                        <p className="text-sm text-muted-foreground">
                            Page {page} of {totalPages}
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(page - 1)}
                                disabled={page === 1}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(page + 1)}
                                disabled={page === totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
