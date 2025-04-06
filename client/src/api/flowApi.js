import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL
const api = axios.create({ baseURL: API_URL });

// Add authorization header if user is logged in
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Flow operations
export const saveFlow = async (flowData) => {
  const response = await api.post('/flows', flowData);
  return response.data;
};

export const loadFlow = async (flowId) => {
  const response = await api.get(`/flows/${flowId}`);
  return response.data;
};

export const listFlows = async () => {
  const response = await api.get('/flows');
  return response.data;
};

export const deleteFlow = async (flowId) => {
  const response = await api.delete(`/flows/${flowId}`);
  return response.data;
};

// Email operations
export const scheduleEmail = async (emailData) => {
  const response = await api.post('/emails/schedule', emailData);
  return response.data;
};

export const getScheduledEmails = async () => {
  const response = await api.get('/emails/scheduled');
  return response.data;
};

// Auth operations
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  localStorage.setItem('token', response.data.token);
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};

export default api;