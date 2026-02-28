import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { AuthService } from '../services/AuthService';
import { UserRepository } from '../repositories/UserRepository';
import { ROUTES } from '../constants/constants';

const router = Router();

//
const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);


router.post(ROUTES.AUTH.LOGIN, authController.login);
router.post(ROUTES.AUTH.SIGNUP, authController.register);


export default router;

