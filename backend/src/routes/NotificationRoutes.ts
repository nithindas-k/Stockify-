import { Router } from 'express';
import { NotificationController } from '../controllers/NotificationController';
import { NotificationService } from '../services/NotificationService';
import { NotificationRepository } from '../repositories/NotificationRepository';
import { protect } from '../middleware/authMiddleware';

const router = Router();

const notificationRepository = new NotificationRepository();
const notificationService = new NotificationService(notificationRepository);
const notificationController = new NotificationController(notificationService);

router.get('/', protect, (req, res) => notificationController.getAll(req, res));
router.delete('/', protect, (req, res) => notificationController.clearAll(req, res));

export default router;
