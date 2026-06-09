/**
 * Notification Service — mock implementation
 * Khi Backend sẵn sàng, thay bằng API calls:
 *   GET  /api/me/notifications
 *   PUT  /api/me/notifications/read-all
 */
import { Notification } from '../types/types';
import { MOCK_NOTIFICATIONS } from '../utils/mockNotifications';

// Simulate mutable state for read/unread
let notifications: Notification[] = JSON.parse(JSON.stringify(MOCK_NOTIFICATIONS));

/**
 * Lấy danh sách thông báo
 */
export const getNotifications = async (): Promise<Notification[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [...notifications];
};

/**
 * Đếm số thông báo chưa đọc
 */
export const getUnreadCount = async (): Promise<number> => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return notifications.filter((n) => !n.isRead).length;
};

/**
 * Đánh dấu tất cả thông báo là đã đọc
 * API: PUT /api/me/notifications/read-all
 */
export const markAllAsRead = async (): Promise<{ success: boolean }> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  notifications = notifications.map((n) => ({ ...n, isRead: true }));
  return { success: true };
};

/**
 * Reset mock data (dùng cho testing)
 */
export const resetNotifications = () => {
  notifications = JSON.parse(JSON.stringify(MOCK_NOTIFICATIONS));
};

/**
 * Lấy icon name theo loại thông báo
 */
export const getNotificationIcon = (type: Notification['type']): string => {
  switch (type) {
    case 'NEW_TASK':
      return 'briefcase';
    case 'DEADLINE_REMINDER':
      return 'alarm';
    case 'REVISION_REQUIRED':
      return 'create';
    default:
      return 'notifications';
  }
};
