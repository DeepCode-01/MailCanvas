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

export const createFlow = async (flowData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/create`, flowData);
    return response.data;
  } catch (error) {
    console.error('Error creating flow:', error);
    throw error;
  }
};

// Get a flow by ID
export const getFlowById = async (flowId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${flowId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching flow:', error);
    throw error;
  }
};

// Update a flow
export const updateFlow = async (flowId, updatedData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/update/${flowId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating flow:', error);
    throw error;
  }
};

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