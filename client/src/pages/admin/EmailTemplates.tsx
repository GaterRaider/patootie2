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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Create New Template</h2>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Template Key
                                </label>
                                <input
                                    type="text"
                                    value={formData.templateKey}
                                    onChange={(e) => setFormData({ ...formData, templateKey: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="e.g., form_submission, admin_notification"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Language
                                </label>
                                <select
                                    value={formData.language}
                                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                >
                                    <option value="en">🇬🇧 English</option>
                                    <option value="ko">🇰🇷 Korean</option>
                                    <option value="de">🇩🇪 Deutsch</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Email subject line"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Sender Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.senderName}
                                        onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="HandokHelper"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Sender Email
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.senderEmail}
                                        onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="info@handokhelper.de"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    HTML Content
                                </label>
                                <textarea
                                    value={formData.htmlContent}
                                    onChange={(e) => setFormData({ ...formData, htmlContent: e.target.value })}
                                    className="w-full h-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                                    placeholder="HTML email content"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Plain Text Content (Optional)
                                </label>
                                <textarea
                                    value={formData.textContent}
                                    onChange={(e) => setFormData({ ...formData, textContent: e.target.value })}
                                    className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                                    placeholder="Plain text fallback content"
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createMutation.isPending}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {createMutation.isPending ? "Creating..." : "Create Template"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Template Name
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Language
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Subject
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Last Updated
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {templates?.map((template) => (
                            <tr key={`${template.templateKey}-${template.language}`} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                                            <Mail size={20} />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {formatKey(template.templateKey)}
                                            </div>
                                            <div className="text-xs text-gray-500">{template.templateKey}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center text-sm text-gray-900">
                                        <span className="mr-2 text-xl">{getLanguageFlag(template.language)}</span>
                                        {getLanguageLabel(template.language)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900 max-w-xs truncate" title={template.subject}>
                                        {template.subject}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Calendar size={16} className="mr-2 text-gray-400" />
                                        {new Date(template.updatedAt).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link
                                        to={`/emails/${template.templateKey}/${template.language}`}
                                        className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                                    >
                                        <Edit size={16} className="mr-1" />
                                        Edit
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {templates?.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    No templates found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
