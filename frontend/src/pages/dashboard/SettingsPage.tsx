import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { User, Lock, Bell, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { usersApi } from "../../lib/api";
import { useAuthStore } from "../../store/authStore";
import { cn } from "../../lib/utils";
import TopBar from "../../components/layout/TopBar";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(8).regex(/[A-Z]/, "Must contain uppercase").regex(/[0-9]/, "Must contain number"),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, { message: "Passwords don't match", path: ["confirmPassword"] });

type ProfileData = z.infer<typeof profileSchema>;
type PasswordData = z.infer<typeof passwordSchema>;

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "password", label: "Password", icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const { user, updateUser } = useAuthStore();
  const [notifications, setNotifications] = useState({ email: true, searchAlerts: false, billing: true, weeklyReport: true });

  const profileForm = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || "", email: user?.email || "", phone: user?.phone || "" },
  });

  const passwordForm = useForm<PasswordData>({ resolver: zodResolver(passwordSchema) });

  const onProfileSave = async (data: ProfileData) => {
    await new Promise((r) => setTimeout(r, 500));
    updateUser(data);
    toast.success("Profile updated!");
  };

  const onPasswordSave = async (data: PasswordData) => {
    await new Promise((r) => setTimeout(r, 500));
    passwordForm.reset();
    toast.success("Password changed successfully!");
  };

  return (
    <>
      <TopBar title="Settings" subtitle="Account preferences" />
      <div className="p-6 lg:p-8 animate-fade-in">
        <div className="flex flex-col lg:flex-row gap-6 max-w-3xl">
          {/* Sidebar tabs */}
          <div className="lg:w-48 flex-shrink-0">
            <nav className="glass-card p-2 space-y-0.5">
              {TABS.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn("nav-item w-full", activeTab === tab.id && "nav-item-active")}>
                  <tab.icon size={15} className={activeTab === tab.id ? "text-primary-300" : ""} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
              {activeTab === "profile" && (
                <form onSubmit={profileForm.handleSubmit(onProfileSave)} className="space-y-5">
                  <h2 className="section-title flex items-center gap-2"><User size={16} className="text-primary-400" /> Profile Information</h2>

                  {/* Avatar */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-2xl font-bold font-display shadow-glow">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white font-display">{user?.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{user?.plan} Plan · {user?.role}</div>
                    </div>
                  </div>

                  <div>
                    <label className="label">Full Name</label>
                    <input {...profileForm.register("name")} className="input-field" />
                    {profileForm.formState.errors.name && <p className="text-danger-400 text-xs mt-1">{profileForm.formState.errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="label">Email Address</label>
                    <input {...profileForm.register("email")} type="email" className="input-field" />
                    {profileForm.formState.errors.email && <p className="text-danger-400 text-xs mt-1">{profileForm.formState.errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="label">Phone Number</label>
                    <input {...profileForm.register("phone")} className="input-field" placeholder="01XXXXXXXXX" />
                  </div>

                  <button type="submit" disabled={profileForm.formState.isSubmitting} className="btn-primary">
                    {profileForm.formState.isSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              )}

              {activeTab === "password" && (
                <form onSubmit={passwordForm.handleSubmit(onPasswordSave)} className="space-y-5">
                  <h2 className="section-title flex items-center gap-2"><Lock size={16} className="text-primary-400" /> Change Password</h2>
                  <div>
                    <label className="label">Current Password</label>
                    <input {...passwordForm.register("currentPassword")} type="password" className="input-field" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="label">New Password</label>
                    <input {...passwordForm.register("newPassword")} type="password" className="input-field" placeholder="Min. 8 characters" />
                    {passwordForm.formState.errors.newPassword && <p className="text-danger-400 text-xs mt-1">{passwordForm.formState.errors.newPassword.message}</p>}
                  </div>
                  <div>
                    <label className="label">Confirm New Password</label>
                    <input {...passwordForm.register("confirmPassword")} type="password" className="input-field" placeholder="Repeat new password" />
                    {passwordForm.formState.errors.confirmPassword && <p className="text-danger-400 text-xs mt-1">{passwordForm.formState.errors.confirmPassword.message}</p>}
                  </div>
                  <button type="submit" disabled={passwordForm.formState.isSubmitting} className="btn-primary">
                    {passwordForm.formState.isSubmitting ? "Updating..." : "Update Password"}
                  </button>
                </form>
              )}

              {activeTab === "notifications" && (
                <div className="space-y-5">
                  <h2 className="section-title flex items-center gap-2"><Bell size={16} className="text-primary-400" /> Notification Preferences</h2>
                  <div className="space-y-3">
                    {[
                      { key: "email", label: "Email Notifications", desc: "Receive important updates via email" },
                      { key: "searchAlerts", label: "High-Risk Alerts", desc: "Alert when a customer has high risk (below 40%)" },
                      { key: "billing", label: "Billing Reminders", desc: "Subscription renewal and payment reminders" },
                      { key: "weeklyReport", label: "Weekly Report", desc: "Summary of your weekly search activity" },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl border border-white/[0.06]">
                        <div>
                          <div className="text-sm font-semibold text-white font-display">{item.label}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setNotifications((prev) => ({ ...prev, [item.key]: !prev[item.key as keyof typeof notifications] }));
                            toast.success("Notification preference updated");
                          }}
                          className={cn("w-11 h-6 rounded-full transition-all relative flex-shrink-0", notifications[item.key as keyof typeof notifications] ? "bg-primary-500" : "bg-white/[0.1]")}
                        >
                          <div className={cn("absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all", notifications[item.key as keyof typeof notifications] ? "left-5" : "left-0.5")} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
