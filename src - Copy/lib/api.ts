import axios from 'axios';

const API_BASE_URL = 'http://localhost/jatri_ovijog/api';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  auth: {
    login: async (email: string, password: string) => {
      const response = await axiosInstance.post('/auth/login.php', {
        email,
        password
      });
      return response.data;
    },
    register: async (userData: any) => {
      const response = await axiosInstance.post('/auth/register.php', userData);
      return response.data;
    }
  },
  reports: {
    create: async (formData: FormData) => {
      const response = await axiosInstance.post('/reports/create.php', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    },
    getAll: async () => {
      const response = await axiosInstance.get('/reports/list.php');
      return response.data;
    },
    getById: async (id: string) => {
      const response = await axiosInstance.get(`/reports/view.php?id=${id}`);
      return response.data;
    },
    update: async (id: string, data: any) => {
      const response = await axiosInstance.put(`/reports/update.php?id=${id}`, data);
      return response.data;
    }
  },
  likes: {
    toggle: async (reportId: string) => {
      const response = await axiosInstance.post('/reports/toggle_like.php', {
        report_id: reportId
      });
      return response.data;
    }
  },
  comments: {
    create: async (reportId: string, content: string) => {
      const response = await axiosInstance.post('/reports/add_comment.php', {
        report_id: reportId,
        content
      });
      return response.data;
    },
    getByReport: async (reportId: string) => {
      const response = await axiosInstance.get(`/reports/comments.php?report_id=${reportId}`);
      return response.data;
    }
  }
};