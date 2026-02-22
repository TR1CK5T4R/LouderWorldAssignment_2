/**
 * axiosInstance.js
 * Shared Axios instance with JWT request/response interceptors.
 *
 * REQUEST: Reads the token from localStorage and attaches it as
 *          `Authorization: Bearer <token>` on every outgoing request.
 *
 * RESPONSE: On a 401, clears the stored token and dispatches a custom
 *           'auth:logout' event so AuthContext can react without a circular
 *           dependency (Context → axios → Context).
 */
import axios from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/',
    timeout: 130_000,
    headers: { 'Content-Type': 'application/json' },
});

/* ── REQUEST interceptor: attach JWT ───────────────────────── */
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

/* ── RESPONSE interceptor: handle 401 ─────────────────────── */
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 401) {
            // Clear stored credentials and signal the app to logout
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            window.dispatchEvent(new CustomEvent('auth:logout'));
        }
        return Promise.reject(error);
    }
);

export default instance;
