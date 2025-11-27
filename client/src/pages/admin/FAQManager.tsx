import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Eye, EyeOff, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { FAQItemForm } from "@/components/admin/FAQItemForm";
import type { FAQItem } from "../../../drizzle/schema";

export default function FAQManager() {
    const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'ko' | 'de'>('en');
    const [editingItem, setEditingItem] = useState<FAQItem | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const utils = trpc.useUtils();
    const { data: allFAQ, isLoading } = trpc.faq.admin.getAll.useQuery();

    const createMutation = trpc.faq.admin.create.useMutation({
        onSuccess: () => {
            toast.success("FAQ item created successfully");
            utils.faq.admin.getAll.invalidate();
            setIsFormOpen(false);
        },
        onError: (error) => {
            toast.error(`Failed to create FAQ: ${error.message}`);
        },
    });

    const updateMutation = trpc.faq.admin.update.useMutation({
        onSuccess: () => {
            toast.success("FAQ item updated successfully");
            utils.faq.admin.getAll.invalidate();
            setEditingItem(null);
            setIsFormOpen(false);
        },
        onError: (error) => {
            toast.error(`Failed to update FAQ: ${error.message}`);
        },
    });

    const deleteMutation = trpc.faq.admin.delete.useMutation({
        onSuccess: () => {
            toast.success("FAQ item deleted successfully");
            utils.faq.admin.getAll.invalidate();
        },
        onError: (error) => {
            toast.error(`Failed to delete FAQ: ${error.message}`);
        },
    });

    const togglePublishMutation = trpc.faq.admin.togglePublish.useMutation({
        onSuccess: (data) => {
            toast.success(data.isPublished ? "FAQ published" : "FAQ unpublished");
            utils.faq.admin.getAll.invalidate();
        },
        onError: (error) => {
            toast.error(`Failed to toggle publish: ${error.message}`);
        },
    });

    const reorderMutation = trpc.faq.admin.reorder.useMutation({
        onSuccess: () => {
            toast.success("FAQ items reordered");
            utils.faq.admin.getAll.invalidate();
        },
        onError: (error) => {
            toast.error(`Failed to reorder: ${error.message}`);
        },
    });

    const filteredFAQ = allFAQ?.filter((item) => item.language === selectedLanguage) || [];

    const handleCreate = (data: { question: string; answer: string; isPublished?: boolean }) => {
        createMutation.mutate({
            language: selectedLanguage,
            ...data,
        });
    };

    const handleUpdate = (data: { question: string; answer: string; isPublished?: boolean }) => {
        if (!editingItem) return;
        updateMutation.mutate({
            id: editingItem.id,
            ...data,
        });
    };

    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this FAQ item?")) {
            deleteMutation.mutate({ id });
        }
    };

    const handleTogglePublish = (id: number) => {
        togglePublishMutation.mutate({ id });
    };

    const handleMoveUp = (index: number) => {
        if (index === 0) return;
        const newOrder = [...filteredFAQ];
        [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
        reorderMutation.mutate({
            language: selectedLanguage,
            itemIds: newOrder.map((item) => item.id),
        });
    };

    const handleMoveDown = (index: number) => {
        if (index === filteredFAQ.length - 1) return;
        const newOrder = [...filteredFAQ];
        [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
        reorderMutation.mutate({
            language: selectedLanguage,
            itemIds: newOrder.map((item) => item.id),
        });
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">FAQ Management</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage frequently asked questions for your website
                    </p>
                </div>
                <Button
                    onClick={() => {
                        setEditingItem(null);
                        setIsFormOpen(true);
                    }}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add FAQ
                </Button>
            </div>

            <Tabs value={selectedLanguage} onValueChange={(value) => setSelectedLanguage(value as 'en' | 'ko' | 'de')}>
                <TabsList className="mb-6">
                    <TabsTrigger value="en">English</TabsTrigger>
                    <TabsTrigger value="ko">한국어</TabsTrigger>
                    <TabsTrigger value="de">Deutsch</TabsTrigger>
                </TabsList>

                <TabsContent value={selectedLanguage}>
                    {isLoading ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">Loading FAQ items...</p>
                        </div>
                    ) : filteredFAQ.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <p className="text-muted-foreground mb-4">
                                    No FAQ items for {selectedLanguage.toUpperCase()} yet
                                </p>
                                <Button onClick={() => setIsFormOpen(true)}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create First FAQ
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {filteredFAQ.map((item, index) => (
                                <Card key={item.id} className={!item.isPublished ? "opacity-60" : ""}>
                                    <CardHeader>
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    {!item.isPublished && (
                                                        <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                                                            Draft
                                                        </span>
                                                    )}
                                                    <span className="text-xs text-muted-foreground">
                                                        Order: {index + 1}
                                                    </span>
                                                </div>
                                                <CardTitle className="text-lg">{item.question}</CardTitle>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex flex-col gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleMoveUp(index)}
                                                        disabled={index === 0}
                                                    >
                                                        ↑
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleMoveDown(index)}
                                                        disabled={index === filteredFAQ.length - 1}
                                                    >
                                                        ↓
                                                    </Button>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleTogglePublish(item.id)}
                                                >
                                                    {item.isPublished ? (
                                                        <Eye className="h-4 w-4" />
                                                    ) : (
                                                        <EyeOff className="h-4 w-4" />
                                                    )}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        setEditingItem(item);
                                                        setIsFormOpen(true);
                                                    }}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(item.id)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                            {item.answer}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {isFormOpen && (
                <FAQItemForm
                    item={editingItem}
                    onSubmit={editingItem ? handleUpdate : handleCreate}
                    onCancel={() => {
                        setIsFormOpen(false);
                        setEditingItem(null);
                    }}
                    isSubmitting={createMutation.isPending || updateMutation.isPending}
                />
            )}
        </div>
    );
}
