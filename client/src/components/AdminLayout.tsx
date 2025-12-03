import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Loader2, LayoutDashboard, LogOut, ScrollText, FileText, Settings as SettingsIcon, Moon, Sun, Menu, X, FileStack, Mail, Users, HelpCircle, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { CommandPalette } from "@/components/CommandPalette";

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const [location, setLocation] = useLocation();
    const { theme, toggleTheme } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { data: admin, isLoading, error } = trpc.admin.auth.me.useQuery(undefined, {
        retry: false,
    });

    const logoutMutation = trpc.admin.auth.logout.useMutation({
        onSuccess: () => {
            setLocation("/login");
        },
    });

    useEffect(() => {
        if (!isLoading && (error || !admin)) {
            setLocation("/login");
        }
    }, [isLoading, error, admin, setLocation]);

    // Close mobile menu when route changes
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location]);

    // Close mobile menu on ESC key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && mobileMenuOpen) {
                setMobileMenuOpen(false);
            }
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [mobileMenuOpen]);

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


    // Sidebar content component (reused for both desktop and mobile)
    const SidebarContent = () => (
        <>
            <div className="p-6 border-b">
                <h1 className="text-xl font-bold">Admin Panel</h1>
            </div>
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto pb-32" role="navigation">
                <Link href="/dashboard" className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                    location === "/dashboard" ? "bg-muted text-foreground font-medium" : "text-muted-foreground"
                )}>
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                </Link>
                <Link href="/submissions" className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                    location === "/submissions" ? "bg-muted text-foreground font-medium" : "text-muted-foreground"
                )}>
                    <FileStack className="h-4 w-4" />
                    Submissions
                </Link>
                <Link href="/board" className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                    location === "/board" ? "bg-muted text-foreground font-medium" : "text-muted-foreground"
                )}>
                    <LayoutDashboard className="h-4 w-4" />
                    Board
                </Link>
                <Link href="/invoices" className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                    location.startsWith("/invoices") ? "bg-muted text-foreground font-medium" : "text-muted-foreground"
                )}>
                    <FileText className="h-4 w-4" />
                    Invoices
                </Link>
                <Link href="/activity" className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                    location === "/activity" ? "bg-muted text-foreground font-medium" : "text-muted-foreground"
                )}>
                    <ScrollText className="h-4 w-4" />
                    Activity Log
                </Link>
                <Link href="/emails" className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                    location.startsWith("/emails") ? "bg-muted text-foreground font-medium" : "text-muted-foreground"
                )}>
                    <Mail className="h-4 w-4" />
                    Emails
                </Link>
                <Link href="/faq" className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                    location === "/faq" ? "bg-muted text-foreground font-medium" : "text-muted-foreground"
                )}>
                    <HelpCircle className="h-4 w-4" />
                    FAQ
                </Link>
                <Link href="/settings" className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                    location === "/settings" ? "bg-muted text-foreground font-medium" : "text-muted-foreground"
                )}>
                    <SettingsIcon className="h-4 w-4" />
                    Site Settings
                </Link>
                <Link href="/company-settings" className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                    location === "/company-settings" ? "bg-muted text-foreground font-medium" : "text-muted-foreground"
                )}>
                    <Building2 className="h-4 w-4" />
                    Company Settings
                </Link>
                <Link href="/users" className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                    location === "/users" ? "bg-muted text-foreground font-medium" : "text-muted-foreground"
                )}>
                    <Users className="h-4 w-4" />
                    Team Members
                </Link>
            </nav>
            <div className="fixed bottom-0 left-0 w-64 p-4 border-t space-y-2 bg-white dark:bg-gray-800 hidden md:block">
                {toggleTheme && (
                    <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={toggleTheme}
                    >
                        {theme === "dark" ? (
                            <Sun className="mr-2 h-4 w-4" />
                        ) : (
                            <Moon className="mr-2 h-4 w-4" />
                        )}
                        {theme === "dark" ? "Light Mode" : "Dark Mode"}
                    </Button>
                )}
                <Button
                    variant="outline"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                    onClick={() => logoutMutation.mutate()}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </div>
        </>
    );

    return (
        <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
            <CommandPalette />
            {/* Mobile Overlay - Only visible when menu is open on mobile */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Mobile Sidebar Drawer - Slides in from left on mobile */}
            {mobileMenuOpen && (
                <aside
                    id="mobile-admin-nav"
                    className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-xl z-50 md:hidden flex flex-col animate-in slide-in-from-left duration-300"
                    role="navigation"
                    aria-label="Mobile navigation"
                >
                    {/* Close button for mobile drawer */}
                    <div className="flex items-center justify-between p-4 border-b">
                        <h1 className="text-xl font-bold">Admin Panel</h1>
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="p-2 rounded-md hover:bg-secondary/80 transition-colors"
                            aria-label="Close menu"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto pb-32" role="navigation">
                        <Link href="/dashboard" className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                            location === "/dashboard" ? "bg-muted text-foreground font-medium" : "text-muted-foreground"
                        )}>
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                        </Link>
                        <Link href="/submissions" className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                            location === "/submissions" ? "bg-muted text-foreground font-medium" : "text-muted-foreground"
                        )}>
                            <FileStack className="h-4 w-4" />
                            Submissions
                        </Link>
                        <Link href="/board" className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                            location === "/board" ? "bg-muted text-foreground font-medium" : "text-muted-foreground"
                        )}>
                            <LayoutDashboard className="h-4 w-4" />
                            Board
                        </Link>
                        <Link href="/invoices" className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                            location.startsWith("/invoices") ? "bg-muted text-foreground font-medium" : "text-muted-foreground"
                        )}>
                            <FileText className="h-4 w-4" />
                            Invoices
                        </Link>
                        <Link href="/activity" className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                            location === "/activity" ? "bg-muted text-foreground font-medium" : "text-muted-foreground"
                        )}>
                            <ScrollText className="h-4 w-4" />
                            Activity Log
                        </Link>
                        <Link href="/settings" className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                            location === "/settings" ? "bg-muted text-foreground font-medium" : "text-muted-foreground"
                        )}>
                            <SettingsIcon className="h-4 w-4" />
                            Site Settings
                        </Link>
                        <Link href="/company-settings" className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                            location === "/company-settings" ? "bg-muted text-foreground font-medium" : "text-muted-foreground"
                        )}>
                            <Building2 className="h-4 w-4" />
                            Company Settings
                        </Link>
                        <Link href="/users" className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                            location === "/users" ? "bg-muted text-foreground font-medium" : "text-muted-foreground"
                        )}>
                            <Users className="h-4 w-4" />
                            Team Members
                        </Link>
                    </nav>
                    <div className="absolute bottom-0 left-0 right-0 p-4 border-t space-y-2 bg-white dark:bg-gray-800">
                        {toggleTheme && (
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={toggleTheme}
                            >
                                {theme === "dark" ? (
                                    <Sun className="mr-2 h-4 w-4" />
                                ) : (
                                    <Moon className="mr-2 h-4 w-4" />
                                )}
                                {theme === "dark" ? "Light Mode" : "Dark Mode"}
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                            onClick={() => logoutMutation.mutate()}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </div>
                </aside>
            )}

            {/* Desktop Sidebar - Always visible on desktop (≥768px), hidden on mobile */}
            <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-800 shadow-md flex-col">
                <SidebarContent />
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-y-auto md:ml-64">
                {/* Mobile Header with Hamburger - Only visible on mobile */}
                <div className="md:hidden sticky top-0 z-30 bg-white dark:bg-gray-800 border-b shadow-sm">
                    <div className="flex items-center gap-3 p-4">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 -ml-2 rounded-md hover:bg-secondary/80 transition-colors"
                            aria-label="Toggle navigation menu"
                            aria-expanded={mobileMenuOpen}
                            aria-controls="mobile-admin-nav"
                        >
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                        <h2 className="text-lg font-semibold">Admin Panel</h2>
                    </div>
                </div>

                {/* Page Content */}
                <div className="p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

