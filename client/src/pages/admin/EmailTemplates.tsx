import React, { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Edit, Mail, Calendar, Globe, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default function EmailTemplates() {
    const utils = trpc.useContext();
    const { data: templates, isLoading, error } = trpc.admin.emailTemplates.getAll.useQuery();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [formData, setFormData] = useState({
        templateKey: "",
        language: "en",
        subject: "",
        htmlContent: "",
        textContent: "",
        senderName: "HandokHelper",
        senderEmail: "info@handokhelper.de"
    });

    const createMutation = trpc.admin.emailTemplates.create.useMutation({
        onSuccess: () => {
            toast.success("Template created successfully");
            utils.admin.emailTemplates.getAll.invalidate();
            setShowCreateModal(false);
            setFormData({
                templateKey: "",
                language: "en",
                subject: "",
                htmlContent: "",
                textContent: "",
                senderName: "HandokHelper",
                senderEmail: "info@handokhelper.de"
            });
        },
        onError: (error) => {
            toast.error(`Failed to create template: ${error.message}`);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate(formData);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 text-red-700 rounded-md">
                Error loading templates: {error.message}
            </div>
        );
    }

    const formatKey = (key: string) => {
        return key
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    const getLanguageLabel = (lang: string) => {
        switch (lang) {
            case "en":
                return "English";
            case "ko":
                return "Korean";
            case "de":
                return "Deutsch";
            default:
                return lang.toUpperCase();
        }
    };

    const getLanguageFlag = (lang: string) => {
        switch (lang) {
            case "en":
                return "🇬🇧";
            case "ko":
                return "🇰🇷";
            case "de":
                return "🇩🇪";
            default:
                return "🌐";
        }
    };

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Email Templates"
                description="Manage email templates for notifications and automated responses."
            >
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center space-x-2 transition-colors"
                >
                    <Plus size={18} />
                    <span>Add Template</span>
                </button>
            </AdminPageHeader>

            {showCreateModal && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-card rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-foreground">Create New Template</h2>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Template Key
                                </label>
                                <input
                                    type="text"
                                    value={formData.templateKey}
                                    onChange={(e) => setFormData({ ...formData, templateKey: e.target.value })}
                                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                                    placeholder="e.g., form_submission, admin_notification"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Language
                                </label>
                                <select
                                    value={formData.language}
                                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                                    required
                                >
                                    <option value="en">🇬🇧 English</option>
                                    <option value="ko">🇰🇷 Korean</option>
                                    <option value="de">🇩🇪 Deutsch</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                                    placeholder="Email subject line"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Sender Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.senderName}
                                        onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                                        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                                        placeholder="HandokHelper"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Sender Email
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.senderEmail}
                                        onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
                                        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                                        placeholder="info@handokhelper.de"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    HTML Content
                                </label>
                                <textarea
                                    value={formData.htmlContent}
                                    onChange={(e) => setFormData({ ...formData, htmlContent: e.target.value })}
                                    className="w-full h-48 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm bg-background text-foreground"
                                    placeholder="HTML email content"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Plain Text Content (Optional)
                                </label>
                                <textarea
                                    value={formData.textContent}
                                    onChange={(e) => setFormData({ ...formData, textContent: e.target.value })}
                                    className="w-full h-32 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm bg-background text-foreground"
                                    placeholder="Plain text fallback content"
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 border border-border rounded-md text-foreground hover:bg-muted transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createMutation.isPending}
                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {createMutation.isPending ? "Creating..." : "Create Template"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div >
            )
            }

            <div className="bg-card shadow-sm rounded-lg border border-border overflow-hidden">
                <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted">
                        <tr>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                            >
                                Template Name
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                            >
                                Language
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                            >
                                Subject
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                            >
                                Last Updated
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider"
                            >
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-card divide-y divide-border">
                        {templates?.map((template) => (
                            <tr key={`${template.templateKey}-${template.language}`} className="hover:bg-muted/50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                            <Mail size={20} />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-foreground">
                                                {formatKey(template.templateKey)}
                                            </div>
                                            <div className="text-xs text-muted-foreground">{template.templateKey}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center text-sm text-foreground">
                                        <span className="mr-2 text-xl">{getLanguageFlag(template.language)}</span>
                                        {getLanguageLabel(template.language)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-foreground max-w-xs truncate" title={template.subject}>
                                        {template.subject}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Calendar size={16} className="mr-2 text-muted-foreground/70" />
                                        {new Date(template.updatedAt).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link
                                        to={`/emails/${template.templateKey}/${template.language}`}
                                        className="text-primary hover:text-primary/80 inline-flex items-center"
                                    >
                                        <Edit size={16} className="mr-1" />
                                        Edit
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {templates?.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                    No templates found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div >
    );
}
