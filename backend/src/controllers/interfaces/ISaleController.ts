import { Request, Response } from 'express';

export interface ISaleController {
    createSale(req: Request, res: Response): Promise<void>;
    getSale(req: Request, res: Response): Promise<void>;
    getAllSales(req: Request, res: Response): Promise<void>;
}
