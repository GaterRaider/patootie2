import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Loader2, Search, Users as UsersIcon, Mail, Calendar, FileText, X } from "lucide-react";
import { format } from "date-fns";
import { useLocation } from "wouter";

export default function ClientUsers() {
    const [, setLocation] = useLocation();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [sortBy, setSortBy] = useState("lastSubmission");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    const { data, isLoading } = trpc.clientUsers.getAll.useQuery({
        page,
        limit: 20,
        search: debouncedSearch || undefined,
        sortBy,
        sortOrder,
    });

    const handleSort = (column: string) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setSortOrder("desc");
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    const totalPages = data ? Math.ceil(data.total / 20) : 0;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Users</h1>
                    <p className="text-muted-foreground">
                        Manage client relationships and view their complete history
                    </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <UsersIcon className="h-4 w-4" />
                    <span>{data?.total || 0} total clients</span>
                </div>
            </div>

            {/* Search */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                        placeholder="Search by email or name..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        className="pl-9 pr-9"
                    />
                    {search && (
                        <button
                            onClick={() => {
                                setSearch("");
                                setPage(1);
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Clear search"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                <button
                                    onClick={() => handleSort("email")}
                                    className="flex items-center gap-1 hover:text-foreground"
                                >
                                    Email
                                    {sortBy === "email" && (
                                        <span className="text-xs">{sortOrder === "asc" ? "↑" : "↓"}</span>
                                    )}
                                </button>
                            </TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead className="text-center">
                                <button
                                    onClick={() => handleSort("submissionCount")}
                                    className="flex items-center gap-1 hover:text-foreground mx-auto"
                                >
                                    Submissions
                                    {sortBy === "submissionCount" && (
                                        <span className="text-xs">{sortOrder === "asc" ? "↑" : "↓"}</span>
                                    )}
                                </button>
                            </TableHead>
                            <TableHead>
                                <button
                                    onClick={() => handleSort("lastSubmission")}
                                    className="flex items-center gap-1 hover:text-foreground"
                                >
                                    Last Contact
                                    {sortBy === "lastSubmission" && (
                                        <span className="text-xs">{sortOrder === "asc" ? "↑" : "↓"}</span>
                                    )}
                                </button>
                            </TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    {search ? "No clients found matching your search" : "No clients yet"}
                                </TableCell>
                            </TableRow>
                        ) : (
                            data?.users.map((user) => (
                                <TableRow key={user.email} className="cursor-pointer hover:bg-muted/50">
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            {user.email}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {user.firstName} {user.lastName}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">{user.submissionCount}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            {format(new Date(user.lastSubmission), "MMM d, yyyy")}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.latestStatus === "new"
                                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                                : user.latestStatus === "in-progress"
                                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                                    : user.latestStatus === "completed"
                                                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                                        : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                                                }`}
                                        >
                                            {user.latestStatus}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setLocation(`/clients/${encodeURIComponent(user.email)}`)}
                                        >
                                            View Profile
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Page {page} of {totalPages}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(page - 1)}
                            disabled={page === 1}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(page + 1)}
                            disabled={page === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
