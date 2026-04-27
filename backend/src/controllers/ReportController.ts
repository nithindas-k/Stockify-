import { Request, Response } from 'express';
import { IReportService } from '../services/interfaces/IReportService';
import { MailService } from '../utils/MailService';
import { AuthRequest } from '../middleware/authMiddleware';
import { IReportController } from './interfaces/IReportController';
import { ReportMapper } from '../mappers/ReportMapper';
import { StatusCode } from '../enums/StatusCode';

export class ReportController implements IReportController {
    constructor(private _reportService: IReportService) { }

    getSalesReport = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as AuthRequest).user.id;
            const { startDate, endDate } = req.query;
            const report = await this._reportService.getSalesReport(userId, startDate as string, endDate as string);
            res.status(StatusCode.OK).json({ data: ReportMapper.toSalesReportDTO(report.sales, report.summary.totalRevenue, report.summary.totalSales) });
        } catch (error: any) {
            res.status(StatusCode.BAD_REQUEST).json({ message: error.message });
        }
    };

    getItemsReport = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as AuthRequest).user.id;
            const report = await this._reportService.getItemsReport(userId);
            res.status(StatusCode.OK).json({ data: ReportMapper.toInventoryReportDTO(report.items, report.summary.totalItems, report.summary.totalValue, report.summary.lowStockItems) });
        } catch (error: any) {
            res.status(StatusCode.BAD_REQUEST).json({ message: error.message });
        }
    };

    getCustomerLedger = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as AuthRequest).user.id;
            const report = await this._reportService.getCustomerLedger(userId, req.params.customerId as string);
            res.status(StatusCode.OK).json({ data: ReportMapper.toLedgerReportDTO(report.customer, report.transactions, report.summary.totalSpent) });
        } catch (error: any) {
            res.status(StatusCode.NOT_FOUND).json({ message: error.message });
        }
    };

    emailReport = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, subject, htmlContent } = req.body;
            if (!email || !htmlContent) {
                res.status(StatusCode.BAD_REQUEST).json({ message: 'Email and content are required' });
                return;
            }
            const mailer = new MailService();
            await mailer.sendReport(email, subject || 'Stockify Report', htmlContent);
            res.status(StatusCode.OK).json({ message: 'Report emailed successfully' });
        } catch (error: any) {
            console.error('Email sending error:', error);
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Failed to send email', error: error.message });
        }
    };
}
