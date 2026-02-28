import { Router } from 'express';
import { DashboardController } from '../controllers/DashboardController';
import { DashboardService } from '../services/DashboardService';
import { ProductRepository } from '../repositories/ProductRepository';
import { SaleRepository } from '../repositories/SaleRepository';
import { CustomerRepository } from '../repositories/CustomerRepository';
import { protect } from '../middleware/authMiddleware';

const router = Router();

const productRepo = new ProductRepository();
const saleRepo = new SaleRepository();
const customerRepo = new CustomerRepository();

const dashboardService = new DashboardService(productRepo, saleRepo, customerRepo);
const dashboardController = new DashboardController(dashboardService);

router.use(protect);

router.get('/stats', dashboardController.getStats);

export default router;
