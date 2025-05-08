import { INotificationRepository } from '../../domain/repositories/INotificationRepository';
import { Notification } from '../../domain/entities/Notification';

export class NotificationRepository implements INotificationRepository {
  private notifications: Notification[] = [];

  async createNotification(notification: Notification): Promise<Notification> {
    this.notifications.push(notification);
    return notification;
  }

  async getNotificationById(notificationId: string): Promise<Notification | null> {
    return this.notifications.find(notification => notification.notificationId === notificationId) || null;
  }

  async getAllNotifications(): Promise<Notification[]> {
    return this.notifications;
  }

  async updateNotification(notificationId: string, notification: Partial<Notification>): Promise<Notification | null> {
    const index = this.notifications.findIndex(n => n.notificationId === notificationId);
    if (index !== -1) {
      this.notifications[index] = { ...this.notifications[index], ...notification };
      return this.notifications[index];
    }
    return null;
  }

  async deleteNotification(notificationId: string): Promise<boolean> {
    const index = this.notifications.findIndex(notification => notification.notificationId === notificationId);
    if (index !== -1) {
      this.notifications.splice(index, 1);
      return true;
    }
    return false;
  }
}