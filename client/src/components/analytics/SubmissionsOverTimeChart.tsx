import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

interface SubmissionsOverTimeChartProps {
    data: Array<{
        date: string;
        count: number;
    }>;
    onGroupByChange?: (groupBy: 'day' | 'week' | 'month') => void;
}

export function SubmissionsOverTimeChart({ data, onGroupByChange }: SubmissionsOverTimeChartProps) {
    const [groupBy, setGroupBy] = useState<'day' | 'week' | 'month'>('day');

    const handleGroupByChange = (newGroupBy: 'day' | 'week' | 'month') => {
        setGroupBy(newGroupBy);
        onGroupByChange?.(newGroupBy);
    };

    const hasData = data && data.length > 0;

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <CardTitle>Submissions Over Time</CardTitle>
                    <div className="flex gap-1 flex-wrap">
                        <Button
                            variant={groupBy === 'day' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleGroupByChange('day')}
                            className="text-xs px-2"
                        >
                            Daily
                        </Button>
                        <Button
                            variant={groupBy === 'week' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleGroupByChange('week')}
                            className="text-xs px-2"
                        >
                            Weekly
                        </Button>
                        <Button
                            variant={groupBy === 'month' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleGroupByChange('month')}
                            className="text-xs px-2"
                        >
                            Monthly
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {hasData ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis
                                dataKey="date"
                                className="text-xs"
                                tick={{ fill: 'currentColor' }}
                            />
                            <YAxis
                                className="text-xs"
                                tick={{ fill: 'currentColor' }}
                                allowDecimals={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--background))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '6px',
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="count"
                                stroke="#6366f1"
                                strokeWidth={2}
                                fill="url(#colorCount)"
                                name="Submissions"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                        <p>No submission data available for the selected period</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
