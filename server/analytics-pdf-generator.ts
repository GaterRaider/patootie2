import PDFDocument from "pdfkit";
import { format } from "date-fns";

interface AnalyticsData {
    summaryMetrics: {
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
        };
        conversionRate: {
            conversionRate: number;
            totalSubmissions: number;
            convertedToInvoices: number;
        };
    };
    submissionsOverTime: Array<{ date: string; count: number }>;
    submissionsByService: Array<{ service: string; count: number }>;
    revenueTrends: {
        monthly: Array<{ month: string; revenue: number }>;
        currency: string;
    };
    invoiceStatus: Array<{ status: string; count: number }>;
    topServices: Array<{ service: string; revenue: number; count: number }>;
    dateRange?: {
        startDate?: string;
        endDate?: string;
    };
}

export async function generateAnalyticsPDF(data: AnalyticsData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ size: "A4", margin: 50 });
            const buffers: Buffer[] = [];

            doc.on("data", buffers.push.bind(buffers));
            doc.on("end", () => {
                const pdfBuffer = Buffer.concat(buffers);
                resolve(pdfBuffer);
            });
            doc.on("error", reject);

            // Header
            doc
                .fontSize(24)
                .font("Helvetica-Bold")
                .text("Analytics Report", 50, 50);

            // Date Range
            let dateRangeText = "All Time";
            if (data.dateRange?.startDate && data.dateRange?.endDate) {
                dateRangeText = `${format(new Date(data.dateRange.startDate), "dd.MM.yyyy")} - ${format(new Date(data.dateRange.endDate), "dd.MM.yyyy")}`;
            } else if (data.dateRange?.startDate) {
                dateRangeText = `From ${format(new Date(data.dateRange.startDate), "dd.MM.yyyy")}`;
            } else if (data.dateRange?.endDate) {
                dateRangeText = `Until ${format(new Date(data.dateRange.endDate), "dd.MM.yyyy")}`;
            }

            doc
                .fontSize(12)
                .font("Helvetica")
                .text(`Period: ${dateRangeText}`, 50, 85);

            doc
                .fontSize(10)
                .text(`Generated: ${format(new Date(), "dd.MM.yyyy HH:mm")}`, 50, 105);

            // Summary Metrics Section
            let yPos = 140;
            doc
                .fontSize(16)
                .font("Helvetica-Bold")
                .text("Summary Metrics", 50, yPos);

            yPos += 30;
            doc.fontSize(10).font("Helvetica");

            // Submissions
            doc.font("Helvetica-Bold").text("Submissions", 50, yPos);
            yPos += 15;
            doc.font("Helvetica");
            doc.text(`Total: ${data.summaryMetrics.submissions.total}`, 70, yPos);
            yPos += 15;
            doc.text(`This Month: ${data.summaryMetrics.submissions.thisMonth}`, 70, yPos);
            yPos += 15;
            doc.text(`Last Month: ${data.summaryMetrics.submissions.lastMonth}`, 70, yPos);
            yPos += 15;
            doc.text(`Change: ${data.summaryMetrics.submissions.percentageChange > 0 ? '+' : ''}${data.summaryMetrics.submissions.percentageChange.toFixed(1)}%`, 70, yPos);
            yPos += 25;

            // Revenue
            doc.font("Helvetica-Bold").text("Revenue", 50, yPos);
            yPos += 15;
            doc.font("Helvetica");
            doc.text(`This Month: ${data.summaryMetrics.revenue.currency}${data.summaryMetrics.revenue.thisMonth.toFixed(2)}`, 70, yPos);
            yPos += 15;
            doc.text(`Year to Date: ${data.summaryMetrics.revenue.currency}${data.summaryMetrics.revenue.ytd.toFixed(2)}`, 70, yPos);
            yPos += 25;

            // Invoices
            doc.font("Helvetica-Bold").text("Invoices", 50, yPos);
            yPos += 15;
            doc.font("Helvetica");
            doc.text(`Total Invoices: ${data.summaryMetrics.totalInvoices}`, 70, yPos);
            yPos += 15;
            doc.text(`Unpaid: ${data.summaryMetrics.unpaidInvoices.count} (${data.summaryMetrics.unpaidInvoices.currency}${data.summaryMetrics.unpaidInvoices.totalAmount.toFixed(2)})`, 70, yPos);
            yPos += 25;

            // Performance Metrics
            doc.font("Helvetica-Bold").text("Performance", 50, yPos);
            yPos += 15;
            doc.font("Helvetica");
            doc.text(`Avg Response Time: ${data.summaryMetrics.responseTime.averageHours.toFixed(1)} hours`, 70, yPos);
            yPos += 15;
            doc.text(`Conversion Rate: ${data.summaryMetrics.conversionRate.conversionRate.toFixed(1)}% (${data.summaryMetrics.conversionRate.convertedToInvoices}/${data.summaryMetrics.conversionRate.totalSubmissions})`, 70, yPos);
            yPos += 35;

            // Submissions by Service
            if (data.submissionsByService.length > 0) {
                doc
                    .fontSize(14)
                    .font("Helvetica-Bold")
                    .text("Submissions by Service", 50, yPos);
                yPos += 25;

                doc.fontSize(10).font("Helvetica");
                data.submissionsByService.forEach((item) => {
                    if (yPos > 700) {
                        doc.addPage();
                        yPos = 50;
                    }
                    doc.text(`${item.service}: ${item.count}`, 70, yPos);
                    yPos += 15;
                });
                yPos += 20;
            }

            // Top Services by Revenue
            if (data.topServices.length > 0) {
                if (yPos > 650) {
                    doc.addPage();
                    yPos = 50;
                }

                doc
                    .fontSize(14)
                    .font("Helvetica-Bold")
                    .text("Top Services by Revenue", 50, yPos);
                yPos += 25;

                doc.fontSize(10).font("Helvetica");
                data.topServices.forEach((item, index) => {
                    if (yPos > 700) {
                        doc.addPage();
                        yPos = 50;
                    }
                    doc.text(`${index + 1}. ${item.service}`, 70, yPos);
                    doc.text(`Revenue: €${item.revenue.toFixed(2)} | Count: ${item.count}`, 90, yPos + 12);
                    yPos += 30;
                });
                yPos += 20;
            }

            // Invoice Status Distribution
            if (data.invoiceStatus.length > 0) {
                if (yPos > 650) {
                    doc.addPage();
                    yPos = 50;
                }

                doc
                    .fontSize(14)
                    .font("Helvetica-Bold")
                    .text("Invoice Status Distribution", 50, yPos);
                yPos += 25;

                doc.fontSize(10).font("Helvetica");
                data.invoiceStatus.forEach((item) => {
                    if (yPos > 700) {
                        doc.addPage();
                        yPos = 50;
                    }
                    doc.text(`${item.status}: ${item.count}`, 70, yPos);
                    yPos += 15;
                });
                yPos += 20;
            }

            // Submissions Over Time (last 10 entries)
            if (data.submissionsOverTime.length > 0) {
                if (yPos > 600) {
                    doc.addPage();
                    yPos = 50;
                }

                doc
                    .fontSize(14)
                    .font("Helvetica-Bold")
                    .text("Recent Submissions Trend", 50, yPos);
                yPos += 25;

                doc.fontSize(10).font("Helvetica");
                const recentData = data.submissionsOverTime.slice(-10);
                recentData.forEach((item) => {
                    if (yPos > 700) {
                        doc.addPage();
                        yPos = 50;
                    }
                    doc.text(`${item.date}: ${item.count}`, 70, yPos);
                    yPos += 15;
                });
            }

            // Footer
            doc.fontSize(8).font("Helvetica");
            doc.text(
                "Analytics Report | Generated by Patootie Admin Panel",
                50,
                750,
                { align: "center", width: 500 }
            );

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
}
