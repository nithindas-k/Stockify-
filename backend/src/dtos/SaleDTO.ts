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

export interface SaleItemResponseDTO {
    productId: string;
    productName: string;
    quantity: number;
    priceAtSale: number;
}

export interface SaleResponseDTO {
    id: string;
    customerName: string;
    customerId?: string | undefined;
    items: SaleItemResponseDTO[];
    totalAmount: number;
    saleDate: string;
    paymentMethod: string;
    createdAt: string;
    updatedAt: string;
}
