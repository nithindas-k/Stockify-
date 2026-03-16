import apiClient from '../../api/apiClient';
import { SALES_ROUTES } from '../../utils/constants/apiRoutes';

export interface GetSalesParams {
    search?: string;
}

export interface SaleItemPayload {
    productId: string;
    quantity: number;
}

export interface SalePayload {
    customerName: string;
    customerId?: string;
    paymentMethod: 'Cash' | 'Card' | 'UPI' | 'Other';
    items: SaleItemPayload[];
}

export const saleService = {
    getAll: (params?: GetSalesParams) =>
        apiClient.get(SALES_ROUTES.GET_ALL, { params }),

    getById: (id: string) =>
        apiClient.get(SALES_ROUTES.GET_BYid(id)),

    create: (payload: SalePayload) =>
        apiClient.post(SALES_ROUTES.CREATE, payload)
};
