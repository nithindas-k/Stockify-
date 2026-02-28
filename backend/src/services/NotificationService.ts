import { INotificationRepository } from '../repositories/interfaces/INotificationRepository';
import { INotification } from '../models/Notification';
import { INotificationService } from './interfaces/INotificationService';

export class NotificationService implements INotificationService {
    constructor(private notificationRepository: INotificationRepository) { }

    async getNotifications(userId: string): Promise<INotification[]> {
        return await this.notificationRepository.findAll(userId);
    }

    async createLowStockNotification(userId: string, productId: string, productName: string, quantity: number): Promise<void> {
        const existing = await this.notificationRepository.findByProduct(userId, productId);
        if (!existing) {
            await this.notificationRepository.create({
                userId: userId as any,
                productId: productId as any,
                type: 'LOW_STOCK',
                message: `Low Stock Alert: ${productName} (Current: ${quantity})`,
                read: false
            });
        }
    }

    async clearAll(userId: string): Promise<void> {
        await this.notificationRepository.deleteAll(userId);
    }
}
