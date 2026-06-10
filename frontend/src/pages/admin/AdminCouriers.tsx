import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Truck, ToggleLeft, ToggleRight, Edit2, Activity, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { couriersApi } from "../../lib/api";
import Modal from "../../components/ui/Modal";
import { cn } from "../../lib/utils";
import type { Courier } from "../../types";
import TopBar from "../../components/layout/TopBar";

const MOCK_COURIERS: Courier[] = [
  { id: "1", name: "Pathao", slug: "pathao", logo: "🚴", apiUrl: "https://api.pathao.com/v1", isActive: true, totalSearches: 12450 },
  { id: "2", name: "Steadfast", slug: "steadfast", logo: "📦", apiUrl: "https://steadfast.com.bd/api", isActive: true, totalSearches: 8923 },
  { id: "3", name: "RedX", slug: "redx", logo: "🔴", apiUrl: "https://api.redx.com.bd", isActive: true, totalSearches: 7341 },
  { id: "4", name: "eCourier", slug: "ecourier", logo: "⚡", apiUrl: "https://ecourier.com.bd/api", isActive: true, totalSearches: 5218 },
  { id: "5", name: "Paperfly", slug: "paperfly", logo: "✈️", apiUrl: "https://paperfly.com.bd/api", isActive: false, totalSearches: 3102 },
  { id: "6", name: "Delivery Tiger", slug: "delivery-tiger", logo: "🐯", apiUrl: "https://deliverytiger.com.bd/api", isActive: true, totalSearches: 2891 },
  { id: "7", name: "Sundarban", slug: "sundarban", logo: "🌿", apiUrl: "https://sundarbancourier.com/api", isActive: false, totalSearches: 1234 },
  { id: "8", name: "Kargo", slug: "kargo", logo: "📫", apiUrl: "https://kargo.com.bd/api", isActive: true, totalSearches: 987 },
];

export default function AdminCouriers() {
  const [editCourier, setEditCourier] = useState<Courier | null>(null);
  const [couriers, setCouriers] = useState<Courier[]>(MOCK_COURIERS);
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["admin-couriers"],
    queryFn: () => couriersApi.getAll().then((r) => r.data.data).catch(() => MOCK_COURIERS),
    initialData: MOCK_COURIERS,
  });

  const toggle = (id: string) => {
    setCouriers((prev) => prev.map((c) => c.id === id ? { ...c, isActive: !c.isActive } : c));
    toast.success("Courier status updated");
  };

  const activeCouriers = couriers.filter((c) => c.isActive).length;

  return (
    <>
      <TopBar title="Couriers" subtitle="Manage courier integrations" />
      <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
        {/* Summary */}
        <div className="flex items-center gap-4">
          <div className="glass-card px-5 py-3 flex items-center gap-3">
            <CheckCircle size={16} className="text-accent-400" />
            <div>
              <div className="text-xl font-bold text-white font-display">{activeCouriers}</div>
              <div className="text-xs text-slate-500">Active</div>
            </div>
          </div>
          <div className="glass-card px-5 py-3 flex items-center gap-3">
            <XCircle size={16} className="text-danger-400" />
            <div>
              <div className="text-xl font-bold text-white font-display">{couriers.length - activeCouriers}</div>
              <div className="text-xs text-slate-500">Inactive</div>
            </div>
          </div>
          <div className="glass-card px-5 py-3 flex items-center gap-3">
            <Truck size={16} className="text-primary-400" />
            <div>
              <div className="text-xl font-bold text-white font-display">{couriers.length}</div>
              <div className="text-xs text-slate-500">Total</div>
            </div>
          </div>
        </div>

        {/* Courier cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {couriers.map((courier, i) => (
            <motion.div
              key={courier.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "glass-card p-5 transition-all duration-200",
                !courier.isActive && "opacity-60"
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-white/[0.06] flex items-center justify-center text-2xl">
                    {courier.logo}
                  </div>
                  <div>
                    <div className="font-bold text-slate-100 font-display text-sm">{courier.name}</div>
                    <div className={cn("text-xs flex items-center gap-1 mt-0.5", courier.isActive ? "text-accent-400" : "text-slate-600")}>
                      <div className={cn("w-1.5 h-1.5 rounded-full", courier.isActive ? "bg-accent-400" : "bg-slate-600")} />
                      {courier.isActive ? "Active" : "Inactive"}
                    </div>
                  </div>
                </div>
                <button onClick={() => setEditCourier(courier)} className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white transition-all">
                  <Edit2 size={12} />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                <span className="flex items-center gap-1.5">
                  <Activity size={11} />
                  {courier.totalSearches.toLocaleString()} searches
                </span>
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-xs text-slate-500 font-display">Toggle Status</span>
                <button
                  onClick={() => toggle(courier.id)}
                  className={cn("transition-colors", courier.isActive ? "text-accent-400 hover:text-accent-300" : "text-slate-600 hover:text-slate-400")}
                >
                  {courier.isActive ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Edit modal */}
      <Modal isOpen={!!editCourier} onClose={() => setEditCourier(null)} title={`Edit ${editCourier?.name}`} size="sm">
        <div className="p-6 pt-4 space-y-4">
          <div>
            <label className="label">API URL</label>
            <input className="input-field font-mono text-xs" defaultValue={editCourier?.apiUrl} />
          </div>
          <div>
            <label className="label">API Key</label>
            <input type="password" className="input-field font-mono text-xs" placeholder="••••••••••••••••" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setEditCourier(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button onClick={() => { toast.success("Courier settings saved!"); setEditCourier(null); }} className="btn-primary flex-1 justify-center">Save</button>
          </div>
        </div>
      </Modal>
    </>
  );
}
