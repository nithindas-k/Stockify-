import apiClient from '../../api/apiClient';
import { CUSTOMER_ROUTES } from '../../utils/constants/apiRoutes';

/* ── Payload / Query types ──────────────────────────────────── */
export interface GetCustomersParams {
    page?: number;
    limit?: number;
    search?: string;
}

export interface CustomerPayload {
    name: string;
    mobile: string;
    address: string;
}


export const customerService = {
    getAll: (params?: GetCustomersParams) =>
        apiClient.get(CUSTOMER_ROUTES.GET_ALL, { params }),

    getById: (id: string) =>
        apiClient.get(CUSTOMER_ROUTES.GET_BY_ID(id)),

    create: (payload: CustomerPayload) =>
        apiClient.post(CUSTOMER_ROUTES.CREATE, payload),

    update: (id: string, payload: Partial<CustomerPayload>) =>
        apiClient.put(CUSTOMER_ROUTES.UPDATE(id), payload),

    delete: (id: string) =>
        apiClient.delete(CUSTOMER_ROUTES.DELETE(id)),
};
