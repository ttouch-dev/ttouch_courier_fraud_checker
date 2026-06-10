import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "BDT") {
  if (currency === "BDT") return `৳${amount.toLocaleString("en-BD")}`;
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function formatPhone(phone: string) {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 11 && cleaned.startsWith("0")) {
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 8)}-${cleaned.slice(8)}`;
  }
  return phone;
}

export function getRiskColor(risk: string) {
  switch (risk) {
    case "LOW": return "text-accent-400";
    case "MEDIUM": return "text-warning-400";
    case "HIGH": return "text-orange-400";
    case "CRITICAL": return "text-danger-400";
    default: return "text-slate-400";
  }
}

export function getRiskBadgeClass(risk: string) {
  switch (risk) {
    case "LOW": return "badge-success";
    case "MEDIUM": return "badge-warning";
    case "HIGH": return "bg-orange-500/15 text-orange-400 border border-orange-500/20";
    case "CRITICAL": return "badge-danger";
    default: return "badge-primary";
  }
}

export function getRiskFromRate(rate: number): string {
  if (rate >= 80) return "LOW";
  if (rate >= 60) return "MEDIUM";
  if (rate >= 40) return "HIGH";
  return "CRITICAL";
}

export function truncate(str: string, length: number) {
  return str.length > length ? str.slice(0, length) + "..." : str;
}
