import { SaleResponseDTO } from './SaleDTO';

export interface DashboardStatsDTO {
    totalProducts: number;
    totalRevenue: number;
    totalCustomers: number;
    lowStockCount: number;
    recentSales: SaleResponseDTO[];
}
