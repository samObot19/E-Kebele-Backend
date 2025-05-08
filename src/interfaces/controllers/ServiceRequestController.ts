import { Request, Response } from 'express';
import { ServiceRequestUseCase } from '../../application/use-cases/service-request';
import { ServiceRequest } from '../../domain/entities/ServiceRequest';

export class ServiceRequestController {
  constructor(private serviceRequestUseCase: ServiceRequestUseCase) {}

  // Create a new service request
  public async createServiceRequest(req: Request, res: Response): Promise<void> {
    try {
      const serviceRequestData: ServiceRequest = req.body;
      const newServiceRequest = await this.serviceRequestUseCase.createServiceRequest(serviceRequestData);
      res.status(201).json(newServiceRequest);
    } catch (error) {
      res.status(500).json({ message: 'Error creating service request', error });
    }
  }

  // Get all service requests
  public async getAllServiceRequests(req: Request, res: Response): Promise<void> {
    try {
      const serviceRequests = await this.serviceRequestUseCase.getAllServiceRequests();
      res.status(200).json(serviceRequests);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving service requests', error });
    }
  }

  // Get a specific service request by ID
  public async getServiceRequestById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const serviceRequest = await this.serviceRequestUseCase.getServiceRequestById(id);
      if (!serviceRequest) {
        res.status(404).json({ message: 'Service request not found' });
        return;
      }
      res.status(200).json(serviceRequest);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving service request', error });
    }
  }

  // Update a service request
  public async updateServiceRequest(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const serviceRequestData: Partial<ServiceRequest> = req.body;
      const updatedServiceRequest = await this.serviceRequestUseCase.updateServiceRequest(id, serviceRequestData);
      if (!updatedServiceRequest) {
        res.status(404).json({ message: 'Service request not found' });
        return;
      }
      res.status(200).json(updatedServiceRequest);
    } catch (error) {
      res.status(500).json({ message: 'Error updating service request', error });
    }
  }

  // Delete a service request
  public async deleteServiceRequest(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await this.serviceRequestUseCase.deleteServiceRequest(id);
      if (!deleted) {
        res.status(404).json({ message: 'Service request not found' });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting service request', error });
    }
  }
}