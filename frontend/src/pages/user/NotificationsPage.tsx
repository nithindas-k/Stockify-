import React, { useEffect, useState } from 'react';
import { UserSidebar, SidebarToggleBtn } from '../../components/user/UserSidebar';
import { useAuthStore } from '../../store/authStore';
import { Trash2, Package, CheckCircle, Clock } from 'lucide-react';
import { notificationService } from '../../services/notifications/notificationService';
import type { Notification } from '../../services/notifications/notificationService';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { Spinner } from '../../components/ui/spinner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '../../components/ui/alert-dialog';

const NotificationsPage: React.FC = () => {
    const user = useAuthStore((s) => s.user);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const res = await notificationService.getAll();
            setNotifications(res.data);
        } catch (error) {
            toast.error('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleClearAll = async () => {
        try {
            await notificationService.clearAll();
            setNotifications([]);
            setIsClearDialogOpen(false);
            toast.success('All notifications cleared');
        } catch (error) {
            toast.error('Failed to clear notifications');
        }
    };

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
            <UserSidebar />

            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b border-border/40 bg-background/80 backdrop-blur-sm px-4">
                    <SidebarToggleBtn />
                    <div className="h-5 w-px bg-border/50 hidden sm:block" />
                    <span className="text-sm font-medium text-muted-foreground hidden sm:block">
                        Notifications Center
                    </span>
                    <div className="flex-1" />

                    <div className="size-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">
                            {user?.name?.[0]?.toUpperCase() ?? 'U'}
                        </span>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold">Notifications</h1>
                            <p className="text-sm text-muted-foreground">Manage your alerts and system messages.</p>
                        </div>
                        <Button
                            variant="destructive"
                            disabled={notifications.length === 0}
                            onClick={() => setIsClearDialogOpen(true)}
                            className="gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Clear All
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            <div className="py-12 flex justify-center">
                                <Spinner />
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="py-20 text-center bg-card rounded-xl border border-white/10 border-dashed">
                                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-emerald-500 opacity-20" />
                                <h3 className="text-lg font-medium text-muted-foreground">You're all caught up!</h3>
                                <p className="text-sm text-muted-foreground/60">No new notifications at this time.</p>
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div
                                    key={notif._id}
                                    className="p-5 bg-card/40 border border-border/50 rounded-xl hover:border-primary/30 transition-all flex gap-4 items-start"
                                >
                                    <div className={`mt-0.5 p-2 rounded-lg ${notif.type === 'LOW_STOCK' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'} shrink-0`}>
                                        <Package className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-foreground font-medium">{notif.message}</p>
                                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                            <Clock className="w-3.5 h-3.5" />
                                            {new Date(notif.createdAt).toLocaleString()}
                                            <span className="w-1 h-1 rounded-full bg-border mx-1" />
                                            <span className="uppercase tracking-wider font-semibold opacity-60">
                                                {notif.type.replace('_', ' ')}
                                            </span>
                                        </div>
                                    </div>
                                    {!notif.read && (
                                        <div className="size-2 rounded-full bg-primary mt-2 shadow-[0_0_8px_rgba(157,0,255,0.6)]" />
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </main>
            </div>

            <AlertDialog open={isClearDialogOpen} onOpenChange={setIsClearDialogOpen}>
                <AlertDialogContent className="bg-card border-border rounded-xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Clear all notifications?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete all notification records from the database.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-transparent border-white/10 text-foreground hover:bg-white/5">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleClearAll} className="bg-red-500 hover:bg-red-600 text-white shadow-md">
                            Clear All
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default NotificationsPage;
