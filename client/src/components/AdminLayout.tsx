import { useEffect } from "react";
import { useLocation, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Loader2, LayoutDashboard, LogOut, ScrollText } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const [location, setLocation] = useLocation();
    const { data: admin, isLoading, error } = trpc.admin.auth.me.useQuery(undefined, {
        retry: false,
    });

    const logoutMutation = trpc.admin.auth.logout.useMutation({
        onSuccess: () => {
            setLocation("/admin/login");
        },
    });

    useEffect(() => {
        if (!isLoading && (error || !admin)) {
            setLocation("/admin/login");
        }
    }, [isLoading, error, admin, setLocation]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!admin) {
        return null; // Will redirect in useEffect
    }

    return (
        <div className="min-h-screen flex bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md flex flex-col">
                <div className="p-6 border-b">
                    <h1 className="text-xl font-bold">Admin Panel</h1>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/admin/dashboard">
                        <a className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                            location === "/admin/dashboard" ? "bg-muted text-primary" : "text-muted-foreground"
                        )}>
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                        </a>
                    </Link>
                    <Link href="/admin/activity">
                        <a className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                            location === "/admin/activity" ? "bg-muted text-primary" : "text-muted-foreground"
                        )}>
                            <ScrollText className="h-4 w-4" />
                            Activity Log
                        </a>
                    </Link>
                </nav>
                <div className="p-4 border-t">
                    <Button
                        variant="outline"
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => logoutMutation.mutate()}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    );
}
