// src/services/leadService.js — Public API calls
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

/**
 * Submit a new lead
 * @param {{ name: string, email: string, budgetRange: string, message: string }} data
 */
export const submitLead = (data) => api.post('/leads', data);
