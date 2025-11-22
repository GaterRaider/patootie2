import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface PaymentHistoryProps {
    invoiceId: number;
    onPaymentAdded?: () => void;
}

export function PaymentHistory({ invoiceId, onPaymentAdded }: PaymentHistoryProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [method, setMethod] = useState("bank_transfer");
    const [reference, setReference] = useState("");
    const [notes, setNotes] = useState("");

    const utils = trpc.useContext();
    const { data: payments, isLoading } = trpc.admin.invoices.payments.getAll.useQuery({ invoiceId });
    const { data: me } = trpc.admin.auth.me.useQuery();

    const addPaymentMutation = trpc.admin.invoices.payments.add.useMutation({
        onSuccess: () => {
            utils.admin.invoices.payments.getAll.invalidate({ invoiceId });
            utils.admin.invoices.getOne.invalidate({ id: invoiceId });
            setIsOpen(false);
            setAmount("");
            setReference("");
            setNotes("");
            if (onPaymentAdded) onPaymentAdded();
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!me) return;

        addPaymentMutation.mutate({
            invoiceId,
            amount,
            paymentDate: date,
            paymentMethod: method,
            reference,
            notes,
            recordedBy: me.adminId,
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Payment History</h3>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Payment
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Record Payment</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="amount">Amount</Label>
                                    <Input
                                        id="amount"
                                        type="number"
                                        step="0.01"
                                        required
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="date">Date</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        required
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="method">Payment Method</Label>
                                <Select value={method} onValueChange={setMethod}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                        <SelectItem value="cash">Cash</SelectItem>
                                        <SelectItem value="paypal">PayPal</SelectItem>
                                        <SelectItem value="credit_card">Credit Card</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="reference">Reference (Optional)</Label>
                                <Input
                                    id="reference"
                                    value={reference}
                                    onChange={(e) => setReference(e.target.value)}
                                    placeholder="e.g. Transaction ID"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes">Notes (Optional)</Label>
                                <Input
                                    id="notes"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>

                            <DialogFooter>
                                <Button type="submit" disabled={addPaymentMutation.status === "pending"}>
                                    {addPaymentMutation.status === "pending" && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Record Payment
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin" />
                </div>
            ) : (
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead>Reference</TableHead>
                                <TableHead>Recorded By</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payments?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                                        No payments recorded
                                    </TableCell>
                                </TableRow>
                            ) : (
                                payments?.map((payment) => (
                                    <TableRow key={payment.id}>
                                        <TableCell>{format(new Date(payment.paymentDate), "PP")}</TableCell>
                                        <TableCell>€{parseFloat(payment.amount).toFixed(2)}</TableCell>
                                        <TableCell className="capitalize">{payment.paymentMethod.replace("_", " ")}</TableCell>
                                        <TableCell>{payment.reference || "-"}</TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            Admin #{payment.recordedBy}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}
