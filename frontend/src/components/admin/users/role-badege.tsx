import { cn } from "@/lib/utils"
import { Shield, User } from "lucide-react"

interface RoleBadgeProps {
  role: "admin" | "customer" | string
  label?: string
  className?: string
}

export function RoleBadge({ role, label, className }: RoleBadgeProps) {
  const styles =
    {
      admin: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
      customer: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
    }[role] || "bg-slate-50 text-slate-700 border-slate-200"

  const Icon = role === "admin" ? Shield : User

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[0.75rem] font-semibold tracking-tight transition-colors shadow-sm whitespace-nowrap uppercase",
        styles,
        className,
      )}
    >
      <Icon className="size-3 shrink-0" />
      {label || role}
    </div>
  )
}
