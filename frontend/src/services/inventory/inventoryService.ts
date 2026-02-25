import apiClient from '../../api/apiClient';
import { INVENTORY_ROUTES } from '../../utils/constants/apiRoutes';

/* ── Payload / Query types ──────────────────────────────────── */
export interface GetInventoryParams {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
}

export interface InventoryPayload {
    name: string;
    sku: string;
    category: string;
    quantity: number;
    price: number;
    lowStockThreshold?: number;
    description?: string;
}

/* ── Inventory Service ──────────────────────────────────────── */
export const inventoryService = {
    getAll: (params?: GetInventoryParams) =>
        apiClient.get(INVENTORY_ROUTES.GET_ALL, { params }),

    getById: (id: string) =>
        apiClient.get(INVENTORY_ROUTES.GET_BY_ID(id)),

    create: (payload: InventoryPayload) =>
        apiClient.post(INVENTORY_ROUTES.CREATE, payload),

    update: (id: string, payload: Partial<InventoryPayload>) =>
        apiClient.put(INVENTORY_ROUTES.UPDATE(id), payload),

    delete: (id: string) =>
        apiClient.delete(INVENTORY_ROUTES.DELETE(id)),

    getLowStock: () =>
        apiClient.get(INVENTORY_ROUTES.LOW_STOCK),
};
