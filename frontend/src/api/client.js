import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  // Events
  getEvents: (filters = {}) => 
    apiClient.get('/events', { params: filters }),
  getEvent: (eventId) => 
    apiClient.get(`/events/${eventId}`),
  fetchEvents: () => 
    apiClient.post('/events/fetch'),

  // Predictions
  getPredictions: (filters = {}) => 
    apiClient.get('/predictions', { params: filters }),
  getPredictionSummary: () => 
    apiClient.get('/predictions/summary'),

  // Search
  searchEvents: (query, limit = 20) => 
    apiClient.get('/search', { params: { q: query, limit } }),

  // Chat
  chatWithAI: (message) => 
    apiClient.post('/chat', { message }),

  // Health check
  health: () => 
    apiClient.get('/health'),
};

export default apiClient;
