import { Request, Response } from 'express';
import { ISaleService } from '../services/interfaces/ISaleService';
import { AuthRequest } from '../middleware/authMiddleware';

export class SaleController {
    constructor(private saleService: ISaleService) { }

    createSale = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as AuthRequest).user.id;
            const sale = await this.saleService.createSale({ ...req.body, userId });
            res.status(201).json({ message: 'Sale completed successfully', data: sale });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    };

    getSale = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as AuthRequest).user.id;
            const sale = await this.saleService.getSale(userId, req.params.id as string);
            res.status(200).json({ data: sale });
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    };

    getAllSales = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as AuthRequest).user.id;
            const query = req.query.search as string;
            const sales = await this.saleService.getAllSales(userId, query);
            res.status(200).json({ data: sales });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };
}
