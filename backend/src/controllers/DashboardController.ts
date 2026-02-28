import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { DashboardService } from '../services/DashboardService';

export class DashboardController {
    constructor(private dashboardService: DashboardService) { }

    getStats = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user.id;
            const stats = await this.dashboardService.getStats(userId);
            res.status(200).json({ data: stats });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };
}
