export interface INotificationService {
    getNotifications(userId: string): Promise<any[]>;
    createLowStockNotification(userId: string, productId: string, productName: string, quantity: number): Promise<void>;
    clearAll(userId: string): Promise<void>;
}
