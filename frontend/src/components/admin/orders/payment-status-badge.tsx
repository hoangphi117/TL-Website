import { cn } from "@/lib/utils"

interface PaymentStatusBadgeProps {
  status: "paid" | "pending" | "failed" | string
  label: string
  className?: string
}

export function PaymentStatusBadge({ status, label, className }: PaymentStatusBadgeProps) {
  const styles =
    {
      paid: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
      pending:
        "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
      failed: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
    }[status] || "bg-slate-50 text-slate-700 border-slate-200"

  return (
    <div  
      className={cn(
        "inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded-sm border text-[0.7rem] md:text-[0.8rem] font-medium transition-colors shadow-xs",
        styles,
        className,
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          status === "paid" ? "bg-emerald-500" : status === "pending" ? "bg-amber-500" : "bg-rose-500",
        )}
      />
      {label}
    </div>
  )
}
