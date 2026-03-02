import { ISale } from '../models/Sale';

export interface CreateSaleDTO {
    customerName: string;
    customerId?: string;
    userId?: string;
    paymentMethod: 'Cash' | 'Card' | 'UPI' | 'Other';
    items: {
        productId: string;
        quantity: number;
    }[];
}
