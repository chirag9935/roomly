import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // send the httpOnly auth cookie on every request
});


let isRefreshing = false;

// Handle expired access tokens globally: try a silent refresh once, and only
// force a logout/redirect if that refresh also fails.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry && !isRefreshing) {
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        await api.post('/auth/refresh');
        isRefreshing = false;
        return api(originalRequest); // retry the original request with the new cookie
      } catch (refreshErr) {
        isRefreshing = false;
        window.location.href = '/login';
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;