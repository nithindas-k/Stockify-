import { Router } from 'express';
import { SaleController } from '../controllers/SaleController';
import { SaleService } from '../services/SaleService';
import { SaleRepository } from '../repositories/SaleRepository';
import { ProductRepository } from '../repositories/ProductRepository';

const router = Router();

const saleRepository = new SaleRepository();
const productRepository = new ProductRepository();
const saleService = new SaleService(saleRepository, productRepository);
const saleController = new SaleController(saleService);

router.post('/', saleController.createSale);
router.get('/', saleController.getAllSales);
router.get('/:id', saleController.getSale);

export default router;
