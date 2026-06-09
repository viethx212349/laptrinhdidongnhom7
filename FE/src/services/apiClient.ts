import { Platform } from 'react-native';

/**
 * API Client — centralized HTTP client for Backend communication
 */

// Sửa lỗi: localhost trên Android Emulator sẽ trỏ vào chính máy ảo chứ không phải máy tính chạy BE.
// Nếu chạy trên thiết bị thật, vui lòng đổi IP này thành IPv4 của máy tính (VD: http://192.168.1.x:3001/api)
export const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3001/api' : 'http://localhost:3001/api';

export interface InternVerifyPayload {
  intern_code: string;
}

export interface InternVerifyResponse {
  success: boolean;
  data: {
    intern_id: string;
    intern_code: string;
    full_name: string;
    email?: string;
    position?: string;
    status?: string;
  };
  message?: string;
}

export interface InternDashboardTask {
  id: string;
  title: string;
  date: string | null;
  status: 'ĐANG LÀM' | 'CẦN SỬA' | 'CHỜ DUYỆT' | 'HOÀN THÀNH' | 'TRỄ HẠN';
  mentor_feedback?: string | null;
  submission_summary?: string | null;
}

export interface InternDashboardSummary {
  total_tasks: number;
  completed_count: number;
  overdue_count: number;
}

export interface InternDashboardResponse {
  success: boolean;
  data: {
    intern: {
      intern_id: string;
      intern_code: string;
      full_name: string;
      email?: string | null;
      position?: string | null;
      status?: string | null;
      phone?: string | null;
      school?: string | null;
    };
    summary: InternDashboardSummary;
    tasks: InternDashboardTask[];
  };
  message?: string;
}

export async function verifyInternCode(internCode: string): Promise<InternVerifyResponse> {
  const response = await fetch(`${BASE_URL}/auth/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ intern_code: internCode }),
  });

  if (!response.ok) {
    throw new Error('Network error');
  }

  return (await response.json()) as InternVerifyResponse;
}

export async function fetchInternDashboard(internId: string): Promise<InternDashboardResponse> {
  const response = await fetch(`${BASE_URL}/interns/${internId}/dashboard`);

  if (!response.ok) {
    throw new Error('Network error');
  }

  return (await response.json()) as InternDashboardResponse;
}

/**
 * Generic fetch wrapper với error handling
 */
export const apiClient = {
  get: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // TODO: Thêm auth token khi có authentication
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },

  post: async <T>(endpoint: string, body: unknown): Promise<T> => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },

  upload: async <T>(endpoint: string, formData: FormData): Promise<T> => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },
};

export default apiClient;
