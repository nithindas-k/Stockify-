import { Router } from 'express';
import { SaleController } from '../controllers/SaleController';
import { SaleService } from '../services/SaleService';
import { SaleRepository } from '../repositories/SaleRepository';
import { ProductRepository } from '../repositories/ProductRepository';
import { NotificationService } from '../services/NotificationService';
import { NotificationRepository } from '../repositories/NotificationRepository';
import { protect } from '../middleware/authMiddleware';

const router = Router();
router.use(protect);

const saleRepository = new SaleRepository();
const productRepository = new ProductRepository();
const notificationRepository = new NotificationRepository();

const notificationService = new NotificationService(notificationRepository);
const saleService = new SaleService(saleRepository, productRepository, notificationService);

const saleController = new SaleController(saleService);

router.post('/', saleController.createSale);
router.get('/', saleController.getAllSales);
router.get('/:id', saleController.getSale);

export default router;
