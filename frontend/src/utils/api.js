import axios from 'axios';

const API_BASE = 'https://helpdesk-backend-cmvq.onrender.com';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

export const complaintsAPI = {
  getAll: (params) => api.get('/complaints', { params }),
  getById: (ticketId) => api.get(`/complaints/${ticketId}`),
  create: (data) => api.post('/complaints', data),
  update: (id, data) => api.put(`/complaints/${id}`, data),
  delete: (id) => api.delete(`/complaints/${id}`)
};

export const statsAPI = {
  getDashboard: () => api.get('/stats/dashboard')
};

export const emailAPI = {
  getTemplates: () => api.get('/email/templates'),
  getTemplate: (type, ticketId) => api.get(`/email/template/${type}/${ticketId}`),
  markSent: (id) => api.post(`/email/mark-sent/${id}`)
};

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  verify: (token) => api.post('/auth/verify', { token })
};

export default api;