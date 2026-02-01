import { Clock, CheckCircle2, XCircle, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PendingApproval({ status = "pending", className }) {
  const statusConfig = {
    pending: {
      icon: Clock,
      color: "bg-amber-50 border-amber-200 text-amber-700",
      iconColor: "text-amber-500",
      title: "Verificación Pendiente",
      message: "Tu permiso está siendo revisado. Podrás comprar residuos una vez aprobado. Esto suele tomar 24-48 horas."
    },
    approved: {
      icon: CheckCircle2,
      color: "bg-emerald-50 border-emerald-200 text-emerald-700",
      iconColor: "text-emerald-500",
      title: "¡Cuenta Aprobada!",
      message: "Tu permiso ha sido verificado. Ya puedes comprar residuos en la plataforma."
    },
    rejected: {
      icon: XCircle,
      color: "bg-red-50 border-red-200 text-red-700",
      iconColor: "text-red-500",
      title: "Permiso Rechazado",
      message: "No pudimos verificar tu permiso. Por favor contacta a soporte para más información."
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={cn(
      "rounded-2xl border-2 p-6",
      config.color,
      className
    )}>
      <div className="flex items-start gap-4">
        <div className={cn("p-3 rounded-xl bg-white/50")}>
          <Icon className={cn("w-6 h-6", config.iconColor)} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-2">{config.title}</h3>
          <p className="text-sm leading-relaxed">{config.message}</p>
          {status === "pending" && (
            <div className="mt-4 flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4" />
              <span>Documento recibido y en revisión</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}