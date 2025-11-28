import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save, Settings2, Clock } from "lucide-react";
import { toast } from "sonner";

export default function SiteSettings() {
    const { data: settings, isLoading } = trpc.siteSettings.getAll.useQuery();
    const utils = trpc.useContext();

    const [showResponseTime, setShowResponseTime] = useState(false);

    const updateMutation = trpc.siteSettings.update.useMutation({
        onSuccess: () => {
            utils.siteSettings.getAll.invalidate();
            toast.success("Settings updated successfully!");
        },
        onError: (error) => {
            toast.error(`Failed to update settings: ${error.message}`);
        },
    });

    // Update local state when data loads
    useState(() => {
        if (settings) {
            setShowResponseTime(settings.showResponseTime === 'true');
        }
    });

    const handleToggleResponseTime = (checked: boolean) => {
        setShowResponseTime(checked);
        updateMutation.mutate({
            key: 'showResponseTime',
            value: checked ? 'true' : 'false',
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Site Settings</h1>
                <p className="text-muted-foreground">
                    Configure public-facing website features
                </p>
            </div>

            <div className="grid gap-6 max-w-4xl">
                {/* Response Time Display */}
                <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 border-0 bg-card">
                    <CardHeader className="space-y-1 pb-4">
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-primary" />
                            <CardTitle className="text-lg font-semibold">Response Time Expectations</CardTitle>
                        </div>
                        <CardDescription>
                            Display response time information on the home page
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="show-response-time" className="text-sm font-medium">
                                    Show Response Time
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    Display expected response time to visitors
                                </p>
                            </div>
                            <Switch
                                id="show-response-time"
                                checked={showResponseTime}
                                onCheckedChange={handleToggleResponseTime}
                                disabled={updateMutation.status === "pending"}
                            />
                        </div>

                        {showResponseTime && (
                            <div className="pt-4 border-t">
                                <p className="text-sm text-muted-foreground">
                                    <strong>Current text:</strong>
                                </p>
                                <div className="mt-2 space-y-1 text-sm">
                                    <p>🇺🇸 {settings?.responseTimeText_en || "We typically respond within 24-48 hours"}</p>
                                    <p>🇰🇷 {settings?.responseTimeText_ko || "일반적으로 24-48시간 이내에 응답합니다"}</p>
                                    <p>🇩🇪 {settings?.responseTimeText_de || "Wir antworten normalerweise innerhalb von 24-48 Stunden"}</p>
                                </div>
                                <p className="text-xs text-muted-foreground mt-3">
                                    To edit the response time text, update the database directly or contact your developer.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Future Settings Placeholder */}
                <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 border-0 bg-card border-dashed">
                    <CardHeader className="space-y-1 pb-4">
                        <div className="flex items-center gap-2">
                            <Settings2 className="h-5 w-5 text-muted-foreground" />
                            <CardTitle className="text-lg font-semibold text-muted-foreground">More Settings Coming Soon</CardTitle>
                        </div>
                        <CardDescription>
                            Additional site configuration options will be added here
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </div>
    );
}
