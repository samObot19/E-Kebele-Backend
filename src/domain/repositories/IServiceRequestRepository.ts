import { ServiceRequest } from '../entities/ServiceRequest';

export interface IServiceRequestRepository {
    create(serviceRequest: ServiceRequest): Promise<ServiceRequest>;
    findById(requestId: string): Promise<ServiceRequest | null>;
    findAll(): Promise<ServiceRequest[]>;
    update(requestId: string, serviceRequest: Partial<ServiceRequest>): Promise<ServiceRequest | null>;
    delete(requestId: string): Promise<boolean>;
}