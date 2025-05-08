import { Router } from 'express';
import { PublicEventController } from '../controllers/PublicEventController';
import { PublicEventUseCase } from '../../application/use-cases/public-event';
import { PublicEventRepository } from '../../infrastructure/repositories/PublicEventRepository';

const router = Router();

// Dependency injection
const publicEventRepository = new PublicEventRepository();
const publicEventUseCase = new PublicEventUseCase(publicEventRepository);
const publicEventController = new PublicEventController(publicEventUseCase);

// Define routes for public events
router.post('/', (req, res) => publicEventController.createEvent(req, res));
router.get('/', (req, res) => publicEventController.getEvents(req, res));
router.get('/:id', (req, res) => publicEventController.getEventById(req, res));
router.put('/:id', (req, res) => publicEventController.updateEvent(req, res));
router.delete('/:id', (req, res) => publicEventController.deleteEvent(req, res));

export default router;