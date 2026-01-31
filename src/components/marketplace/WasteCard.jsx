import { MapPin, Package, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import WasteTypeIcon, { getWasteTypeInfo } from "@/components/ui/WasteTypeIcon";
import { cn } from "@/lib/utils";

const frequencyLabels = {
  unica: "Única vez",
  semanal: "Semanal",
  mensual: "Mensual",
  continua: "Continua"
};

export default function WasteCard({ waste, onBuy, showBuyButton = true, className }) {
  const wasteInfo = getWasteTypeInfo(waste.waste_type);

  return (
    <div className={cn(
      "group relative bg-white rounded-2xl border border-slate-200 p-5 transition-all duration-300",
      "hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-200 hover:-translate-y-1",
      className
    )}>
      {/* Status badge */}
      <Badge 
        className={cn(
          "absolute top-4 right-4",
          waste.status === "disponible" 
            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" 
            : "bg-slate-100 text-slate-600 hover:bg-slate-100"
        )}
      >
        {waste.status === "disponible" ? "Disponible" : waste.status}
      </Badge>

      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <WasteTypeIcon type={waste.waste_type} size="lg" />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 text-lg">
            {wasteInfo.label}
          </h3>
          <p className="text-sm text-slate-500 truncate">
            {waste.seller_name}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-3 mb-5">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Package className="w-4 h-4 text-slate-400" />
          <span className="font-medium">{waste.quantity_kg.toLocaleString()} kg</span>
          <span className="text-slate-400">disponibles</span>
        </div>
        
        {waste.location && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span>{waste.location}</span>
          </div>
        )}

        {waste.frequency && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>{frequencyLabels[waste.frequency]}</span>
          </div>
        )}
      </div>

      {/* Price & Action */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div>
          <p className="text-2xl font-bold text-emerald-600">
            ${waste.price_per_kg.toFixed(2)}
          </p>
          <p className="text-xs text-slate-500">USD / kg</p>
        </div>
        
        {showBuyButton && waste.status === "disponible" && (
          <Button 
            onClick={() => onBuy(waste)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6"
          >
            Comprar
          </Button>
        )}
      </div>
    </div>
  );
}