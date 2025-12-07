import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, FileText, Tag, X, Plus } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { getCategoryDisplayName } from "@/lib/categoryUtils";

export default function SubmissionDetail() {
    const params = useParams();
    const [, setLocation] = useLocation();
    const id = parseInt(params.id || "0");

    const [newNote, setNewNote] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<string>("");
    const [newTag, setNewTag] = useState("");

    const utils = trpc.useContext();

    const { data: submission, isLoading } = trpc.admin.submissions.getOne.useQuery({ id });
    const { data: notes = [] } = trpc.admin.submissions.notes.getAll.useQuery({ submissionId: id });

    const updateStatusMutation = trpc.admin.submissions.updateStatus.useMutation({
        onSuccess: () => {
            utils.admin.submissions.getOne.invalidate({ id });
            utils.admin.submissions.getAll.invalidate();
        },
    });

    const addTagMutation = trpc.admin.submissions.addTag.useMutation({
        onSuccess: () => {
            utils.admin.submissions.getOne.invalidate({ id });
            utils.admin.submissions.getAll.invalidate();
            setNewTag("");
        },
    });

    const removeTagMutation = trpc.admin.submissions.removeTag.useMutation({
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

    const handleAddTag = () => {
        if (!newTag.trim()) return;
        addTagMutation.mutate({ id, tag: newTag.trim() });
    };

    const handleRemoveTag = (tag: string) => {
        removeTagMutation.mutate({ id, tag });
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
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLocation("/admin/dashboard")}
                    className="gap-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm rounded-full hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                    <ArrowLeft className="h-4 w-4" />
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
            case "contacted":
                className = "bg-purple-500 hover:bg-purple-600 border-transparent text-white";
                break;
            case "processing":
                className = "bg-yellow-500 hover:bg-yellow-600 border-transparent text-white";
                break;
            case "completed":
                className = "bg-green-500 hover:bg-green-600 border-transparent text-white";
                break;
            case "no-reply":
                className = "bg-orange-500 hover:bg-orange-600 border-transparent text-white";
                break;
            case "cancelled":
                className = "bg-red-500 hover:bg-red-600 border-transparent text-white";
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLocation("/submissions")}
                        className="gap-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm rounded-full hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shrink-0"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                    <div className="min-w-0">
                        <h1 className="text-2xl sm:text-3xl font-bold truncate">Submission Details</h1>
                        <p className="text-sm text-muted-foreground truncate">Ref ID: {submission.refId}</p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    {getStatusBadge(submission.status)}
                    <Select value={selectedStatus} onValueChange={handleStatusUpdate}>
                        <SelectTrigger className="w-[140px] sm:w-[160px]">
                            <SelectValue placeholder="Change Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="no-reply">No reply</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button
                        size="sm"
                        onClick={() => setLocation(`/admin/invoices/new?submissionId=${id}`)}
                        className="gap-2"
                    >
                        <FileText className="h-4 w-4" />
                        <span className="hidden sm:inline">Create Invoice</span>
                        <span className="sm:hidden">Invoice</span>
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2 items-start">
                {/* Column 1: Client & Service Information */}
                <div className="space-y-6">
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
                                <p className="text-base font-medium">{getCategoryDisplayName(submission.service)}</p>
                            </div>
                            {(submission.subServices && submission.subServices.length > 0) ? (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Selected Services</p>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {submission.subServices.map((s: string, i: number) => (
                                            <Badge key={i} variant="secondary" className="font-normal bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                                {s}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            ) : submission.subService && (
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

                    {/* Tags */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Tag className="h-5 w-5" />
                                Tags
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Existing Tags */}
                            <div className="flex flex-wrap gap-2 min-h-[40px] p-3 border rounded-md bg-muted/30">
                                {submission.tags && submission.tags.length > 0 ? (
                                    submission.tags.map((tag) => (
                                        <Badge
                                            key={tag}
                                            variant="secondary"
                                            className="pl-2 pr-1 py-1 gap-1 hover:bg-secondary/80 transition-colors"
                                        >
                                            {tag}
                                            <button
                                                onClick={() => handleRemoveTag(tag)}
                                                disabled={removeTagMutation.status === "pending"}
                                                className="ml-1 hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">No tags yet</p>
                                )}
                            </div>

                            {/* Add New Tag */}
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Add a tag..."
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleAddTag();
                                        }
                                    }}
                                    className="flex-1"
                                />
                                <Button
                                    onClick={handleAddTag}
                                    disabled={!newTag.trim() || addTagMutation.status === "pending"}
                                    size="sm"
                                    className="gap-1"
                                >
                                    {addTagMutation.status === "pending" ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Plus className="h-4 w-4" />
                                    )}
                                    Add
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Column 2: Message & Notes */}
                <div className="space-y-6">
                    {/* Message */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Message</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-base whitespace-pre-wrap">{submission.message}</p>
                        </CardContent>
                    </Card>

                    {/* Internal Notes */}
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
                                    className="w-full"
                                >
                                    {createNoteMutation.status === "pending" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Add Note
                                </Button>
                            </div>

                            <div className="space-y-4 mt-6 max-h-[500px] overflow-y-auto pr-2">
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
            </div>
        </div>
    );
}
