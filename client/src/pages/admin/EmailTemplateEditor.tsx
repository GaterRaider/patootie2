import React, { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Save, Eye, Code, Info } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function EmailTemplateEditor() {
    const [, params] = useRoute("/admin/emails/:key/:language");
    const [, setLocation] = useLocation();
    const templateKey = params?.key || "";
    const language = params?.language || "";

    const { data: template, isLoading } = trpc.admin.emailTemplates.getOne.useQuery(
        { key: templateKey, language },
        { enabled: !!templateKey && !!language }
    );

    const { data: placeholders } = trpc.admin.emailTemplates.getPlaceholders.useQuery(
        { key: templateKey },
        { enabled: !!templateKey }
    );

    const updateMutation = trpc.admin.emailTemplates.update.useMutation({
        onSuccess: () => {
            toast.success("Template updated successfully");
        },
        onError: (error: Error) => {
            toast.error(`Failed to update template: ${error.message}`);
        },
    });

    const [subject, setSubject] = useState("");
    const [htmlContent, setHtmlContent] = useState("");
    const [textContent, setTextContent] = useState("");
    const [senderName, setSenderName] = useState("");
    const [senderEmail, setSenderEmail] = useState("");
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        if (template) {
            setSubject(template.subject);
            setHtmlContent(template.htmlContent);
            setTextContent(template.textContent || "");
            setSenderName(template.senderName || "");
            setSenderEmail(template.senderEmail || "");
        }
    }, [template]);

    const handleSave = async () => {
        if (!template) return;

        await updateMutation.mutateAsync({
            id: template.id,
            subject,
            htmlContent,
            textContent,
            senderName: senderName || undefined,
            senderEmail: senderEmail || undefined,
        });
    };

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
            default:
                return lang.toUpperCase();
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!template) {
        return (
            <div className="p-4 bg-red-50 text-red-700 rounded-md">
                Template not found
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link
                        to="/admin/emails"
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {formatKey(templateKey)} - {getLanguageLabel(language)}
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Last updated: {new Date(template.updatedAt).toLocaleString()}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className={`px-4 py-2 rounded-md flex items-center space-x-2 transition-colors ${showPreview
                            ? "bg-indigo-100 text-indigo-700"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        {showPreview ? <Code size={18} /> : <Eye size={18} />}
                        <span>{showPreview ? "Edit" : "Preview"}</span>
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={updateMutation.isPending}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
                    >
                        <Save size={18} />
                        <span>{updateMutation.isPending ? "Saving..." : "Save Changes"}</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {!showPreview ? (
                        <>
                            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 space-y-4">
                                <h2 className="text-lg font-semibold text-gray-900">Email Settings</h2>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Email subject line"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Sender Name (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            value={senderName}
                                            onChange={(e) => setSenderName(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="e.g., HandokHelper Team"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Sender Email (Optional)
                                        </label>
                                        <input
                                            type="email"
                                            value={senderEmail}
                                            onChange={(e) => setSenderEmail(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="e.g., noreply@handokhelper.de"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 space-y-4">
                                <h2 className="text-lg font-semibold text-gray-900">HTML Content</h2>
                                <textarea
                                    value={htmlContent}
                                    onChange={(e) => setHtmlContent(e.target.value)}
                                    className="w-full h-96 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                                    placeholder="HTML email content"
                                />
                            </div>

                            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 space-y-4">
                                <h2 className="text-lg font-semibold text-gray-900">Plain Text Content (Optional)</h2>
                                <textarea
                                    value={textContent}
                                    onChange={(e) => setTextContent(e.target.value)}
                                    className="w-full h-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                                    placeholder="Plain text fallback content"
                                />
                            </div>
                        </>
                    ) : (
                        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview</h2>
                            <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
                                <div className="mb-4 pb-4 border-b border-gray-300">
                                    <div className="text-sm text-gray-600 mb-1">
                                        <strong>From:</strong> {senderName || "Default Sender"} &lt;{senderEmail || "default@handokhelper.de"}&gt;
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        <strong>Subject:</strong> {subject}
                                    </div>
                                </div>
                                <iframe
                                    srcDoc={htmlContent}
                                    className="w-full h-[600px] border-0 bg-white"
                                    title="Email Preview"
                                    sandbox="allow-same-origin"
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                            <Info size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-blue-800">
                                <p className="font-semibold mb-2">Available Placeholders</p>
                                <p className="mb-3">Use these placeholders in your template. They will be replaced with actual values when the email is sent.</p>
                                {placeholders && placeholders.length > 0 ? (
                                    <div className="space-y-1">
                                        {placeholders.map((placeholder: string) => (
                                            <code
                                                key={placeholder}
                                                className="block bg-blue-100 px-2 py-1 rounded text-xs font-mono cursor-pointer hover:bg-blue-200 transition-colors"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(placeholder);
                                                    toast.success("Copied to clipboard");
                                                }}
                                                title="Click to copy"
                                            >
                                                {placeholder}
                                            </code>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs">No placeholders available for this template.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                            <Info size={20} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-yellow-800">
                                <p className="font-semibold mb-2">Important Notes</p>
                                <ul className="list-disc list-inside space-y-1 text-xs">
                                    <li>Changes are saved immediately to the database</li>
                                    <li>Test your changes by triggering the corresponding action</li>
                                    <li>HTML emails should be tested across different email clients</li>
                                    <li>Always provide a plain text fallback for accessibility</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
