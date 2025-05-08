import { Router } from 'express';
import { ServiceRequestController } from '../controllers/ServiceRequestController';
import { ServiceRequestUseCase } from '../../application/use-cases/service-request';
import { ServiceRequestRepository } from '../../infrastructure/repositories/ServiceRequestRepository';

const router = Router();

// Dependency injection
const serviceRequestRepository = new ServiceRequestRepository();
const serviceRequestUseCase = new ServiceRequestUseCase(serviceRequestRepository);
const serviceRequestController = new ServiceRequestController(serviceRequestUseCase);

// Route to create a new service request
router.post('/', (req, res) => serviceRequestController.createServiceRequest(req, res));

// Route to get all service requests
router.get('/', (req, res) => serviceRequestController.getAllServiceRequests(req, res));

// Route to get a specific service request by ID
router.get('/:id', (req, res) => serviceRequestController.getServiceRequestById(req, res));

// Route to update a service request by ID
router.put('/:id', (req, res) => serviceRequestController.updateServiceRequest(req, res));

// Route to delete a service request by ID
router.delete('/:id', (req, res) => serviceRequestController.deleteServiceRequest(req, res));

export default router;