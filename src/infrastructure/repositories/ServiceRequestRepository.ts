import { IServiceRequestRepository } from '../../domain/repositories/IServiceRequestRepository';
import { ServiceRequest } from '../../domain/entities/ServiceRequest';

export class ServiceRequestRepository implements IServiceRequestRepository {
  private serviceRequests: ServiceRequest[] = [];

  async create(serviceRequest: ServiceRequest): Promise<ServiceRequest> {
    this.serviceRequests.push(serviceRequest);
    return serviceRequest;
  }

  async findById(requestId: string): Promise<ServiceRequest | null> {
    return this.serviceRequests.find(req => req.requestId === requestId) || null;
  }

  async findAll(): Promise<ServiceRequest[]> {
    return this.serviceRequests;
  }

  async update(requestId: string, updatedRequest: Partial<ServiceRequest>): Promise<ServiceRequest | null> {
    const index = this.serviceRequests.findIndex(req => req.requestId === requestId);
    if (index === -1) return null;

    this.serviceRequests[index] = { ...this.serviceRequests[index], ...updatedRequest };
    return this.serviceRequests[index];
  }

  async delete(requestId: string): Promise<boolean> {
    const index = this.serviceRequests.findIndex(req => req.requestId === requestId);
    if (index === -1) return false;

    this.serviceRequests.splice(index, 1);
    return true;
  }
}