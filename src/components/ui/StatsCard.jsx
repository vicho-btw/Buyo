import { cn } from "@/lib/utils";

export default function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  trendUp,
  className,
  variant = "default"
}) {
  const variants = {
    default: "bg-white border-slate-200",
    success: "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200",
    warning: "bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200",
    info: "bg-gradient-to-br from-sky-50 to-blue-50 border-sky-200",
    purple: "bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200"
  };

  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5",
      variants[variant],
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-500 tracking-wide uppercase">
            {title}
          </p>
          <p className="text-3xl font-bold text-slate-900 tracking-tight">
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-slate-500">{subtitle}</p>
          )}
          {trend && (
            <div className={cn(
              "inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
              trendUp ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
            )}>
              {trendUp ? "↑" : "↓"} {trend}
            </div>
          )}
        </div>
        {Icon && (
          <div className="p-3 rounded-xl bg-white/80 shadow-sm">
            <Icon className="w-6 h-6 text-emerald-600" />
          </div>
        )}
      </div>
    </div>
  );
}