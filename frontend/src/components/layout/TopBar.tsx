import { Bell, Search, Moon, Sun, ChevronDown } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { cn } from "../../lib/utils";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export default function TopBar({ title, subtitle }: TopBarProps) {
  const { user } = useAuthStore();

  return (
    <header className="sticky top-0 z-10 bg-surface-950/80 backdrop-blur-xl border-b border-white/[0.06] px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white font-display">{title}</h1>
          {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3">
          {/* Notification */}
          <button className="relative w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.07] transition-all">
            <Bell size={16} />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-primary-400" />
          </button>

          {/* Plan badge */}
          <div className={cn(
            "hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold font-display border",
            user?.plan === "PRO" || user?.plan === "ENTERPRISE"
              ? "bg-primary-500/15 border-primary-500/20 text-primary-300"
              : "bg-white/[0.04] border-white/[0.08] text-slate-400"
          )}>
            <span>{user?.plan}</span>
          </div>

          {/* User */}
          <div className="flex items-center gap-2 pl-2 border-l border-white/[0.06]">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xs font-bold font-display">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-semibold text-slate-200 font-display">{user?.name}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
