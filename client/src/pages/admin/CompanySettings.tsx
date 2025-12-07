import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, Building2, Receipt, Landmark, FileText } from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default function Settings() {
    const [companyName, setCompanyName] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [taxId, setTaxId] = useState("");
    const [vatId, setVatId] = useState("");
    const [iban, setIban] = useState("");
    const [bic, setBic] = useState("");
    const [bankName, setBankName] = useState("");
    const [defaultTaxRate, setDefaultTaxRate] = useState("19.00");
    const [paymentTermsDays, setPaymentTermsDays] = useState(14);
    const [termsAndConditions, setTermsAndConditions] = useState("");

    const { data: settings, isLoading } = trpc.admin.settings.get.useQuery();
    const utils = trpc.useContext();

    const updateMutation = trpc.admin.settings.update.useMutation({
        onSuccess: () => {
            utils.admin.settings.get.invalidate();
            toast.success("Settings saved successfully!");
        },
        onError: (error) => {
            toast.error(`Failed to save settings: ${error.message}`);
        },
    });

    useEffect(() => {
        if (settings) {
            setCompanyName(settings.companyName || "");
            setAddress(settings.address || "");
            setEmail(settings.email || "");
            setPhone(settings.phone || "");
            setTaxId(settings.taxId || "");
            setVatId(settings.vatId || "");
            setIban(settings.iban || "");
            setBic(settings.bic || "");
            setBankName(settings.bankName || "");
            setDefaultTaxRate(settings.defaultTaxRate || "19.00");
            setPaymentTermsDays(settings.paymentTermsDays || 14);
            setTermsAndConditions(settings.termsAndConditions || "");
        }
    }, [settings]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        updateMutation.mutate({
            companyName,
            address,
            email,
            phone: phone || undefined,
            taxId: taxId || undefined,
            vatId: vatId || undefined,
            iban: iban || undefined,
            bic: bic || undefined,
            bankName: bankName || undefined,
            defaultTaxRate,
            paymentTermsDays,
            termsAndConditions: termsAndConditions || undefined,
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-8">
            <AdminPageHeader
                title="Company Settings"
                description="Configure your company information for invoices"
            />

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Company Information */}
                    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 border-0 bg-card">
                        <CardHeader className="space-y-1 pb-4">
                            <div className="flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-primary" />
                                <CardTitle className="text-lg font-semibold">Company Information</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="companyName" className="text-sm font-medium">Company Name *</Label>
                                <Input
                                    id="companyName"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    required
                                    className="mt-1.5 transition-all duration-200 hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <div>
                                <Label htmlFor="address" className="text-sm font-medium">Address *</Label>
                                <Textarea
                                    id="address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    rows={4}
                                    required
                                    className="mt-1.5 transition-all duration-200 hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <div>
                                <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="mt-1.5 transition-all duration-200 hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <div>
                                <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="mt-1.5 transition-all duration-200 hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tax Information */}
                    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 border-0 bg-card">
                        <CardHeader className="space-y-1 pb-4">
                            <div className="flex items-center gap-2">
                                <Receipt className="h-5 w-5 text-primary" />
                                <CardTitle className="text-lg font-semibold">Tax Information</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="taxId" className="text-sm font-medium">Tax ID (Steuernummer)</Label>
                                <Input
                                    id="taxId"
                                    value={taxId}
                                    onChange={(e) => setTaxId(e.target.value)}
                                    placeholder="12/345/67890"
                                    className="mt-1.5 transition-all duration-200 hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <div>
                                <Label htmlFor="vatId" className="text-sm font-medium">VAT ID (USt-IdNr)</Label>
                                <Input
                                    id="vatId"
                                    value={vatId}
                                    onChange={(e) => setVatId(e.target.value)}
                                    placeholder="DE123456789"
                                    className="mt-1.5 transition-all duration-200 hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <div>
                                <Label htmlFor="defaultTaxRate" className="text-sm font-medium">Default Tax Rate (%) *</Label>
                                <Input
                                    id="defaultTaxRate"
                                    type="number"
                                    step="0.01"
                                    value={defaultTaxRate}
                                    onChange={(e) => setDefaultTaxRate(e.target.value)}
                                    required
                                    className="mt-1.5 transition-all duration-200 hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                                <p className="text-xs text-muted-foreground mt-1.5">
                                    Standard VAT rate in Germany is 19%
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Bank Information */}
                    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 border-0 bg-card">
                        <CardHeader className="space-y-1 pb-4">
                            <div className="flex items-center gap-2">
                                <Landmark className="h-5 w-5 text-primary" />
                                <CardTitle className="text-lg font-semibold">Bank Information</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="bankName" className="text-sm font-medium">Bank Name</Label>
                                <Input
                                    id="bankName"
                                    value={bankName}
                                    onChange={(e) => setBankName(e.target.value)}
                                    className="mt-1.5 transition-all duration-200 hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <div>
                                <Label htmlFor="iban" className="text-sm font-medium">IBAN</Label>
                                <Input
                                    id="iban"
                                    value={iban}
                                    onChange={(e) => setIban(e.target.value)}
                                    placeholder="DE89 3704 0044 0532 0130 00"
                                    className="mt-1.5 transition-all duration-200 hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <div>
                                <Label htmlFor="bic" className="text-sm font-medium">BIC/SWIFT</Label>
                                <Input
                                    id="bic"
                                    value={bic}
                                    onChange={(e) => setBic(e.target.value)}
                                    placeholder="COBADEFFXXX"
                                    className="mt-1.5 transition-all duration-200 hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Invoice Preferences */}
                    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 border-0 bg-card">
                        <CardHeader className="space-y-1 pb-4">
                            <div className="flex items-center gap-2">
                                <Receipt className="h-5 w-5 text-primary" />
                                <CardTitle className="text-lg font-semibold">Invoice Preferences</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="paymentTermsDays" className="text-sm font-medium">Payment Terms (Days) *</Label>
                                <Input
                                    id="paymentTermsDays"
                                    type="number"
                                    value={paymentTermsDays}
                                    onChange={(e) => setPaymentTermsDays(parseInt(e.target.value))}
                                    required
                                    className="mt-1.5 transition-all duration-200 hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                                <p className="text-xs text-muted-foreground mt-1.5">
                                    Default number of days until payment is due
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Terms and Conditions */}
                <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 border-0 bg-card">
                    <CardHeader className="space-y-1 pb-4">
                        <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            <CardTitle className="text-lg font-semibold">Default Terms and Conditions</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            value={termsAndConditions}
                            onChange={(e) => setTermsAndConditions(e.target.value)}
                            rows={6}
                            placeholder="Enter default terms and conditions that will appear on invoices..."
                            className="transition-all duration-200 hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                            These terms will be automatically included in new invoices
                        </p>
                    </CardContent>
                </Card>

                <div className="flex justify-end pt-2">
                    <Button
                        type="submit"
                        disabled={updateMutation.status === "pending"}
                        className="px-6 shadow-md hover:shadow-lg transition-all duration-200"
                    >
                        {updateMutation.status === "pending" && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        <Save className="mr-2 h-4 w-4" />
                        Save Settings
                    </Button>
                </div>
            </form>
        </div>
    );
}
