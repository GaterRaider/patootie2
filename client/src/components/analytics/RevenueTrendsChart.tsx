import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell, LabelList } from "recharts";

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

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function RevenueTrendsChart({ data }: RevenueTrendsChartProps) {
    // Combine current and previous year data
    const combinedData = data.currentYear.map((current, index) => {
        const monthLabel = current.month.split('-')[1]; // Get MM from YYYY-MM
        const monthIndex = parseInt(monthLabel) - 1;
        const previous = data.previousYear.find(p => p.month.split('-')[1] === monthLabel);

        return {
            month: MONTH_NAMES[monthIndex] || monthLabel,
            currentYear: current.revenue,
            previousYear: previous?.revenue || 0,
            currentCount: current.count,
            previousCount: previous?.count || 0,
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

    const formatCompactCurrency = (value: number) => {
        if (value >= 1000) {
            return `€${(value / 1000).toFixed(1)}k`;
        }
        return `€${value}`;
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const current = payload.find((p: any) => p.dataKey === 'currentYear');
            const previous = payload.find((p: any) => p.dataKey === 'previousYear');
            const percentageChange = previous?.value
                ? ((current?.value - previous?.value) / previous?.value * 100).toFixed(1)
                : null;

            return (
                <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                    <p className="font-semibold text-sm mb-2">{label}</p>
                    {current && (
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#10b981' }} />
                            <span className="text-sm">
                                Current: <span className="font-semibold">{formatCurrency(current.value)}</span>
                            </span>
                        </div>
                    )}
                    {previous && previous.value > 0 && (
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#94a3b8' }} />
                            <span className="text-sm">
                                Previous: <span className="font-semibold">{formatCurrency(previous.value)}</span>
                            </span>
                        </div>
                    )}
                    {percentageChange && (
                        <p className={`text-xs mt-2 font-semibold ${parseFloat(percentageChange) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {parseFloat(percentageChange) >= 0 ? '↑' : '↓'} {Math.abs(parseFloat(percentageChange))}% vs last year
                        </p>
                    )}
                </div>
            );
        }
        return null;
    };

    const renderCustomBarLabel = (props: any) => {
        const { x, y, width, value } = props;
        if (value === 0) return null;

        return (
            <text
                x={x + width / 2}
                y={y - 5}
                fill="currentColor"
                textAnchor="middle"
                className="text-xs font-semibold"
            >
                {formatCompactCurrency(value)}
            </text>
        );
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={combinedData} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                        <XAxis
                            dataKey="month"
                            className="text-xs"
                            tick={{ fill: 'currentColor' }}
                            tickLine={false}
                        />
                        <YAxis
                            className="text-xs"
                            tick={{ fill: 'currentColor' }}
                            tickFormatter={formatCompactCurrency}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
                        <Legend
                            wrapperStyle={{ paddingTop: '20px' }}
                            iconType="rect"
                            iconSize={12}
                        />
                        <Bar
                            dataKey="currentYear"
                            fill="#10b981"
                            name="Current Year"
                            radius={[6, 6, 0, 0]}
                            animationDuration={800}
                            animationEasing="ease-out"
                        >
                            <LabelList content={renderCustomBarLabel} />
                        </Bar>
                        <Bar
                            dataKey="previousYear"
                            fill="#94a3b8"
                            name="Previous Year"
                            radius={[6, 6, 0, 0]}
                            animationDuration={800}
                            animationEasing="ease-out"
                        >
                            <LabelList content={renderCustomBarLabel} />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
