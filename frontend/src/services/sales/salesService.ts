import apiClient from '../../api/apiClient';
import { SALES_ROUTES } from '../../utils/constants/apiRoutes';

export interface GetSalesParams {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    customerId?: string;
}

export interface SaleItem {
    productId: string;
    quantity: number;
    price: number;
}

export interface SalePayload {
    customerId: string;
    items: SaleItem[];
    notes?: string;
}

export const salesService = {
    getAll: (params?: GetSalesParams) =>
        apiClient.get(SALES_ROUTES.GET_ALL, { params }),

    getById: (id: string) =>
        apiClient.get(SALES_ROUTES.GET_BYid(id)),

    create: (payload: SalePayload) =>
        apiClient.post(SALES_ROUTES.CREATE, payload),

    update: (id: string, payload: Partial<SalePayload>) =>
        apiClient.put(SALES_ROUTES.UPDATE(id), payload),

    delete: (id: string) =>
        apiClient.delete(SALES_ROUTES.DELETE(id)),
};
