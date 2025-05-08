import { Router } from 'express';
import { QueueController } from '../controllers/QueueController';
import { QueueUseCase } from '../../application/use-cases/queue';
import { QueueRepository } from '../../infrastructure/repositories/QueueRepository';

const router = Router();

// Dependency injection
const queueRepository = new QueueRepository();
const queueUseCase = new QueueUseCase(queueRepository);
const queueController = new QueueController(queueUseCase);

// Define routes for queue management
router.post('/queues', (req, res) => queueController.addToQueue(req, res)); // Updated to match `addToQueue` method
router.get('/queues', (req, res) => queueController.getQueue(req, res)); // Updated to match `getQueue` method
router.get('/queues/:id', (req, res) => queueController.getQueueById(req, res)); // Matches `getQueueById` method
router.put('/queues/:id', (req, res) => queueController.updateQueue(req, res)); // Matches `updateQueue` method
router.delete('/queues/:id', (req, res) => queueController.removeFromQueue(req, res)); // Updated to match `removeFromQueue` method

export default router;