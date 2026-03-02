import { Request, Response } from 'express';

export interface IReportController {
    getSalesReport(req: Request, res: Response): Promise<void>;
    getItemsReport(req: Request, res: Response): Promise<void>;
    getCustomerLedger(req: Request, res: Response): Promise<void>;
    emailReport(req: Request, res: Response): Promise<void>;
}
