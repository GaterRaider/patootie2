import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

export default function SubmissionDetail() {
    const params = useParams();
    const [, setLocation] = useLocation();
    const id = parseInt(params.id || "0");

    const [newNote, setNewNote] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<string>("");

    const utils = trpc.useContext();

    const { data: submission, isLoading } = trpc.admin.submissions.getOne.useQuery({ id });
    const { data: notes = [] } = trpc.admin.submissions.notes.getAll.useQuery({ submissionId: id });

    const updateStatusMutation = trpc.admin.submissions.updateStatus.useMutation({
        onSuccess: () => {
            utils.admin.submissions.getOne.invalidate({ id });
            utils.admin.submissions.getAll.invalidate();
        },
    });

    const createNoteMutation = trpc.admin.submissions.notes.create.useMutation({
        onSuccess: () => {
            utils.admin.submissions.notes.getAll.invalidate({ submissionId: id });
            setNewNote("");
        },
    });

    const handleStatusUpdate = (status: string) => {
        setSelectedStatus("");
        updateStatusMutation.mutate({ id, status });
    };

    const handleAddNote = () => {
        if (!newNote.trim()) return;
        createNoteMutation.mutate({ submissionId: id, note: newNote });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!submission) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Submission Not Found</h2>
                <Button onClick={() => setLocation("/admin/dashboard")}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Button>
            </div>
        );
    }

    const getStatusBadge = (status: string) => {
        let className = "";
        const label = status.charAt(0).toUpperCase() + status.slice(1);

        switch (status) {
            case "new":
                className = "bg-blue-500 hover:bg-blue-600 border-transparent text-white";
                break;
            case "processing":
                className = "bg-yellow-500 hover:bg-yellow-600 border-transparent text-white";
                break;
            case "completed":
                className = "bg-green-500 hover:bg-green-600 border-transparent text-white";
                break;
            case "archived":
                className = "bg-gray-500 hover:bg-gray-600 border-transparent text-white";
                break;
            default:
                className = "bg-secondary text-secondary-foreground hover:bg-secondary/80";
        }

        return <Badge className={className} variant="outline">{label}</Badge>;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => setLocation("/admin/dashboard")}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Submission Details</h1>
                        <p className="text-sm text-muted-foreground">Ref ID: {submission.refId}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {getStatusBadge(submission.status)}
                    <Select value={selectedStatus} onValueChange={handleStatusUpdate}>
                        <SelectTrigger className="w-[160px]">
                            <SelectValue placeholder="Change Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Personal Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Name</p>
                            <p className="text-base">{submission.salutation} {submission.firstName} {submission.lastName}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                            <p className="text-base">{submission.dateOfBirth}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Email</p>
                            <p className="text-base">{submission.email}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Phone</p>
                            <p className="text-base">{submission.phoneNumber}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Address Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Address Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Street</p>
                            <p className="text-base">{submission.street}</p>
                            {submission.addressLine2 && <p className="text-base">{submission.addressLine2}</p>}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">City</p>
                            <p className="text-base">{submission.postalCode} {submission.city}</p>
                        </div>
                        {submission.stateProvince && (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">State/Province</p>
                                <p className="text-base">{submission.stateProvince}</p>
                            </div>
                        )}
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Country</p>
                            <p className="text-base">{submission.country}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Service Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Service Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Service Category</p>
                            <p className="text-base font-medium">{submission.service}</p>
                        </div>
                        {submission.subService && (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Specific Service</p>
                                <p className="text-base">{submission.subService}</p>
                            </div>
                        )}
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Submitted</p>
                            <p className="text-base">{format(new Date(submission.createdAt), "PPpp")}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Message */}
                <Card>
                    <CardHeader>
                        <CardTitle>Message</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-base whitespace-pre-wrap">{submission.message}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Notes Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Internal Notes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Textarea
                            placeholder="Add a note..."
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            rows={3}
                        />
                        <Button
                            onClick={handleAddNote}
                            disabled={!newNote.trim() || createNoteMutation.status === "pending"}
                        >
                            {createNoteMutation.status === "pending" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Add Note
                        </Button>
                    </div>

                    <div className="space-y-4 mt-6">
                        {notes.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">No notes yet</p>
                        ) : (
                            notes.map((note) => (
                                <div key={note.id} className="border-l-2 border-primary pl-4 py-2">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-sm font-medium">{note.adminUsername || "Unknown Admin"}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {format(new Date(note.createdAt), "PPp")}
                                        </p>
                                    </div>
                                    <p className="text-sm whitespace-pre-wrap">{note.note}</p>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
