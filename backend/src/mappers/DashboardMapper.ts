import { ISale } from '../models/Sale';
import { DashboardStatsDTO } from '../dtos/DashboardDTO';
import { SaleMapper } from './SaleMapper';

export class DashboardMapper {
    static toStatsDTO(
        totalProducts: number,
        totalRevenue: number,
        totalCustomers: number,
        lowStockCount: number,
        recentSales: ISale[]
    ): DashboardStatsDTO {
        return {
            totalProducts,
            totalRevenue,
            totalCustomers,
            lowStockCount,
            recentSales: recentSales.map(SaleMapper.toDTO),
        };
    }
}
