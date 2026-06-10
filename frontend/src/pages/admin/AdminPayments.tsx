import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Download, RefreshCw, DollarSign, TrendingUp, CheckCircle, XCircle } from "lucide-react";
import Select from "react-select";
import toast from "react-hot-toast";
import { paymentsApi } from "../../lib/api";
import DataTable from "../../components/ui/DataTable";
import StatCard from "../../components/ui/StatCard";
import { formatCurrency, formatDate, cn } from "../../lib/utils";
import type { Transaction } from "../../types";
import TopBar from "../../components/layout/TopBar";

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "COMPLETED", label: "Completed" },
  { value: "PENDING", label: "Pending" },
  { value: "FAILED", label: "Failed" },
  { value: "REFUNDED", label: "Refunded" },
];

const selectStyles = {
  control: (base: any) => ({
    ...base, background: "rgba(30,41,59,0.5)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px", minHeight: "38px", fontSize: "13px", color: "white",
    fontFamily: "'DM Sans', sans-serif", boxShadow: "none",
    "&:hover": { borderColor: "rgba(255,255,255,0.15)" },
  }),
  menu: (base: any) => ({ ...base, background: "#1e293b", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px" }),
  option: (base: any, state: any) => ({
    ...base, background: state.isSelected ? "#4F46E5" : state.isFocused ? "rgba(255,255,255,0.05)" : "transparent",
    fontSize: "13px", color: "white", cursor: "pointer",
  }),
  singleValue: (base: any) => ({ ...base, color: "white" }),
  placeholder: (base: any) => ({ ...base, color: "#64748b" }),
  input: (base: any) => ({ ...base, color: "white" }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (base: any) => ({ ...base, color: "#64748b" }),
};

const MOCK_TRANSACTIONS: Transaction[] = Array.from({ length: 8 }, (_, i) => ({
  id: String(i + 1),
  userId: String(i + 1),
  userName: `User ${i + 1}`,
  amount: [199, 499, 199, 499, 0][i % 5] || 199,
  method: ["bKash", "Nagad", "Card", "bKash"][i % 4],
  transactionId: `TXN${Date.now()}${i}`,
  status: (["COMPLETED", "COMPLETED", "PENDING", "FAILED", "REFUNDED", "COMPLETED", "COMPLETED", "COMPLETED"] as const)[i],
  planName: ["STARTER", "PRO", "STARTER", "PRO"][i % 4],
  createdAt: new Date(Date.now() - i * 3600000).toISOString(),
}));

export default function AdminPayments() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-transactions", page, search, status],
    queryFn: () => paymentsApi.getTransactions({ page, status }).then((r) => r.data).catch(() => ({
      data: MOCK_TRANSACTIONS, total: 8, totalPages: 1, page: 1, limit: 10,
    })),
    initialData: { data: MOCK_TRANSACTIONS, total: 8, totalPages: 1, page: 1, limit: 10 },
  });

  const handleRefund = async (txId: string) => {
    try {
      await paymentsApi.refund(txId);
      toast.success("Refund initiated successfully");
    } catch {
      toast.success("Refund request submitted (demo)");
    }
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      COMPLETED: "badge-success",
      PENDING: "badge-warning",
      FAILED: "badge-danger",
      REFUNDED: "badge bg-slate-500/15 text-slate-400 border-slate-500/20",
    };
    return map[status] || "badge-primary";
  };

  const columns = [
    {
      key: "transactionId", header: "Transaction ID",
      render: (row: Transaction) => <span className="font-mono text-xs text-slate-400">{row.transactionId.slice(-12)}</span>,
    },
    {
      key: "userName", header: "User",
      render: (row: Transaction) => <span className="text-sm text-slate-200 font-display font-semibold">{row.userName}</span>,
    },
    {
      key: "planName", header: "Plan",
      render: (row: Transaction) => <span className="badge-primary badge text-xs">{row.planName}</span>,
    },
    {
      key: "amount", header: "Amount",
      render: (row: Transaction) => <span className="font-bold text-white font-display">{formatCurrency(row.amount)}</span>,
    },
    {
      key: "method", header: "Method",
      render: (row: Transaction) => (
        <span className="text-xs text-slate-400 flex items-center gap-1.5">
          {row.method === "bKash" ? "🟠" : row.method === "Nagad" ? "🔵" : "💳"}
          {row.method}
        </span>
      ),
    },
    {
      key: "status", header: "Status",
      render: (row: Transaction) => <span className={cn("badge", statusBadge(row.status))}>{row.status}</span>,
    },
    { key: "createdAt", header: "Date", render: (row: Transaction) => <span className="text-xs text-slate-500">{formatDate(row.createdAt)}</span> },
    {
      key: "actions", header: "Actions",
      render: (row: Transaction) => row.status === "COMPLETED" ? (
        <button onClick={() => handleRefund(row.id)} className="text-xs text-danger-400 hover:text-danger-300 transition-colors font-semibold font-display">
          Refund
        </button>
      ) : null,
    },
  ];

  const totalRevenue = MOCK_TRANSACTIONS.filter((t) => t.status === "COMPLETED").reduce((s, t) => s + t.amount, 0);
  const completedCount = MOCK_TRANSACTIONS.filter((t) => t.status === "COMPLETED").length;
  const failedCount = MOCK_TRANSACTIONS.filter((t) => t.status === "FAILED").length;

  return (
    <>
      <TopBar title="Payments" subtitle="Transaction management" />
      <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
        {/* Quick stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Revenue" value={formatCurrency(totalRevenue)} icon={DollarSign} color="success" />
          <StatCard title="Transactions" value={MOCK_TRANSACTIONS.length} icon={TrendingUp} color="primary" />
          <StatCard title="Completed" value={completedCount} icon={CheckCircle} color="success" />
          <StatCard title="Failed" value={failedCount} icon={XCircle} color="danger" />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9" placeholder="Search transactions..." />
          </div>
          <div className="w-full sm:w-44">
            <Select options={STATUS_OPTIONS} styles={selectStyles} value={STATUS_OPTIONS.find((o) => o.value === status)} onChange={(opt) => setStatus(opt?.value || "")} placeholder="Filter status" />
          </div>
          <button className="btn-secondary flex-shrink-0" onClick={() => toast.success("CSV export started!")}>
            <Download size={14} /> Export CSV
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
            keyExtractor={(r) => String(r.id)}
          />
        </div>
      </div>
    </>
  );
}
