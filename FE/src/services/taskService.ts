/**
 * Task Service — mock implementation
 * Khi Backend sẵn sàng, thay nội dung các hàm bằng fetch/axios call thật.
 */
import { TaskDetail, TaskStatus, SubmitReportPayload } from '../types/types';
import apiClient from './apiClient';

/**
 * Lấy chi tiết task theo ID
 */
export const getTaskDetail = async (taskId: string): Promise<TaskDetail | null> => {
  try {
    const response = await apiClient.get(`/tasks/${taskId}`) as any;
    const raw = response.data;
    if (!raw) return null;

    let mappedStatus: TaskStatus = 'IN_PROGRESS';
    if (raw.display_status === 'ĐANG LÀM') mappedStatus = 'IN_PROGRESS';
    else if (raw.display_status === 'CẦN SỬA') mappedStatus = 'NEEDS_REVISION';
    else if (raw.display_status === 'CHỜ DUYỆT') mappedStatus = 'IN_REVIEW';
    else if (raw.display_status === 'HOÀN THÀNH') mappedStatus = 'DONE';
    else if (raw.display_status === 'TRỄ HẠN') mappedStatus = 'OVERDUE';

    return {
      id: raw.id,
      title: raw.title,
      dueDate: raw.due_date ? new Date(raw.due_date).toLocaleDateString('vi-VN') : 'Không có',
      assignee: raw.interns?.full_name || 'Chưa gán',
      description: raw.description || 'Không có mô tả',
      status: mappedStatus,
      technicalBriefs: (raw.attachments || []).map((a: any) => ({
        id: a.id,
        name: a.file_name || 'Tài liệu đính kèm',
        type: a.type || 'link',
        url: a.file_url || '#'
      })),
      feedback: raw.mentor_feedback ? {
        content: raw.mentor_feedback,
        date: raw.updated_at ? new Date(raw.updated_at).toLocaleDateString('vi-VN') : ''
      } : undefined,
      submittedReport: raw.submission_summary || undefined,
      submittedLink: raw.submission_link || undefined
    };
  } catch (error) {
    console.error('Error fetching task detail:', error);
    return null;
  }
};

/**
 * Nộp báo cáo
 */
export const submitReport = async (
  payload: SubmitReportPayload
): Promise<{ success: boolean; message: string }> => {
  try {
    const formData = new FormData();
    if (payload.content) {
      formData.append('submission_summary', payload.content);
    }
    
    if (payload.attachmentUri && payload.attachmentName) {
      formData.append('file', {
        uri: payload.attachmentUri,
        name: payload.attachmentName,
        type: payload.attachmentType || 'application/octet-stream',
      } as any);
    }

    const response = await apiClient.upload(`/tasks/${payload.taskId}/submit`, formData) as any;
    return {
      success: response.success,
      message: response.message || 'Báo cáo đã được nộp thành công!',
    };
  } catch (error: any) {
    console.error('Error submitting report:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Có lỗi xảy ra khi nộp báo cáo.',
    };
  }
};

/**
 * Kiểm tra task có cho phép nộp báo cáo không
 * Chỉ IN_PROGRESS và NEEDS_REVISION mới được nộp
 */
export const canSubmitReport = (status: TaskStatus | string): boolean => {
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