import { ISale } from '../models/Sale';

export interface CreateSaleDTO {
    customerName: string;
    customerId?: string; // Optional if registered customer
    paymentMethod: 'Cash' | 'Card' | 'UPI' | 'Other';
    items: {
        productId: string;
        quantity: number;
    }[];
}
