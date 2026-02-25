import { Request, Response } from 'express';
import { SaleService } from '../services/SaleService';

export class SaleController {
    constructor(private saleService: SaleService) { }

    createSale = async (req: Request, res: Response): Promise<void> => {
        try {
            const sale = await this.saleService.createSale(req.body);
            res.status(201).json({ message: 'Sale completed successfully', data: sale });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    };

    getSale = async (req: Request, res: Response): Promise<void> => {
        try {
            const sale = await this.saleService.getSale(req.params.id as string);
            res.status(200).json({ data: sale });
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    };

    getAllSales = async (req: Request, res: Response): Promise<void> => {
        try {
            const query = req.query.search as string;
            const sales = await this.saleService.getAllSales(query);
            res.status(200).json({ data: sales });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };
}
