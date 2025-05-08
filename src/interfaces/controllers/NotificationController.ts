import { Request, Response } from 'express';
import { NotificationService } from '../../application/use-cases/notification';

class NotificationController {
  private notificationService: NotificationService;

  constructor(notificationService: NotificationService) {
    this.notificationService = notificationService;
  }

  // Create a new notification
  public async createNotification(req: Request, res: Response): Promise<void> {
    try {
      const notificationData = req.body;
      const newNotification = await this.notificationService.sendNotification(notificationData);
      res.status(201).json(newNotification);
    } catch (error) {
      res.status(500).json({ message: 'Error creating notification', error });
    }
  }

  // Get a specific notification by ID
  public async getNotificationById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const notification = await this.notificationService.getNotificationById(id);
      if (!notification) {
        res.status(404).json({ message: 'Notification not found' });
        return;
      }
      res.status(200).json(notification);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving notification', error });
    }
  }

  // Update a notification
  public async updateNotification(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;
      const updatedNotification = await this.notificationService.updateNotification(id, updates);
      if (!updatedNotification) {
        res.status(404).json({ message: 'Notification not found' });
        return;
      }
      res.status(200).json(updatedNotification);
    } catch (error) {
      res.status(500).json({ message: 'Error updating notification', error });
    }
  }

  // Delete a notification
  public async deleteNotification(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await this.notificationService.deleteNotification(id);
      if (!deleted) {
        res.status(404).json({ message: 'Notification not found' });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting notification', error });
    }
  }
}

export default NotificationController;