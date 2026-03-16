import { INotification } from '../models/Notification';
import { NotificationResponseDTO } from '../dtos/NotificationDTO';

export class NotificationMapper {
    static toDTO(notification: INotification): NotificationResponseDTO {
        return {
            id: notification._id.toString(),
            type: notification.type,
            productId: notification.productId ? notification.productId.toString() : undefined,
            message: notification.message,
            read: notification.read,
            createdAt: notification.createdAt.toISOString(),
            updatedAt: notification.updatedAt.toISOString(),
        };
    }
}
