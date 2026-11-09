import axios from 'axios';

// Set VITE_API_URL at build time to point at a deployed backend.
export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5005').replace(/\/+$/, '');

export const api = axios.create({ baseURL: `${API_URL}/api` });
