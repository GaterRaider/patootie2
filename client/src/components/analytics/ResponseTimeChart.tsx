import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ResponseTimeChart() {
    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle>Response Time Metrics</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    <p className="text-sm">Response time tracking coming soon</p>
                </div>
            </CardContent>
        </Card>
    );
}
