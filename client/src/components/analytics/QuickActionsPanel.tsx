import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Plus, FileText, Users, Mail, Settings } from "lucide-react";

export function QuickActionsPanel() {
    const [, setLocation] = useLocation();

    const actions = [
        {
            label: "Create Invoice",
            icon: FileText,
            onClick: () => setLocation("/invoices/new"),
            color: "bg-blue-500 hover:bg-blue-600",
        },
        {
            label: "View Submissions",
            icon: Users,
            onClick: () => setLocation("/submissions"),
            color: "bg-purple-500 hover:bg-purple-600",
        },
        {
            label: "Email Templates",
            icon: Mail,
            onClick: () => setLocation("/emails"),
            color: "bg-green-500 hover:bg-green-600",
        },
        {
            label: "Settings",
            icon: Settings,
            onClick: () => setLocation("/settings"),
            color: "bg-gray-500 hover:bg-gray-600",
        },
    ];

    return (
        <Card className="h-full">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Quick Actions
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-3">
                    {actions.map((action) => {
                        const Icon = action.icon;
                        return (
                            <Button
                                key={action.label}
                                onClick={action.onClick}
                                className={`${action.color} text-white h-20 flex flex-col items-center justify-center gap-2`}
                                variant="default"
                            >
                                <Icon className="h-5 w-5" />
                                <span className="text-xs font-medium">{action.label}</span>
                            </Button>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
