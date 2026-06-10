import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, Zap, Crown, Building2, CreditCard, History } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { plansApi, paymentsApi } from "../../lib/api";
import { useAuthStore } from "../../store/authStore";
import { formatCurrency, formatDate } from "../../lib/utils";
import { cn } from "../../lib/utils";
import type { Plan } from "../../types";
import TopBar from "../../components/layout/TopBar";

const PLAN_ICONS: Record<string, React.ReactNode> = {
  FREE: <Zap size={18} />,
  STARTER: <Zap size={18} />,
  PRO: <Crown size={18} />,
  ENTERPRISE: <Building2 size={18} />,
};

const PAYMENT_METHODS = [
  { id: "bkash", label: "bKash", emoji: "🟠", color: "hover:border-pink-500/40" },
  { id: "nagad", label: "Nagad", emoji: "🔵", color: "hover:border-orange-500/40" },
  { id: "card", label: "Card", emoji: "💳", color: "hover:border-blue-500/40" },
  { id: "bank", label: "Bank Transfer", emoji: "🏦", color: "hover:border-green-500/40" },
];

export default function BillingPage() {
  const { user } = useAuthStore();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>("bkash");
  const [isProcessing, setIsProcessing] = useState(false);

  const MOCK_PLANS: Plan[] = [
    { id: "free", name: "FREE", price: 0, currency: "BDT", interval: "MONTHLY", searchLimit: 20, features: ["20 searches/day", "Basic reports", "Email support"], isActive: true },
    { id: "starter", name: "STARTER", price: 199, currency: "BDT", interval: "MONTHLY", searchLimit: 200, features: ["200 searches/day", "API access", "Search history", "Priority support"], isActive: true, isPopular: false },
    { id: "pro", name: "PRO", price: 499, currency: "BDT", interval: "MONTHLY", searchLimit: -1, features: ["Unlimited searches", "Full API access", "Advanced analytics", "Webhook support", "Priority support"], isActive: true, isPopular: true },
    { id: "enterprise", name: "ENTERPRISE", price: 0, currency: "BDT", interval: "MONTHLY", searchLimit: -1, features: ["Custom integration", "White-label option", "Dedicated support", "SLA guarantee", "Custom API limits"], isActive: true },
  ];

  const { data: plansData } = useQuery({
    queryKey: ["plans"],
    queryFn: () => plansApi.getAll().then((r) => r.data.data).catch(() => MOCK_PLANS),
    initialData: MOCK_PLANS,
  });

  const { data: billingHistory } = useQuery({
    queryKey: ["billing-history"],
    queryFn: () => paymentsApi.getBillingHistory().then((r) => r.data.data).catch(() => []),
    initialData: [],
  });

  const handleSubscribe = async (planId: string) => {
    setIsProcessing(true);
    try {
      const res = await paymentsApi.initiate(planId, selectedMethod);
      window.location.href = res.data.paymentUrl;
    } catch {
      toast.success("Payment gateway integration demo. In production, you'd be redirected to payment.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <TopBar title="Billing & Plans" subtitle="Manage your subscription" />
      <div className="p-6 lg:p-8 space-y-8 animate-fade-in">
        {/* Current plan */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-500/15 flex items-center justify-center text-primary-400">
                {PLAN_ICONS[user?.plan || "FREE"]}
              </div>
              <div>
                <div className="text-sm text-slate-500">Current Plan</div>
                <div className="font-bold text-white font-display">{user?.plan}</div>
              </div>
            </div>
            <div className="badge badge-primary text-sm px-3 py-1.5">Active</div>
          </div>
        </div>

        {/* Plans */}
        <div>
          <h2 className="section-title mb-4">Choose a Plan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {plansData?.map((plan: Plan, i: number) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => plan.price > 0 && setSelectedPlan(plan.id)}
                className={cn(
                  "glass-card p-5 relative cursor-pointer transition-all duration-200 border",
                  plan.isPopular ? "border-primary-500/40 shadow-glow" : "border-transparent",
                  selectedPlan === plan.id && "border-primary-500/60",
                  plan.price === 0 && user?.plan === plan.name && "border-accent-500/30",
                  plan.price > 0 && "hover:border-white/[0.12]"
                )}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="badge bg-gradient-to-r from-primary-500 to-primary-600 text-white text-[10px] px-3 py-1 shadow-glow-sm">Most Popular</span>
                  </div>
                )}
                <div className="text-sm font-bold text-slate-400 font-display mb-3">{plan.name}</div>
                <div className="mb-4">
                  {plan.price === 0 && plan.name === "ENTERPRISE" ? (
                    <span className="text-2xl font-black text-white font-display">Custom</span>
                  ) : (
                    <>
                      <span className="text-3xl font-black text-white font-display">{plan.price === 0 ? "Free" : formatCurrency(plan.price)}</span>
                      {plan.price > 0 && <span className="text-slate-500 text-sm">/mo</span>}
                    </>
                  )}
                </div>
                <ul className="space-y-2 mb-5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-slate-400">
                      <Check size={13} className="text-accent-400 mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                {plan.price === 0 && plan.name !== "ENTERPRISE" ? (
                  <div className={cn("w-full py-2 rounded-xl text-xs font-semibold text-center font-display", user?.plan === "FREE" ? "bg-accent-500/15 text-accent-400" : "bg-white/[0.04] text-slate-500")}>
                    {user?.plan === "FREE" ? "Current Plan" : "Free Tier"}
                  </div>
                ) : plan.name === "ENTERPRISE" ? (
                  <button className="btn-secondary w-full justify-center text-xs py-2">Contact Sales</button>
                ) : (
                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    className={cn("w-full py-2 rounded-xl text-xs font-semibold font-display transition-all", plan.isPopular ? "btn-primary justify-center" : "btn-secondary justify-center")}
                  >
                    {user?.plan === plan.name ? "Current Plan" : "Subscribe"}
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Payment method */}
        <div className="glass-card p-5">
          <h3 className="section-title flex items-center gap-2 mb-4">
            <CreditCard size={16} className="text-primary-400" />
            Payment Method
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PAYMENT_METHODS.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMethod(m.id)}
                className={cn(
                  "p-3 rounded-xl border text-center transition-all duration-200",
                  selectedMethod === m.id
                    ? "border-primary-500/50 bg-primary-500/10 text-white"
                    : "border-white/[0.08] bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06]",
                  m.color
                )}
              >
                <div className="text-xl mb-1">{m.emoji}</div>
                <div className="text-xs font-semibold font-display">{m.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Billing history */}
        {billingHistory && (billingHistory as unknown[]).length > 0 && (
          <div className="glass-card overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-2">
              <History size={16} className="text-primary-400" />
              <h3 className="section-title">Billing History</h3>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {(billingHistory as any[]).map((tx: any) => (
                <div key={tx.id} className="flex items-center justify-between px-5 py-3.5">
                  <div>
                    <div className="text-sm font-semibold text-slate-200 font-display">{tx.planName}</div>
                    <div className="text-xs text-slate-500">{formatDate(tx.createdAt)} · {tx.method}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-white font-display">{formatCurrency(tx.amount)}</div>
                    <span className={cn("badge text-[10px]", tx.status === "COMPLETED" ? "badge-success" : "badge-warning")}>{tx.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
