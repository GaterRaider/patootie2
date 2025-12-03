import { useState, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Eye, EyeOff, GripVertical, Download, Upload } from "lucide-react";
import { toast } from "sonner";
import { FAQItemForm } from "@/components/admin/FAQItemForm";
import { SortableFAQItem } from "@/components/admin/SortableFAQItem";
import type { FAQItem } from "../../../../drizzle/schema";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function FAQManager() {
    const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'ko' | 'de'>('en');
    const [editingItem, setEditingItem] = useState<FAQItem | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleSelect = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedItems([...selectedItems, id]);
        } else {
            setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedItems(filteredFAQ.map((item) => item.id));
        } else {
            setSelectedItems([]);
        }
    };

    const handleBulkPublish = async (publish: boolean) => {
        if (!confirm(`Are you sure you want to ${publish ? 'publish' : 'unpublish'} ${selectedItems.length} items?`)) return;

        // Execute sequentially to avoid race conditions or server overload
        for (const id of selectedItems) {
            const item = filteredFAQ.find(i => i.id === id);
            if (item && item.isPublished !== publish) {
                await togglePublishMutation.mutateAsync({ id });
            }
        }
        setSelectedItems([]);
        toast.success(`Bulk ${publish ? 'published' : 'unpublished'} successfully`);
    };

    const handleBulkDelete = async () => {
        if (!confirm(`Are you sure you want to delete ${selectedItems.length} items? This cannot be undone.`)) return;

        for (const id of selectedItems) {
            await deleteMutation.mutateAsync({ id });
        }
        setSelectedItems([]);
        toast.success("Bulk deleted successfully");
    };

    const handleExport = () => {
        if (filteredFAQ.length === 0) {
            toast.error("No items to export");
            return;
        }

        const headers = ["Question", "Answer", "Published"];
        const csvContent = [
            headers.join(","),
            ...filteredFAQ.map(item => {
                const question = `"${item.question.replace(/"/g, '""')}"`;
                const answer = `"${item.answer.replace(/"/g, '""')}"`;
                return `${question},${answer},${item.isPublished}`;
            })
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `faq_${selectedLanguage}_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e.target?.result as string;
            if (!text) return;

            const lines = text.split("\n");
            // Skip header
            const dataLines = lines.slice(1).filter(line => line.trim());

            let successCount = 0;
            let failCount = 0;

            for (const line of dataLines) {
                try {
                    // Simple CSV parsing (handles quoted strings)
                    const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
                    if (!matches || matches.length < 2) continue;

                    const question = matches[0].replace(/^"|"$/g, '').replace(/""/g, '"');
                    const answer = matches[1].replace(/^"|"$/g, '').replace(/""/g, '"');
                    const isPublished = matches[2] === 'true';

                    await createMutation.mutateAsync({
                        language: selectedLanguage,
                        question,
                        answer,
                        isPublished
                    });
                    successCount++;
                } catch (error) {
                    failCount++;
                }
            }

            toast.success(`Imported ${successCount} items` + (failCount > 0 ? `, ${failCount} failed` : ""));
            // Reset file input
            event.target.value = '';
        };
        reader.readAsText(file);
    };

    // Drag and drop sensors
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = filteredFAQ.findIndex((item) => item.id === active.id);
            const newIndex = filteredFAQ.findIndex((item) => item.id === over.id);

            const newOrder = arrayMove(filteredFAQ, oldIndex, newIndex);
            reorderMutation.mutate({
                language: selectedLanguage,
                itemIds: newOrder.map((item) => item.id),
            });
        }
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
                <div className="flex gap-2">
                    <input
                        type="file"
                        accept=".csv"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleImport}
                    />
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="h-4 w-4 mr-2" />
                        Import CSV
                    </Button>
                    <Button variant="outline" onClick={handleExport}>
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                    </Button>
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
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <div className="flex items-center justify-between mb-4 p-4 bg-muted/30 rounded-lg border">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        checked={filteredFAQ.length > 0 && selectedItems.length === filteredFAQ.length}
                                        onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                                        id="select-all"
                                    />
                                    <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
                                        Select All ({selectedItems.length} selected)
                                    </label>
                                </div>
                                {selectedItems.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <Button size="sm" variant="outline" onClick={() => handleBulkPublish(true)}>
                                            <Eye className="h-4 w-4 mr-2" />
                                            Publish
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={() => handleBulkPublish(false)}>
                                            <EyeOff className="h-4 w-4 mr-2" />
                                            Unpublish
                                        </Button>
                                        <Button size="sm" variant="destructive" onClick={handleBulkDelete}>
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <SortableContext
                                items={filteredFAQ.map(item => item.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-4">
                                    {filteredFAQ.map((item, index) => (
                                        <SortableFAQItem
                                            key={item.id}
                                            item={item}
                                            index={index}
                                            totalItems={filteredFAQ.length}
                                            isSelected={selectedItems.includes(item.id)}
                                            onSelect={(checked) => handleSelect(item.id, checked)}
                                            onMoveUp={() => handleMoveUp(index)}
                                            onMoveDown={() => handleMoveDown(index)}
                                            onTogglePublish={() => handleTogglePublish(item.id)}
                                            onEdit={() => {
                                                setEditingItem(item);
                                                setIsFormOpen(true);
                                            }}
                                            onDelete={() => handleDelete(item.id)}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
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
