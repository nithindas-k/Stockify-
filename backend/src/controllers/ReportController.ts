import { Request, Response } from 'express';
import { ReportService } from '../services/ReportService';

export class ReportController {
    constructor(private reportService: ReportService) { }

    getSalesReport = async (req: Request, res: Response): Promise<void> => {
        try {
            const { startDate, endDate } = req.query;
            const report = await this.reportService.getSalesReport(startDate as string, endDate as string);
            res.status(200).json({ data: report });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    };

    getItemsReport = async (req: Request, res: Response): Promise<void> => {
        try {
            const report = await this.reportService.getItemsReport();
            res.status(200).json({ data: report });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    };

    getCustomerLedger = async (req: Request, res: Response): Promise<void> => {
        try {
            const report = await this.reportService.getCustomerLedger(req.params.customerId as string);
            res.status(200).json({ data: report });
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    };
}
