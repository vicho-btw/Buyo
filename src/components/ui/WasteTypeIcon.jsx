import { 
  Beef, 
  Citrus, 
  Apple, 
  Milk, 
  Flame,
  Waves,
  Package
} from "lucide-react";
import { cn } from "@/lib/utils";

const wasteTypes = {
  estiercol: { icon: Beef, label: "Estiércol", color: "bg-amber-100 text-amber-700" },
  bagazo: { icon: Citrus, label: "Bagazo", color: "bg-orange-100 text-orange-700" },
  pulpa_vegetal: { icon: Apple, label: "Pulpa Vegetal", color: "bg-green-100 text-green-700" },
  cascara_frutas: { icon: Citrus, label: "Cáscara de Frutas", color: "bg-yellow-100 text-yellow-700" },
  residuos_lacteos: { icon: Milk, label: "Residuos Lácteos", color: "bg-blue-100 text-blue-700" },
  residuos_matadero: { icon: Flame, label: "Residuos de Matadero", color: "bg-red-100 text-red-700" },
  lodos_organicos: { icon: Waves, label: "Lodos Orgánicos", color: "bg-teal-100 text-teal-700" },
  otro: { icon: Package, label: "Otro", color: "bg-slate-100 text-slate-700" }
};

export function getWasteTypeInfo(type) {
  return wasteTypes[type] || wasteTypes.otro;
}

export default function WasteTypeIcon({ type, size = "md", showLabel = false, className }) {
  const info = getWasteTypeInfo(type);
  const Icon = info.icon;

  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14"
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-7 h-7"
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn(
        "rounded-xl flex items-center justify-center",
        sizes[size],
        info.color
      )}>
        <Icon className={iconSizes[size]} />
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-slate-700">{info.label}</span>
      )}
    </div>
  );
}

export { wasteTypes };