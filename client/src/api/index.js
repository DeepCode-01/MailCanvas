import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

// Set base URL for all axios requests
axios.defaults.baseURL = API_URL;

export const sequencesApi = {
  getAll: () => axios.get('/sequences'),
  getById: (id) => axios.get(`/sequences/${id}`),
  create: (data) => axios.post('/sequences', data),
  update: (id, data) => axios.put(`/sequences/${id}`, data),
  delete: (id) => axios.delete(`/sequences/${id}`),
};

export const emailsApi = {
  schedule: (data) => axios.post('/emails/schedule', data),
  getHistory: () => axios.get('/emails/history'),
};