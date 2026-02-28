import apiClient from '../../api/apiClient';
import { DASHBOARD_ROUTES } from '../../utils/constants/apiRoutes';

export interface DashboardStats {
    totalProducts: number;
    totalRevenue: number;
    totalCustomers: number;
    lowStockCount: number;
    recentSales: {
        id: string;
        customer: string;
        amount: number;
        date: string;
        items: number;
    }[];
}

export const dashboardService = {
    getStats: () => apiClient.get<{ data: DashboardStats }>(DASHBOARD_ROUTES.STATS)
};
