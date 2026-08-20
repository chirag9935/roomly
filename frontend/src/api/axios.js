import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // send the httpOnly auth cookie on every request
});


let isRefreshing = false;
// Requests that arrive with a 401 while a refresh is already in flight are
// queued here instead of being silently rejected — they get replayed (or
// rejected together) once the in-flight refresh settles.
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

function onRefreshSettled(refreshErr) {
  refreshSubscribers.forEach((cb) => cb(refreshErr));
  refreshSubscribers = [];
}

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

    if (error.response?.status === 401 && !originalRequest._retry && !matchesPath(originalRequest, NO_REFRESH_PATHS)) {
      originalRequest._retry = true;

      // A refresh is already in flight (e.g. several requests 401'd at once
      // on page load) — queue this request instead of rejecting it outright,
      // so it gets retried (or rejected) once that refresh settles.
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((refreshErr) => {
            if (refreshErr) {
              reject(refreshErr);
            } else {
              resolve(api(originalRequest));
            }
          });
        });
      }

      isRefreshing = true;
      try {
        await api.post('/auth/refresh');
        isRefreshing = false;
        onRefreshSettled(null);
        return api(originalRequest); // retry the original request with the new cookie
      } catch (refreshErr) {
        isRefreshing = false;
        onRefreshSettled(refreshErr);
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