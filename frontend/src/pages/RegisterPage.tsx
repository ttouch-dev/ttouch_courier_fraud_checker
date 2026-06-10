import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Eye, EyeOff, Truck, ArrowRight, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { authApi } from "../lib/api";
import { useAuthStore } from "../store/authStore";
import { Spinner } from "../components/ui/Spinner";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^(\+880|0)1[3-9]\d{8}$/, "Enter a valid Bangladeshi phone number").optional().or(z.literal("")),
  password: z.string().min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain uppercase letter")
    .regex(/[0-9]/, "Must contain a number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

const features = [
  "20 free searches per day",
  "Multi-courier data",
  "Search history",
  "API token access",
];

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const password = watch("password", "");

  const onSubmit = async (data: FormData) => {
    try {
      const res = await authApi.register({
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        password: data.password,
      });
      setAuth(res.data.user, res.data.token);
      toast.success("Account created! Welcome to BDCourier.");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  const passwordStrength = () => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const strength = passwordStrength();
  const strengthColors = ["bg-danger-500", "bg-orange-400", "bg-warning-400", "bg-accent-400"];
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];

  return (
    <div className="min-h-screen bg-surface-950 flex">
      {/* Left: Visual */}
      <div className="hidden lg:flex flex-col flex-1 bg-gradient-to-br from-primary-900/20 to-surface-900 relative overflow-hidden items-center justify-center border-r border-white/[0.06]">
        <div className="absolute inset-0 bg-mesh-gradient" />
        <div className="relative px-12 max-w-lg">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mb-8 shadow-glow">
            <Truck size={28} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white font-display mb-4">
            Start free today.<br />
            <span className="text-gradient">Upgrade anytime.</span>
          </h2>
          <p className="text-slate-400 mb-8">
            Join thousands of Bangladeshi merchants who use BDCourier to reduce failed deliveries.
          </p>
          <div className="space-y-3">
            {features.map((f) => (
              <div key={f} className="flex items-center gap-3">
                <CheckCircle size={16} className="text-accent-400 flex-shrink-0" />
                <span className="text-slate-300 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md py-6"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-glow-sm">
              <Truck size={17} className="text-white" />
            </div>
            <span className="text-lg font-bold text-white font-display">BDCourier</span>
          </div>

          <h1 className="text-2xl font-bold text-white font-display mb-1">Create your account</h1>
          <p className="text-slate-400 text-sm mb-7">Free forever. No credit card required.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input {...register("name")} className="input-field" placeholder="John Doe" />
              {errors.name && <p className="text-danger-400 text-xs mt-1.5">{errors.name.message}</p>}
            </div>

            <div>
              <label className="label">Email Address</label>
              <input {...register("email")} type="email" className="input-field" placeholder="you@example.com" />
              {errors.email && <p className="text-danger-400 text-xs mt-1.5">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label">Phone Number <span className="text-slate-600 normal-case tracking-normal font-normal">(optional)</span></label>
              <input {...register("phone")} type="tel" className="input-field" placeholder="01XXXXXXXXX" />
              {errors.phone && <p className="text-danger-400 text-xs mt-1.5">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  className="input-field pr-10"
                  placeholder="Min. 8 characters"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < strength ? strengthColors[strength - 1] : "bg-white/[0.08]"}`} />
                    ))}
                  </div>
                  <p className={`text-xs ${strength > 0 ? strengthColors[strength - 1].replace("bg-", "text-") : "text-slate-500"}`}>
                    {strength > 0 ? strengthLabels[strength - 1] : ""}
                  </p>
                </div>
              )}
              {errors.password && <p className="text-danger-400 text-xs mt-1.5">{errors.password.message}</p>}
            </div>

            <div>
              <label className="label">Confirm Password</label>
              <input
                {...register("confirmPassword")}
                type="password"
                className="input-field"
                placeholder="Repeat password"
              />
              {errors.confirmPassword && <p className="text-danger-400 text-xs mt-1.5">{errors.confirmPassword.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center py-3 mt-2">
              {isSubmitting ? <Spinner size="sm" /> : <>Create Account <ArrowRight size={16} /></>}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            Already have an account?{" "}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
          <p className="text-center text-xs text-slate-600 mt-4">
            By creating an account, you agree to our{" "}
            <a href="#" className="text-slate-500 hover:text-slate-300 transition-colors">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="text-slate-500 hover:text-slate-300 transition-colors">Privacy Policy</a>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
