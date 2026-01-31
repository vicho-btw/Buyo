import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Building2, Factory, ArrowRight, Check } from "lucide-react";
import { createPageUrl } from "@/utils";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    role: "",
    company_name: "",
    industry_type: "",
    location: "",
    country: "",
    phone: "",
    description: ""
  });

  const industryOptions = {
    seller: [
      { value: "granja", label: "Granja" },
      { value: "ganaderia", label: "Ganadería" },
      { value: "agroindustrial", label: "Agroindustrial" },
      { value: "otro", label: "Otro" }
    ],
    buyer: [
      { value: "biogas", label: "Biogás" },
      { value: "energia", label: "Generación de Energía" },
      { value: "otro", label: "Otro" }
    ]
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await base44.entities.UserProfile.create({
        ...formData,
        onboarding_completed: true,
        total_sold_kg: 0,
        total_purchased_kg: 0,
        total_earnings: 0,
        total_spent: 0
      });

      if (formData.role === "seller") {
        navigate(createPageUrl("SellerDashboard"));
      } else {
        navigate(createPageUrl("BuyerDashboard"));
      }
    } catch (error) {
      console.error("Error creating profile:", error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <div className="border-b border-emerald-100 bg-white/70 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-slate-900">BioMarket</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all",
                step >= s 
                  ? "bg-emerald-600 text-white" 
                  : "bg-slate-100 text-slate-400"
              )}>
                {step > s ? <Check className="w-5 h-5" /> : s}
              </div>
              {s < 2 && (
                <div className={cn(
                  "w-20 h-1 mx-2 rounded-full transition-all",
                  step > s ? "bg-emerald-600" : "bg-slate-200"
                )} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h1 className="text-3xl font-bold text-slate-900 mb-3">
                  ¡Bienvenido a BioMarket!
                </h1>
                <p className="text-slate-500 text-lg">
                  ¿Cómo participarás en nuestra plataforma?
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Card 
                  className={cn(
                    "cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
                    formData.role === "seller" 
                      ? "border-emerald-500 ring-2 ring-emerald-500/20" 
                      : "border-slate-200 hover:border-emerald-300"
                  )}
                  onClick={() => setFormData({ ...formData, role: "seller" })}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-2xl flex items-center justify-center">
                      <Factory className="w-8 h-8 text-amber-600" />
                    </div>
                    <h3 className="font-semibold text-lg text-slate-900 mb-2">
                      Soy Vendedor
                    </h3>
                    <p className="text-sm text-slate-500">
                      Tengo residuos orgánicos de mi granja o industria
                    </p>
                  </CardContent>
                </Card>

                <Card 
                  className={cn(
                    "cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
                    formData.role === "buyer" 
                      ? "border-emerald-500 ring-2 ring-emerald-500/20" 
                      : "border-slate-200 hover:border-emerald-300"
                  )}
                  onClick={() => setFormData({ ...formData, role: "buyer" })}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-sky-100 rounded-2xl flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-sky-600" />
                    </div>
                    <h3 className="font-semibold text-lg text-slate-900 mb-2">
                      Soy Comprador
                    </h3>
                    <p className="text-sm text-slate-500">
                      Busco residuos para generar biogás o energía
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Button
                onClick={() => setStep(2)}
                disabled={!formData.role}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-12 text-base"
              >
                Continuar
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h1 className="text-3xl font-bold text-slate-900 mb-3">
                  Cuéntanos sobre tu empresa
                </h1>
                <p className="text-slate-500">
                  Esta información nos ayuda a conectarte mejor
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
                <div className="space-y-2">
                  <Label className="text-slate-700">Nombre de la empresa *</Label>
                  <Input
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    placeholder="Ej: Granja El Sol"
                    className="h-11 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700">Tipo de industria *</Label>
                  <Select
                    value={formData.industry_type}
                    onValueChange={(value) => setFormData({ ...formData, industry_type: value })}
                  >
                    <SelectTrigger className="h-11 rounded-xl">
                      <SelectValue placeholder="Selecciona una opción" />
                    </SelectTrigger>
                    <SelectContent>
                      {industryOptions[formData.role]?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-700">País</Label>
                    <Input
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      placeholder="Ej: México"
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700">Ciudad / Región</Label>
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Ej: Jalisco"
                      className="h-11 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700">Teléfono (opcional)</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+52 123 456 7890"
                    className="h-11 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700">Descripción (opcional)</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Cuéntanos brevemente sobre tu empresa..."
                    className="rounded-xl resize-none"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 rounded-xl h-12"
                >
                  Atrás
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!formData.company_name || !formData.industry_type || loading}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-12 text-base"
                >
                  {loading ? "Creando cuenta..." : "Completar registro"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}