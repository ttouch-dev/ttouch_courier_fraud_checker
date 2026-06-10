import { useQuery } from "@tanstack/react-query";
import { Search, TrendingUp, Clock, Zap, ArrowRight, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { dashboardApi, searchApi } from "../../lib/api";
import StatCard from "../../components/ui/StatCard";
import { SkeletonCard, TableSkeleton } from "../../components/ui/Spinner";
import { useAuthStore } from "../../store/authStore";
import { formatDate, getRiskBadgeClass } from "../../lib/utils";
import type { SearchLog } from "../../types";
import TopBar from "../../components/layout/TopBar";

export default function DashboardHome() {
  const { user } = useAuthStore();

  const { data: statsData } = useQuery({
    queryKey: ["user-stats"],
    queryFn: () => dashboardApi.getStats().then((r) => r.data),
  });

  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ["recent-searches"],
    queryFn: () => searchApi.getHistory({ limit: 5 }).then((r) => r.data),
  });

  const recentSearches: SearchLog[] = historyData?.data || [];

  const dailyLimit = user?.plan === "FREE" ? 20 : user?.plan === "STARTER" ? 200 : 999999;
  const searchesUsed = user?.searchCount || 0;
  const searchProgress = Math.min((searchesUsed / dailyLimit) * 100, 100);

  return (
    <>
      <TopBar title={`Good ${new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"}, ${user?.name?.split(" ")[0]}! 👋`} subtitle="Here's what's happening with your searches" />
      <div className="p-6 lg:p-8 space-y-8 animate-fade-in">
        {/* Quick search CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-transparent" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white font-display mb-1">Ready to check a customer?</h2>
              <p className="text-slate-400 text-sm">Enter a phone number to get instant delivery insights</p>
            </div>
            <Link to="/dashboard/check" className="btn-primary flex-shrink-0">
              <Search size={16} />
              Check Now
              <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statsData ? (
            <>
              <StatCard title="Today's Searches" value={statsData.todaySearches} icon={Search} change={statsData.searchGrowth} color="primary" />
              <StatCard title="Total Searches" value={statsData.totalUsers} icon={Package} color="success" />
              <StatCard title="Success Rate Avg" value={85} suffix="%" icon={TrendingUp} color="success" />
              <StatCard title="Saved Orders" value={132} icon={Zap} change={12} color="warning" />
            </>
          ) : (
            <>
              {[0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)}
            </>
          )}
        </div>

        {/* Usage bar */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm font-semibold text-slate-200 font-display">Daily Search Usage</div>
              <div className="text-xs text-slate-500 mt-0.5">{user?.plan} Plan</div>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-white font-display">{searchesUsed}</span>
              <span className="text-slate-500 text-sm"> / {dailyLimit === 999999 ? "∞" : dailyLimit}</span>
            </div>
          </div>
          <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${searchProgress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`h-full rounded-full ${searchProgress > 80 ? "bg-danger-500" : searchProgress > 50 ? "bg-warning-400" : "bg-gradient-to-r from-primary-500 to-accent-400"}`}
            />
          </div>
          {user?.plan === "FREE" && (
            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-slate-500">Upgrade for unlimited searches</p>
              <Link to="/dashboard/billing" className="text-xs text-primary-400 hover:text-primary-300 font-semibold transition-colors">
                Upgrade →
              </Link>
            </div>
          )}
        </div>

        {/* Recent Searches */}
        <div className="glass-card overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
            <h3 className="section-title flex items-center gap-2">
              <Clock size={16} className="text-primary-400" />
              Recent Searches
            </h3>
            <Link to="/dashboard/history" className="text-xs text-primary-400 hover:text-primary-300 font-semibold transition-colors">
              View All →
            </Link>
          </div>
          {historyLoading ? (
            <div className="p-5"><TableSkeleton rows={4} /></div>
          ) : recentSearches.length === 0 ? (
            <div className="py-16 text-center">
              <Search size={32} className="text-slate-700 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">No searches yet. Try checking a customer!</p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {recentSearches.map((log) => (
                <div key={log.id} className="flex items-center justify-between px-5 py-3.5 table-row-hover">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center">
                      <Search size={14} className="text-primary-400" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-200 font-mono">{log.phone}</div>
                      <div className="text-xs text-slate-500">{formatDate(log.createdAt)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-white font-display">{log.successRate}%</span>
                    <span className={`badge ${getRiskBadgeClass(log.riskLevel)}`}>{log.riskLevel}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
