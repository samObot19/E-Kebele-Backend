import { Router } from 'express';
import NotificationController from '../controllers/NotificationController';
import { NotificationService } from '../../application/use-cases/notification';
import { NotificationRepository } from '../../infrastructure/repositories/NotificationRepository';

const router = Router();

// Dependency injection
const notificationRepository = new NotificationRepository();
const notificationService = new NotificationService(notificationRepository);
const notificationController = new NotificationController(notificationService);

// Define routes for notifications
router.post('/', (req, res) => notificationController.createNotification(req, res));
router.get('/:id', (req, res) => notificationController.getNotificationById(req, res));
router.put('/:id', (req, res) => notificationController.updateNotification(req, res));
router.delete('/:id', (req, res) => notificationController.deleteNotification(req, res));

export default router;