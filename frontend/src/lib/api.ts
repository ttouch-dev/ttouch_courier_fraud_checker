import axios from "axios";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import type { Courier, Plan } from "../types";

const API_BASE_URL = "https://ttouch-courier-fraud-checker.onrender.com/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = "/login";
      toast.error("Session expired. Please login again.");
    } else if (error.response?.status >= 500) {
      toast.error("Server error. Please try again later.");
    }

    return Promise.reject(error);
  }
);

export default api;

export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),

  register: (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) => api.post("/auth/register", data),

  me: () => api.get("/auth/me"),
};

export const searchApi = {
  checkPhone: (phone: string) => api.post("/search/check", { phone }),

  getHistory: (params: {
    page?: number;
    limit?: number;
    search?: string;
  }) => api.get("/search/history", { params }),
};

export const usersApi = {
  getAll: (params: {
    page?: number;
    limit?: number;
    search?: string;
    plan?: string;
  }) => api.get("/users", { params }),

  getById: (id: string) => api.get(`/users/${id}`),

  update: (
    id: string,
    data: Partial<{
      name: string;
      email: string;
      phone: string;
      plan: string;
      isActive: boolean;
    }>
  ) => api.patch(`/users/${id}`, data),

  delete: (id: string) => api.delete(`/users/${id}`),

  generateToken: () => api.post("/users/generate-token"),
};

export const plansApi = {
  getAll: () => api.get("/plans"),

  create: (data: Partial<Plan>) => api.post("/plans", data),

  update: (id: string, data: Partial<Plan>) =>
    api.patch(`/plans/${id}`, data),

  delete: (id: string) => api.delete(`/plans/${id}`),
};

export const paymentsApi = {
  initiate: (planId: string, method: string) =>
    api.post("/payments/initiate", { planId, method }),

  getTransactions: (params: {
    page?: number;
    limit?: number;
    status?: string;
  }) => api.get("/payments/transactions", { params }),

  refund: (txId: string) => api.post(`/payments/${txId}/refund`),

  getBillingHistory: () => api.get("/payments/billing-history"),
};

export const couriersApi = {
  getAll: () => api.get("/couriers"),

  update: (id: string, data: Partial<Courier>) =>
    api.patch(`/couriers/${id}`, data),

  toggle: (id: string) => api.post(`/couriers/${id}/toggle`),
};

export const dashboardApi = {
  getStats: () => api.get("/dashboard/stats"),

  getRevenueChart: (period: string) =>
    api.get("/dashboard/revenue-chart", { params: { period } }),

  getSearchChart: () => api.get("/dashboard/search-chart"),
};