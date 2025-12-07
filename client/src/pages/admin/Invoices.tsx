import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { InvoiceStats } from "@/components/admin/InvoiceStats";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { AnimatedTableRow } from "@/components/motion";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Loader2, Plus, Search, FileText, Trash2, Edit, Download, Mail, Eye, ChevronLeft, ChevronRight, Settings2 } from "lucide-react";
import { useEffect } from "react";

import { format } from "date-fns";
import { toast } from "sonner";

export default function Invoices() {
    const [, setLocation] = useLocation();
    const utils = trpc.useContext();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('invoices-page-size');
            if (saved) {
                try {
                    return parseInt(saved);
                } catch (e) {
                    console.error('Failed to parse page size', e);
                }
            }
        }
        return 10;
    });

    // Persist page size to localStorage
    useEffect(() => {
        localStorage.setItem('invoices-page-size', pageSize.toString());
    }, [pageSize]);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [selectedInvoices, setSelectedInvoices] = useState<number[]>([]);
    const [showStats, setShowStats] = useState(true);
    const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
        issueDate: false, // Hidden by default on mobile
        dueDate: false,   // Hidden by default on mobile
    });

    const { data, isLoading } = trpc.admin.invoices.getAll.useQuery({
        page,
        limit: pageSize,
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
    }

    // Bulk Actions
    const bulkUpdateMutation = trpc.admin.invoices.update.useMutation();
    const bulkSendMutation = trpc.admin.invoices.send.useMutation();
    const [isBulkActionLoading, setIsBulkActionLoading] = useState(false);

    const handleBulkMarkAsPaid = async () => {
        if (!confirm(`Are you sure you want to mark ${selectedInvoices.length} invoices as paid?`)) return;

        setIsBulkActionLoading(true);
        try {
            await Promise.all(selectedInvoices.map(id =>
                bulkUpdateMutation.mutateAsync({
                    id,
                    updates: { status: 'paid' }
                })
            ));

            utils.admin.invoices.getAll.invalidate();
            utils.admin.invoices.stats.invalidate();
            setSelectedInvoices([]);
            toast.success("Bulk Update Successful", {
                description: `${selectedInvoices.length} invoices marked as paid.`,
            });
        } catch (error) {
            console.error(error);
            toast.error("Bulk Update Failed", {
                description: "Some invoices could not be updated.",
            });
        } finally {
            setIsBulkActionLoading(false);
        }
    };

    const handleBulkSendEmails = async () => {
        if (!confirm(`Are you sure you want to send emails for ${selectedInvoices.length} invoices?`)) return;

        setIsBulkActionLoading(true);
        try {
            await Promise.all(selectedInvoices.map(id =>
                bulkSendMutation.mutateAsync({ id })
            ));

            utils.admin.invoices.getAll.invalidate();
            setSelectedInvoices([]);
            toast.success("Bulk Send Successful", {
                description: `Emails sent for ${selectedInvoices.length} invoices.`,
            });
        } catch (error) {
            console.error(error);
            toast.error("Bulk Send Failed", {
                description: "Some emails could not be sent.",
            });
        } finally {
            setIsBulkActionLoading(false);
        }
    };


    const handleSelectAll = (checked: boolean) => {
        if (checked && data?.invoices) {
            setSelectedInvoices(data.invoices.map(inv => inv.id));
        } else {
            setSelectedInvoices([]);
        }
    };

    const handleSelectRow = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedInvoices(prev => [...prev, id]);
        } else {
            setSelectedInvoices(prev => prev.filter(i => i !== id));
        }
    };

    const totalPages = data ? Math.ceil(data.total / pageSize) : 0;

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Invoices"
                description="Manage and track your invoices"
            >
                <div className="flex gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Settings2 className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuCheckboxItem
                                checked={showStats}
                                onCheckedChange={setShowStats}
                            >
                                Show Statistics
                            </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button onClick={() => setLocation("/invoices/new")}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Invoice
                    </Button>
                </div>
            </AdminPageHeader>

            {showStats && <InvoiceStats />}

            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by invoice number, client name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 bg-background/50 border-input md:h-12 md:text-base"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    <Button
                        variant={statusFilter === "all" ? "default" : "outline"}
                        onClick={() => setStatusFilter("all")}
                        className="min-w-[60px] md:h-12 md:px-6"
                    >
                        All
                    </Button>
                    <Button
                        variant={statusFilter === "paid" ? "default" : "outline"}
                        onClick={() => setStatusFilter("paid")}
                        className="min-w-[60px] md:h-12 md:px-6"
                    >
                        Paid
                    </Button>
                    <Button
                        variant={statusFilter === "unpaid" ? "default" : "outline"}
                        onClick={() => setStatusFilter("sent")}
                        className="min-w-[60px] md:h-12 md:px-6"
                    >
                        Unpaid
                    </Button>
                    <Button
                        variant={statusFilter === "overdue" ? "default" : "outline"}
                        onClick={() => setStatusFilter("overdue")}
                        className="min-w-[60px] md:h-12 md:px-6"
                    >
                        Overdue
                    </Button>

                    <Select
                        value={["draft", "cancelled"].includes(statusFilter) ? statusFilter : ""}
                        onValueChange={setStatusFilter}
                    >
                        <SelectTrigger className={`w-[130px] md:h-12 md:w-[160px] ${["draft", "cancelled"].includes(statusFilter) ? "bg-primary text-primary-foreground" : ""}`}>
                            <SelectValue placeholder="Other" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {selectedInvoices.length > 0 && (
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-4 flex items-center justify-between">
                    <span className="text-sm font-medium text-primary">
                        {selectedInvoices.length} {selectedInvoices.length === 1 ? 'invoice' : 'invoices'} selected
                    </span>
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            className="bg-background"
                            onClick={handleBulkMarkAsPaid}
                            disabled={isBulkActionLoading}
                        >
                            {isBulkActionLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                            Mark as Paid
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="bg-background"
                            onClick={handleBulkSendEmails}
                            disabled={isBulkActionLoading}
                        >
                            {isBulkActionLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                            Send Emails
                        </Button>
                    </div>
                </div>
            )}

            <Card className="border-none shadow-none bg-transparent">
                <CardHeader className="p-0 hidden">
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto rounded-md border">
                                <Table>
                                    <TableHeader className="bg-muted/50">
                                        <TableRow>
                                            <TableHead className="w-[40px]">
                                                <Checkbox
                                                    checked={!!data?.invoices?.length && selectedInvoices.length === data.invoices.length}
                                                    onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                                                />
                                            </TableHead>
                                            <TableHead>INVOICE #</TableHead>
                                            <TableHead>CLIENT NAME</TableHead>
                                            <TableHead className={visibleColumns.issueDate ? "" : "hidden md:table-cell"}>ISSUE DATE</TableHead>
                                            <TableHead className={visibleColumns.dueDate ? "" : "hidden md:table-cell"}>DUE DATE</TableHead>
                                            <TableHead>AMOUNT</TableHead>
                                            <TableHead>STATUS</TableHead>
                                            <TableHead className="text-right">ACTIONS</TableHead>
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
                                            data?.invoices.map((invoice, index) => (
                                                <AnimatedTableRow
                                                    key={invoice.id}
                                                    index={index}
                                                    className="cursor-pointer hover:bg-muted/50"
                                                    onClick={() => setLocation(`/invoices/${invoice.id}/edit`)}
                                                >
                                                    <TableCell onClick={(e) => e.stopPropagation()}>
                                                        <Checkbox
                                                            checked={selectedInvoices.includes(invoice.id)}
                                                            onCheckedChange={(checked) => handleSelectRow(invoice.id, checked as boolean)}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {invoice.invoiceNumber}
                                                    </TableCell>
                                                    <TableCell>{invoice.clientName}</TableCell>
                                                    <TableCell className={visibleColumns.issueDate ? "" : "hidden md:table-cell"}>
                                                        {format(new Date(invoice.issueDate), "PP")}
                                                    </TableCell>
                                                    <TableCell className={visibleColumns.dueDate ? "" : "hidden md:table-cell"}>
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
                                                                    setLocation(`/invoices/${invoice.id}/edit`);
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
                                                </AnimatedTableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {totalPages > 0 && (
                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex items-center gap-2">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" size="sm" className="h-7 text-sm font-medium border-border">
                                                    Showing {data?.invoices.length ? ((page - 1) * pageSize + 1) : 0} to {data?.total ? Math.min(page * pageSize, data.total) : 0}
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="start">
                                                <DropdownMenuLabel>Results per page</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => { setPageSize(10); setPage(1); }}>
                                                    10 per page
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => { setPageSize(25); setPage(1); }}>
                                                    25 per page
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => { setPageSize(50); setPage(1); }}>
                                                    50 per page
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => { setPageSize(100); setPage(1); }}>
                                                    100 per page
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <span className="text-sm text-muted-foreground">
                                            of {data?.total || 0} results
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPage(page - 1)}
                                            disabled={page === 1}
                                        >
                                            <ChevronLeft className="h-4 w-4 mr-2" />
                                            Previous
                                        </Button>
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-primary text-primary-foreground pointer-events-none">
                                                {page}
                                            </Button>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPage(page + 1)}
                                            disabled={page === totalPages}
                                        >
                                            Next
                                            <ChevronRight className="h-4 w-4 ml-2" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div >
    );
}
