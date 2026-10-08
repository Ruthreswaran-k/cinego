export class NotificationRepository {
  async getNotifications(customerId: string): Promise<any[]> {
    throw new Error('Not implemented yet');
  }
  async markAsRead(id: string): Promise<void> {
    throw new Error('Not implemented yet');
  }
  async createNotification(notification: any): Promise<void> {
    throw new Error('Not implemented yet');
  }
}
export const notificationRepository = new NotificationRepository();
