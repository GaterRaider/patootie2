import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Line, ComposedChart } from "recharts";

interface RevenueTrendsChartProps {
    data: {
        currentYear: Array<{
            month: string;
            revenue: number;
            count: number;
        }>;
        previousYear: Array<{
            month: string;
            revenue: number;
            count: number;
        }>;
    };
}

export function RevenueTrendsChart({ data }: RevenueTrendsChartProps) {
    // Combine current and previous year data
    const combinedData = data.currentYear.map((current, index) => {
        const monthLabel = current.month.split('-')[1]; // Get MM from YYYY-MM
        const previous = data.previousYear.find(p => p.month.split('-')[1] === monthLabel);

        return {
            month: monthLabel,
            currentYear: current.revenue,
            previousYear: previous?.revenue || 0,
        };
    });

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={combinedData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis
                            dataKey="month"
                            className="text-xs"
                            tick={{ fill: 'currentColor' }}
                        />
                        <YAxis
                            className="text-xs"
                            tick={{ fill: 'currentColor' }}
                            tickFormatter={formatCurrency}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(var(--background))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '6px',
                            }}
                            formatter={(value: number) => formatCurrency(value)}
                        />
                        <Legend />
                        <Bar
                            dataKey="currentYear"
                            fill="#10b981"
                            name="Current Year"
                            radius={[4, 4, 0, 0]}
                        />
                        <Bar
                            dataKey="previousYear"
                            fill="#6b7280"
                            name="Previous Year"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
