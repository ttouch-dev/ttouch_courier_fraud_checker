import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Download, AlertTriangle } from "lucide-react";
import { searchApi } from "../../lib/api";
import DataTable from "../../components/ui/DataTable";
import { formatDate, getRiskBadgeClass, cn } from "../../lib/utils";
import type { SearchLog } from "../../types";
import TopBar from "../../components/layout/TopBar";

const MOCK_LOGS: SearchLog[] = Array.from({ length: 15 }, (_, i) => ({
  id: String(i + 1), userId: String(i % 5 + 1), userName: `User ${i % 5 + 1}`,
  phone: `017${String(Math.floor(Math.random() * 100000000)).padStart(8, "0")}`,
  successRate: Math.floor(Math.random() * 100),
  riskLevel: (["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const)[i % 4],
  createdAt: new Date(Date.now() - i * 1800000).toISOString(),
}));

export default function AdminSearchLogs() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-search-logs", page, search],
    queryFn: () => searchApi.getHistory({ page, limit: 10, search }).then((r) => r.data).catch(() => ({
      data: MOCK_LOGS, total: 15, totalPages: 2, page: 1, limit: 10,
    })),
    initialData: { data: MOCK_LOGS, total: 15, totalPages: 2, page: 1, limit: 10 },
  });

  const highRisk = MOCK_LOGS.filter((l) => l.riskLevel === "CRITICAL" || l.riskLevel === "HIGH").length;

  const columns = [
    { key: "phone", header: "Phone", render: (row: SearchLog) => <span className="font-mono text-sm text-slate-200">{row.phone}</span> },
    { key: "userName", header: "User", render: (row: SearchLog) => <span className="text-sm font-display font-semibold text-slate-300">{row.userName}</span> },
    {
      key: "successRate", header: "Success Rate",
      render: (row: SearchLog) => (
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
            <div className={cn("h-full rounded-full", row.successRate >= 80 ? "bg-accent-400" : row.successRate >= 60 ? "bg-warning-400" : "bg-danger-400")} style={{ width: `${row.successRate}%` }} />
          </div>
          <span className="text-sm font-bold text-white font-display">{row.successRate}%</span>
        </div>
      ),
    },
    {
      key: "riskLevel", header: "Risk",
      render: (row: SearchLog) => (
        <span className={cn("badge", getRiskBadgeClass(row.riskLevel))}>
          {(row.riskLevel === "CRITICAL" || row.riskLevel === "HIGH") && <AlertTriangle size={10} />}
          {row.riskLevel}
        </span>
      ),
    },
    { key: "createdAt", header: "Time", render: (row: SearchLog) => <span className="text-xs text-slate-500">{formatDate(row.createdAt)}</span> },
  ];

  return (
    <>
      <TopBar title="Search Logs" subtitle="All platform search activity" />
      <div className="p-6 lg:p-8 space-y-5 animate-fade-in">
        {highRisk > 0 && (
          <div className="glass-card p-4 border border-warning-500/20 bg-warning-500/5 flex items-center gap-3">
            <AlertTriangle size={16} className="text-warning-400 flex-shrink-0" />
            <span className="text-sm text-warning-300 font-display">{highRisk} high-risk searches detected in recent activity</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="input-field pl-9" placeholder="Search by phone, user..." />
          </div>
          <button className="btn-secondary flex-shrink-0"><Download size={14} /> Export</button>
        </div>

        <div className="glass-card overflow-hidden">
          <DataTable
            columns={columns as any}
            data={data?.data || []}
            isLoading={isLoading}
            page={page}
            totalPages={data?.totalPages}
            onPageChange={setPage}
            keyExtractor={(r) => String(r.id)}
          />
        </div>
      </div>
    </>
  );
}
