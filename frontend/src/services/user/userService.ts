import apiClient from '../../api/apiClient';
import { USER_ROUTES } from '../../utils/constants/apiRoutes';

/* ── Payload / Query types ──────────────────────────────────── */
export interface GetUsersParams {
    page?: number;
    limit?: number;
    search?: string;
}

export interface UpdateUserPayload {
    name?: string;
    email?: string;
    role?: string;
}

/* ── User Service (admin-facing) ────────────────────────────── */
export const userService = {
    getAll: (params?: GetUsersParams) =>
        apiClient.get(USER_ROUTES.GET_ALL, { params }),

    getById: (id: string) =>
        apiClient.get(USER_ROUTES.GET_BY_ID(id)),

    update: (id: string, payload: UpdateUserPayload) =>
        apiClient.put(USER_ROUTES.UPDATE(id), payload),

    delete: (id: string) =>
        apiClient.delete(USER_ROUTES.DELETE(id)),

    toggleStatus: (id: string) =>
        apiClient.patch(USER_ROUTES.TOGGLE_STATUS(id)),
};
