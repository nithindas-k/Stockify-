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


router.post(ROUTES.AUTH.LOGIN, (req, res) => authController.login(req, res));
router.post(ROUTES.AUTH.REGISTER, (req, res) => authController.register(req, res));


export default router;

