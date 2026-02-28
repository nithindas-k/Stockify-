import apiClient from '../../api/apiClient';

export interface Notification {
    _id: string;
    type: 'LOW_STOCK' | 'SYSTEM';
    productId?: string;
    message: string;
    read: boolean;
    createdAt: string;
}

export const notificationService = {
    getAll: () => apiClient.get<Notification[]>('/notifications'),
    clearAll: () => apiClient.delete('/notifications'),
};
