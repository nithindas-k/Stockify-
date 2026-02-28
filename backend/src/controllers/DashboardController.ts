import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { IDashboardService } from '../services/interfaces/IDashboardService';

export class DashboardController {
    constructor(private dashboardService: IDashboardService) { }

    getStats = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as AuthRequest).user.id;
            const stats = await this.dashboardService.getStats(userId);
            res.status(200).json({ data: stats });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };
}
