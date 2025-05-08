// This file contains use case implementations for handling service requests, including submission and retrieval.

import { IServiceRequestRepository } from '../../domain/repositories/IServiceRequestRepository';
import { ServiceRequest } from '../../domain/entities/ServiceRequest';

export class ServiceRequestUseCase {
  private serviceRequestRepository: IServiceRequestRepository;

  constructor(serviceRequestRepository: IServiceRequestRepository) {
    this.serviceRequestRepository = serviceRequestRepository;
  }

  // Create a new service request
  async createServiceRequest(serviceRequestData: Omit<ServiceRequest, 'requestId'>): Promise<ServiceRequest> {
    const serviceRequest = { ...serviceRequestData, requestId: this.generateRequestId() }; // Generate a unique ID
    return await this.serviceRequestRepository.create(serviceRequest);
  }

  // Get a specific service request by ID
  async getServiceRequestById(requestId: string): Promise<ServiceRequest | null> {
    return await this.serviceRequestRepository.findById(requestId);
  }

  // Get all service requests
  async getAllServiceRequests(): Promise<ServiceRequest[]> {
    return await this.serviceRequestRepository.findAll();
  }

  // Update a service request
  async updateServiceRequest(requestId: string, updates: Partial<ServiceRequest>): Promise<ServiceRequest | null> {
    return await this.serviceRequestRepository.update(requestId, updates);
  }

  // Delete a service request
  async deleteServiceRequest(requestId: string): Promise<boolean> {
    return await this.serviceRequestRepository.delete(requestId);
  }

  // Helper method to generate a unique request ID
  private generateRequestId(): string {
    return `REQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
}