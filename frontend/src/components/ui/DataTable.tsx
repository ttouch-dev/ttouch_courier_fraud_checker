import { ChevronLeft, ChevronRight } from "lucide-react";
import { Spinner } from "./Spinner";
import { cn } from "../../lib/utils";

interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  emptyMessage?: string;
  keyExtractor?: (row: T) => string;
}

export default function DataTable<T extends Record<string, unknown>>({
  columns, data, isLoading, page = 1, totalPages = 1,
  onPageChange, emptyMessage = "No data found", keyExtractor,
}: DataTableProps<T>) {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {columns.map((col) => (
                <th key={col.key} className={cn("px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500 font-display", col.className)}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="py-16 text-center">
                  <Spinner className="mx-auto" />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-16 text-center text-slate-500 text-sm font-display">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr
                  key={keyExtractor ? keyExtractor(row) : i}
                  className="border-b border-white/[0.04] table-row-hover"
                >
                  {columns.map((col) => (
                    <td key={col.key} className={cn("px-4 py-3.5 text-sm text-slate-300", col.className)}>
                      {col.render ? col.render(row) : String(row[col.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-4 border-t border-white/[0.06]">
          <div className="text-xs text-slate-500 font-display">
            Page {page} of {totalPages}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onPageChange?.(page - 1)}
              disabled={page <= 1}
              className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.07] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange?.(pageNum)}
                  className={cn(
                    "w-8 h-8 rounded-lg text-xs font-semibold font-display transition-all",
                    pageNum === page
                      ? "bg-primary-500 text-white shadow-glow-sm"
                      : "bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.07]"
                  )}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => onPageChange?.(page + 1)}
              disabled={page >= totalPages}
              className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.07] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
