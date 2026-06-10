import { cn } from "../../lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-10 h-10" };

export function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <div className={cn("relative", sizes[size], className)}>
      <div className="absolute inset-0 rounded-full border-2 border-white/10" />
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary-400 animate-spin" />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-surface-950 flex items-center justify-center z-50">
      <div className="text-center">
        <Spinner size="lg" className="mx-auto mb-4" />
        <div className="text-sm text-slate-500 font-display">Loading...</div>
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="stat-card animate-pulse">
      <div className="w-10 h-10 rounded-xl bg-white/[0.04] mb-4" />
      <div className="h-7 w-24 bg-white/[0.04] rounded-lg mb-2" />
      <div className="h-3 w-16 bg-white/[0.03] rounded" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 bg-white/[0.02] rounded-xl animate-pulse" />
      ))}
    </div>
  );
}
