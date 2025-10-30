import axios from 'axios';

// This is the file that defines where the backend is located
const api = axios.create({
  baseURL: 'http://localhost:5001/api', // Backend URL
});

// This interceptor ensures the token is sent with every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;