import { trpc } from "@/lib/trpc";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

export default function ActivityLog() {
    const { data: logs, isLoading } = trpc.admin.activity.getAll.useQuery({ limit: 50 });

    if (isLoading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Activity Log</h1>
                <p className="text-muted-foreground">
                    Recent administrative actions and security events.
                </p>
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
                        {logs?.map((log) => (
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
                        {!logs?.length && (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No activity logs found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
