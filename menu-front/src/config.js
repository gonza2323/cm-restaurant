// src/config.js
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';
export const BASE_URL = import.meta.env.VITE_BASE_URL ?? 'http://localhost:8080';
console.log(import.meta.env);