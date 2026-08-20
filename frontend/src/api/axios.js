import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // send the httpOnly auth cookie on every request
});


let isRefreshing = false;

// Endpoints where a 401 must never trigger a nested refresh attempt or the
// hard redirect below — /auth/refresh, /auth/login etc. failing is a normal
// outcome (wrong password, no session), not a session-expiry event.
const NO_REFRESH_PATHS = ['/auth/login', '/auth/signup', '/auth/refresh', '/auth/logout'];

// /auth/me is the session bootstrap check called on every app load (see
// AuthContext). A 401 there can mean "not logged in" — a normal, valid state
// — so unlike other protected requests, a failed refresh must NOT force a
// redirect here, or a logged-out visitor on ANY page gets bounced into an
// infinite reload loop (/auth/me 401s -> refresh fails -> redirect to /login
// -> remounts app -> /auth/me 401s again -> ...). AuthContext already
// handles this case correctly by setting user to null.
const NO_REDIRECT_PATHS = [...NO_REFRESH_PATHS, '/auth/me'];

function matchesPath(config, paths) {
  return paths.some((path) => config.url?.includes(path));
}

// Handle expired access tokens globally: try a silent refresh once, and only
// force a logout/redirect if that refresh also fails on a genuine protected
// request.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry && !isRefreshing && !matchesPath(originalRequest, NO_REFRESH_PATHS)) {
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        await api.post('/auth/refresh');
        isRefreshing = false;
        return api(originalRequest); // retry the original request with the new cookie
      } catch (refreshErr) {
        isRefreshing = false;
        if (!matchesPath(originalRequest, NO_REDIRECT_PATHS)) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;