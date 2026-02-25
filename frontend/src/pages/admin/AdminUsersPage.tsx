import React, { useEffect, useState } from 'react';
import { AdminSidebar, AdminSidebarToggleBtn } from '../../components/admin/AdminSidebar';
import { useAuthStore } from '../../store/authStore';
import { Users, Search, MoreHorizontal, ShieldOff, ShieldAlert, Bell, Mail, Clock } from 'lucide-react';
import { userService } from '../../services/user/userService';
import { toast } from 'sonner';

// Shadcn components
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../components/ui/alert-dialog';
import { Spinner } from '../../components/ui/spinner';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
}

const AdminUsersPage: React.FC = () => {
    const adminUser = useAuthStore((s) => s.user);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [toggling, setToggling] = useState<string | null>(null);
    const [confirmUser, setConfirmUser] = useState<User | null>(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await userService.getAll({ search });
            setUsers(res.data.data || res.data);
        } catch (error: any) {
            toast.error(error.message || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [search]);

    const executeToggleStatus = async () => {
        if (!confirmUser) return;
        const currentStatus = confirmUser.isActive !== false;
        const id = confirmUser._id;

        setToggling(id);
        setConfirmUser(null);
        try {
            await userService.toggleStatus(id);
            toast.success(`User ${currentStatus ? 'blocked' : 'unblocked'} successfully`);
            fetchUsers();
        } catch (error: any) {
            toast.error('Failed to change user status');
        } finally {
            setToggling(null);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
            <AdminSidebar />

            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b border-border/40 bg-background/80 backdrop-blur-sm px-4">
                    <AdminSidebarToggleBtn />

                    <div className="h-5 w-px bg-border/50 hidden sm:block" />
                    <span className="text-sm font-medium text-muted-foreground hidden sm:block">
                        User Management
                    </span>
                    <div className="flex-1" />

                    <button className="relative p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors">
                        <Bell className="size-4" />
                    </button>
                    <div className="size-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                        <span className="text-xs font-bold text-amber-400">
                            {adminUser?.name?.[0]?.toUpperCase() ?? 'A'}
                        </span>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="relative w-full sm:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search users by name or email..."
                                className="pl-9 bg-card border-border border-white/5"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-card overflow-hidden shadow-lg">
                        <Table>
                            <TableHeader className="bg-white/5">
                                <TableRow className="border-white/10">
                                    <TableHead>User Profile</TableHead>
                                    <TableHead>Account Status</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead className="w-[80px] text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-64 text-center">
                                            <Spinner className="mx-auto" />
                                        </TableCell>
                                    </TableRow>
                                ) : filteredUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-64 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center gap-4 opacity-50">
                                                <Users className="size-12" />
                                                <p>No users found matching your search.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredUsers.map((u) => (
                                        <TableRow key={u._id} className="border-white/5 group hover:bg-white/[0.02] transition-colors">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="size-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0">
                                                        <span className="text-sm font-bold text-primary">
                                                            {u.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-sm">{u.name}</p>
                                                        <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
                                                            <Mail className="size-3" />
                                                            {u.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={u.isActive !== false
                                                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                                        : 'bg-red-500/10 text-red-500 border-red-500/20'}
                                                >
                                                    {u.isActive !== false ? 'Active' : 'Blocked'}
                                                </Badge>
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                                    <Clock className="size-3.5" />
                                                    {new Date(u.createdAt).toLocaleDateString()}
                                                </div>
                                            </TableCell>

                                            <TableCell className="text-right">
                                                {toggling === u._id ? (
                                                    <Spinner className="w-5 h-5 mx-auto" />
                                                ) : (
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-white/10">
                                                                <span className="sr-only">Open menu</span>
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48 bg-card border-border">
                                                            <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                                                            <DropdownMenuItem
                                                                onClick={() => setConfirmUser(u)}
                                                                className={`cursor-pointer gap-2 ${u.isActive !== false ? 'text-red-400 focus:text-red-400' : 'text-emerald-400 focus:text-emerald-400'}`}
                                                            >
                                                                {u.isActive !== false ? (
                                                                    <><ShieldOff className="w-4 h-4" /> Block User</>
                                                                ) : (
                                                                    <><ShieldAlert className="w-4 h-4" /> Unblock User</>
                                                                )}
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <AlertDialog open={!!confirmUser} onOpenChange={(open) => !open && setConfirmUser(null)}>
                        <AlertDialogContent className="bg-card border-border">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-foreground">Confirm Action</AlertDialogTitle>
                                <AlertDialogDescription className="text-muted-foreground">
                                    Are you sure you want to <strong className={confirmUser?.isActive !== false ? "text-red-400" : "text-emerald-400"}>{confirmUser?.isActive !== false ? 'block' : 'unblock'}</strong> the user {confirmUser?.name}?
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="border-border text-foreground hover:bg-white/5">Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={executeToggleStatus}
                                    className="bg-primary hover:bg-primary/90 text-white shadow-[0_0_15px_rgba(157,0,255,0.3)]"
                                >
                                    Yes, {confirmUser?.isActive !== false ? 'Block' : 'Unblock'}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                </main>
            </div>
        </div>
    );
};

export default AdminUsersPage;
