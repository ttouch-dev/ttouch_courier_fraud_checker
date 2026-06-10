import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Truck, Search, Shield, Zap, CheckCircle, ArrowRight, Star, BarChart2, Globe } from "lucide-react";

const FEATURES = [
  { icon: Search, title: "Instant Phone Lookup", desc: "Enter any BD phone number to instantly see delivery history across all major couriers." },
  { icon: BarChart2, title: "Success Rate Analytics", desc: "Get detailed success/cancel ratios and risk scores to make better delivery decisions." },
  { icon: Globe, title: "10+ Couriers Covered", desc: "Pathao, Steadfast, RedX, eCourier, Paperfly, Delivery Tiger and more." },
  { icon: Shield, title: "Fraud Prevention", desc: "Automatically flag high-risk customers with our intelligent risk scoring system." },
  { icon: Zap, title: "Lightning Fast API", desc: "Integrate with WooCommerce, Shopify, or any platform via our REST API." },
  { icon: CheckCircle, title: "Always Accurate", desc: "Real-time data from courier networks ensures 99.9% accuracy." },
];

const PLANS = [
  { name: "Free", price: "৳0", period: "/mo", features: ["20 searches/day", "Basic reports", "Email support"], cta: "Get Started", highlight: false },
  { name: "Pro", price: "৳499", period: "/mo", features: ["Unlimited searches", "API access", "Advanced analytics", "Webhook support", "Priority support"], cta: "Start Pro", highlight: true },
  { name: "Starter", price: "৳199", period: "/mo", features: ["200 searches/day", "API access", "Search history", "Priority support"], cta: "Get Starter", highlight: false },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-950 text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-30 bg-surface-950/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-glow-sm">
              <Truck size={16} className="text-white" />
            </div>
            <span className="font-bold text-white font-display">BDCourier</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#api" className="hover:text-white transition-colors">API</a>
          </div>
          <div className="flex items-center gap-2.5">
            <Link to="/login" className="btn-secondary text-xs py-2 px-4">Sign In</Link>
            <Link to="/register" className="btn-primary text-xs py-2 px-4">Get Free Access</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden py-24 px-6">
        <div className="absolute inset-0 bg-mesh-gradient" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-primary-500/10 to-transparent" />

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-xs text-primary-300 font-display mb-6">
              <Zap size={11} /> Trusted by 5,000+ Bangladesh merchants
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black font-display leading-tight mb-6">
              Know Before You<br />
              <span className="text-gradient">Ship</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Check any customer's delivery history across all major Bangladeshi couriers. Reduce returns, avoid fraud, and protect your business.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/register" className="btn-primary text-base py-3.5 px-8">
                Start Free Today <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn-secondary text-base py-3.5 px-8">
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Demo */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-primary-500/15 flex items-center justify-center">
                <Search size={16} className="text-primary-400" />
              </div>
              <div>
                <div className="font-semibold text-white font-display text-sm">Check Customer Delivery History</div>
                <div className="text-xs text-slate-500">Enter phone number to get instant insights</div>
              </div>
            </div>
            <div className="flex gap-3 mb-5">
              <input className="input-field font-mono flex-1" value="01712345678" readOnly />
              <div className="btn-primary px-5 cursor-default">Check</div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Total Orders", value: "24", color: "text-slate-200" },
                { label: "Successful", value: "19", color: "text-accent-400" },
                { label: "Cancelled", value: "5", color: "text-danger-400" },
              ].map((s) => (
                <div key={s.label} className="bg-white/[0.03] rounded-xl p-3 text-center border border-white/[0.06]">
                  <div className={`text-2xl font-black font-display ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-warning-500/10 rounded-xl border border-warning-500/20 flex items-center gap-2.5">
              <div className="text-base">⚠️</div>
              <div>
                <div className="text-xs font-semibold text-warning-300 font-display">Medium Risk — 79% success rate</div>
                <div className="text-xs text-slate-500 mt-0.5">Proceed with caution. Consider calling to confirm.</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black font-display mb-3">Everything you need to <span className="text-gradient">ship smarter</span></h2>
            <p className="text-slate-400 max-w-xl mx-auto">All the tools to reduce failed deliveries and protect your business from fraudulent orders.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-5 group hover:border-white/[0.1] transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center mb-4 group-hover:bg-primary-500/20 transition-colors">
                  <f.icon size={17} className="text-primary-400" />
                </div>
                <h3 className="font-bold text-white font-display text-sm mb-1.5">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 border-t border-white/[0.05]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black font-display mb-3">Simple, transparent <span className="text-gradient">pricing</span></h2>
            <p className="text-slate-400">Start free. Upgrade when you need more.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
            {PLANS.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`glass-card p-6 relative ${plan.highlight ? "border border-primary-500/40 shadow-glow" : ""}`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="badge bg-gradient-to-r from-primary-500 to-primary-600 text-white px-3 py-1 text-[10px]">Most Popular</span>
                  </div>
                )}
                <div className="font-bold text-slate-400 font-display text-xs uppercase tracking-widest mb-2">{plan.name}</div>
                <div className="text-4xl font-black text-white font-display mb-5">
                  {plan.price}<span className="text-sm text-slate-500 font-normal">{plan.period}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-slate-400">
                      <CheckCircle size={12} className="text-accent-400 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link to="/register" className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold font-display transition-all ${plan.highlight ? "btn-primary" : "btn-secondary"}`}>
                  {plan.cta} <ArrowRight size={14} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <Truck size={14} className="text-white" />
            </div>
            <span className="font-bold text-white font-display text-sm">BDCourier</span>
          </div>
          <div className="text-xs text-slate-600">© 2024 BDCourier. All rights reserved.</div>
          <div className="flex gap-4 text-xs text-slate-500">
            <a href="#" className="hover:text-slate-300 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">API Docs</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
