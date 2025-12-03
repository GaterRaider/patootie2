import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash2, Eye, EyeOff, GripVertical } from "lucide-react";
import type { FAQItem } from "../../../../drizzle/schema";

interface SortableFAQItemProps {
    item: FAQItem;
    index: number;
    totalItems: number;
    isSelected: boolean;
    onSelect: (checked: boolean) => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    onTogglePublish: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export function SortableFAQItem({
    item,
    index,
    totalItems,
    isSelected,
    onSelect,
    onMoveUp,
    onMoveDown,
    onTogglePublish,
    onEdit,
    onDelete,
}: SortableFAQItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style}>
            <Card className={!item.isPublished ? "opacity-60" : ""}>
                <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                            <div className="mt-1">
                                <Checkbox
                                    checked={isSelected}
                                    onCheckedChange={(checked) => onSelect(checked as boolean)}
                                />
                            </div>
                            {/* Drag Handle */}
                            <div
                                {...attributes}
                                {...listeners}
                                className="cursor-grab active:cursor-grabbing mt-1 p-1 hover:bg-muted rounded"
                                title="Drag to reorder"
                            >
                                <GripVertical className="h-5 w-5 text-muted-foreground" />
                            </div>

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
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex flex-col gap-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onMoveUp}
                                    disabled={index === 0}
                                    title="Move up"
                                >
                                    ↑
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onMoveDown}
                                    disabled={index === totalItems - 1}
                                    title="Move down"
                                >
                                    ↓
                                </Button>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onTogglePublish}
                                title={item.isPublished ? "Unpublish" : "Publish"}
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
                                onClick={onEdit}
                                title="Edit"
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onDelete}
                                title="Delete"
                            >
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div
                        className="text-sm text-muted-foreground prose prose-sm dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: item.answer }}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
