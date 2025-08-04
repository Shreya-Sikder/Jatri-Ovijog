import axios from 'axios';

const API_BASE_URL = 'http://localhost/jatri_ovijog/api';

export const api = {
  reports: {
    create: async (formData: FormData) => {
      const response = await axios.post(`${API_BASE_URL}/reports/create.php`, formData);
      return response.data;
    },
    getAll: async () => {
      const response = await axios.get(`${API_BASE_URL}/reports/read.php`);
      return response.data;
    }
  }
};