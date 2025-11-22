import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface InvoiceStatusChartProps {
    data: Array<{
        status: string;
        count: number;
    }>;
}

const STATUS_COLORS = {
    draft: "#6b7280",
    sent: "#3b82f6",
    paid: "#10b981",
    overdue: "#ef4444",
    cancelled: "#374151",
};

const STATUS_LABELS = {
    draft: "Draft",
    sent: "Sent",
    paid: "Paid",
    overdue: "Overdue",
    cancelled: "Cancelled",
};

export function InvoiceStatusChart({ data }: InvoiceStatusChartProps) {
    const getColor = (status: string) => {
        return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || "#6b7280";
    };

    const getLabel = (status: string) => {
        return STATUS_LABELS[status as keyof typeof STATUS_LABELS] || status;
    };

    // Transform data for horizontal bar chart
    const chartData = data.map(item => ({
        ...item,
        label: getLabel(item.status),
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Invoice Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis
                            type="number"
                            className="text-xs"
                            tick={{ fill: 'currentColor' }}
                        />
                        <YAxis
                            type="category"
                            dataKey="label"
                            className="text-xs"
                            tick={{ fill: 'currentColor' }}
                            width={80}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(var(--background))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '6px',
                            }}
                        />
                        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getColor(entry.status)} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
