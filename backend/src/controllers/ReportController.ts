import { Request, Response } from 'express';
import { IReportService } from '../services/interfaces/IReportService';
import { MailService } from '../utils/MailService';
import { AuthRequest } from '../middleware/authMiddleware';
import { IReportController } from './interfaces/IReportController';

export class ReportController implements IReportController {
    constructor(private reportService: IReportService) { }

    getSalesReport = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as AuthRequest).user.id;
            const { startDate, endDate } = req.query;
            const report = await this.reportService.getSalesReport(userId, startDate as string, endDate as string);
            res.status(200).json({ data: report });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    };

    getItemsReport = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as AuthRequest).user.id;
            const report = await this.reportService.getItemsReport(userId);
            res.status(200).json({ data: report });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    };

    getCustomerLedger = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as AuthRequest).user.id;
            const report = await this.reportService.getCustomerLedger(userId, req.params.customerId as string);
            res.status(200).json({ data: report });
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    };

    emailReport = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, subject, htmlContent } = req.body;
            if (!email || !htmlContent) {
                res.status(400).json({ message: 'Email and content are required' });
                return;
            }
            const mailer = new MailService();
            await mailer.sendReport(email, subject || 'Stockify Report', htmlContent);
            res.status(200).json({ message: 'Report emailed successfully' });
        } catch (error: any) {
            console.error('Email sending error:', error);
            res.status(500).json({ message: 'Failed to send email', error: error.message });
        }
    };
}
