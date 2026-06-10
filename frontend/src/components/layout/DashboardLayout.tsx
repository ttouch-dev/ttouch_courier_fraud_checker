import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";

const pageTitles: Record<string, { title: string; subtitle?: string }> = {
  "/dashboard": { title: "Dashboard", subtitle: "Welcome back!" },
  "/dashboard/check": { title: "Check Customer", subtitle: "Enter a phone number to get delivery insights" },
  "/dashboard/history": { title: "Search History", subtitle: "Your past searches" },
  "/dashboard/billing": { title: "Billing & Plans", subtitle: "Manage your subscription" },
  "/dashboard/api-token": { title: "API Token", subtitle: "Manage your API access" },
  "/dashboard/settings": { title: "Settings", subtitle: "Account preferences" },
  "/admin": { title: "Admin Overview", subtitle: "Platform statistics" },
  "/admin/users": { title: "Users", subtitle: "Manage all platform users" },
  "/admin/payments": { title: "Payments", subtitle: "Transaction management" },
  "/admin/subscriptions": { title: "Subscriptions", subtitle: "Active & expired subscriptions" },
  "/admin/search-logs": { title: "Search Logs", subtitle: "All platform searches" },
  "/admin/couriers": { title: "Couriers", subtitle: "Manage courier integrations" },
  "/admin/plans": { title: "Plans & Pricing", subtitle: "Subscription plan management" },
  "/admin/api-tokens": { title: "API Tokens", subtitle: "Developer token management" },
  "/admin/announcements": { title: "Announcements", subtitle: "Broadcast messages to users" },
  "/admin/settings": { title: "Settings", subtitle: "Platform configuration" },
};

export default function DashboardLayout({ isAdmin = false }: { isAdmin?: boolean }) {
  const location = useLocation();
  const pageInfo = pageTitles[location.pathname] || { title: "Dashboard" };

  return (
    <div className="flex min-h-screen bg-surface-950">
      <Sidebar isAdmin={isAdmin} />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-6 lg:p-8 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
