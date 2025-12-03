import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, Mail, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface SubmissionActionsProps {
    submission: {
        id: number;
        email: string;
        firstName: string;
        lastName: string;
    };
}

export function SubmissionActions({ submission }: SubmissionActionsProps) {
    const [, setLocation] = useLocation();
    const [emailDialogOpen, setEmailDialogOpen] = useState(false);
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
    const [subject, setSubject] = useState("");
    const [content, setContent] = useState("");

    // Queries
    const { data: templates } = trpc.admin.emailTemplates.getAll.useQuery(undefined, {
        enabled: emailDialogOpen,
    });

    const previewQuery = trpc.admin.submissions.previewTemplate.useQuery(
        { submissionId: submission.id, templateId: parseInt(selectedTemplateId) },
        {
            enabled: !!selectedTemplateId,
            onSuccess: (data) => {
                setSubject(data.subject);
                setContent(data.text); // Default to text content for editing simplicity
            },
        }
    );

    // Mutation
    const sendEmailMutation = trpc.admin.submissions.sendEmail.useMutation({
        onSuccess: () => {
            toast.success("Email sent", {
                description: `Email successfully sent to ${submission.email}`,
            });
            setEmailDialogOpen(false);
            setSelectedTemplateId("");
            setSubject("");
            setContent("");
        },
        onError: (error) => {
            toast.error("Error sending email", {
                description: error.message,
            });
        },
    });

    const handleSendEmail = () => {
        if (!subject || !content) return;

        // For now, we send text content as both HTML (wrapped in p tags) and text
        // In a real app, we might want a rich text editor
        const htmlContent = content.split('\n').map(line => `<p>${line}</p>`).join('');

        sendEmailMutation.mutate({
            submissionId: submission.id,
            subject,
            html: htmlContent,
            text: content,
        });
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(submission.email)}>
                        Copy Email
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setLocation(`/submissions/${submission.id}`)}>
                        View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setEmailDialogOpen(true)}>
                        <Mail className="mr-2 h-4 w-4" />
                        Quick Send Email
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
                <DialogContent className="sm:max-w-[600px]" onClick={(e) => e.stopPropagation()}>
                    <DialogHeader>
                        <DialogTitle>Send Email to {submission.firstName} {submission.lastName}</DialogTitle>
                        <DialogDescription>
                            Select a template or write a custom email.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="template">Template</Label>
                            <Select
                                value={selectedTemplateId}
                                onValueChange={setSelectedTemplateId}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a template..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {templates?.map((template) => (
                                        <SelectItem key={template.id} value={template.id.toString()}>
                                            {template.templateKey} ({template.language})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {previewQuery.isLoading && (
                            <div className="flex justify-center py-4">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        )}

                        <div className="grid gap-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input
                                id="subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Email subject"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="content">Message</Label>
                            <Textarea
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Write your message here..."
                                className="min-h-[200px]"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEmailDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSendEmail} disabled={sendEmailMutation.status === "pending" || !subject || !content}>
                            {sendEmailMutation.status === "pending" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Send Email
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
