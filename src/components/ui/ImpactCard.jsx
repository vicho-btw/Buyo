import { TreePine, Leaf, Droplets, Wind } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ImpactCard({ totalKg = 0, className }) {
  // Factor: 100 kg = 1 árbol salvado (mock)
  const treesFactor = 100;
  const co2Factor = 2.5; // kg CO2 evitado por kg de residuo
  const waterFactor = 50; // litros de agua ahorrados por kg

  const treesSaved = Math.floor(totalKg / treesFactor);
  const co2Avoided = (totalKg * co2Factor).toFixed(0);
  const waterSaved = (totalKg * waterFactor).toFixed(0);

  const impacts = [
    {
      icon: TreePine,
      value: treesSaved,
      label: "Árboles salvados",
      color: "text-emerald-600",
      bg: "bg-emerald-100"
    },
    {
      icon: Wind,
      value: `${co2Avoided} kg`,
      label: "CO₂ evitado",
      color: "text-sky-600",
      bg: "bg-sky-100"
    },
    {
      icon: Droplets,
      value: `${waterSaved} L`,
      label: "Agua ahorrada",
      color: "text-blue-600",
      bg: "bg-blue-100"
    }
  ];

  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 p-6 text-white",
      className
    )}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <Leaf className="w-5 h-5" />
          <h3 className="font-semibold tracking-wide">Impacto Ambiental</h3>
        </div>
        
        <p className="text-emerald-100 text-sm mb-6">
          Tu contribución al medio ambiente
        </p>

        <div className="grid grid-cols-3 gap-4">
          {impacts.map((impact, idx) => (
            <div key={idx} className="text-center">
              <div className={cn(
                "w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-2",
                "bg-white/20 backdrop-blur-sm"
              )}>
                <impact.icon className="w-6 h-6" />
              </div>
              <p className="text-2xl font-bold">{impact.value}</p>
              <p className="text-xs text-emerald-100">{impact.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}