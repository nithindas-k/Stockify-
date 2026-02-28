import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { ProductService } from '../services/ProductService';
import { ProductRepository } from '../repositories/ProductRepository';
import { NotificationService } from '../services/NotificationService';
import { NotificationRepository } from '../repositories/NotificationRepository';
import { protect } from '../middleware/authMiddleware';

const router = Router();

const productRepository = new ProductRepository();
const notificationRepository = new NotificationRepository();
const notificationService = new NotificationService(notificationRepository);
const productService = new ProductService(productRepository, notificationService);
const productController = new ProductController(productService);

router.post('/', protect, productController.create);
router.get('/', protect, productController.getAll);
router.get('/low-stock', protect, productController.getLowStock);
router.get('/:id', protect, productController.getById);
router.put('/:id', protect, productController.update);
router.delete('/:id', protect, productController.delete);

export default router;
