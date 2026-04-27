import { Request, Response } from 'express';
import { ISaleService } from '../services/interfaces/ISaleService';
import { AuthRequest } from '../middleware/authMiddleware';
import { ISaleController } from './interfaces/ISaleController';
import { SaleMapper } from '../mappers/SaleMapper';
import { StatusCode } from '../enums/StatusCode';

export class SaleController implements ISaleController {
    constructor(private _saleService: ISaleService) { }

    createSale = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as AuthRequest).user.id;
            const sale = await this._saleService.createSale({ ...req.body, userId });
            res.status(StatusCode.CREATED).json({ message: 'Sale completed successfully', data: SaleMapper.toDTO(sale) });
        } catch (error: any) {
            res.status(StatusCode.BAD_REQUEST).json({ message: error.message });
        }
    };

    getSale = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as AuthRequest).user.id;
            const sale = await this._saleService.getSale(userId, req.params.id as string);
            res.status(StatusCode.OK).json({ data: SaleMapper.toDTO(sale) });
        } catch (error: any) {
            res.status(StatusCode.NOT_FOUND).json({ message: error.message });
        }
    };

    getAllSales = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as AuthRequest).user.id;
            const query = req.query.search as string;
            const sales = await this._saleService.getAllSales(userId, query);
            res.status(StatusCode.OK).json({ data: sales.map(SaleMapper.toDTO) });
        } catch (error: any) {
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    };
}
