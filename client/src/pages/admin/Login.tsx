import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { User, Lock } from "lucide-react";

export default function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [keepMeLoggedIn, setKeepMeLoggedIn] = useState(false);
    const [, setLocation] = useLocation();
    const utils = trpc.useUtils();

    const loginMutation = trpc.admin.auth.login.useMutation({
        onSuccess: async () => {
            toast.success("Logged in successfully");
            // Invalidate the auth.me query to refresh auth state
            await utils.admin.auth.me.invalidate();
            // Use window.location for a hard navigation to ensure cookies are sent
            window.location.href = "/admin/dashboard";
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        loginMutation.mutate({ username, password, keepMeLoggedIn });
    };

    const currentYear = new Date().getFullYear();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50/50 relative overflow-hidden">
            {/* Background decoration - optional subtle waves could be added here with SVG or CSS */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent"></div>
            </div>

            <Card className="w-full max-w-md bg-white shadow-xl z-10 border-none rounded-xl">
                <CardContent className="pt-10 pb-8 px-8">
                    <div className="flex flex-col items-center mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <img
                                src="/images/HandokHelperLogoOnly.png"
                                alt="HandokHelper Logo"
                                className="h-10 w-auto"
                            />
                            <span className="text-2xl font-bold text-slate-800 tracking-tight">HandokHelper</span>
                        </div>
                        <p className="text-slate-600 font-medium">Please log in to your account.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2 relative">
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2 relative">
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="keepMeLoggedIn"
                                checked={keepMeLoggedIn}
                                onCheckedChange={(checked) => setKeepMeLoggedIn(!!checked)}
                                className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                            />
                            <Label
                                htmlFor="keepMeLoggedIn"
                                className="text-sm font-normal text-slate-700 cursor-pointer select-none"
                            >
                                Keep me signed in for 30 days
                            </Label>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg rounded-md transition-all shadow-md hover:shadow-lg"
                            disabled={loginMutation.isPending}
                        >
                            {loginMutation.isPending ? "Logging in..." : "Login"}
                        </Button>

                        <div className="flex justify-between items-center pt-2">
                            <button type="button" className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium">
                                Forgot password?
                            </button>
                            {/* Sign up link removed as per request */}
                        </div>
                    </form>
                </CardContent>
            </Card>

            <div className="mt-8 text-center text-xs text-slate-400 z-10">
                <p>&copy; {currentYear} HandokHelper. All rights reserved.</p>
            </div>
        </div>
    );
}
