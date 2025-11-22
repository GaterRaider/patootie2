import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface SubmissionsByServiceChartProps {
    data: Array<{
        service: string;
        count: number;
        percentage: number;
    }>;
}

// Define colors for each service type with multiple possible name variations
const COLOR_MAP = [
    { keywords: ['immigration', 'residence'], color: '#3b82f6' }, // Vibrant blue
    { keywords: ['registration', 'bureaucracy'], color: '#8b5cf6' }, // Purple
    { keywords: ['pension', 'social', 'benefits'], color: '#ec4899' }, // Pink
    { keywords: ['others', 'other'], color: '#f59e0b' }, // Amber
];

const DEFAULT_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#06b6d4', '#10b981'];

export function SubmissionsByServiceChart({ data }: SubmissionsByServiceChartProps) {
    const getColor = (service: string, index: number) => {
        const serviceLower = service.toLowerCase();

        // Try to match by keywords
        for (const mapping of COLOR_MAP) {
            if (mapping.keywords.some(keyword => serviceLower.includes(keyword))) {
                return mapping.color;
            }
        }

        // Fallback to index-based color
        return DEFAULT_COLORS[index % DEFAULT_COLORS.length];
    };

    const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage, count }: any) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        if (percentage < 5) return null; // Don't show label for small slices

        return (
            <g>
                {/* Dark background for better contrast */}
                <rect
                    x={x - 25}
                    y={y - 10}
                    width={50}
                    height={20}
                    fill="rgba(0, 0, 0, 0.7)"
                    rx={4}
                />
                <text
                    x={x}
                    y={y}
                    fill="white"
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="text-sm font-bold"
                >
                    {`${percentage.toFixed(1)}%`}
                </text>
            </g>
        );
    };

    const renderLegend = (props: any) => {
        const { payload } = props;
        return (
            <div className="flex flex-wrap justify-center gap-4 mt-4">
                {payload.map((entry: any, index: number) => (
                    <div key={`legend-${index}`} className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-sm"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-sm text-muted-foreground">
                            {entry.value}: <span className="font-semibold text-foreground">{entry.payload.count}</span>
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                    <p className="font-semibold text-sm mb-1">{data.service}</p>
                    <p className="text-sm text-muted-foreground">
                        Count: <span className="font-semibold text-foreground">{data.count}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Percentage: <span className="font-semibold text-foreground">{data.percentage.toFixed(1)}%</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle>Submissions by Service</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <PieChart margin={{ top: 20, right: 0, bottom: 0, left: 0 }}>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomLabel}
                            outerRadius={130}
                            innerRadius={80}
                            fill="#8884d8"
                            dataKey="count"
                            nameKey="service"
                            animationBegin={0}
                            animationDuration={800}
                            animationEasing="ease-out"
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={getColor(entry.service, index)}
                                    className="hover:opacity-80 transition-opacity cursor-pointer"
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend content={renderLegend} />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
