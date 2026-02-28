import { Router } from 'express';
import { CustomerController } from '../controllers/CustomerController';
import { CustomerService } from '../services/CustomerService';
import { CustomerRepository } from '../repositories/CustomerRepository';
import { protect } from '../middleware/authMiddleware';

const router = Router();
router.use(protect);

const customerRepository = new CustomerRepository();
const customerService = new CustomerService(customerRepository);
const customerController = new CustomerController(customerService);

router.post('/', customerController.createCustomer);
router.get('/', customerController.getAllCustomers);
router.get('/:id', customerController.getCustomer);
router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

export default router;
