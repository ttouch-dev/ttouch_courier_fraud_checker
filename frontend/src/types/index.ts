export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  plan: "FREE" | "STARTER" | "PRO" | "ENTERPRISE";
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
  apiToken?: string;
  isActive: boolean;
  createdAt: string;
  searchCount: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface CourierResult {
  courier: string;
  logo: string;
  total: number;
  success: number;
  cancel: number;
  successRate: number;
  status: "active" | "inactive";
}

export interface SearchResult {
  phone: string;
  totalOrders: number;
  totalSuccess: number;
  totalCancel: number;
  overallSuccessRate: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  couriers: CourierResult[];
  searchedAt: string;
}

export interface SearchLog {
  id: string;
  userId: string;
  userName: string;
  phone: string;
  successRate: number;
  riskLevel: string;
  createdAt: string;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: "MONTHLY" | "YEARLY";
  searchLimit: number;
  features: string[];
  isActive: boolean;
  isPopular?: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  method: string;
  transactionId: string;
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  planName: string;
  createdAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  startDate: string;
  endDate: string;
  status: "ACTIVE" | "EXPIRED" | "CANCELLED";
  autoRenew: boolean;
}

export interface Courier {
  id: string;
  name: string;
  slug: string;
  logo: string;
  apiUrl: string;
  isActive: boolean;
  totalSearches: number;
}

export interface DashboardStats {
  totalUsers: number;
  activeSubscriptions: number;
  todaySearches: number;
  totalRevenue: number;
  userGrowth: number;
  revenueGrowth: number;
  searchGrowth: number;
  subGrowth: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
