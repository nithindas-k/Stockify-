import * as express from 'express';
import { INotificationService } from '../services/interfaces/INotificationService';
import { AuthRequest } from '../middleware/authMiddleware';
import { INotificationController } from './interfaces/INotificationController';
import { NotificationMapper } from '../mappers/NotificationMapper';
import { StatusCode } from '../enums/StatusCode';

export class NotificationController implements INotificationController {
    constructor(private _notificationService: INotificationService) { }

    getAll = async (req: express.Request, res: express.Response): Promise<void> => {
        try {
            const userId = (req as AuthRequest).user.id;
            const notifications = await this._notificationService.getNotifications(userId);
            res.status(StatusCode.OK).json(notifications.map(NotificationMapper.toDTO));
        } catch (error: any) {
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message || 'Error fetching notifications' });
        }
    };

    clearAll = async (req: express.Request, res: express.Response): Promise<void> => {
        try {
            const userId = (req as AuthRequest).user.id;
            await this._notificationService.clearAll(userId);
            res.status(StatusCode.OK).json({ message: 'Notifications cleared successfully' });
        } catch (error: any) {
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message || 'Error clearing notifications' });
        }
    };
}
