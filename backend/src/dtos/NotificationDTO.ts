export interface NotificationResponseDTO {
    id: string;
    type: string;
    productId?: string | undefined;
    message: string;
    read: boolean;
    createdAt: string;
    updatedAt: string;
}
