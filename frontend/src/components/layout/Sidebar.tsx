import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Search, CreditCard, Users, Package, Truck,
  Settings, ChevronLeft, ChevronRight, Bell, LogOut, Menu, X,
  Key, BarChart2, FileText, Megaphone, Tag, Shield, ChevronDown
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { cn } from "../../lib/utils";

const userNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Search, label: "Check Customer", path: "/dashboard/check" },
  { icon: FileText, label: "Search History", path: "/dashboard/history" },
  { icon: CreditCard, label: "Billing", path: "/dashboard/billing" },
  { icon: Key, label: "API Token", path: "/dashboard/api-token" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

const adminNavItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/admin" },
  { icon: Users, label: "Users", path: "/admin/users" },
  { icon: CreditCard, label: "Payments", path: "/admin/payments" },
  { icon: Package, label: "Subscriptions", path: "/admin/subscriptions" },
  { icon: Search, label: "Search Logs", path: "/admin/search-logs" },
  { icon: Truck, label: "Couriers", path: "/admin/couriers" },
  { icon: Tag, label: "Plans & Pricing", path: "/admin/plans" },
  { icon: Key, label: "API Tokens", path: "/admin/api-tokens" },
  { icon: Megaphone, label: "Announcements", path: "/admin/announcements" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];

interface SidebarProps {
  isAdmin?: boolean;
}

export default function Sidebar({ isAdmin = false }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const navItems = isAdmin ? adminNavItems : userNavItems;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn("flex items-center gap-3 px-4 py-5 border-b border-white/[0.06]", collapsed && "justify-center px-2")}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0 shadow-glow-sm">
          <Truck size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <div className="font-bold text-sm text-white font-display leading-none">BDCourier</div>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
              {isAdmin ? "Admin Panel" : "Dashboard"}
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto no-scrollbar py-3 px-2">
        {isAdmin && !collapsed && (
          <div className="px-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 font-display">Management</span>
          </div>
        )}
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const active = location.pathname === item.path ||
              (item.path !== "/dashboard" && item.path !== "/admin" && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={cn(active ? "nav-item-active" : "nav-item", collapsed && "justify-center px-2")}
                title={collapsed ? item.label : undefined}
              >
                <item.icon size={17} className={active ? "text-primary-300" : ""} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User info */}
      <div className={cn("p-3 border-t border-white/[0.06]", collapsed && "px-2")}>
        {!collapsed ? (
          <div className="glass-card-light rounded-xl p-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xs font-bold font-display flex-shrink-0">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-slate-100 truncate font-display">{user?.name}</div>
                <div className="text-[11px] text-slate-500 truncate">{user?.plan} Plan</div>
              </div>
              <button onClick={handleLogout} className="text-slate-500 hover:text-danger-400 transition-colors p-1" title="Logout">
                <LogOut size={14} />
              </button>
            </div>
          </div>
        ) : (
          <button onClick={handleLogout} className="nav-item justify-center w-full" title="Logout">
            <LogOut size={17} />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-9 h-9 glass-card flex items-center justify-center text-slate-300"
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
          />
        )}
      </AnimatePresence>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="lg:hidden fixed left-0 top-0 bottom-0 w-64 z-40 bg-surface-900 border-r border-white/[0.06]"
          >
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 60 : 224 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-20 bg-surface-900/95 backdrop-blur-xl border-r border-white/[0.06] overflow-hidden"
      >
        <SidebarContent />
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-surface-800 border border-white/[0.1] flex items-center justify-center text-slate-400 hover:text-white transition-colors shadow-md"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </motion.aside>

      {/* Spacer */}
      <motion.div
        animate={{ width: collapsed ? 60 : 224 }}
        transition={{ duration: 0.2 }}
        className="hidden lg:block flex-shrink-0"
      />
    </>
  );
}
