import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit2, Trash2, Check, Crown, Zap, Building2, ToggleLeft, ToggleRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { plansApi } from "../../lib/api";
import Modal from "../../components/ui/Modal";
import { formatCurrency, cn } from "../../lib/utils";
import type { Plan } from "../../types";
import TopBar from "../../components/layout/TopBar";

const schema = z.object({
  name: z.string().min(2),
  price: z.coerce.number().min(0),
  searchLimit: z.coerce.number().min(-1),
  features: z.string().min(1),
  isPopular: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

const MOCK_PLANS: Plan[] = [
  { id: "1", name: "FREE", price: 0, currency: "BDT", interval: "MONTHLY", searchLimit: 20, features: ["20 searches/day", "Basic reports", "Email support"], isActive: true, isPopular: false },
  { id: "2", name: "STARTER", price: 199, currency: "BDT", interval: "MONTHLY", searchLimit: 200, features: ["200 searches/day", "API access", "Search history", "Priority support"], isActive: true, isPopular: false },
  { id: "3", name: "PRO", price: 499, currency: "BDT", interval: "MONTHLY", searchLimit: -1, features: ["Unlimited searches", "Full API access", "Advanced analytics", "Webhook support", "Priority support"], isActive: true, isPopular: true },
  { id: "4", name: "ENTERPRISE", price: 0, currency: "BDT", interval: "MONTHLY", searchLimit: -1, features: ["Custom integration", "White-label", "Dedicated support", "SLA guarantee"], isActive: true, isPopular: false },
];

const PLAN_ICONS: Record<string, React.ReactNode> = {
  FREE: <Zap size={16} />,
  STARTER: <Zap size={16} />,
  PRO: <Crown size={16} />,
  ENTERPRISE: <Building2 size={16} />,
};

export default function AdminPlans() {
  const [plans, setPlans] = useState<Plan[]>(MOCK_PLANS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Plan | null>(null);
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const openCreate = () => { reset(); setEditTarget(null); setIsModalOpen(true); };
  const openEdit = (plan: Plan) => {
    setEditTarget(plan);
    setValue("name", plan.name);
    setValue("price", plan.price);
    setValue("searchLimit", plan.searchLimit);
    setValue("features", plan.features.join("\n"));
    setValue("isPopular", plan.isPopular || false);
    setIsModalOpen(true);
  };

  const onSubmit = async (data: FormData) => {
    await new Promise((r) => setTimeout(r, 500));
    const features = data.features.split("\n").map((f) => f.trim()).filter(Boolean);
    if (editTarget) {
      setPlans((prev) => prev.map((p) => p.id === editTarget.id ? { ...p, ...data, features } : p));
      toast.success("Plan updated!");
    } else {
      const newPlan: Plan = { id: Date.now().toString(), ...data, features, currency: "BDT", interval: "MONTHLY", isActive: true };
      setPlans((prev) => [...prev, newPlan]);
      toast.success("Plan created!");
    }
    setIsModalOpen(false);
  };

  const togglePlan = (id: string) => {
    setPlans((prev) => prev.map((p) => p.id === id ? { ...p, isActive: !p.isActive } : p));
    toast.success("Plan status updated");
  };

  const deletePlan = (id: string) => {
    setPlans((prev) => prev.filter((p) => p.id !== id));
    toast.success("Plan deleted");
  };

  return (
    <>
      <TopBar title="Plans & Pricing" subtitle="Subscription plan management" />
      <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
        <div className="flex justify-end">
          <button onClick={openCreate} className="btn-primary">
            <Plus size={15} /> Add New Plan
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={cn("glass-card p-5 relative", plan.isPopular && "border border-primary-500/35 shadow-glow", !plan.isActive && "opacity-50")}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="badge bg-gradient-to-r from-primary-500 to-primary-600 text-white text-[10px] px-2.5 py-1">Popular</span>
                </div>
              )}

              <div className="flex items-center justify-between mb-4">
                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", plan.isPopular ? "bg-primary-500/20 text-primary-400" : "bg-white/[0.06] text-slate-400")}>
                  {PLAN_ICONS[plan.name] || <Zap size={16} />}
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(plan)} className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white transition-all">
                    <Edit2 size={12} />
                  </button>
                  <button onClick={() => deletePlan(plan.id)} className="w-7 h-7 rounded-lg bg-danger-500/10 hover:bg-danger-500/20 flex items-center justify-center text-danger-400 transition-all">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

              <div className="font-bold text-slate-300 font-display text-xs mb-1 uppercase tracking-widest">{plan.name}</div>
              <div className="text-2xl font-black text-white font-display mb-1">
                {plan.price === 0 && plan.name === "ENTERPRISE" ? "Custom" : plan.price === 0 ? "Free" : formatCurrency(plan.price)}
                {plan.price > 0 && <span className="text-sm text-slate-500 font-normal">/mo</span>}
              </div>
              <div className="text-xs text-slate-500 mb-4">
                {plan.searchLimit === -1 ? "Unlimited searches" : `${plan.searchLimit} searches/day`}
              </div>

              <ul className="space-y-1.5 mb-5">
                {plan.features.slice(0, 3).map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-slate-400">
                    <Check size={11} className="text-accent-400 flex-shrink-0" /> {f}
                  </li>
                ))}
                {plan.features.length > 3 && (
                  <li className="text-xs text-slate-600">+{plan.features.length - 3} more...</li>
                )}
              </ul>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <span className={cn("text-xs font-semibold font-display", plan.isActive ? "text-accent-400" : "text-slate-600")}>
                  {plan.isActive ? "Active" : "Disabled"}
                </span>
                <button onClick={() => togglePlan(plan.id)} className={cn("transition-colors", plan.isActive ? "text-accent-400 hover:text-accent-300" : "text-slate-600 hover:text-slate-400")}>
                  {plan.isActive ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editTarget ? "Edit Plan" : "Create New Plan"} size="md">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 pt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Plan Name</label>
              <input {...register("name")} className="input-field" placeholder="e.g. PRO" />
              {errors.name && <p className="text-danger-400 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="label">Price (BDT)</label>
              <input {...register("price")} type="number" className="input-field" placeholder="499" />
              {errors.price && <p className="text-danger-400 text-xs mt-1">{errors.price.message}</p>}
            </div>
          </div>

          <div>
            <label className="label">Search Limit <span className="text-slate-600 normal-case tracking-normal font-normal">(-1 = unlimited)</span></label>
            <input {...register("searchLimit")} type="number" className="input-field" placeholder="-1" />
          </div>

          <div>
            <label className="label">Features <span className="text-slate-600 normal-case tracking-normal font-normal">(one per line)</span></label>
            <textarea {...register("features")} className="input-field h-28 resize-none" placeholder={"Unlimited searches\nAPI access\nPriority support"} />
          </div>

          <div className="flex items-center gap-3">
            <input {...register("isPopular")} type="checkbox" id="isPopular" className="w-4 h-4 rounded accent-primary-500" />
            <label htmlFor="isPopular" className="text-sm text-slate-300 font-display">Mark as Popular</label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 justify-center">
              {isSubmitting ? "Saving..." : editTarget ? "Update Plan" : "Create Plan"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
