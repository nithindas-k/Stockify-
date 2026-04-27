import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { IDashboardService } from '../services/interfaces/IDashboardService';
import { IDashboardController } from './interfaces/IDashboardController';
import { DashboardMapper } from '../mappers/DashboardMapper';
import { StatusCode } from '../enums/StatusCode';

export class DashboardController implements IDashboardController {
    constructor(private _dashboardService: IDashboardService) { }

    getStats = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as AuthRequest).user.id;
            const stats = await this._dashboardService.getStats(userId);
            res.status(StatusCode.OK).json({ data: DashboardMapper.toStatsDTO(stats.totalProducts, stats.totalRevenue, stats.totalCustomers, stats.lowStockCount, stats.recentSales) });
        } catch (error: any) {
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    };
}
