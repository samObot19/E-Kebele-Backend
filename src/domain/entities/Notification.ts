export class Notification {
  notificationId: string;
  message: string;
  channel: string;
  userId: string; // Add userId property

  constructor(notificationId: string, message: string, channel: string, userId: string) {
    this.notificationId = notificationId;
    this.message = message;
    this.channel = channel;
    this.userId = userId; // Initialize userId
  }
}