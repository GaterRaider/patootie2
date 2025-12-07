import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, DollarSign, FileText, Clock, Target, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { StaggerContainer, StaggerItem } from "@/components/motion";
import { motion } from "framer-motion";
import { scaleOnHover } from "@/lib/animations";
import { AnimatedNumber, AnimatedCurrency, AnimatedPercentage } from "@/components/ui/animated-number";

interface SummaryCardsProps {
    data: {
        submissions: {
            total: number;
            thisMonth: number;
            lastMonth: number;
            percentageChange: number;
        };
        totalInvoices: number;
        revenue: {
            thisMonth: number;
            ytd: number;
            currency: string;
        };
        unpaidInvoices: {
            count: number;
            totalAmount: number;
            currency: string;
        };
        responseTime: {
            averageHours: number;
            averageDays: number;
        };
        conversionRate: {
            conversionRate: number;
            totalSubmissions: number;
            paidInvoices: number;
        };
    };
}

export function SummaryCards({ data }: SummaryCardsProps) {
    const formatCurrency = (amount: number, currency: string = 'EUR') => {
        return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: currency,
        }).format(amount);
    };

    const getTrendIcon = (change: number) => {
        if (change > 0) return <TrendingUp className="h-4 w-4" />;
        if (change < 0) return <TrendingDown className="h-4 w-4" />;
        return <Minus className="h-4 w-4" />;
    };

    const getTrendColor = (change: number, inverse: boolean = false) => {
        if (inverse) {
            // For metrics where lower is better (e.g., unpaid invoices)
            if (change > 0) return "text-red-600 dark:text-red-400";
            if (change < 0) return "text-green-600 dark:text-green-400";
        } else {
            // For metrics where higher is better
            if (change > 0) return "text-green-600 dark:text-green-400";
            if (change < 0) return "text-red-600 dark:text-red-400";
        }
        return "text-gray-600 dark:text-gray-400";
    };

    return (
        <StaggerContainer>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Total Submissions */}
                <StaggerItem>
                    <motion.div {...scaleOnHover}>
                        <Card className="shadow-modern hover:shadow-lg transition-shadow duration-300">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                                <FileText className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    <AnimatedNumber value={data.submissions.total} />
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <p className="text-xs text-muted-foreground">
                                        {data.submissions.thisMonth} this month
                                    </p>
                                    <div className={cn("flex items-center gap-1 text-xs font-medium", getTrendColor(data.submissions.percentageChange))}>
                                        {getTrendIcon(data.submissions.percentageChange)}
                                        <span>{Math.abs(data.submissions.percentageChange)}%</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </StaggerItem>

                {/* Total Invoices */}
                <StaggerItem>
                    <motion.div {...scaleOnHover}>
                        <Card className="shadow-modern hover:shadow-lg transition-shadow duration-300">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
                                <FileText className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    <AnimatedNumber value={data.totalInvoices} />
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Invoices created
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </StaggerItem>

                {/* Revenue */}
                <StaggerItem>
                    <motion.div {...scaleOnHover}>
                        <Card className="shadow-modern hover:shadow-lg transition-shadow duration-300">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                                <DollarSign className="h-4 w-4 text-indigo-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    <AnimatedCurrency
                                        amount={data.revenue.thisMonth}
                                        currency={data.revenue.currency}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {formatCurrency(data.revenue.ytd, data.revenue.currency)} YTD
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </StaggerItem>

                {/* Unpaid Invoices */}
                <StaggerItem>
                    <motion.div {...scaleOnHover}>
                        <Card className="shadow-modern hover:shadow-lg transition-shadow duration-300 border-destructive/50 border-2">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Unpaid Invoices</CardTitle>
                                <AlertCircle className="h-4 w-4 text-destructive" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    <AnimatedNumber value={data.unpaidInvoices.count} />
                                </div>
                                <p className="text-xs text-destructive mt-1">
                                    {formatCurrency(data.unpaidInvoices.totalAmount, data.unpaidInvoices.currency)} outstanding
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </StaggerItem>

                {/* Average Response Time */}
                <StaggerItem>
                    <motion.div {...scaleOnHover}>
                        <Card className="shadow-modern hover:shadow-lg transition-shadow duration-300">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    <AnimatedNumber value={data.responseTime.averageHours} decimals={1} suffix="h" />
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {data.responseTime.averageDays.toFixed(1)} days average
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </StaggerItem>

                {/* Conversion Rate */}
                <StaggerItem>
                    <motion.div {...scaleOnHover}>
                        <Card className="shadow-modern hover:shadow-lg transition-shadow duration-300">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                                <Target className="h-4 w-4 text-purple-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    <AnimatedPercentage value={data.conversionRate.conversionRate} />
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {data.conversionRate.paidInvoices} / {data.conversionRate.totalSubmissions} submissions
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </StaggerItem>
            </div>
        </StaggerContainer>
    );
}
