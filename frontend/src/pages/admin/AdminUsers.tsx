import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, UserCheck, UserX, Trash2, MoreVertical, Filter } from "lucide-react";
import toast from "react-hot-toast";
import Select from "react-select";
import { usersApi } from "../../lib/api";
import DataTable from "../../components/ui/DataTable";
import Modal from "../../components/ui/Modal";
import { formatDate, cn } from "../../lib/utils";
import type { User } from "../../types";
import TopBar from "../../components/layout/TopBar";

const PLAN_OPTIONS = [
  { value: "", label: "All Plans" },
  { value: "FREE", label: "Free" },
  { value: "STARTER", label: "Starter" },
  { value: "PRO", label: "Pro" },
  { value: "ENTERPRISE", label: "Enterprise" },
];

const selectStyles = {
  control: (base: any) => ({
    ...base, background: "rgba(30,41,59,0.5)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px", minHeight: "38px", fontSize: "13px", color: "white",
    fontFamily: "'DM Sans', sans-serif",
    "&:hover": { borderColor: "rgba(255,255,255,0.15)" },
    boxShadow: "none",
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

const MOCK_USERS: User[] = Array.from({ length: 10 }, (_, i) => ({
  id: String(i + 1), name: `User ${i + 1}`, email: `user${i + 1}@example.com`,
  phone: `0171${String(i).padStart(7, "0")}`,
  plan: (["FREE", "STARTER", "PRO", "ENTERPRISE"] as const)[i % 4],
  role: i === 0 ? "SUPER_ADMIN" : "USER",
  isActive: i % 5 !== 3,
  createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  searchCount: Math.floor(Math.random() * 200),
}));

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const [plan, setPlan] = useState("");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", page, search, plan],
    queryFn: () => usersApi.getAll({ page, limit: 10, search, plan }).then((r) => r.data).catch(() => ({
      data: MOCK_USERS, total: 10, totalPages: 1, page: 1, limit: 10,
    })),
    initialData: { data: MOCK_USERS, total: 10, totalPages: 1, page: 1, limit: 10 },
  });

  const { mutate: toggleUser } = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      usersApi.update(id, { isActive: !isActive }),
    onSuccess: () => {
      toast.success("User status updated");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });

  const { mutate: deleteUser, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => usersApi.delete(id),
    onSuccess: () => {
      toast.success("User deleted");
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });

  const planBadge = (plan: string) => {
    const map: Record<string, string> = {
      FREE: "badge bg-white/[0.05] text-slate-400 border-white/[0.08]",
      STARTER: "badge-primary",
      PRO: "badge bg-purple-500/15 text-purple-300 border-purple-500/20",
      ENTERPRISE: "badge-warning",
    };
    return map[plan] || "badge-primary";
  };

  const columns = [
    {
      key: "name", header: "User",
      render: (row: User) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xs font-bold font-display flex-shrink-0">
            {row.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-slate-200 text-sm font-display">{row.name}</div>
            <div className="text-xs text-slate-500">{row.email}</div>
          </div>
        </div>
      ),
    },
    { key: "phone", header: "Phone", render: (row: User) => <span className="font-mono text-xs text-slate-400">{row.phone || "—"}</span> },
    {
      key: "plan", header: "Plan",
      render: (row: User) => <span className={cn("badge", planBadge(row.plan))}>{row.plan}</span>,
    },
    {
      key: "isActive", header: "Status",
      render: (row: User) => (
        <span className={cn("badge", row.isActive ? "badge-success" : "badge-danger")}>
          {row.isActive ? "Active" : "Banned"}
        </span>
      ),
    },
    { key: "searchCount", header: "Searches", render: (row: User) => <span className="font-mono text-sm text-slate-300">{row.searchCount}</span> },
    { key: "createdAt", header: "Joined", render: (row: User) => <span className="text-xs text-slate-500">{formatDate(row.createdAt)}</span> },
    {
      key: "actions", header: "Actions",
      render: (row: User) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => toggleUser({ id: row.id, isActive: row.isActive })}
            className={cn("w-7 h-7 rounded-lg flex items-center justify-center transition-all", row.isActive ? "bg-danger-500/10 text-danger-400 hover:bg-danger-500/20" : "bg-accent-500/10 text-accent-400 hover:bg-accent-500/20")}
            title={row.isActive ? "Ban User" : "Unban User"}
          >
            {row.isActive ? <UserX size={13} /> : <UserCheck size={13} />}
          </button>
          <button
            onClick={() => setDeleteTarget(row)}
            className="w-7 h-7 rounded-lg bg-danger-500/10 text-danger-400 hover:bg-danger-500/20 flex items-center justify-center transition-all"
            title="Delete User"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <TopBar title="Users" subtitle="Manage all registered users" />
      <div className="p-6 lg:p-8 space-y-5 animate-fade-in">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="input-field pl-9"
              placeholder="Search by name, email, phone..."
            />
          </div>
          <div className="w-full sm:w-44">
            <Select
              options={PLAN_OPTIONS}
              styles={selectStyles}
              value={PLAN_OPTIONS.find((o) => o.value === plan)}
              onChange={(opt) => { setPlan(opt?.value || ""); setPage(1); }}
              placeholder="Filter plan"
            />
          </div>
        </div>

        {/* Table */}
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

      {/* Delete confirm modal */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete User" size="sm">
        <div className="p-6 pt-4">
          <p className="text-slate-400 text-sm mb-5">
            Are you sure you want to delete <strong className="text-white">{deleteTarget?.name}</strong>? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteTarget(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button onClick={() => deleteTarget && deleteUser(deleteTarget.id)} disabled={isDeleting} className="btn-danger flex-1 justify-center">
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
