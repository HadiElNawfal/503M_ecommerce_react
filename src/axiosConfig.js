// axiosConfig.js
import axios from 'axios';
import config from './config';

const instance = axios.create({
  baseURL: config.server,
  withCredentials: true
});

function getCsrfTokenFromCookie() {
  const value = `${document.cookie}`;
  const parts = value.split('; csrf_token=');
  if (parts.length === 2) return parts.pop().split(';').shift();
  return '';
}

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    const csrfToken = getCsrfTokenFromCookie();
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
      console.log(`[DEBUG] CSRF Token set in headers: ${csrfToken}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);
// Response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const currentPath = window.location.pathname;
    if (error.response && error.response.status === 401 && currentPath !== '/login') {
      window.location.href = '/login';
    } else if (error.response && error.response.status === 403) {
      // Redirect to Not Authorized page
      window.location.href = '/not-authorized';
    }
    return Promise.reject(error);
  }
);

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export default instance;