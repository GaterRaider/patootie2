import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface TopServicesChartProps {
    data: Array<{
        service: string;
        revenue: number;
        count: number;
    }>;
}

export function TopServicesChart({ data }: TopServicesChartProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    // Sort by revenue descending
    const sortedData = [...data].sort((a, b) => b.revenue - a.revenue);

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle>Top Services by Revenue</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={sortedData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis
                            type="number"
                            className="text-xs"
                            tick={{ fill: 'currentColor' }}
                            tickFormatter={formatCurrency}
                        />
                        <YAxis
                            type="category"
                            dataKey="service"
                            className="text-xs"
                            tick={{ fill: 'currentColor' }}
                            width={150}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(var(--background))',
                                border: '1px solid hsl(--border))',
                                borderRadius: '6px',
                            }}
                            formatter={(value: number, name: string, props: any) => [
                                formatCurrency(value),
                                `Revenue (${props.payload.count} invoices)`
                            ]}
                        />
                        <Bar
                            dataKey="revenue"
                            fill="#6366f1"
                            radius={[0, 4, 4, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
