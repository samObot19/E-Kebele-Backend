import { Request, Response } from 'express';
import { QueueUseCase } from '../../application/use-cases/queue';

export class QueueController {
  constructor(private queueUseCase: QueueUseCase) {}

  // Get all items in the queue
  public async getQueue(req: Request, res: Response): Promise<void> {
    try {
      const queue = await this.queueUseCase.listQueues();
      res.status(200).json(queue);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving queue', error });
    }
  }

  // Add an item to the queue
  public async addToQueue(req: Request, res: Response): Promise<void> {
    try {
      const queueData = req.body;
      const newQueueItem = await this.queueUseCase.createQueue(queueData);
      res.status(201).json(newQueueItem);
    } catch (error) {
      res.status(500).json({ message: 'Error adding to queue', error });
    }
  }

  // Remove an item from the queue
  public async removeFromQueue(req: Request, res: Response): Promise<void> {
    try {
      const { queueId } = req.params;
      const queueItem = await this.queueUseCase.getQueueById(queueId);
      if (queueItem) {
        await this.queueUseCase.deleteQueue(queueId);
        res.status(204).send();
      } else {
        res.status(404).json({ message: 'Queue item not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error removing from queue', error });
    }
  }

  // Get a specific queue item by ID
  public async getQueueById(req: Request, res: Response): Promise<void> {
    try {
      const { queueId } = req.params;
      const queueItem = await this.queueUseCase.getQueueById(queueId);
      if (queueItem) {
        res.status(200).json(queueItem);
      } else {
        res.status(404).json({ message: 'Queue item not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving queue item', error });
    }
  }

  // Update a queue item
  public async updateQueue(req: Request, res: Response): Promise<void> {
    try {
      const { queueId } = req.params;
      const queueData = req.body;
      const updatedQueueItem = await this.queueUseCase.updateQueue(queueId, queueData);
      if (updatedQueueItem) {
        res.status(200).json(updatedQueueItem);
      } else {
        res.status(404).json({ message: 'Queue item not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating queue item', error });
    }
  }
}