import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { ProductService } from '../services/ProductService';
import { ProductRepository } from '../repositories/ProductRepository';
import { protect } from '../middleware/authMiddleware';

const router = Router();

const productRepository = new ProductRepository();
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

router.post('/', protect, (req, res) => productController.create(req, res));
router.get('/', protect, (req, res) => productController.getAll(req, res));
router.get('/low-stock', protect, (req, res) => productController.getLowStock(req, res));
router.get('/:id', protect, (req, res) => productController.getById(req, res));
router.put('/:id', protect, (req, res) => productController.update(req, res));
router.delete('/:id', protect, (req, res) => productController.delete(req, res));

export default router;
