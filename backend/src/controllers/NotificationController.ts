import * as express from 'express';
import { INotificationService } from '../services/interfaces/INotificationService';
import { AuthRequest } from '../middleware/authMiddleware';

export class NotificationController {
    constructor(private notificationService: INotificationService) { }

    getAll = async (req: express.Request, res: express.Response): Promise<void> => {
        try {
            const userId = (req as AuthRequest).user.id;
            const notifications = await this.notificationService.getNotifications(userId);
            res.status(200).json(notifications);
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Error fetching notifications' });
        }
    };

    clearAll = async (req: express.Request, res: express.Response): Promise<void> => {
        try {
            const userId = (req as AuthRequest).user.id;
            await this.notificationService.clearAll(userId);
            res.status(200).json({ message: 'Notifications cleared successfully' });
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Error clearing notifications' });
        }
    };
}
