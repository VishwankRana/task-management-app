import axios from 'axios';

/**
 * API base URL.
 * - Local dev: defaults to http://localhost:3000
 * - Vercel production: set VITE_API_URL to your Render API URL (e.g. https://task-manager-api.onrender.com)
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_URL !== undefined
    ? import.meta.env.VITE_API_URL
    : 'http://localhost:3000';

export const API_TASKMANAGER = `${API_BASE_URL}/api/taskmanager`;

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default api;
