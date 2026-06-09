/**
 * Notification Routes — /api/me/notifications
 * 
 * All routes require authentication (authMiddleware).
 * Routes are scoped to the current intern's data.
 */
import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import * as notificationController from '../controllers/notification.controller';

const router = Router();

// Apply auth middleware to all notification routes
router.use(authMiddleware);

// GET  /api/me/notifications           → Lấy danh sách thông báo (phân trang)
router.get('/', notificationController.getNotifications);

// GET  /api/me/notifications/unread-count → Đếm thông báo chưa đọc
router.get('/unread-count', notificationController.getUnreadCount);

// PUT  /api/me/notifications/read-all   → Đánh dấu tất cả đã đọc
router.put('/read-all', notificationController.markAllAsRead);

// PUT  /api/me/notifications/:id/read   → Đánh dấu 1 thông báo đã đọc
router.put('/:id/read', notificationController.markAsRead);

export default router;
