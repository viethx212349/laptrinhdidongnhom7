/**
 * Shared TypeScript types for InternFlow Mobile App
 */

// =============================================================================
// Task Status — determined by Backend, FE only reads this
// =============================================================================
export type TaskStatus =
  | 'IN_PROGRESS'     // Đang thực hiện → form MỞ
  | 'IN_REVIEW'       // Chờ duyệt → form KHÓA
  | 'DONE'            // Hoàn thành → form KHÓA
  | 'NEEDS_REVISION'  // Cần sửa (Mentor yêu cầu) → form MỞ + hiện feedback
  | 'OVERDUE';        // Trễ hạn → form KHÓA

// =============================================================================
// Technical Brief / Tài liệu đính kèm
// =============================================================================
export interface TechnicalBrief {
  id: string;
  name: string;           // e.g. "INFRA_SPECS_V2.PDF"
  type: 'pdf' | 'png' | 'doc' | 'link' | 'other';
  url: string;            // URL để download hoặc mở
}

// =============================================================================
// Mentor Feedback — chỉ có khi status = NEEDS_REVISION
// =============================================================================
export interface MentorFeedback {
  content: string;
  date: string;
}

// =============================================================================
// Task Detail — dữ liệu đầy đủ của 1 task từ API
// =============================================================================
export interface TaskDetail {
  id: string;
  title: string;
  dueDate: string;
  assignee: string;
  description: string;
  status: TaskStatus;
  technicalBriefs: TechnicalBrief[];
  feedback?: MentorFeedback;       // Chỉ có khi status = NEEDS_REVISION
  submittedReport?: string;        // Nội dung báo cáo đã nộp trước đó (nếu có)
}

// =============================================================================
// Task (list item) — dùng cho TaskCard trên TaskListScreen
// =============================================================================
export interface Task {
  id: string;
  title: string;
  mentor: string;
  date: string;
  status: TaskStatus;
}

// =============================================================================
// Submit Report Payload — dữ liệu gửi lên khi nộp báo cáo
// =============================================================================
export interface SubmitReportPayload {
  taskId: string;
  content: string;
  attachmentUri?: string;
  attachmentName?: string;
}

// =============================================================================
// Navigation Param Types
// =============================================================================
export type RootStackParamList = {
  TaskList: undefined;
  TaskDetail: { taskId: string };
};
