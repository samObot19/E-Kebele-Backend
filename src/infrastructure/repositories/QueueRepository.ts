import { IQueueRepository } from '../../domain/repositories/IQueueRepository';
import { Queue } from '../../domain/entities/Queue';

export class QueueRepository implements IQueueRepository {
  private queues: Queue[] = [];

  async createQueue(queue: Queue): Promise<Queue> {
    this.queues.push(queue);
    return queue;
  }

  async listQueues(): Promise<Queue[]> {
    return this.queues;
  }

  async getQueueById(queueId: string): Promise<Queue | null> {
    return this.queues.find(queue => queue.queueId === queueId) || null;
  }

  async updateQueue(queueId: string, updatedQueue: Queue): Promise<Queue | null> {
    const index = this.queues.findIndex(queue => queue.queueId === queueId);
    if (index !== -1) {
      Object.assign(this.queues[index], updatedQueue);
      return this.queues[index];
    }
    return null;
  }

  async deleteQueue(queueId: string): Promise<void> {
    const index = this.queues.findIndex(queue => queue.queueId === queueId);
    if (index !== -1) {
      this.queues.splice(index, 1);
    }
  }
}