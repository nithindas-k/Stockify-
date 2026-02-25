import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { UserService } from '../services/UserService';

const router = Router();
const userService = new UserService();
const userController = new UserController(userService);

// Apply auth/admin middleware if they exist
router.get('/', userController.getAllUsers);
router.patch('/:id/status', userController.toggleUserStatus);

export default router;
