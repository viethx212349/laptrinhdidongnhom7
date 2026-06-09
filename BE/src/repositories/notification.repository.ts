/**
 * Notification Repository — Data access layer for notifications table
 * 
 * Uses Supabase as the database client.
 * All queries are scoped to a specific intern_id for data isolation.
 */
import supabase from '../config/supabase';
import {
  Notification,
  NotificationResponse,
  PaginationParams,
  PaginatedResponse,
} from '../types/notification.types';

/**
 * Lấy danh sách thông báo của intern, sắp xếp mới nhất lên đầu
 */
export const getNotificationsByInternId = async (
  internId: string,
  pagination: PaginationParams
): Promise<PaginatedResponse<NotificationResponse>> => {
  const { page, limit } = pagination;
  const offset = (page - 1) * limit;

  // Get total count
  const { count, error: countError } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('intern_id', internId);

  if (countError) {
    throw new Error(`Failed to count notifications: ${countError.message}`);
  }

  const total = count || 0;

  // Get paginated data
  const { data, error } = await supabase
    .from('notifications')
    .select('id, title, message, type, is_read, task_id, created_at')
    .eq('intern_id', internId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new Error(`Failed to fetch notifications: ${error.message}`);
  }

  return {
    data: (data || []) as NotificationResponse[],
    pagination: {
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Lấy một thông báo theo ID
 */
export const getNotificationById = async (
  notificationId: string
): Promise<Notification | null> => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('id', notificationId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw new Error(`Failed to fetch notification: ${error.message}`);
  }

  return data as Notification;
};

/**
 * Đánh dấu một thông báo là đã đọc
 */
export const markNotificationAsRead = async (
  notificationId: string,
  internId: string
): Promise<boolean> => {
  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
    .eq('intern_id', internId)
    .select('id');

  if (error) {
    throw new Error(`Failed to mark notification as read: ${error.message}`);
  }

  // Returns true if a row was actually updated
  return (data && data.length > 0) || false;
};

/**
 * Đánh dấu tất cả thông báo chưa đọc của intern thành đã đọc
 */
export const markAllNotificationsAsRead = async (
  internId: string
): Promise<number> => {
  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('intern_id', internId)
    .eq('is_read', false)
    .select('id');

  if (error) {
    throw new Error(`Failed to mark all notifications as read: ${error.message}`);
  }

  return data?.length || 0;
};

/**
 * Đếm số thông báo chưa đọc của intern
 */
export const getUnreadCount = async (internId: string): Promise<number> => {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('intern_id', internId)
    .eq('is_read', false);

  if (error) {
    throw new Error(`Failed to count unread notifications: ${error.message}`);
  }

  return count || 0;
};
