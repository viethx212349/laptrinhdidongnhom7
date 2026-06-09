/**
 * Notification Types — shared type definitions for notification domain
 */

// Các loại thông báo theo nghiệp vụ Mobile
export type NotificationType =
  | 'NEW_TASK'             // Được giao task mới
  | 'DEADLINE_REMINDER'    // Nhắc nhở deadline
  | 'NEEDS_REVISION'       // Cần sửa bài nộp (KHÔNG dùng REJECTED)
  | 'TASK_COMPLETED';      // Task đã được duyệt hoàn thành

// Notification entity từ database
export interface Notification {
  id: string;
  intern_id: string;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  task_id: string | null;
  created_at: string;
}

// Response format cho API (không expose intern_id)
export interface NotificationResponse {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  task_id: string | null;
  created_at: string;
}

// Pagination params
export interface PaginationParams {
  page: number;
  limit: number;
}

// Paginated response
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}
