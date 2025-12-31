import { cn } from "@/lib/utils"

interface PaymentStatusBadgeProps {
  status:
    | "pending_confirmation"
    | "processing"
    | "shipping"
    | "completed"
    | "cancelled"
    | string
  label: string
  className?: string
}

export function OrderStatusBadge({ status, label, className }: PaymentStatusBadgeProps) {
  const styles =
    {
      pending_confirmation:
        "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
      processing:
        "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20",
      shipping:
        "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20",
      completed:
        "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
      cancelled:
        "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20",
    }[status] || "bg-slate-50 text-slate-700 border-slate-200"

  const dotColors =
    {
      pending_confirmation: "bg-blue-500",
      processing: "bg-indigo-500",
      shipping: "bg-violet-500",
      completed: "bg-emerald-500",
      cancelled: "bg-slate-400",
    }[status] || "bg-slate-400"

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded-sm border text-xs md:text-[0.8rem] font-medium transition-colors shadow-sm whitespace-nowrap",
        styles,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full shrink-0", dotColors)} />
      {label}
    </div>
  )
}
