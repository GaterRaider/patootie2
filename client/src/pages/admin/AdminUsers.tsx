import { useState } from "react";
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Trash2, Key, UserCog } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function AdminUsers() {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isPasswordOpen, setIsPasswordOpen] = useState(false);
    const [selectedAdminId, setSelectedAdminId] = useState<number | null>(null);
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [updatePassword, setUpdatePassword] = useState("");

    const utils = trpc.useContext();
    const { data: admins, isLoading } = trpc.admin.users.getAll.useQuery();
    const { data: me } = trpc.admin.auth.me.useQuery();

    const createMutation = trpc.admin.users.create.useMutation({
        onSuccess: () => {
            utils.admin.users.getAll.invalidate();
            setIsCreateOpen(false);
            setNewUsername("");
            setNewPassword("");
            toast.success("Admin user created successfully");
        },
        onError: (error) => {
            toast.error(`Failed to create admin: ${error.message}`);
        },
    });

    const deleteMutation = trpc.admin.users.delete.useMutation({
        onSuccess: () => {
            utils.admin.users.getAll.invalidate();
            toast.success("Admin user deleted successfully");
        },
        onError: (error) => {
            toast.error(`Failed to delete admin: ${error.message}`);
        },
    });

    const updatePasswordMutation = trpc.admin.users.updatePassword.useMutation({
        onSuccess: () => {
            setIsPasswordOpen(false);
            setUpdatePassword("");
            setSelectedAdminId(null);
            toast.success("Password updated successfully");
        },
        onError: (error) => {
            toast.error(`Failed to update password: ${error.message}`);
        },
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate({
            username: newUsername,
            password: newPassword,
        });
    };

    const handleUpdatePassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAdminId) return;
        updatePasswordMutation.mutate({
            id: selectedAdminId,
            password: updatePassword,
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Team Members</h1>
                    <p className="text-muted-foreground">
                        Manage team members who can access this dashboard
                    </p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Admin
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Administrator</DialogTitle>
                            <DialogDescription>
                                Create a new admin account. They will have full access to the dashboard.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    value={newUsername}
                                    onChange={(e) => setNewUsername(e.target.value)}
                                    placeholder="johndoe"
                                    required
                                    minLength={3}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>
                            <DialogFooter>
                                <Button
                                    type="submit"
                                    disabled={createMutation.status === "pending"}
                                >
                                    {createMutation.status === "pending" && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Create Admin
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Username</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {admins?.map((admin) => (
                            <TableRow key={admin.id}>
                                <TableCell className="font-medium flex items-center gap-2">
                                    <UserCog className="h-4 w-4 text-muted-foreground" />
                                    {admin.username}
                                    {me?.adminId === admin.id && (
                                        <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                            You
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {format(new Date(admin.createdAt), "MMM d, yyyy")}
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Dialog open={isPasswordOpen && selectedAdminId === admin.id} onOpenChange={(open) => {
                                        setIsPasswordOpen(open);
                                        if (!open) setSelectedAdminId(null);
                                    }}>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setSelectedAdminId(admin.id)}
                                            >
                                                <Key className="h-4 w-4 mr-2" />
                                                Reset Password
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Reset Password</DialogTitle>
                                                <DialogDescription>
                                                    Set a new password for {admin.username}.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <form onSubmit={handleUpdatePassword} className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="new-password">New Password</Label>
                                                    <Input
                                                        id="new-password"
                                                        type="password"
                                                        value={updatePassword}
                                                        onChange={(e) => setUpdatePassword(e.target.value)}
                                                        required
                                                        minLength={6}
                                                    />
                                                </div>
                                                <DialogFooter>
                                                    <Button
                                                        type="submit"
                                                        disabled={updatePasswordMutation.status === "pending"}
                                                    >
                                                        {updatePasswordMutation.status === "pending" && (
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        )}
                                                        Update Password
                                                    </Button>
                                                </DialogFooter>
                                            </form>
                                        </DialogContent>
                                    </Dialog>

                                    {me?.adminId !== admin.id && (
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete the admin account
                                                        for <strong>{admin.username}</strong>.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => deleteMutation.mutate({ id: admin.id })}
                                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                    >
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
