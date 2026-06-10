import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Eye, EyeOff, Truck, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { authApi } from "../lib/api";
import { useAuthStore } from "../store/authStore";
import { Spinner } from "../components/ui/Spinner";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

function getDashboardPath(role?: string) {
  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    return "/admin";
  }

  return "/dashboard";
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await authApi.login(data);

      const user = res.data.user;
      const token = res.data.token;

      setAuth(user, token);

      toast.success("Welcome back!");

      navigate(getDashboardPath(user?.role), { replace: true });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-surface-950 flex">
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-glow">
              <Truck size={20} className="text-white" />
            </div>

            <div>
              <div className="text-xl font-bold text-white font-display leading-none">
                BDCourier
              </div>
              <div className="text-xs text-slate-500">
                Smart Delivery Intelligence
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white font-display mb-2">
            Welcome back
          </h1>

          <p className="text-slate-400 mb-8">
            Sign in to your account to continue
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <input
                {...register("email")}
                type="email"
                className="input-field"
                placeholder="you@example.com"
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-danger-400 text-xs mt-1.5">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label mb-0">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  className="input-field pr-10"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {errors.password && (
                <p className="text-danger-400 text-xs mt-1.5">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full justify-center py-3 mt-2"
            >
              {isSubmitting ? (
                <Spinner size="sm" />
              ) : (
                <>
                  Sign In <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="text-primary-400 hover:text-primary-300 font-semibold transition-colors"
            >
              Create one free
            </Link>
          </p>
        </motion.div>
      </div>

      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-900/30 to-surface-900 relative overflow-hidden items-center justify-center border-l border-white/[0.06]">
        <div className="absolute inset-0 bg-mesh-gradient" />

        <div className="relative text-center px-12 max-w-lg">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mx-auto mb-8 shadow-glow">
            <Truck size={36} className="text-white" />
          </div>

          <h2 className="text-3xl font-bold text-white font-display mb-4">
            Smart Delivery
            <br />
            <span className="text-gradient">Intelligence Platform</span>
          </h2>

          <p className="text-slate-400 text-base leading-relaxed">
            Check customer delivery success rates across all major Bangladeshi
            courier services in seconds.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { label: "Couriers", value: "10+" },
              { label: "Searches/day", value: "50K+" },
              { label: "Accuracy", value: "99.9%" },
            ].map((stat) => (
              <div key={stat.label} className="glass-card p-4 text-center">
                <div className="text-xl font-bold text-white font-display">
                  {stat.value}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}