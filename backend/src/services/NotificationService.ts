import { INotificationRepository } from '../repositories/interfaces/INotificationRepository';
import { INotification } from '../models/Notification';
import { INotificationService } from './interfaces/INotificationService';

export class NotificationService implements INotificationService {
    constructor(private _notificationRepository: INotificationRepository) { }

    async getNotifications(userId: string): Promise<INotification[]> {
        return await this._notificationRepository.findAll(userId);
    }

    async createLowStockNotification(userId: string, productId: string, productName: string, quantity: number): Promise<void> {
        const existing = await this._notificationRepository.findByProduct(userId, productId);
        if (!existing) {
            await this._notificationRepository.create({
                userId: userId as any,
                productId: productId as any,
                type: 'LOW_STOCK',
                message: `Low Stock Alert: ${productName} (Current: ${quantity})`,
                read: false
            });
        }
    }

    async clearAll(userId: string): Promise<void> {
        await this._notificationRepository.deleteAll(userId);
    }
}
