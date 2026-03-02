import { Request, Response } from 'express';

export interface IDashboardController {
    getStats(req: Request, res: Response): Promise<void>;
}
