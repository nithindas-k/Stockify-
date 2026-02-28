import { Router } from 'express';
import { SaleController } from '../controllers/SaleController';
import { SaleService } from '../services/SaleService';
import { SaleRepository } from '../repositories/SaleRepository';
import { ProductRepository } from '../repositories/ProductRepository';
import { NotificationService } from '../services/NotificationService';
import { NotificationRepository } from '../repositories/NotificationRepository';

const router = Router();

const saleRepository = new SaleRepository();
const productRepository = new ProductRepository();
const notificationRepository = new NotificationRepository();

const notificationService = new NotificationService(notificationRepository);
const saleService = new SaleService(saleRepository, productRepository, notificationService);


const saleController = new SaleController(saleService);

router.post('/', (req, res) => saleController.createSale(req, res));
router.get('/', (req, res) => saleController.getAllSales(req, res));
router.get('/:id', (req, res) => saleController.getSale(req, res));

export default router;
