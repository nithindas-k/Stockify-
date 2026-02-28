import { Router } from 'express';
import { ReportController } from '../controllers/ReportController';
import { ReportService } from '../services/ReportService';
import { SaleRepository } from '../repositories/SaleRepository';
import { ProductRepository } from '../repositories/ProductRepository';
import { CustomerRepository } from '../repositories/CustomerRepository';
import { protect } from '../middleware/authMiddleware';

const router = Router();
router.use(protect);

const saleRepo = new SaleRepository();
const productRepo = new ProductRepository();
const customerRepo = new CustomerRepository();

const reportService = new ReportService(saleRepo, productRepo, customerRepo);
const reportController = new ReportController(reportService);

router.get('/sales', reportController.getSalesReport);
router.get('/inventory', reportController.getItemsReport);
router.get('/customer/:customerId', reportController.getCustomerLedger);
router.post('/email', reportController.emailReport);

export default router;
