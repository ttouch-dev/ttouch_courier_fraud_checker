import { useQuery } from "@tanstack/react-query";
import { Users, CreditCard, Search, DollarSign, TrendingUp, Activity } from "lucide-react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from "recharts";
import { dashboardApi } from "../../lib/api";
import StatCard from "../../components/ui/StatCard";
import { SkeletonCard } from "../../components/ui/Spinner";
import { formatCurrency, formatDate, getRiskBadgeClass } from "../../lib/utils";
import TopBar from "../../components/layout/TopBar";

const MOCK_STATS = {
  totalUsers: 1240, activeSubscriptions: 320, todaySearches: 5430, totalRevenue: 45000,
  userGrowth: 12, revenueGrowth: 18, searchGrowth: 23, subGrowth: 8,
};

const MOCK_REVENUE = [
  { month: "Jan", revenue: 18000 }, { month: "Feb", revenue: 22000 }, { month: "Mar", revenue: 19500 },
  { month: "Apr", revenue: 28000 }, { month: "May", revenue: 32000 }, { month: "Jun", revenue: 45000 },
];

const MOCK_SEARCHES = [
  { day: "Mon", searches: 3200 }, { day: "Tue", searches: 4100 }, { day: "Wed", searches: 3800 },
  { day: "Thu", searches: 5200 }, { day: "Fri", searches: 4900 }, { day: "Sat", searches: 5430 },
  { day: "Sun", searches: 2800 },
];

const MOCK_RECENT = [
  { id: "1", phone: "01712345678", userName: "Rahim Store", successRate: 85, riskLevel: "LOW", createdAt: new Date().toISOString() },
  { id: "2", phone: "01898765432", userName: "Nadia Boutique", successRate: 45, riskLevel: "HIGH", createdAt: new Date().toISOString() },
  { id: "3", phone: "01554321876", userName: "Tech Corner", successRate: 72, riskLevel: "MEDIUM", createdAt: new Date().toISOString() },
  { id: "4", phone: "01312345678", userName: "Fashion Hub", successRate: 28, riskLevel: "CRITICAL", createdAt: new Date().toISOString() },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-3 py-2 text-xs">
      <div className="text-slate-400 mb-1">{label}</div>
      <div className="font-bold text-white font-display">{payload[0].name === "revenue" ? formatCurrency(payload[0].value) : payload[0].value.toLocaleString()}</div>
    </div>
  );
};

export default function AdminOverview() {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => dashboardApi.getStats().then((r) => r.data.data).catch(() => MOCK_STATS),
    initialData: MOCK_STATS,
  });

  return (
    <>
      <TopBar title="Admin Overview" subtitle="Platform health at a glance" />
      <div className="p-6 lg:p-8 space-y-8 animate-fade-in">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Users" value={stats.totalUsers.toLocaleString()} icon={Users} change={stats.userGrowth} color="primary" />
          <StatCard title="Active Subscriptions" value={stats.activeSubscriptions.toLocaleString()} icon={CreditCard} change={stats.subGrowth} color="success" />
          <StatCard title="Today's Searches" value={stats.todaySearches.toLocaleString()} icon={Search} change={stats.searchGrowth} color="warning" />
          <StatCard title="Total Revenue" value={formatCurrency(stats.totalRevenue)} icon={DollarSign} change={stats.revenueGrowth} color="danger" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Revenue */}
          <div className="glass-card p-5 lg:col-span-3">
            <div className="flex items-center justify-between mb-5">
              <h3 className="section-title flex items-center gap-2">
                <TrendingUp size={16} className="text-primary-400" />
                Revenue (6 months)
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={MOCK_REVENUE} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11, fontFamily: "Sora" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `৳${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={2} fill="url(#revenueGrad)" name="revenue" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Searches */}
          <div className="glass-card p-5 lg:col-span-2">
            <h3 className="section-title flex items-center gap-2 mb-5">
              <Activity size={16} className="text-accent-400" />
              Daily Searches
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={MOCK_SEARCHES} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 11, fontFamily: "Sora" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="searches" fill="#10B981" radius={[4, 4, 0, 0]} name="searches" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent searches */}
        <div className="glass-card overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.06]">
            <h3 className="section-title">Recent Platform Searches</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {["Phone", "User", "Success Rate", "Risk", "Time"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500 font-display">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_RECENT.map((row, i) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-white/[0.04] table-row-hover"
                  >
                    <td className="px-5 py-3.5 text-sm font-mono text-slate-300">{row.phone}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-300 font-display">{row.userName}</td>
                    <td className="px-5 py-3.5 text-sm font-bold text-white font-display">{row.successRate}%</td>
                    <td className="px-5 py-3.5">
                      <span className={`badge ${getRiskBadgeClass(row.riskLevel)}`}>{row.riskLevel}</span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-500">{formatDate(row.createdAt)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
