
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, TrendingUp, TrendingDown } from "lucide-react";

export function InvoiceStats() {
    const { data: stats, isLoading } = trpc.admin.invoices.stats.useQuery();

    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-3 mb-6">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="bg-card/50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Loading...</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-8 w-24 bg-muted animate-pulse rounded" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    const formatCurrency = (amount: number, currency: string = 'EUR') => {
        return new Intl.NumberFormat('en-IE', {
            style: 'currency',
            currency: currency,
        }).format(amount);
    };

    return (
        <div className="grid gap-4 md:grid-cols-3 mb-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Unpaid
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {formatCurrency(stats?.unpaid.totalAmount || 0)}
                    </div>
                    {/* Placeholder for percentage if backend supported it, or static/calculated */}
                    <p className="text-xs text-green-500 flex items-center mt-1">
                        +2.5% <span className="text-muted-foreground ml-1">last month</span>
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Overdue
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {formatCurrency(stats?.overdue.totalAmount || 0)}
                    </div>
                    <p className={`text-xs flex items-center mt-1 ${(stats?.overdue.percentageChange || 0) > 0 ? 'text-red-500' : 'text-green-500'
                        }`}>
                        {(stats?.overdue.percentageChange || 0) > 0 ? '+' : ''}
                        {stats?.overdue.percentageChange}%
                        <span className="text-muted-foreground ml-1">last month</span>
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Revenue This Month
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {formatCurrency(stats?.revenue.thisMonth || 0)}
                    </div>
                    <p className="text-xs text-green-500 flex items-center mt-1">
                        +8.2% <span className="text-muted-foreground ml-1">last month</span>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
