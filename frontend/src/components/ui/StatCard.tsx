import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "../../lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color?: "primary" | "success" | "warning" | "danger";
  suffix?: string;
}

const colorMap = {
  primary: {
    icon: "text-primary-400",
    bg: "bg-primary-500/10",
    glow: "shadow-[0_0_20px_rgba(79,70,229,0.12)]",
  },
  success: {
    icon: "text-accent-400",
    bg: "bg-accent-500/10",
    glow: "shadow-[0_0_20px_rgba(16,185,129,0.12)]",
  },
  warning: {
    icon: "text-warning-400",
    bg: "bg-warning-500/10",
    glow: "shadow-[0_0_20px_rgba(245,158,11,0.12)]",
  },
  danger: {
    icon: "text-danger-400",
    bg: "bg-danger-500/10",
    glow: "shadow-[0_0_20px_rgba(239,68,68,0.12)]",
  },
};

export default function StatCard({ title, value, change, icon: Icon, color = "primary", suffix }: StatCardProps) {
  const colors = colorMap[color];
  const isPositive = change !== undefined && change >= 0;

  return (
    <div className={cn("stat-card group hover:border-white/[0.1] transition-all duration-300", colors.glow)}>
      {/* Subtle gradient overlay */}
      <div className={cn("absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300", `bg-gradient-to-br from-transparent to-${color === 'primary' ? 'primary' : color === 'success' ? 'accent' : color}-500/[0.03]`)} />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", colors.bg)}>
            <Icon size={18} className={colors.icon} />
          </div>
          {change !== undefined && (
            <div className={cn(
              "flex items-center gap-1 text-xs font-semibold font-display px-2 py-1 rounded-lg",
              isPositive ? "bg-accent-500/10 text-accent-400" : "bg-danger-500/10 text-danger-400"
            )}>
              {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {Math.abs(change)}%
            </div>
          )}
        </div>

        <div className="text-2xl font-bold text-white font-display mb-1">
          {value}{suffix}
        </div>
        <div className="text-xs text-slate-500 font-display uppercase tracking-wider">{title}</div>
      </div>
    </div>
  );
}
