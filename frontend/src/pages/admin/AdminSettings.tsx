import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Settings, Mail, CreditCard, Globe, AlertTriangle, Save, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import TopBar from "../../components/layout/TopBar";

const TABS = [
  { id: "general", label: "General", icon: Globe },
  { id: "email", label: "Email / SMTP", icon: Mail },
  { id: "payment", label: "Payment Gateways", icon: CreditCard },
  { id: "maintenance", label: "Maintenance", icon: AlertTriangle },
];

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const { register, handleSubmit } = useForm();

  const toggleKey = (key: string) => setShowKeys((prev) => ({ ...prev, [key]: !prev[key] }));

  const onSave = async (data: any) => {
    await new Promise((r) => setTimeout(r, 500));
    toast.success("Settings saved successfully!");
  };

  const SecretInput = ({ id, placeholder, ...props }: any) => (
    <div className="relative">
      <input
        {...props}
        type={showKeys[id] ? "text" : "password"}
        className="input-field pr-10"
        placeholder={placeholder}
      />
      <button type="button" onClick={() => toggleKey(id)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
        {showKeys[id] ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </div>
  );

  return (
    <>
      <TopBar title="Settings" subtitle="Platform configuration" />
      <div className="p-6 lg:p-8 animate-fade-in">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar tabs */}
          <div className="lg:w-52 flex-shrink-0">
            <nav className="glass-card p-2 space-y-0.5">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn("nav-item w-full", activeTab === tab.id && "nav-item-active")}
                >
                  <tab.icon size={15} className={activeTab === tab.id ? "text-primary-300" : ""} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            <form onSubmit={handleSubmit(onSave)}>
              <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 space-y-5">
                {activeTab === "general" && (
                  <>
                    <h2 className="section-title flex items-center gap-2"><Globe size={16} className="text-primary-400" /> General Settings</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="label">Site Name</label>
                        <input {...register("siteName")} defaultValue="BDCourier" className="input-field" />
                      </div>
                      <div>
                        <label className="label">Support Email</label>
                        <input {...register("supportEmail")} defaultValue="support@bdcourier.com" className="input-field" />
                      </div>
                    </div>
                    <div>
                      <label className="label">Site Description</label>
                      <textarea {...register("siteDescription")} defaultValue="Smart delivery intelligence for Bangladeshi e-commerce." className="input-field h-20 resize-none" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="label">Free Plan Daily Limit</label>
                        <input {...register("freePlanLimit")} type="number" defaultValue={20} className="input-field" />
                      </div>
                      <div>
                        <label className="label">Default Timezone</label>
                        <input {...register("timezone")} defaultValue="Asia/Dhaka" className="input-field" />
                      </div>
                    </div>
                  </>
                )}

                {activeTab === "email" && (
                  <>
                    <h2 className="section-title flex items-center gap-2"><Mail size={16} className="text-primary-400" /> Email / SMTP Settings</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="label">SMTP Host</label>
                        <input {...register("smtpHost")} defaultValue="smtp.gmail.com" className="input-field" />
                      </div>
                      <div>
                        <label className="label">SMTP Port</label>
                        <input {...register("smtpPort")} defaultValue={587} type="number" className="input-field" />
                      </div>
                      <div>
                        <label className="label">SMTP Username</label>
                        <input {...register("smtpUser")} className="input-field" placeholder="your@email.com" />
                      </div>
                      <div>
                        <label className="label">SMTP Password</label>
                        <SecretInput id="smtpPass" {...register("smtpPass")} placeholder="SMTP password" />
                      </div>
                      <div>
                        <label className="label">From Name</label>
                        <input {...register("fromName")} defaultValue="BDCourier" className="input-field" />
                      </div>
                      <div>
                        <label className="label">From Email</label>
                        <input {...register("fromEmail")} defaultValue="noreply@bdcourier.com" className="input-field" />
                      </div>
                    </div>
                    <button type="button" onClick={() => toast.success("Test email sent!")} className="btn-secondary text-xs">
                      Send Test Email
                    </button>
                  </>
                )}

                {activeTab === "payment" && (
                  <>
                    <h2 className="section-title flex items-center gap-2"><CreditCard size={16} className="text-primary-400" /> Payment Gateway Keys</h2>

                    {[
                      { label: "bKash", fields: [{ name: "bkashAppKey", label: "App Key" }, { name: "bkashAppSecret", label: "App Secret" }, { name: "bkashUsername", label: "Username" }, { name: "bkashPassword", label: "Password" }] },
                      { label: "Nagad", fields: [{ name: "nagadMerchantId", label: "Merchant ID" }, { name: "nagadPublicKey", label: "Public Key" }, { name: "nagadPrivateKey", label: "Private Key" }] },
                      { label: "SSLCommerz", fields: [{ name: "sslStoreId", label: "Store ID" }, { name: "sslStorePassword", label: "Store Password" }] },
                    ].map((gateway) => (
                      <div key={gateway.label} className="bg-white/[0.02] rounded-xl p-4 border border-white/[0.06]">
                        <div className="text-sm font-bold text-slate-300 font-display mb-3">{gateway.label}</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {gateway.fields.map((field) => (
                            <div key={field.name}>
                              <label className="label">{field.label}</label>
                              <SecretInput id={field.name} {...register(field.name as any)} placeholder={`${gateway.label} ${field.label}`} />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {activeTab === "maintenance" && (
                  <>
                    <h2 className="section-title flex items-center gap-2"><AlertTriangle size={16} className="text-warning-400" /> Maintenance Mode</h2>
                    <div className={cn("rounded-xl p-5 border", maintenanceMode ? "bg-warning-500/10 border-warning-500/20" : "bg-white/[0.03] border-white/[0.06]")}>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-semibold text-white font-display text-sm">Maintenance Mode</div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {maintenanceMode ? "⚠️ Site is currently in maintenance mode" : "Site is running normally"}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => { setMaintenanceMode(!maintenanceMode); toast.success(maintenanceMode ? "Maintenance mode OFF" : "Maintenance mode ON"); }}
                          className={cn("w-12 h-6 rounded-full transition-all relative", maintenanceMode ? "bg-warning-400" : "bg-white/[0.1]")}
                        >
                          <div className={cn("absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all", maintenanceMode ? "left-6" : "left-0.5")} />
                        </button>
                      </div>
                      {maintenanceMode && (
                        <div>
                          <label className="label">Maintenance Message</label>
                          <textarea className="input-field h-20 resize-none" defaultValue="We are currently performing maintenance. Please check back soon." />
                        </div>
                      )}
                    </div>

                    <div className="bg-white/[0.02] rounded-xl p-4 border border-white/[0.06]">
                      <div className="font-semibold text-white font-display text-sm mb-3">Terms & Privacy Pages</div>
                      <div className="space-y-3">
                        <div>
                          <label className="label">Terms of Service URL</label>
                          <input className="input-field" defaultValue="/terms" />
                        </div>
                        <div>
                          <label className="label">Privacy Policy URL</label>
                          <input className="input-field" defaultValue="/privacy" />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="pt-2 border-t border-white/[0.06]">
                  <button type="submit" className="btn-primary">
                    <Save size={14} /> Save Settings
                  </button>
                </div>
              </motion.div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
