import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import { trpc } from "@/lib/trpc";
import {
    LayoutDashboard,
    FileText,
    Settings,
    LogOut,
    User,
    Search,
    Loader2,
} from "lucide-react";

export function CommandPalette() {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [, setLocation] = useLocation();
    const utils = trpc.useContext();

    // Toggle with Ctrl+K or Cmd+K
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    // Search submissions
    const { data: searchResults, isLoading } = trpc.admin.submissions.getAll.useQuery(
        { search, limit: 5 },
        { enabled: search.length > 1 }
    );

    const runCommand = (command: () => void) => {
        setOpen(false);
        command();
    };

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput
                placeholder="Type a command or search..."
                value={search}
                onValueChange={setSearch}
            />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>

                {search.length === 0 && (
                    <>
                        <CommandGroup heading="Navigation">
                            <CommandItem
                                onSelect={() => runCommand(() => setLocation("/admin/dashboard"))}
                            >
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                <span>Dashboard</span>
                            </CommandItem>
                            <CommandItem
                                onSelect={() => runCommand(() => setLocation("/admin/submissions"))}
                            >
                                <FileText className="mr-2 h-4 w-4" />
                                <span>Submissions</span>
                            </CommandItem>
                            <CommandItem
                                onSelect={() => runCommand(() => setLocation("/admin/invoices"))}
                            >
                                <FileText className="mr-2 h-4 w-4" />
                                <span>Invoices</span>
                            </CommandItem>
                            <CommandItem
                                onSelect={() => runCommand(() => setLocation("/admin/settings"))}
                            >
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </CommandItem>
                        </CommandGroup>
                        <CommandSeparator />
                        <CommandGroup heading="Account">
                            <CommandItem
                                onSelect={() => runCommand(() => setLocation("/admin/profile"))}
                            >
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </CommandItem>
                            <CommandItem
                                onSelect={() => runCommand(() => {
                                    // Trigger logout logic if needed, or just nav
                                    // For now just nav to login as placeholder or actual logout
                                    // Ideally call logout mutation here
                                })}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Logout</span>
                            </CommandItem>
                        </CommandGroup>
                    </>
                )}

                {search.length > 0 && (
                    <CommandGroup heading="Submissions">
                        {isLoading ? (
                            <CommandItem disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                <span>Searching...</span>
                            </CommandItem>
                        ) : (
                            searchResults?.submissions.map((sub) => (
                                <CommandItem
                                    key={sub.id}
                                    onSelect={() =>
                                        runCommand(() => setLocation(`/admin/submissions/${sub.id}`))
                                    }
                                >
                                    <FileText className="mr-2 h-4 w-4" />
                                    <span>
                                        {sub.firstName} {sub.lastName} ({sub.refId})
                                    </span>
                                </CommandItem>
                            ))
                        )}
                    </CommandGroup>
                )}
            </CommandList>
        </CommandDialog>
    );
}
