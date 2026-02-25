import { Router } from 'express';
import { ReportController } from '../controllers/ReportController';
import { ReportService } from '../services/ReportService';

const router = Router();
const reportService = new ReportService();
const reportController = new ReportController(reportService);

router.get('/sales', reportController.getSalesReport);
router.get('/inventory', reportController.getItemsReport);
router.get('/customer/:customerId', reportController.getCustomerLedger);
router.post('/email', reportController.emailReport);

export default router;
