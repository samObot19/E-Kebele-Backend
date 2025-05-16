// import { Router } from 'express';
// import { SupportController } from '../controllers/SupportController';
// import { SupportUseCase } from '../../application/use-cases/support';
// import { SupportRepository } from '../../infrastructure/repositories/SupportRepository';

// const router = Router();

// // Dependency injection
// const supportRepository = new SupportRepository();
// const supportUseCase = new SupportUseCase(supportRepository);
// const supportController = new SupportController(supportUseCase);

// // Create a new support ticket
// router.post('/tickets', (req, res) => supportController.createSupportTicket(req, res));

// // Get all support tickets
// router.get('/tickets', (req, res) => supportController.listSupportTickets(req, res));

// // Get a specific support ticket by ID
// router.get('/tickets/:ticketId', (req, res) => supportController.getSupportTicketById(req, res));

// // Update a support ticket
// router.put('/tickets/:ticketId', (req, res) => supportController.updateSupportTicket(req, res));

// // Delete a support ticket
// router.delete('/tickets/:ticketId', (req, res) => supportController.deleteSupportTicket(req, res));

// export default router;