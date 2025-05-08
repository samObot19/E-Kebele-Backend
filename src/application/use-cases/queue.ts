import { IQueueRepository } from '../../domain/repositories/IQueueRepository';

// This file contains use case implementations for managing the service request queue.

export class QueueUseCase {
  constructor(private queueRepository: IQueueRepository) {}

  // Create a new queue
  public async createQueue(queueData: any): Promise<any> {
    return this.queueRepository.createQueue(queueData);
  }

  // Retrieve a queue by its ID
  public async getQueueById(queueId: string): Promise<any> {
    return this.queueRepository.getQueueById(queueId);
  }

  // Update an existing queue
  public async updateQueue(queueId: string, queueData: any): Promise<any> {
    return this.queueRepository.updateQueue(queueId, queueData);
  }

  // Delete a queue by its ID
  public async deleteQueue(queueId: string): Promise<void> {
    return this.queueRepository.deleteQueue(queueId);
  }

  // List all queues
  public async listQueues(): Promise<any[]> {
    return this.queueRepository.listQueues();
  }
}