import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Loader2,
    ArrowLeft,
    Mail,
    Phone,
    MapPin,
    FileText,
    DollarSign,
    Calendar,
    TrendingUp,
} from "lucide-react";
import { format } from "date-fns";

export default function ClientUserDetail() {
    const [, params] = useRoute("/clients/:id");
    const [, setLocation] = useLocation();
    const id = params?.id ? Number(params.id) : 0;

    const { data: user, isLoading } = trpc.clientUsers.getById.useQuery(
        { id },
        { enabled: !!id && id > 0 }
    );

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-2">Client Not Found</h2>
                <p className="text-muted-foreground mb-4">
                    The client could not be found.
                </p>
                <Button onClick={() => setLocation("/clients")}>Back to Clients</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <Button variant="ghost" onClick={() => setLocation("/clients")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Clients
            </Button>

            {/* Profile Header */}
            <div className="grid gap-6 md:grid-cols-3">
                {/* Contact Info Card */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-2xl">
                            {user.contactInfo.firstName} {user.contactInfo.lastName}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {user.email}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-start gap-2 text-sm">
                            <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                            <span>{user.contactInfo.phoneNumber}</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                            <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                            <div>
                                <div>{user.contactInfo.street}</div>
                                <div>
                                    {user.contactInfo.postalCode} {user.contactInfo.city}
                                </div>
                                <div>{user.contactInfo.country}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <FileText className="h-4 w-4" />
                                <span>Submissions</span>
                            </div>
                            <span className="text-2xl font-bold">{user.stats.submissionCount}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <DollarSign className="h-4 w-4" />
                                <span>Total Invoiced</span>
                            </div>
                            <span className="text-2xl font-bold">
                                €{user.stats.totalInvoiced.toFixed(2)}
                            </span>
                        </div>
                        {user.stats.outstandingBalance > 0 && (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <TrendingUp className="h-4 w-4" />
                                    <span>Outstanding</span>
                                </div>
                                <span className="text-xl font-bold text-orange-600">
                                    €{user.stats.outstandingBalance.toFixed(2)}
                                </span>
                            </div>
                        )}
                        <div className="pt-4 border-t space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">First Contact</span>
                                <span>{format(new Date(user.stats.firstSeen), "MMM d, yyyy")}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Last Contact</span>
                                <span>{format(new Date(user.stats.lastSeen), "MMM d, yyyy")}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="submissions" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="submissions">
                        Submissions ({user.stats.submissionCount})
                    </TabsTrigger>
                    <TabsTrigger value="invoices">
                        Invoices ({user.stats.invoiceCount})
                    </TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>

                {/* Submissions Tab */}
                <TabsContent value="submissions" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Submission History</CardTitle>
                            <CardDescription>
                                All inquiries and requests from this client
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {user.submissions.map((submission) => (
                                    <div
                                        key={submission.id}
                                        className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                                        onClick={() => setLocation(`/submissions/${submission.id}`)}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h4 className="font-medium">{submission.service}</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Ref: {submission.refId}
                                                </p>
                                            </div>
                                            <span
                                                className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${submission.status === "new"
                                                    ? "bg-blue-100 text-blue-800"
                                                    : submission.status === "in-progress"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-green-100 text-green-800"
                                                    }`}
                                            >
                                                {submission.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                            {submission.message}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Calendar className="h-3 w-3" />
                                            {format(new Date(submission.createdAt), "MMM d, yyyy 'at' h:mm a")}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Invoices Tab */}
                <TabsContent value="invoices" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Invoices</CardTitle>
                            <CardDescription>All invoices for this client</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {user.invoices.length === 0 ? (
                                <p className="text-center py-8 text-muted-foreground">
                                    No invoices yet
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {user.invoices.map((invoice) => (
                                        <div
                                            key={invoice.id}
                                            className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                                            onClick={() => setLocation(`/invoices/${invoice.id}`)}
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h4 className="font-medium">{invoice.invoiceNumber}</h4>
                                                    <p className="text-sm text-muted-foreground">
                                                        Due: {format(new Date(invoice.dueDate), "MMM d, yyyy")}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-bold">
                                                        €{Number(invoice.total).toFixed(2)}
                                                    </div>
                                                    <span
                                                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${invoice.status === "paid"
                                                            ? "bg-green-100 text-green-800"
                                                            : invoice.status === "sent"
                                                                ? "bg-blue-100 text-blue-800"
                                                                : invoice.status === "overdue"
                                                                    ? "bg-red-100 text-red-800"
                                                                    : "bg-gray-100 text-gray-800"
                                                            }`}
                                                    >
                                                        {invoice.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notes Tab */}
                <TabsContent value="notes" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Internal Notes</CardTitle>
                            <CardDescription>
                                Private notes about this client (not visible to them)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-center py-8 text-muted-foreground">
                                Notes feature coming soon
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Activity Tab */}
                <TabsContent value="activity" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Activity Timeline</CardTitle>
                            <CardDescription>
                                Complete history of interactions with this client
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-center py-8 text-muted-foreground">
                                Activity timeline coming soon
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
