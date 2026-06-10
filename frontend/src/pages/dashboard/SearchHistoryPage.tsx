import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Download, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { searchApi } from "../../lib/api";
import DataTable from "../../components/ui/DataTable";
import { formatDate, getRiskBadgeClass, cn } from "../../lib/utils";
import type { SearchLog } from "../../types";
import TopBar from "../../components/layout/TopBar";

const MOCK_HISTORY: SearchLog[] = Array.from({ length: 12 }, (_, i) => ({
  id: String(i + 1),
  userId: "me",
  userName: "My Account",
  phone: `017${String(Math.floor(Math.random() * 100000000)).padStart(8, "0")}`,
  successRate: Math.floor(Math.random() * 100),
  riskLevel: (["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const)[i % 4],
  createdAt: new Date(Date.now() - i * 3600000 * 2).toISOString(),
}));

export default function SearchHistoryPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["search-history", page, search],
    queryFn: () => searchApi.getHistory({ page, limit: 10, search }).then((r) => r.data).catch(() => ({
      data: MOCK_HISTORY, total: 12, totalPages: 2, page: 1, limit: 10,
    })),
    initialData: { data: MOCK_HISTORY, total: 12, totalPages: 2, page: 1, limit: 10 },
  });

  const columns = [
    {
      key: "phone",
      header: "Phone Number",
      render: (row: SearchLog) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center flex-shrink-0">
            <Search size={13} className="text-primary-400" />
          </div>
          <span className="font-mono text-sm text-slate-200">{row.phone}</span>
        </div>
      ),
    },
    {
      key: "successRate",
      header: "Success Rate",
      render: (row: SearchLog) => (
        <div className="flex items-center gap-3">
          <div className="w-20 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all", row.successRate >= 80 ? "bg-accent-400" : row.successRate >= 60 ? "bg-warning-400" : "bg-danger-400")}
              style={{ width: `${row.successRate}%` }}
            />
          </div>
          <span className="text-sm font-bold text-white font-display w-10">{row.successRate}%</span>
        </div>
      ),
    },
    {
      key: "riskLevel",
      header: "Risk Level",
      render: (row: SearchLog) => <span className={cn("badge", getRiskBadgeClass(row.riskLevel))}>{row.riskLevel}</span>,
    },
    {
      key: "createdAt",
      header: "Searched At",
      render: (row: SearchLog) => <span className="text-xs text-slate-500 flex items-center gap-1.5"><Clock size={11} />{formatDate(row.createdAt)}</span>,
    },
  ];

  return (
    <>
      <TopBar title="Search History" subtitle="Your past customer checks" />
      <div className="p-6 lg:p-8 space-y-5 animate-fade-in">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="input-field pl-9" placeholder="Search phone numbers..." />
          </div>
          <button className="btn-secondary flex-shrink-0" onClick={() => {}}>
            <Download size={14} /> Export
          </button>
        </div>

        <div className="glass-card overflow-hidden">
          <DataTable
            columns={columns as any}
            data={data?.data || []}
            isLoading={isLoading}
            page={page}
            totalPages={data?.totalPages}
            onPageChange={setPage}
            keyExtractor={(r) => r.id}
            emptyMessage="No searches yet. Try checking a customer!"
          />
        </div>
      </div>
    </>
  );
}
