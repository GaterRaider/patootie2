import { useState, useEffect } from "react";
import { useLocation, useParams, useSearch } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Trash2, ArrowLeft } from "lucide-react";
import { format, addDays } from "date-fns";
import { PaymentHistory } from "@/components/invoices/PaymentHistory";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LineItem {
    description: string;
    quantity: string;
    unitPrice: string;
    amount: string;
}

export default function InvoiceForm() {
    const params = useParams();
    const [, setLocation] = useLocation();
    const utils = trpc.useContext();
    const isEdit = !!params.id;
    const invoiceId = params.id ? parseInt(params.id) : undefined;
    const searchString = useSearch();
    const queryParams = new URLSearchParams(searchString);
    const submissionIdParam = queryParams.get("submissionId");

    const [clientName, setClientName] = useState("");
    const [clientEmail, setClientEmail] = useState("");
    const [clientAddress, setClientAddress] = useState("");
    const [issueDate, setIssueDate] = useState(format(new Date(), "yyyy-MM-dd"));
    const [dueDate, setDueDate] = useState(format(addDays(new Date(), 14), "yyyy-MM-dd"));
    const [serviceDate, setServiceDate] = useState(format(new Date(), "yyyy-MM-dd"));
    const [taxRate, setTaxRate] = useState("19.00");
    const [notes, setNotes] = useState("");
    const [items, setItems] = useState<LineItem[]>([
        { description: "", quantity: "1", unitPrice: "0.00", amount: "0.00" },
    ]);
    const [selectedSubmissionId, setSelectedSubmissionId] = useState<string>(submissionIdParam || "");

    const { data: submissionsData } = trpc.admin.submissions.getAll.useQuery(
        { limit: 100, sortBy: "createdAt", sortOrder: "desc" },
        { enabled: !isEdit }
    );

    const { data: selectedSubmission } = trpc.admin.submissions.getOne.useQuery(
        { id: parseInt(selectedSubmissionId) },
        { enabled: !!selectedSubmissionId }
    );

    useEffect(() => {
        if (selectedSubmission) {
            setClientName(`${selectedSubmission.firstName} ${selectedSubmission.lastName}`);
            setClientEmail(selectedSubmission.email);
            const address = [
                selectedSubmission.street,
                selectedSubmission.addressLine2,
                `${selectedSubmission.postalCode} ${selectedSubmission.city}`,
                selectedSubmission.stateProvince,
                selectedSubmission.country
            ].filter(Boolean).join('\n');
            setClientAddress(address);
        }
    }, [selectedSubmission]);

    const { data: settings } = trpc.admin.settings.get.useQuery();
    const { data: invoice } = trpc.admin.invoices.getOne.useQuery(
        { id: invoiceId! },
        { enabled: isEdit && !!invoiceId }
    );

    const createMutation = trpc.admin.invoices.create.useMutation({
        onSuccess: () => {
            setLocation("/admin/invoices");
        },
    });

    const updateMutation = trpc.admin.invoices.update.useMutation({
        onSuccess: () => {
            setLocation("/admin/invoices");
        },
    });

    // Load invoice data for editing
    useEffect(() => {
        if (invoice) {
            setClientName(invoice.clientName);
            setClientEmail(invoice.clientEmail);
            setClientAddress(invoice.clientAddress);
            setIssueDate(invoice.issueDate);
            setDueDate(invoice.dueDate);
            setServiceDate(invoice.serviceDate || "");
            setTaxRate(invoice.taxRate);
            setNotes(invoice.notes || "");
            if (invoice.items && invoice.items.length > 0) {
                setItems(invoice.items.map((item: any) => ({
                    description: item.description,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    amount: item.amount,
                })));
            }
        }
    }, [invoice]);

    // Set default tax rate from settings
    useEffect(() => {
        if (settings && !isEdit) {
            setTaxRate(settings.defaultTaxRate);
            if (settings.paymentTermsDays) {
                setDueDate(format(addDays(new Date(), settings.paymentTermsDays), "yyyy-MM-dd"));
            }
        }
    }, [settings, isEdit]);

    const calculateItemAmount = (quantity: string, unitPrice: string) => {
        const qty = parseFloat(quantity) || 0;
        const price = parseFloat(unitPrice) || 0;
        return (qty * price).toFixed(2);
    };

    const handleItemChange = (index: number, field: keyof LineItem, value: string) => {
        const newItems = [...items];
        newItems[index][field] = value;

        if (field === "quantity" || field === "unitPrice") {
            newItems[index].amount = calculateItemAmount(
                newItems[index].quantity,
                newItems[index].unitPrice
            );
        }

        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { description: "", quantity: "1", unitPrice: "0.00", amount: "0.00" }]);
    };

    const removeItem = (index: number) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        }
    };

    const subtotal = items.reduce((sum, item) => sum + parseFloat(item.amount || "0"), 0);
    const taxAmount = (subtotal * parseFloat(taxRate)) / 100;
    const total = subtotal + taxAmount;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const invoiceData = {
            clientName,
            clientEmail,
            clientAddress,
            issueDate,
            dueDate,
            serviceDate: serviceDate || undefined,
            subtotal: subtotal.toFixed(2),
            taxRate,
            taxAmount: taxAmount.toFixed(2),
            total: total.toFixed(2),
            currency: "EUR",
            status: "draft",
            notes: notes || undefined,

            createdBy: 1, // TODO: Get from auth context
            submissionId: selectedSubmissionId ? parseInt(selectedSubmissionId) : undefined,
        };

        if (isEdit && invoiceId) {
            updateMutation.mutate({
                id: invoiceId,
                updates: invoiceData,
                items: items.filter(item => item.description.trim()),
            });
        } else {
            createMutation.mutate({
                invoice: invoiceData,
                items: items.filter(item => item.description.trim()),
            });
        }
    };

    const isLoading = createMutation.status === "pending" || updateMutation.status === "pending";

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setLocation("/admin/invoices")}
                        className="gap-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm rounded-full hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">
                            {isEdit ? "Edit Invoice" : "Create Invoice"}
                        </h1>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setLocation("/admin/invoices")}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isEdit ? "Update Invoice" : "Create Invoice"}
                    </Button>
                </div>
            </div>



            {
                !isEdit && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Link to Submission (Optional)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="max-w-md">
                                <Label>Select Submission</Label>
                                <Select value={selectedSubmissionId} onValueChange={setSelectedSubmissionId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a submission to pre-fill details..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {submissionsData?.submissions.map((sub) => (
                                            <SelectItem key={sub.id} value={sub.id.toString()}>
                                                {sub.refId} - {sub.firstName} {sub.lastName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Selecting a submission will pre-fill client details and link the invoice to the submission.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )
            }

            <div className="grid gap-6 md:grid-cols-2">
                {/* Client Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Client Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="clientName">Client Name *</Label>
                            <Input
                                id="clientName"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="clientEmail">Client Email *</Label>
                            <Input
                                id="clientEmail"
                                type="email"
                                value={clientEmail}
                                onChange={(e) => setClientEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="clientAddress">Client Address *</Label>
                            <Textarea
                                id="clientAddress"
                                value={clientAddress}
                                onChange={(e) => setClientAddress(e.target.value)}
                                rows={4}
                                required
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Invoice Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Invoice Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="issueDate">Issue Date *</Label>
                            <Input
                                id="issueDate"
                                type="date"
                                value={issueDate}
                                onChange={(e) => setIssueDate(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="dueDate">Due Date *</Label>
                            <Input
                                id="dueDate"
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="serviceDate">Service Date (Leistungsdatum)</Label>
                            <Input
                                id="serviceDate"
                                type="date"
                                value={serviceDate}
                                onChange={(e) => setServiceDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="taxRate">Tax Rate (%) *</Label>
                            <Input
                                id="taxRate"
                                type="number"
                                step="0.01"
                                value={taxRate}
                                onChange={(e) => setTaxRate(e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Line Items */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Line Items</CardTitle>
                        <Button type="button" variant="outline" size="sm" onClick={addItem}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Item
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {items.map((item, index) => (
                            <div key={index} className="grid gap-4 md:grid-cols-12 items-end">
                                <div className="md:col-span-5">
                                    <Label htmlFor={`desc-${index}`}>Description</Label>
                                    <Input
                                        id={`desc-${index}`}
                                        value={item.description}
                                        onChange={(e) => handleItemChange(index, "description", e.target.value)}
                                        placeholder="Service or product description"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <Label htmlFor={`qty-${index}`}>Quantity</Label>
                                    <Input
                                        id={`qty-${index}`}
                                        type="number"
                                        step="0.01"
                                        value={item.quantity}
                                        onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <Label htmlFor={`price-${index}`}>Unit Price (€)</Label>
                                    <Input
                                        id={`price-${index}`}
                                        type="number"
                                        step="0.01"
                                        value={item.unitPrice}
                                        onChange={(e) => handleItemChange(index, "unitPrice", e.target.value)}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <Label>Amount (€)</Label>
                                    <Input value={item.amount} readOnly className="bg-muted" />
                                </div>
                                <div className="md:col-span-1">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeItem(index)}
                                        disabled={items.length === 1}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Totals */}
                    <div className="mt-6 space-y-2 border-t pt-4">
                        <div className="flex justify-between text-sm">
                            <span>Subtotal:</span>
                            <span className="font-medium">€{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Tax ({taxRate}%):</span>
                            <span className="font-medium">€{taxAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold border-t pt-2">
                            <span>Total:</span>
                            <span>€{total.toFixed(2)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {
                isEdit && invoiceId && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Payments</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <PaymentHistory
                                invoiceId={invoiceId!}
                                onPaymentAdded={() => {
                                    // Refresh invoice data to update status if needed
                                    utils.admin.invoices.getOne.invalidate({ id: invoiceId });
                                }}
                            />
                        </CardContent>
                    </Card>
                )
            }

            {/* Notes */}
            <Card>
                <CardHeader>
                    <CardTitle>Internal Notes</CardTitle>
                </CardHeader>
                <CardContent>
                    <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        placeholder="Add any internal notes about this invoice..."
                    />
                </CardContent>
            </Card>
        </form >
    );
}
