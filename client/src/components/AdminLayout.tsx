import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Loader2, LayoutDashboard, LogOut, ScrollText, FileText, Settings as SettingsIcon, Moon, Sun, Menu, X, FileStack, Mail, Users, HelpCircle, Building2, User } from "lucide-react";
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
            <div className="p-6 flex items-center gap-3">
                <img
                    src="/images/HandokHelperLogoOnly.webp"
                    alt="HandokHelper Logo"
                    className="h-10 w-10 flex-shrink-0 object-contain"
                />
                <div className="flex flex-col">
                    <span className="font-bold text-base leading-tight">HandokHelper</span>
                    <span className="text-xs text-muted-foreground">Admin Panel</span>
                </div>
            </div>
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto pb-32" role="navigation">
                <Link href="/dashboard" className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 transition-all text-sm font-medium",
                    location === "/dashboard"
                        ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}>
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                </Link>
                <Link href="/submissions" className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 transition-all text-sm font-medium",
                    location === "/submissions"
                        ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}>
                    <FileStack className="h-4 w-4" />
                    Submissions
                </Link>
                <Link href="/board" className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 transition-all text-sm font-medium",
                    location === "/board"
                        ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}>
                    <LayoutDashboard className="h-4 w-4" />
                    Board
                </Link>
                <Link href="/invoices" className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 transition-all text-sm font-medium",
                    location.startsWith("/invoices")
                        ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}>
                    <FileText className="h-4 w-4" />
                    Invoices
                </Link>
                <Link href="/emails" className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 transition-all text-sm font-medium",
                    location.startsWith("/emails")
                        ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}>
                    <Mail className="h-4 w-4" />
                    Emails
                </Link>
                <Link href="/faq" className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 transition-all text-sm font-medium",
                    location === "/faq"
                        ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}>
                    <HelpCircle className="h-4 w-4" />
                    FAQ
                </Link>
                <Link href="/activity" className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 transition-all text-sm font-medium",
                    location === "/activity"
                        ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}>
                    <ScrollText className="h-4 w-4" />
                    Activity Log
                </Link>

                <div className="my-4 border-t border-border/50 mx-2" />

                <Link href="/settings" className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 transition-all text-sm font-medium",
                    location === "/settings"
                        ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}>
                    <SettingsIcon className="h-4 w-4" />
                    Site Settings
                </Link>
                <Link href="/company-settings" className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 transition-all text-sm font-medium",
                    location === "/company-settings"
                        ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}>
                    <Building2 className="h-4 w-4" />
                    Company Settings
                </Link>
                <Link href="/users" className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 transition-all text-sm font-medium",
                    location === "/users"
                        ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}>
                    <Users className="h-4 w-4" />
                    Team Members
                </Link>
                <Link href="/clients" className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 transition-all text-sm font-medium",
                    location.startsWith("/clients")
                        ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}>
                    <User className="h-4 w-4" />
                    Users
                </Link>
            </nav>
            <div className="fixed bottom-0 left-0 w-64 p-4 border-t space-y-2 bg-white dark:bg-[#1C252D] hidden md:block border-border">
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
        <div className="h-screen overflow-hidden flex bg-gray-100 dark:bg-[#101922]">
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
                    className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-[#1C252D] shadow-xl z-50 md:hidden flex flex-col animate-in slide-in-from-left duration-300"
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
                        <Link href="/clients" className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                            location.startsWith("/clients") ? "bg-muted text-foreground font-medium" : "text-muted-foreground"
                        )}>
                            <Users className="h-4 w-4" />
                            Users
                        </Link>
                    </nav>
                    <div className="absolute bottom-0 left-0 right-0 p-4 border-t space-y-2 bg-white dark:bg-[#1C252D]">
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
            <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-white dark:bg-[#1C252D] shadow-md flex-col">
                <SidebarContent />
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-y-auto md:ml-64">
                {/* Mobile Header with Hamburger - Only visible on mobile */}
                <div className="md:hidden sticky top-0 z-30 bg-white dark:bg-[#1C252D] border-b shadow-sm">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
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
                        <div className="flex items-center gap-2">
                            {toggleTheme && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={toggleTheme}
                                    title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                                >
                                    {theme === "dark" ? (
                                        <Sun className="h-5 w-5" />
                                    ) : (
                                        <Moon className="h-5 w-5" />
                                    )}
                                </Button>
                            )}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => logoutMutation.mutate()}
                                title="Logout"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                            >
                                <LogOut className="h-5 w-5" />
                            </Button>
                        </div>
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

