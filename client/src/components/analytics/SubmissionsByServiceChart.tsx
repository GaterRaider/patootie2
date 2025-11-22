import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface SubmissionsByServiceChartProps {
    data: Array<{
        service: string;
        count: number;
        percentage: number;
    }>;
}

const COLORS = {
    "Immigration & Residence": "#6366f1",
    "Registration & Bureaucracy": "#8b5cf6",
    "Pension and social benefits": "#ec4899",
    "Others requests": "#f59e0b",
};

export function SubmissionsByServiceChart({ data }: SubmissionsByServiceChartProps) {
    const getColor = (service: string) => {
        return COLORS[service as keyof typeof COLORS] || "#6b7280";
    };

    const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }: any) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        if (percentage < 5) return null; // Don't show label for small slices

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                className="text-xs font-semibold"
            >
                {`${percentage.toFixed(1)}%`}
            </text>
        );
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Submissions by Service</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomLabel}
                            outerRadius={100}
                            innerRadius={60}
                            fill="#8884d8"
                            dataKey="count"
                            nameKey="service"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getColor(entry.service)} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(var(--background))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '6px',
                            }}
                            formatter={(value: number, name: string, props: any) => [
                                `${value} (${props.payload.percentage.toFixed(1)}%)`,
                                name
                            ]}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            formatter={(value, entry: any) => (
                                <span className="text-xs">
                                    {value}: {entry.payload.count}
                                </span>
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
