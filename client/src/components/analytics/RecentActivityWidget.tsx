import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Activity, Loader2 } from "lucide-react";

export function RecentActivityWidget() {
    const { data: activities, isLoading } = trpc.admin.activity.getAll.useQuery({
        limit: 10,
        offset: 0,
    });

    const getActionColor = (action: string) => {
        if (action.includes("CREATE")) return "text-green-600 dark:text-green-400";
        if (action.includes("DELETE")) return "text-red-600 dark:text-red-400";
        if (action.includes("UPDATE")) return "text-blue-600 dark:text-blue-400";
        return "text-gray-600 dark:text-gray-400";
    };

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Recent Activity
                </CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                ) : (
                    <ScrollArea className="h-[300px] pr-4">
                        <div className="space-y-3">
                            {activities?.logs.map((log) => (
                                <div key={log.id} className="flex flex-col space-y-1 pb-3 border-b last:border-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">
                                                {log.adminUsername || `Admin #${log.adminId}`}
                                            </p>
                                            <p className={`text-xs ${getActionColor(log.action)}`}>
                                                {log.action.replace(/_/g, " ")}
                                            </p>
                                            {log.entityType && (
                                                <p className="text-xs text-muted-foreground">
                                                    {log.entityType} {log.entityId ? `#${log.entityId}` : ""}
                                                </p>
                                            )}
                                        </div>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                                            {format(new Date(log.createdAt), "MMM d, HH:mm")}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {activities?.logs.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-8">
                                    No recent activity
                                </p>
                            )}
                        </div>
                    </ScrollArea>
                )}
            </CardContent>
        </Card>
    );
}
