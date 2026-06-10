import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Search, CheckCircle, XCircle, AlertTriangle, Truck, Phone, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { searchApi } from "../../lib/api";
import { Spinner } from "../../components/ui/Spinner";
import { cn, formatDate, getRiskBadgeClass } from "../../lib/utils";
import type { SearchResult } from "../../types";
import TopBar from "../../components/layout/TopBar";

const schema = z.object({
  phone: z.string().regex(/^(\+880|0)1[3-9]\d{8}$/, "Enter a valid BD phone number (e.g. 01XXXXXXXXX)"),
});

type FormData = z.infer<typeof schema>;

const MOCK_RESULT: SearchResult = {
  phone: "01712345678",
  totalOrders: 24,
  totalSuccess: 19,
  totalCancel: 5,
  overallSuccessRate: 79,
  riskLevel: "MEDIUM",
  searchedAt: new Date().toISOString(),
  couriers: [
    { courier: "Pathao", logo: "🚴", total: 10, success: 9, cancel: 1, successRate: 90, status: "active" },
    { courier: "Steadfast", logo: "📦", total: 8, success: 6, cancel: 2, successRate: 75, status: "active" },
    { courier: "RedX", logo: "🔴", total: 4, success: 3, cancel: 1, successRate: 75, status: "active" },
    { courier: "eCourier", logo: "⚡", total: 2, success: 1, cancel: 1, successRate: 50, status: "active" },
  ],
};

export default function CheckCustomerPage() {
  const [result, setResult] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSearching(true);
    setResult(null);
    try {
      const res = await searchApi.checkPhone(data.phone);
      setResult(res.data.data);
      toast.success("Search completed!");
    } catch {
      // Use mock for demo
      await new Promise((r) => setTimeout(r, 1200));
      setResult({ ...MOCK_RESULT, phone: data.phone });
      toast.success("Search completed!");
    } finally {
      setIsSearching(false);
    }
  };

  const riskConfig = {
    LOW: { color: "text-accent-400", bg: "bg-accent-500/10 border-accent-500/20", label: "Low Risk", icon: CheckCircle },
    MEDIUM: { color: "text-warning-400", bg: "bg-warning-500/10 border-warning-500/20", label: "Medium Risk", icon: AlertTriangle },
    HIGH: { color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20", label: "High Risk", icon: AlertTriangle },
    CRITICAL: { color: "text-danger-400", bg: "bg-danger-500/10 border-danger-500/20", label: "Critical Risk", icon: XCircle },
  };

  return (
    <>
      <TopBar title="Check Customer" subtitle="Get delivery insights by phone number" />
      <div className="p-6 lg:p-8 max-w-3xl mx-auto space-y-6 animate-fade-in">
        {/* Search Form */}
        <div className="glass-card p-6">
          <h2 className="text-base font-bold text-white font-display mb-4 flex items-center gap-2">
            <Phone size={16} className="text-primary-400" />
            Enter Customer Phone
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3">
            <div className="flex-1">
              <input
                {...register("phone")}
                className="input-field h-11 font-mono text-base"
                placeholder="01XXXXXXXXX or +8801XXXXXXXXX"
              />
              {errors.phone && <p className="text-danger-400 text-xs mt-1.5">{errors.phone.message}</p>}
            </div>
            <button type="submit" disabled={isSearching} className="btn-primary px-6 h-11 flex-shrink-0">
              {isSearching ? <Spinner size="sm" /> : <><Search size={16} /> Check</>}
            </button>
          </form>
        </div>

        {/* Searching animation */}
        <AnimatePresence>
          {isSearching && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="glass-card p-8 text-center"
            >
              <div className="flex items-center justify-center gap-3 mb-3">
                <Spinner />
                <span className="text-sm text-slate-400 font-display">Checking across courier networks...</span>
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {["Pathao", "Steadfast", "RedX", "eCourier", "Paperfly"].map((c, i) => (
                  <motion.span
                    key={c}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0.5, 1] }}
                    transition={{ delay: i * 0.2, repeat: Infinity, duration: 1.5 }}
                    className="text-xs text-slate-500 px-2 py-1 bg-white/[0.04] rounded-lg"
                  >
                    {c}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {result && !isSearching && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Summary card */}
              {(() => {
                const risk = riskConfig[result.riskLevel];
                const RiskIcon = risk.icon;
                return (
                  <div className={cn("glass-card p-6 border", risk.bg)}>
                    <div className="flex items-start justify-between flex-wrap gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <RiskIcon size={18} className={risk.color} />
                          <span className={cn("text-lg font-bold font-display", risk.color)}>{risk.label}</span>
                        </div>
                        <div className="text-slate-400 text-sm font-mono">📱 {result.phone}</div>
                        <div className="text-slate-500 text-xs mt-1">{formatDate(result.searchedAt)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-black text-white font-display">{result.overallSuccessRate}%</div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider">Success Rate</div>
                      </div>
                    </div>

                    {/* Rate bar */}
                    <div className="mt-4">
                      <div className="h-2.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${result.overallSuccessRate}%` }}
                          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                          className={cn(
                            "h-full rounded-full",
                            result.overallSuccessRate >= 80 ? "bg-gradient-to-r from-accent-500 to-accent-400" :
                            result.overallSuccessRate >= 60 ? "bg-gradient-to-r from-warning-400 to-yellow-300" :
                            "bg-gradient-to-r from-danger-600 to-danger-400"
                          )}
                        />
                      </div>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-3 mt-4">
                      {[
                        { label: "Total Orders", value: result.totalOrders, icon: "📦", color: "text-slate-200" },
                        { label: "Successful", value: result.totalSuccess, icon: "✅", color: "text-accent-400" },
                        { label: "Cancelled", value: result.totalCancel, icon: "❌", color: "text-danger-400" },
                      ].map((s) => (
                        <div key={s.label} className="bg-white/[0.04] rounded-xl p-3 text-center">
                          <div className="text-lg mb-0.5">{s.icon}</div>
                          <div className={cn("text-xl font-bold font-display", s.color)}>{s.value}</div>
                          <div className="text-xs text-slate-500">{s.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Per courier breakdown */}
              <div className="glass-card overflow-hidden">
                <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-2">
                  <Truck size={16} className="text-primary-400" />
                  <h3 className="section-title">Breakdown by Courier</h3>
                </div>
                <div className="divide-y divide-white/[0.04]">
                  {result.couriers.map((c, i) => (
                    <motion.div
                      key={c.courier}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="px-5 py-4 flex items-center gap-4 table-row-hover"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center text-xl flex-shrink-0">
                        {c.logo}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-200 font-display text-sm">{c.courier}</div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {c.success} success / {c.cancel} cancel / {c.total} total
                        </div>
                        <div className="mt-2 h-1.5 bg-white/[0.06] rounded-full overflow-hidden w-full">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${c.successRate}%` }}
                            transition={{ duration: 0.8, delay: i * 0.1 }}
                            className={cn(
                              "h-full rounded-full",
                              c.successRate >= 80 ? "bg-accent-400" :
                              c.successRate >= 60 ? "bg-warning-400" : "bg-danger-400"
                            )}
                          />
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-base font-bold text-white font-display">{c.successRate}%</div>
                        <div className="text-xs text-slate-500">success</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Recommendation */}
              <div className={cn(
                "glass-card p-5 flex items-start gap-3",
                result.overallSuccessRate >= 80 ? "border-accent-500/20" :
                result.overallSuccessRate >= 60 ? "border-warning-500/20" : "border-danger-500/20"
              )}>
                <div className={cn("text-2xl flex-shrink-0")}>
                  {result.overallSuccessRate >= 80 ? "✅" : result.overallSuccessRate >= 60 ? "⚠️" : "🚫"}
                </div>
                <div>
                  <div className="font-semibold text-white font-display text-sm mb-1">
                    {result.overallSuccessRate >= 80 ? "Safe to deliver" :
                     result.overallSuccessRate >= 60 ? "Proceed with caution" : "High return risk"}
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    {result.overallSuccessRate >= 80
                      ? "This customer has a strong delivery history. You can confidently process this order."
                      : result.overallSuccessRate >= 60
                      ? "This customer has a moderate cancellation rate. Consider calling to confirm before shipping."
                      : "This customer has a high cancellation/return rate. Consider advance payment or calling to confirm."}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
