import axios from "axios";

export const API_BASE = `http://${window.location.hostname}:8888`;

export const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const endpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
  },
  series: {
    list: "/series",
    trending: "/series/trending",
  },
  history: (userId) => `/history/${userId}/history`,
  historyPush: (userId, serieId) =>
    `/history/${userId}/history/${encodeURIComponent(serieId)}`,
  recommendations: (userId) =>
    `/recommendation/${userId}/recommendations`,
};
