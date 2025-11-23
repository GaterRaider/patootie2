import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Loader2, Plus, Search, FileText, Trash2, Edit, Download, Mail, Eye } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function Invoices() {
    const [, setLocation] = useLocation();
    const utils = trpc.useContext();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    const { data, isLoading } = trpc.admin.invoices.getAll.useQuery({
        page,
        limit: 20,
        clientName: search || undefined,
        status: (statusFilter && statusFilter !== "all") ? statusFilter : undefined,
    });

    const updateStatusMutation = trpc.admin.invoices.update.useMutation({
        onSuccess: () => {
            utils.admin.invoices.getAll.invalidate();
            toast.success("Status Updated", {
                description: "The invoice status has been successfully updated.",
            });
        },
        onError: (error) => {
            toast.error("Error", {
                description: `Failed to update status: ${error.message}`,
            });
        }
    });

    const handleStatusUpdate = (id: number, status: string) => {
        updateStatusMutation.mutate({
            id,
            updates: { status }
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "draft":
                return "bg-gray-500 hover:bg-gray-600 border-transparent text-white";
            case "sent":
                return "bg-blue-500 hover:bg-blue-600 border-transparent text-white";
            case "paid":
                return "bg-green-500 hover:bg-green-600 border-transparent text-white";
            case "overdue":
                return "bg-red-500 hover:bg-red-600 border-transparent text-white";
            case "cancelled":
                return "bg-gray-400 hover:bg-gray-500 border-transparent text-white";
            default:
                return "bg-secondary text-secondary-foreground hover:bg-secondary/80";
        }
    };

    const deleteMutation = trpc.admin.invoices.delete.useMutation({
        onSuccess: () => {
            utils.admin.invoices.getAll.invalidate();
            toast.success("Invoice Deleted", {
                description: "The invoice has been successfully deleted.",
            });
        },
    });

    const handleDelete = (id: number, invoiceNumber: string) => {
        if (confirm(`Are you sure you want to delete invoice ${invoiceNumber}?`)) {
            deleteMutation.mutate({ id });
        }
    };

    const pdfMutation = trpc.admin.invoices.generatePdf.useMutation();

    const sendMutation = trpc.admin.invoices.send.useMutation({
        onSuccess: () => {
            utils.admin.invoices.getAll.invalidate();
            toast.success("Invoice Sent", {
                description: "The invoice has been sent to the client via email.",
            });
        },
        onError: (error) => {
            toast.error("Error", {
                description: `Failed to send invoice: ${error.message}`,
            });
        }
    });

    const handleSendInvoice = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        if (confirm("Are you sure you want to send this invoice via email?")) {
            sendMutation.mutate({ id });
        }
    };

    const handlePreviewEmail = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        try {
            const html = await utils.client.admin.invoices.previewEmail.query({ id });
            const newWindow = window.open("", "_blank");
            if (newWindow) {
                newWindow.document.write(html);
                newWindow.document.close();
            } else {
                toast.error("Error", {
                    description: "Pop-up blocked. Please allow pop-ups to view the preview.",
                });
            }
        } catch (error) {
            toast.error("Error", {
                description: "Failed to load email preview.",
            });
        }
    };

    const handleDownloadPdf = async (e: React.MouseEvent, id: number, invoiceNumber: string) => {
        e.stopPropagation();
        try {
            const result = await pdfMutation.mutateAsync({ id });

            // Convert base64 to blob
            const byteCharacters = atob(result.pdf);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = result.filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to generate PDF:', error);
            toast.error("Error", {
                description: "Failed to generate PDF. Please try again.",
            });
        }
    };

    const totalPages = data ? Math.ceil(data.total / 20) : 0;

    return (
        <div className="space-y-6">
            {/* ... (keep existing header and search/filter section) ... */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Invoices</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage and track your invoices
                    </p>
                </div>
                <Button onClick={() => setLocation("/admin/invoices/new")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Invoice
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by client name..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="sent">Sent</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="overdue">Overdue</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Invoice #</TableHead>
                                        <TableHead>Client</TableHead>
                                        <TableHead>Issue Date</TableHead>
                                        <TableHead>Due Date</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data?.invoices.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center h-32">
                                                <div className="flex flex-col items-center gap-2">
                                                    <FileText className="h-8 w-8 text-muted-foreground" />
                                                    <p className="text-sm text-muted-foreground">
                                                        No invoices found
                                                    </p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        data?.invoices.map((invoice) => (
                                            <TableRow
                                                key={invoice.id}
                                                className="cursor-pointer hover:bg-muted/50"
                                                onClick={() => setLocation(`/admin/invoices/${invoice.id}/edit`)}
                                            >
                                                <TableCell className="font-medium">
                                                    {invoice.invoiceNumber}
                                                </TableCell>
                                                <TableCell>{invoice.clientName}</TableCell>
                                                <TableCell>
                                                    {format(new Date(invoice.issueDate), "PP")}
                                                </TableCell>
                                                <TableCell>
                                                    {format(new Date(invoice.dueDate), "PP")}
                                                </TableCell>
                                                <TableCell>
                                                    €{parseFloat(invoice.total).toFixed(2)}
                                                </TableCell>
                                                <TableCell onClick={(e) => e.stopPropagation()}>
                                                    <Select
                                                        value={invoice.status}
                                                        onValueChange={(value) => handleStatusUpdate(invoice.id, value)}
                                                    >
                                                        <SelectTrigger className={`w-[110px] h-8 ${getStatusColor(invoice.status)}`}>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="draft">Draft</SelectItem>
                                                            <SelectItem value="sent">Sent</SelectItem>
                                                            <SelectItem value="paid">Paid</SelectItem>
                                                            <SelectItem value="overdue">Overdue</SelectItem>
                                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={(e) => handlePreviewEmail(e, invoice.id)}
                                                            title="Preview Email"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={(e) => handleSendInvoice(e, invoice.id)}
                                                            disabled={sendMutation.status === "pending"}
                                                            title="Send Email"
                                                        >
                                                            {sendMutation.status === "pending" && sendMutation.variables?.id === invoice.id ? (
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            ) : (
                                                                <Mail className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={(e) => handleDownloadPdf(e, invoice.id, invoice.invoiceNumber)}
                                                            disabled={pdfMutation.status === "pending" && pdfMutation.variables?.id === invoice.id}
                                                            title="Download PDF"
                                                        >
                                                            {pdfMutation.status === "pending" && pdfMutation.variables?.id === invoice.id ? (
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            ) : (
                                                                <Download className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setLocation(`/admin/invoices/${invoice.id}/edit`);
                                                            }}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDelete(invoice.id, invoice.invoiceNumber);
                                                            }}
                                                            disabled={deleteMutation.status === "pending"}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>

                            {totalPages > 1 && (
                                <div className="flex items-center justify-between mt-4">
                                    <p className="text-sm text-muted-foreground">
                                        Page {page} of {totalPages}
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPage(page - 1)}
                                            disabled={page === 1}
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPage(page + 1)}
                                            disabled={page === totalPages}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
