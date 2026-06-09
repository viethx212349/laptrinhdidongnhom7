/**
 * Notification Controller — handles HTTP request/response logic
 * 
 * Controllers validate input, call repository, and format responses.
 * Business logic stays thin here — complex logic should go in a service layer.
 */
import { Request, Response } from 'express';
import * as notificationRepo from '../repositories/notification.repository';

/**
 * GET /api/me/notifications
 * Lấy danh sách thông báo của Intern hiện tại
 */
export const getNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const internId = req.internId!;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));

    const result = await notificationRepo.getNotificationsByInternId(internId, {
      page,
      limit,
    });

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('[NotificationController] getNotifications error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Không thể lấy danh sách thông báo.',
      },
    });
  }
};

/**
 * PUT /api/me/notifications/:id/read
 * Đánh dấu một thông báo cụ thể là đã đọc
 */
export const markAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const internId = req.internId!;
    const notificationId = req.params.id;

    if (!notificationId) {
      res.status(400).json({
        success: false,
        error: {
          code: 'BAD_REQUEST',
          message: 'Missing notification id.',
        },
      });
      return;
    }

    // Check if notification exists
    const notification = await notificationRepo.getNotificationById(notificationId as string);

    if (!notification) {
      res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Thông báo không tồn tại.',
        },
      });
      return;
    }

    // Check ownership — Intern không thể đọc thông báo của người khác
    if (notification.intern_id !== internId) {
      res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Bạn không có quyền truy cập thông báo này.',
        },
      });
      return;
    }

    const updated = await notificationRepo.markNotificationAsRead(notificationId as string, internId as string);

    res.json({
      success: true,
      data: {
        id: notificationId,
        is_read: true,
      },
      message: 'Đã đánh dấu thông báo là đã đọc.',
    });
  } catch (error) {
    console.error('[NotificationController] markAsRead error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Không thể cập nhật thông báo.',
      },
    });
  }
};

/**
 * PUT /api/me/notifications/read-all
 * Đánh dấu tất cả thông báo chưa đọc thành đã đọc
 */
export const markAllAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const internId = req.internId!;

    const updatedCount = await notificationRepo.markAllNotificationsAsRead(internId);

    res.json({
      success: true,
      data: {
        updated_count: updatedCount,
      },
      message: `Đã đánh dấu ${updatedCount} thông báo là đã đọc.`,
    });
  } catch (error) {
    console.error('[NotificationController] markAllAsRead error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Không thể cập nhật thông báo.',
      },
    });
  }
};

/**
 * GET /api/me/notifications/unread-count
 * Đếm số thông báo chưa đọc
 */
export const getUnreadCount = async (req: Request, res: Response): Promise<void> => {
  try {
    const internId = req.internId!;

    const count = await notificationRepo.getUnreadCount(internId);

    res.json({
      success: true,
      data: {
        unread_count: count,
      },
    });
  } catch (error) {
    console.error('[NotificationController] getUnreadCount error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Không thể đếm thông báo chưa đọc.',
      },
    });
  }
};
