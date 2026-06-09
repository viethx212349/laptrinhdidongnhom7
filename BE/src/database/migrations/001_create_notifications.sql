-- =====================================================
-- InternFlow — Notifications Table Migration
-- =====================================================
-- Run this SQL in Supabase SQL Editor to create the
-- notifications table and seed sample data.
-- =====================================================

-- 1. Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intern_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('NEW_TASK', 'DEADLINE_REMINDER', 'NEEDS_REVISION', 'TASK_COMPLETED')),
  is_read BOOLEAN NOT NULL DEFAULT false,
  task_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_notifications_intern_id ON notifications(intern_id);
CREATE INDEX IF NOT EXISTS idx_notifications_intern_unread ON notifications(intern_id, is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Intern chỉ xem được thông báo của chính mình
-- (Áp dụng khi dùng Supabase Auth — với anon key + BE middleware thì chưa enforce)
-- CREATE POLICY "Interns can view own notifications"
--   ON notifications FOR SELECT
--   USING (auth.uid() = intern_id);

-- =====================================================
-- SAMPLE DATA — Dùng cho development/testing
-- Thay 'INTERN_UUID_HERE' bằng UUID thật từ bảng interns
-- =====================================================

-- Uncomment và chạy sau khi có intern data:

-- INSERT INTO notifications (intern_id, title, message, type, is_read, task_id, created_at) VALUES
-- ('INTERN_UUID_HERE', 'New Task Assigned', 'Mobile Wireframe Prototyping has been assigned to you.', 'NEW_TASK', false, null, now() - interval '1 hour'),
-- ('INTERN_UUID_HERE', 'Deadline Reminder', 'Core API Infrastructure is due tomorrow.', 'DEADLINE_REMINDER', false, null, now() - interval '3 hours'),
-- ('INTERN_UUID_HERE', 'Cần sửa bài nộp', 'Mentor đã gửi phản hồi cho task Mobile Wireframe Prototyping. Vui lòng xem và chỉnh sửa.', 'NEEDS_REVISION', false, null, now() - interval '5 hours'),
-- ('INTERN_UUID_HERE', 'New Task Assigned', 'System Architecture Audit has been assigned to you.', 'NEW_TASK', true, null, now() - interval '26 hours'),
-- ('INTERN_UUID_HERE', 'Deadline Reminder', 'Design System Documentation deadline is approaching.', 'DEADLINE_REMINDER', true, null, now() - interval '28 hours'),
-- ('INTERN_UUID_HERE', 'Task hoàn thành', 'Task Database Migration Script đã được Mentor duyệt.', 'TASK_COMPLETED', true, null, now() - interval '30 hours');
