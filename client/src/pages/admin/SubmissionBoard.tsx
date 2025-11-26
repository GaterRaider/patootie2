import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
    defaultDropAnimationSideEffects,
    DropAnimation,
    useDroppable,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Loader2, Calendar, User, Mail, Phone, MapPin, MessageSquare, Layers, LayoutGrid } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { toast } from "sonner";
import { Link } from "wouter";

type Submission = {
    id: number;
    refId: string;
    firstName: string;
    lastName: string;
    email: string;
    service: string;
    status: string;
    createdAt: string | Date;
};

const COLUMNS = [
    { id: "new", title: "New" },
    { id: "contacted", title: "Contacted" },
    { id: "processing", title: "Processing" },
    { id: "completed", title: "Completed" },
    { id: "no-reply", title: "No Reply" },
    { id: "cancelled", title: "Cancelled" },
];

const statusColors: Record<string, string> = {
    new: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    contacted: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    processing: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    "no-reply": "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    archived: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
};

interface SortableItemProps {
    submission: Submission;
}

function SortableItem({ submission }: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: submission.id,
        data: {
            type: "Submission",
            submission,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-3 touch-none">
            <Card className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow">
                <CardContent className="p-3 space-y-2">
                    <div className="flex justify-between items-start">
                        <Badge variant="outline" className="text-[10px] px-1 py-0 h-5">
                            {submission.refId}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                            {format(new Date(submission.createdAt), "MMM d")}
                        </span>
                    </div>
                    <div>
                        <h4 className="font-semibold text-sm truncate">
                            {submission.firstName} {submission.lastName}
                        </h4>
                        <p className="text-xs text-muted-foreground truncate">{submission.service}</p>
                    </div>
                    <div className="pt-1 flex justify-end">
                        <Link href={`/admin/submissions/${submission.id}`}>
                            <a className="text-xs text-primary hover:underline" onClick={(e) => e.stopPropagation()}>
                                View Details
                            </a>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function DroppableColumn({ id, children }: { id: string; children: React.ReactNode }) {
    const { setNodeRef } = useDroppable({
        id: id,
    });

    return (
        <div ref={setNodeRef} className="min-h-[150px] h-full">
            {children}
        </div>
    );
}

export default function SubmissionBoard() {
    const utils = trpc.useContext();
    const { data, isLoading } = trpc.admin.submissions.getAll.useQuery({ limit: 100 });
    const [activeId, setActiveId] = useState<number | null>(null);
    const [activeSubmission, setActiveSubmission] = useState<Submission | null>(null);
    const [groupByService, setGroupByService] = useState(false);

    const updateStatusMutation = trpc.admin.submissions.updateStatus.useMutation({
        onSuccess: () => {
            utils.admin.submissions.getAll.invalidate();
            toast.success("Status updated");
        },
        onError: (error) => {
            toast.error(`Failed to update status: ${error.message}`);
            utils.admin.submissions.getAll.invalidate();
        },
    });

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Group submissions
    const groupedData = useMemo(() => {
        if (!data?.submissions) return { default: {} };

        if (!groupByService) {
            const cols: Record<string, Submission[]> = {};
            COLUMNS.forEach((col) => { cols[col.id] = []; });

            data.submissions.forEach((sub: any) => {
                const status = sub.status || "new";
                if (cols[status]) cols[status].push(sub);
                else {
                    if (!cols["new"]) cols["new"] = [];
                    cols["new"].push(sub);
                }
            });
            return { default: cols };
        } else {
            // Group by Service -> Status
            const services: Record<string, Record<string, Submission[]>> = {};

            data.submissions.forEach((sub: any) => {
                const service = sub.service || "Other";
                const status = sub.status || "new";

                if (!services[service]) {
                    services[service] = {};
                    COLUMNS.forEach((col) => { services[service][col.id] = []; });
                }

                if (services[service][status]) {
                    services[service][status].push(sub);
                } else {
                    // Fallback for unknown status
                    if (!services[service]["new"]) services[service]["new"] = [];
                    services[service]["new"].push(sub);
                }
            });

            return services;
        }
    }, [data, groupByService]);

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        setActiveId(active.id as number);
        const sub = data?.submissions.find((s: any) => s.id === active.id);
        if (sub) setActiveSubmission(sub);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);
        setActiveSubmission(null);

        if (!over) return;

        const activeId = active.id as number;
        const overId = over.id; // Could be number (submission ID), "status", or "service::status"

        // Find the submission
        const submission = data?.submissions.find((s: any) => s.id === activeId);
        if (!submission) return;

        let newStatus = "";

        // Convert overId to string for parsing
        const overIdStr = String(overId);

        // Parse overId to get status
        if (overIdStr.includes("::")) {
            // It's a swimlane column: "Service Name::status"
            const parts = overIdStr.split("::");
            newStatus = parts[parts.length - 1];
        } else {
            // It's a standard column or another item
            if (COLUMNS.some((col) => col.id === overIdStr)) {
                newStatus = overIdStr;
            } else {
                // Dropped on another item (overId is a number)
                const overSubmission = data?.submissions.find((s: any) => s.id === overId);
                if (overSubmission) {
                    newStatus = overSubmission.status;
                }
            }
        }

        if (newStatus && newStatus !== submission.status) {
            updateStatusMutation.mutate({
                id: activeId,
                status: newStatus,
            });
        }
    };

    const dropAnimation: DropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: { opacity: "0.5" },
            },
        }),
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Submission Board</h1>
                    <p className="text-muted-foreground">
                        Manage submission workflow
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => setGroupByService(!groupByService)}
                    className="gap-2"
                >
                    {groupByService ? <LayoutGrid className="h-4 w-4" /> : <Layers className="h-4 w-4" />}
                    {groupByService ? "Default View" : "Group by Service"}
                </Button>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="flex-1 overflow-x-auto pb-4">
                    <div className="min-w-[1200px] h-full space-y-8">
                        {Object.entries(groupedData).map(([groupName, columns]) => (
                            <div key={groupName} className="space-y-2">
                                {groupByService && (
                                    <h3 className="font-semibold text-lg px-1 flex items-center gap-2">
                                        <Badge variant="secondary" className="rounded-sm">
                                            {groupName}
                                        </Badge>
                                    </h3>
                                )}
                                <div className="flex gap-4">
                                    {COLUMNS.map((col) => {
                                        // Generate unique ID for the column droppable area
                                        // If grouping, use "Service::Status", else just "Status"
                                        const columnId = groupByService ? `${groupName}::${col.id}` : col.id;
                                        const items = columns[col.id] || [];

                                        return (
                                            <div key={columnId} className="flex-1 min-w-[280px] flex flex-col bg-muted/30 rounded-lg border">
                                                <div className={`p-3 border-b font-medium flex justify-between items-center ${statusColors[col.id] || "bg-gray-100"}`}>
                                                    <span>{col.title}</span>
                                                    <Badge variant="secondary" className="bg-white/50 text-inherit border-0">
                                                        {items.length}
                                                    </Badge>
                                                </div>
                                                <div className="flex-1 p-2">
                                                    <SortableContext
                                                        id={columnId}
                                                        items={items.map((s) => s.id)}
                                                        strategy={verticalListSortingStrategy}
                                                    >
                                                        <ScrollArea className="h-full">
                                                            <DroppableColumn id={columnId}>
                                                                {items.map((submission) => (
                                                                    <SortableItem key={submission.id} submission={submission} />
                                                                ))}
                                                            </DroppableColumn>
                                                        </ScrollArea>
                                                    </SortableContext>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <DragOverlay dropAnimation={dropAnimation}>
                    {activeSubmission ? (
                        <Card className="cursor-grabbing shadow-xl w-[280px]">
                            <CardContent className="p-3 space-y-2">
                                <div className="flex justify-between items-start">
                                    <Badge variant="outline" className="text-[10px] px-1 py-0 h-5">
                                        {activeSubmission.refId}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                        {format(new Date(activeSubmission.createdAt), "MMM d")}
                                    </span>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm truncate">
                                        {activeSubmission.firstName} {activeSubmission.lastName}
                                    </h4>
                                    <p className="text-xs text-muted-foreground truncate">{activeSubmission.service}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}
