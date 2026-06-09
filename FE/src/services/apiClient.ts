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

const API_BASE_URL = 'http://localhost:3001';

export async function verifyInternCode(internCode: string): Promise<InternVerifyResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
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
  const response = await fetch(`${API_BASE_URL}/api/interns/${internId}/dashboard`);

  if (!response.ok) {
    throw new Error('Network error');
  }

  return (await response.json()) as InternDashboardResponse;
}
