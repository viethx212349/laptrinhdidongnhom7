/**
 * Mock notification data
 * Covers 3 types: NEW_TASK, DEADLINE_REMINDER, REVISION_REQUIRED
 * Grouped by time: TODAY and YESTERDAY
 * Mix of read and unread notifications
 */
import { Notification } from '../types/types';

// Helper: get ISO date string for today/yesterday
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

const todayISO = today.toISOString();
const yesterdayISO = yesterday.toISOString();

// Create dates with specific hours for "Xh ago" display
const hoursAgo = (hours: number): string => {
  const d = new Date();
  d.setHours(d.getHours() - hours);
  return d.toISOString();
};

export const MOCK_NOTIFICATIONS: Notification[] = [
  // === TODAY — unread ===
  {
    id: 'n1',
    title: 'New Task Assigned',
    message: 'Mobile Wireframe Prototyping has been assigned to you.',
    type: 'NEW_TASK',
    isRead: false,
    createdAt: hoursAgo(1),
    taskId: '3',
  },
  {
    id: 'n2',
    title: 'Deadline Reminder',
    message: 'Core API Infrastructure is due tomorrow.',
    type: 'DEADLINE_REMINDER',
    isRead: false,
    createdAt: hoursAgo(3),
    taskId: '2',
  },
  {
    id: 'n3',
    title: 'Cần sửa bài nộp',
    message: 'Mentor đã gửi phản hồi cho task Mobile Wireframe Prototyping. Vui lòng xem và chỉnh sửa.',
    type: 'REVISION_REQUIRED',
    isRead: false,
    createdAt: hoursAgo(5),
    taskId: '3',
  },

  // === YESTERDAY — read ===
  {
    id: 'n4',
    title: 'New Task Assigned',
    message: 'System Architecture Audit has been assigned to you.',
    type: 'NEW_TASK',
    isRead: true,
    createdAt: hoursAgo(26),
    taskId: '1',
  },
  {
    id: 'n5',
    title: 'Deadline Reminder',
    message: 'Design System Documentation deadline is approaching.',
    type: 'DEADLINE_REMINDER',
    isRead: true,
    createdAt: hoursAgo(28),
    taskId: '4',
  },
  {
    id: 'n6',
    title: 'Cần sửa bài nộp',
    message: 'Mentor đã gửi phản hồi cho task Database Migration Script. Vui lòng kiểm tra lại.',
    type: 'REVISION_REQUIRED',
    isRead: true,
    createdAt: hoursAgo(30),
    taskId: '5',
  },
];
