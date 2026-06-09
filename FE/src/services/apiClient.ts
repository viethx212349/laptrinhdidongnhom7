/**
 * API Client — centralized HTTP client for Backend communication
 * 
 * Khi Backend sẵn sàng, cấu hình BASE_URL và implement các method.
 * Hiện tại app dùng mock data từ taskService.ts
 */

// TODO: Thay bằng URL Backend thật khi deploy
const BASE_URL = 'http://localhost:3001/api';

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

  /**
   * Upload file (multipart/form-data)
   */
  upload: async <T>(endpoint: string, formData: FormData): Promise<T> => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      body: formData,
      // Note: Don't set Content-Type for multipart, fetch will set it automatically
    });

    if (!response.ok) {
      throw new Error(`Upload Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },
};

export default apiClient;