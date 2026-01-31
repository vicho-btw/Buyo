import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import WasteTypeIcon, { getWasteTypeInfo } from "@/components/ui/WasteTypeIcon";
import { cn } from "@/lib/utils";

const statusStyles = {
  pendiente: "bg-amber-100 text-amber-700",
  confirmada: "bg-blue-100 text-blue-700",
  completada: "bg-emerald-100 text-emerald-700",
  cancelada: "bg-red-100 text-red-700"
};

const paymentStyles = {
  pendiente: "bg-amber-100 text-amber-700",
  pagado: "bg-emerald-100 text-emerald-700",
  fallido: "bg-red-100 text-red-700"
};

export default function TransactionRow({ transaction, viewAs = "seller", className }) {
  const wasteInfo = getWasteTypeInfo(transaction.waste_type);

  return (
    <div className={cn(
      "flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-colors",
      className
    )}>
      <WasteTypeIcon type={transaction.waste_type} size="md" />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-slate-900">{wasteInfo.label}</span>
          <span className="text-slate-400">•</span>
          <span className="text-sm text-slate-500">
            {transaction.quantity_kg.toLocaleString()} kg
          </span>
        </div>
        <p className="text-sm text-slate-500">
          {viewAs === "seller" ? (
            <>Comprador: {transaction.buyer_name}</>
          ) : (
            <>Vendedor: {transaction.seller_name}</>
          )}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Badge className={cn("font-normal", statusStyles[transaction.status])}>
          {transaction.status}
        </Badge>
        <Badge className={cn("font-normal", paymentStyles[transaction.payment_status])}>
          {transaction.payment_status === "pagado" ? "Pagado" : transaction.payment_status}
        </Badge>
      </div>

      <div className="text-right">
        <p className={cn(
          "font-semibold",
          viewAs === "seller" ? "text-emerald-600" : "text-slate-900"
        )}>
          {viewAs === "seller" ? (
            <>+${transaction.seller_earnings?.toFixed(2)}</>
          ) : (
            <>${transaction.total_amount?.toFixed(2)}</>
          )}
        </p>
        <p className="text-xs text-slate-500">
          {format(new Date(transaction.created_date), "dd MMM yyyy", { locale: es })}
        </p>
      </div>
    </div>
  );
}