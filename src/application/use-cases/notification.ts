import { INotificationRepository } from '../../domain/repositories/INotificationRepository';
import { Notification } from '../../domain/entities/Notification';

export class NotificationService {
  constructor(private notificationRepository: INotificationRepository) {}

  // Send a notification
  public async sendNotification(notification: Notification): Promise<Notification> {
    return this.notificationRepository.createNotification(notification);
  }

  // Retrieve notifications for a specific user
  public async getNotificationsByUserId(userId: string): Promise<Notification[]> {
    return this.notificationRepository.getAllNotifications().then((notifications) =>
      notifications.filter((notification) => notification.userId === userId)
    );
  }

  // Retrieve a notification by its ID
  public async getNotificationById(notificationId: string): Promise<Notification | null> {
    return this.notificationRepository.getNotificationById(notificationId);
  }

  // Update a notification
  public async updateNotification(notificationId: string, updates: Partial<Notification>): Promise<Notification | null> {
    return this.notificationRepository.updateNotification(notificationId, updates);
  }

  // Delete a notification
  public async deleteNotification(notificationId: string): Promise<boolean> {
    return this.notificationRepository.deleteNotification(notificationId);
  }
}