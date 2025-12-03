import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper,
    VisibilityState,
    SortingState,
    OnChangeFn,
} from "@tanstack/react-table";
import { useLocation } from "wouter";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ArrowUpDown, MoreHorizontal, Mail, Tag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SubmissionActions } from "./admin/SubmissionActions";

export interface Submission {
    id: number;
    refId: string;
    firstName: string;
    lastName: string;
    email: string;
    service: string;
    status: string;
    createdAt: string | Date;
    country: string;
    tags: string[] | null;
}

const columnHelper = createColumnHelper<Submission>();

import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

export const columns = [
    columnHelper.display({
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    }),
    columnHelper.accessor("refId", {
        header: "Ref ID",
        cell: (info) => <span className="font-mono text-xs">{info.getValue()}</span>,
    }),
    columnHelper.accessor("firstName", {
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: (info) => `${info.row.original.firstName} ${info.row.original.lastName}`,
    }),
    columnHelper.accessor("email", {
        header: "Email",
    }),
    columnHelper.accessor("service", {
        header: "Service",
    }),
    columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => {
            const status = info.getValue();
            const label = status.charAt(0).toUpperCase() + status.slice(1);
            let className = "";

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
        },
    }),
    columnHelper.accessor("country", {
        header: "Country",
    }),
    columnHelper.accessor("tags", {
        header: "Tags",
        cell: (info) => {
            const tags = info.getValue() as string[] | null;
            if (!tags || tags.length === 0) return null;
            return (
                <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-[10px] px-1 py-0 h-5">
                            {tag}
                        </Badge>
                    ))}
                </div>
            );
        },
    }),
    columnHelper.accessor("createdAt", {
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: (info) => format(new Date(info.getValue()), "MMM d, yyyy"),
    }),
    columnHelper.display({
        id: "actions",
        cell: ({ row }) => <SubmissionActions submission={row.original} />,
    }),
];

interface SubmissionsTableProps {
    data: Submission[];
    sorting: SortingState;
    onSortingChange: OnChangeFn<SortingState>;
    rowSelection: Record<string, boolean>;
    onRowSelectionChange: OnChangeFn<Record<string, boolean>>;
    columnVisibility?: VisibilityState;
    onColumnVisibilityChange?: OnChangeFn<VisibilityState>;
}

export default function SubmissionsTable({
    data,
    sorting,
    onSortingChange,
    rowSelection,
    onRowSelectionChange,
    columnVisibility,
    onColumnVisibilityChange,
}: SubmissionsTableProps) {
    const [, setLocation] = useLocation();

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getRowId: (row) => row.id.toString(),
        onSortingChange,
        onRowSelectionChange,
        onColumnVisibilityChange,
        enableRowSelection: true,
        state: {
            sorting,
            rowSelection,
            columnVisibility,
        },
        manualSorting: true, // Server-side sorting
    });

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                                className="cursor-pointer hover:bg-muted/50"
                                onClick={(e) => {
                                    // Don't navigate if clicking on checkbox or actions
                                    const target = e.target as HTMLElement;
                                    if (target.closest('button') || target.closest('[role="checkbox"]') || target.closest('[role="menuitem"]')) {
                                        return;
                                    }
                                    setLocation(`/submissions/${row.original.id}`);
                                }}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
