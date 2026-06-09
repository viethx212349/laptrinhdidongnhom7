/**
 * Task Service — mock implementation
 * Khi Backend sẵn sàng, thay nội dung các hàm bằng fetch/axios call thật.
 */
import { TaskDetail, TaskStatus, SubmitReportPayload } from '../types/types';
import { MOCK_TASK_DETAILS } from '../utils/mockData';

/**
 * Lấy chi tiết task theo ID
 */
export const getTaskDetail = async (taskId: string): Promise<TaskDetail | null> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const task = MOCK_TASK_DETAILS.find((t) => t.id === taskId);
  return task || null;
};

/**
 * Nộp báo cáo
 */
export const submitReport = async (
  payload: SubmitReportPayload
): Promise<{ success: boolean; message: string }> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock: always succeed
  console.log('[taskService] submitReport:', payload);
  return {
    success: true,
    message: 'Báo cáo đã được nộp thành công!',
  };
};

/**
 * Kiểm tra task có cho phép nộp báo cáo không
 * Chỉ IN_PROGRESS và NEEDS_REVISION mới được nộp
 */
export const canSubmitReport = (status: TaskStatus): boolean => {
  return status === 'IN_PROGRESS' || status === 'NEEDS_REVISION';
};

/**
 * Lấy label hiển thị cho trạng thái task (tiếng Việt)
 */
export const getStatusLabel = (status: TaskStatus): string => {
  switch (status) {
    case 'IN_PROGRESS':
      return 'ĐANG LÀM';
    case 'IN_REVIEW':
      return 'CHỜ DUYỆT';
    case 'DONE':
      return 'HOÀN THÀNH';
    case 'NEEDS_REVISION':
      return 'CẦN SỬA';
    case 'OVERDUE':
      return 'TRỄ HẠN';
    default:
      return status;
  }
};

/**
 * Lấy màu badge cho trạng thái task
 */
export const getStatusColor = (status: TaskStatus): { bg: string; text: string } => {
  switch (status) {
    case 'IN_PROGRESS':
      return { bg: '#E3F2FD', text: '#1565C0' };
    case 'IN_REVIEW':
      return { bg: '#FFF3E0', text: '#E65100' };
    case 'DONE':
      return { bg: '#E8F5E9', text: '#2E7D32' };
    case 'NEEDS_REVISION':
      return { bg: '#FFF8E1', text: '#F57F17' };
    case 'OVERDUE':
      return { bg: '#FFEBEE', text: '#C62828' };
    default:
      return { bg: '#F5F5F5', text: '#616161' };
  }
};