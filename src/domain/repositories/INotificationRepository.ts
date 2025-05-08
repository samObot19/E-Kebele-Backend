import { Notification } from '../entities/Notification';

export interface INotificationRepository {
    createNotification(notification: Notification): Promise<Notification>;
    getNotificationById(notificationId: string): Promise<Notification | null>;
    getAllNotifications(): Promise<Notification[]>;
    updateNotification(notificationId: string, notification: Partial<Notification>): Promise<Notification | null>;
    deleteNotification(notificationId: string): Promise<boolean>;
}