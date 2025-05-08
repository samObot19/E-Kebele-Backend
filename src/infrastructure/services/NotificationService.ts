import { INotificationRepository } from '../../domain/repositories/INotificationRepository';
import { Notification } from '../../domain/entities/Notification';

export class NotificationService {
    private notificationRepository: INotificationRepository;

    constructor(notificationRepository: INotificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    async sendNotification(notification: Notification): Promise<void> {
        // Logic to send notification
        await this.notificationRepository.save(notification);
    }

    async getNotifications(userId: string): Promise<Notification[]> {
        // Logic to retrieve notifications for a user
        return await this.notificationRepository.findByUserId(userId);
    }

    async deleteNotification(notificationId: string): Promise<void> {
        // Logic to delete a notification
        await this.notificationRepository.delete(notificationId);
    }
}