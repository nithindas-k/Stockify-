import Notification, { INotification } from '../models/Notification';
import mongoose from 'mongoose';
import { INotificationRepository } from './interfaces/INotificationRepository';

export class NotificationRepository implements INotificationRepository {
    async create(data: Partial<INotification>): Promise<INotification> {
        const notification = new Notification(data);
        return await notification.save();
    }

    async findAll(userId: string): Promise<INotification[]> {
        return await Notification.find({ userId }).sort({ createdAt: -1 });
    }

    async markAllAsRead(userId: string): Promise<void> {
        await Notification.updateMany({ userId, read: false }, { read: true });
    }

    async deleteAll(userId: string): Promise<void> {
        await Notification.deleteMany({ userId });
    }

    async findByProduct(userId: string, productId: string): Promise<INotification | null> {
        return await Notification.findOne({ userId, productId, read: false });
    }
}
