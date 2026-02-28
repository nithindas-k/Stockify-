import { INotification } from '../../models/Notification';

export interface INotificationRepository {
    create(data: Partial<INotification>): Promise<INotification>;
    findAll(userId: string): Promise<INotification[]>;
    findByProduct(userId: string, productId: string): Promise<INotification | null>;
    deleteAll(userId: string): Promise<void>;
}
