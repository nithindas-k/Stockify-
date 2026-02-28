import React, { useEffect, useState } from 'react';
import { Bell, Trash2, Package } from 'lucide-react';
import { Button } from '../ui/button';
import { notificationService } from '../../services/notifications/notificationService';
import type { Notification } from '../../services/notifications/notificationService';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '../ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '../ui/alert-dialog';
import { toast } from 'sonner';

export const NotificationBell: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);

    const fetchNotifications = async () => {
        try {
            const res = await notificationService.getAll();
            setNotifications(res.data);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Check every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const handleClearAll = async () => {
        try {
            await notificationService.clearAll();
            setNotifications([]);
            setIsClearDialogOpen(false);
            setIsOpen(false);
            toast.success('All notifications cleared from database');
        } catch (error) {
            toast.error('Failed to clear notifications');
        }
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <button className="relative p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" onClick={fetchNotifications}>
                        <Bell className="size-4" />
                        {notifications.length > 0 && (
                            <span className="absolute top-1 right-1 flex size-3 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white shadow-sm ring-2 ring-background">
                                {notifications.length > 9 ? '9+' : notifications.length}
                            </span>
                        )}
                    </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-card border-border rounded-xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Bell className="w-5 h-5 text-primary" />
                            Notifications
                        </DialogTitle>
                    </DialogHeader>

                    <div className="max-h-[60vh] overflow-y-auto pr-2 pb-2 space-y-3 mt-2">
                        {notifications.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <Bell className="w-8 h-8 opacity-20 mx-auto mb-2" />
                                <p className="text-sm">No new notifications</p>
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div key={notif._id} className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                                    <div className="mt-0.5 w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                                        <Package className="w-4 h-4 text-red-500" />
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                                        <div className="text-sm font-semibold text-foreground break-words truncate whitespace-normal">
                                            {notif.message}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground uppercase tracking-tight">
                                            {new Date(notif.createdAt).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <DialogFooter className="sm:justify-between border-t border-border mt-4 pt-4">
                        <Button
                            variant="destructive"
                            size="sm"
                            className="w-full sm:w-auto gap-2"
                            disabled={notifications.length === 0}
                            onClick={() => setIsClearDialogOpen(true)}
                        >
                            <Trash2 className="w-4 h-4" />
                            Clear All
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={isClearDialogOpen} onOpenChange={setIsClearDialogOpen}>
                <AlertDialogContent className="bg-card border-border rounded-xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Clear all notifications?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to permanently delete all notifications from the database?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-transparent border-white/10 text-foreground hover:bg-white/5">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleClearAll} className="bg-red-500 hover:bg-red-600 text-white shadow-md">
                            Clear Notifications
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};
