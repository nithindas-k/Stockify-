import * as express from 'express';
import { NotificationService } from '../services/NotificationService';

export class NotificationController {
    private notificationService: NotificationService;

    constructor(notificationService: NotificationService) {
        this.notificationService = notificationService;
    }

    async getAll(req: express.Request, res: express.Response): Promise<void> {
        try {
            const userId = (req as any).user.id;
            const notifications = await this.notificationService.getNotifications(userId);
            res.status(200).json(notifications);
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Error fetching notifications' });
        }
    }

    async clearAll(req: express.Request, res: express.Response): Promise<void> {
        try {
            const userId = (req as any).user.id;
            await this.notificationService.clearAll(userId);
            res.status(200).json({ message: 'Notifications cleared successfully' });
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Error clearing notifications' });
        }
    }
}
