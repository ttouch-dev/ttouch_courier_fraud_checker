import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute, AdminRoute, GuestRoute } from "./components/auth/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardHome from "./pages/dashboard/DashboardHome";
import CheckCustomerPage from "./pages/dashboard/CheckCustomerPage";
import SearchHistoryPage from "./pages/dashboard/SearchHistoryPage";
import BillingPage from "./pages/dashboard/BillingPage";
import ApiTokenPage from "./pages/dashboard/ApiTokenPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminCouriers from "./pages/admin/AdminCouriers";
import AdminPlans from "./pages/admin/AdminPlans";
import AdminSearchLogs from "./pages/admin/AdminSearchLogs";
import AdminSettings from "./pages/admin/AdminSettings";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />

      {/* Guest only */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* User Dashboard */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/dashboard/check" element={<CheckCustomerPage />} />
          <Route path="/dashboard/history" element={<SearchHistoryPage />} />
          <Route path="/dashboard/billing" element={<BillingPage />} />
          <Route path="/dashboard/api-token" element={<ApiTokenPage />} />
          <Route path="/dashboard/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* Admin Panel */}
      <Route element={<AdminRoute />}>
        <Route element={<DashboardLayout isAdmin />}>
          <Route path="/admin" element={<AdminOverview />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/payments" element={<AdminPayments />} />
          <Route path="/admin/subscriptions" element={<AdminOverview />} />
          <Route path="/admin/search-logs" element={<AdminSearchLogs />} />
          <Route path="/admin/couriers" element={<AdminCouriers />} />
          <Route path="/admin/plans" element={<AdminPlans />} />
          <Route path="/admin/api-tokens" element={<AdminOverview />} />
          <Route path="/admin/announcements" element={<AdminOverview />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
