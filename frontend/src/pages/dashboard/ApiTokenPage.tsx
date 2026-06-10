import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Key, Copy, RefreshCw, Eye, EyeOff, Code, Terminal } from "lucide-react";
import toast from "react-hot-toast";
import { usersApi } from "../../lib/api";
import { useAuthStore } from "../../store/authStore";
import { Spinner } from "../../components/ui/Spinner";
import TopBar from "../../components/layout/TopBar";

export default function ApiTokenPage() {
  const { user, updateUser } = useAuthStore();
  const [showToken, setShowToken] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: generateToken, isPending } = useMutation({
    mutationFn: () => usersApi.generateToken(),
    onSuccess: (res) => {
      updateUser({ apiToken: res.data.token });
      toast.success("New API token generated!");
    },
    onError: () => toast.error("Failed to generate token"),
  });

  const copyToken = () => {
    if (user?.apiToken) {
      navigator.clipboard.writeText(user.apiToken);
      toast.success("Token copied to clipboard!");
    }
  };

  const displayToken = user?.apiToken
    ? showToken
      ? user.apiToken
      : user.apiToken.slice(0, 8) + "•".repeat(32) + user.apiToken.slice(-8)
    : null;

  const CODE_EXAMPLE = `// Check customer delivery history
const response = await fetch('https://api.bdcourier.com/v1/check', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ${user?.apiToken || "YOUR_API_TOKEN"}'
  },
  body: JSON.stringify({ phone: '01XXXXXXXXX' })
});

const data = await response.json();
console.log(data);
// {
//   phone: "01XXXXXXXXX",
//   totalOrders: 24,
//   successRate: 79,
//   riskLevel: "MEDIUM",
//   couriers: [...]
// }`;

  return (
    <>
      <TopBar title="API Token" subtitle="Developer access credentials" />
      <div className="p-6 lg:p-8 space-y-6 animate-fade-in max-w-3xl">
        {/* Token display */}
        <div className="glass-card p-6">
          <h2 className="text-base font-bold text-white font-display mb-4 flex items-center gap-2">
            <Key size={16} className="text-primary-400" />
            Your API Token
          </h2>

          {user?.apiToken ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 bg-surface-800/50 border border-white/[0.08] rounded-xl p-3">
                <code className="flex-1 text-sm text-slate-300 font-mono break-all text-xs leading-relaxed">
                  {displayToken}
                </code>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button onClick={() => setShowToken(!showToken)} className="w-7 h-7 rounded-lg bg-white/[0.05] flex items-center justify-center text-slate-400 hover:text-white transition-all">
                    {showToken ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                  <button onClick={copyToken} className="w-7 h-7 rounded-lg bg-white/[0.05] flex items-center justify-center text-slate-400 hover:text-white transition-all">
                    <Copy size={13} />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => generateToken()}
                  disabled={isPending}
                  className="btn-secondary text-xs py-2"
                >
                  {isPending ? <Spinner size="sm" /> : <RefreshCw size={13} />}
                  Regenerate Token
                </button>
                <p className="text-xs text-slate-500">Warning: Regenerating will invalidate the current token</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Key size={32} className="text-slate-700 mx-auto mb-3" />
              <p className="text-slate-400 text-sm mb-4">You don't have an API token yet</p>
              <button onClick={() => generateToken()} disabled={isPending} className="btn-primary">
                {isPending ? <Spinner size="sm" /> : <Key size={14} />}
                Generate Token
              </button>
            </div>
          )}
        </div>

        {/* API Docs */}
        <div className="glass-card p-6">
          <h2 className="text-base font-bold text-white font-display mb-4 flex items-center gap-2">
            <Terminal size={16} className="text-primary-400" />
            Quick Start
          </h2>
          <div className="bg-surface-950 rounded-xl border border-white/[0.06] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06]">
              <div className="flex gap-1.5">
                {["bg-danger-500", "bg-warning-400", "bg-accent-400"].map((c) => (
                  <div key={c} className={`w-2.5 h-2.5 rounded-full ${c}`} />
                ))}
              </div>
              <span className="text-xs text-slate-500 font-mono">JavaScript / Node.js</span>
              <button
                onClick={() => { navigator.clipboard.writeText(CODE_EXAMPLE); toast.success("Code copied!"); }}
                className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors"
              >
                <Copy size={11} /> Copy
              </button>
            </div>
            <pre className="p-4 text-xs text-slate-300 font-mono overflow-x-auto leading-relaxed">
              <code>{CODE_EXAMPLE}</code>
            </pre>
          </div>
        </div>

        {/* Rate limits */}
        <div className="glass-card p-5">
          <h3 className="section-title mb-4">Rate Limits by Plan</h3>
          <div className="space-y-3">
            {[
              { plan: "FREE", limit: "20 req/day", color: "text-slate-400" },
              { plan: "STARTER", limit: "200 req/day", color: "text-slate-300" },
              { plan: "PRO", limit: "Unlimited", color: "text-primary-300" },
              { plan: "ENTERPRISE", limit: "Custom", color: "text-accent-400" },
            ].map((row) => (
              <div key={row.plan} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                <span className={`text-sm font-semibold font-display ${row.color}`}>{row.plan}</span>
                <span className="text-sm text-slate-400 font-mono">{row.limit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
