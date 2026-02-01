import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Leaf, Building2, Factory, ArrowRight, Check, Upload, User, Building } from "lucide-react";
import { createPageUrl } from "@/utils";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { wasteTypes } from "@/components/ui/WasteTypeIcon";

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [formData, setFormData] = useState({
    role: "",
    company_name: "",
    industry_type: "",
    location: "",
    country: "",
    phone: "",
    description: "",
    waste_types_needed: [],
    permit_document_url: ""
  });

  const industryOptions = {
    seller_personal: [
      { value: "granja", label: "Granja" },
      { value: "ganaderia", label: "Ganadería" },
      { value: "agroindustrial", label: "Agroindustrial" },
      { value: "otro", label: "Otro" }
    ],
    seller_business: [
      { value: "granja", label: "Granja" },
      { value: "ganaderia", label: "Ganadería" },
      { value: "agroindustrial", label: "Agroindustrial" },
      { value: "otro", label: "Otro" }
    ],
    buyer_business: [
      { value: "biogas", label: "Planta de Biogás" },
      { value: "energia", label: "Generación de Energía" },
      { value: "otro", label: "Otro" }
    ]
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDoc(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, permit_document_url: file_url });
    } catch (error) {
      console.error("Error uploading file:", error);
    }
    setUploadingDoc(false);
  };

  const toggleWasteType = (wasteType) => {
    const current = formData.waste_types_needed || [];
    if (current.includes(wasteType)) {
      setFormData({
        ...formData,
        waste_types_needed: current.filter(t => t !== wasteType)
      });
    } else {
      setFormData({
        ...formData,
        waste_types_needed: [...current, wasteType]
      });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const profileData = {
        ...formData,
        onboarding_completed: true,
        total_sold_kg: 0,
        total_purchased_kg: 0,
        total_earnings: 0,
        total_spent: 0
      };

      // Solo compradores empresariales necesitan aprobación
      if (formData.role === "buyer_business") {
        profileData.approval_status = "pending";
      } else {
        profileData.approval_status = "approved";
      }

      await base44.entities.UserProfile.create(profileData);

      if (formData.role === "buyer_business") {
        navigate(createPageUrl("BuyerDashboard"));
      } else {
        navigate(createPageUrl("SellerDashboard"));
      }
    } catch (error) {
      console.error("Error creating profile:", error);
    }
    setLoading(false);
  };

  const isBuyer = formData.role === "buyer_business";
  const requiresStep3 = isBuyer;

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
          {[1, 2, requiresStep3 && 3].filter(Boolean).map((s, idx, arr) => (
            <div key={s} className="flex items-center">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all",
                step >= s 
                  ? "bg-emerald-600 text-white" 
                  : "bg-slate-100 text-slate-400"
              )}>
                {step > s ? <Check className="w-5 h-5" /> : s}
              </div>
              {idx < arr.length - 1 && (
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

              <div className="space-y-4">
                <Card 
                  className={cn(
                    "cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
                    formData.role === "seller_personal" 
                      ? "border-emerald-500 ring-2 ring-emerald-500/20" 
                      : "border-slate-200 hover:border-emerald-300"
                  )}
                  onClick={() => setFormData({ ...formData, role: "seller_personal" })}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <User className="w-7 h-7 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-slate-900 mb-2">
                          Vendedor Personal
                        </h3>
                        <p className="text-sm text-slate-500">
                          Soy granja, rancho o productor individual con residuos orgánicos
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card 
                  className={cn(
                    "cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
                    formData.role === "seller_business" 
                      ? "border-emerald-500 ring-2 ring-emerald-500/20" 
                      : "border-slate-200 hover:border-emerald-300"
                  )}
                  onClick={() => setFormData({ ...formData, role: "seller_business" })}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Factory className="w-7 h-7 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-slate-900 mb-2">
                          Vendedor Empresarial
                        </h3>
                        <p className="text-sm text-slate-500">
                          Soy empresa con una o más ubicaciones que generan residuos orgánicos
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card 
                  className={cn(
                    "cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
                    formData.role === "buyer_business" 
                      ? "border-emerald-500 ring-2 ring-emerald-500/20" 
                      : "border-slate-200 hover:border-emerald-300"
                  )}
                  onClick={() => setFormData({ ...formData, role: "buyer_business" })}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-sky-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Building className="w-7 h-7 text-sky-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-slate-900 mb-2">
                          Comprador Empresarial
                        </h3>
                        <p className="text-sm text-slate-500">
                          Soy centro/planta de biogás o energía que compra residuos
                        </p>
                      </div>
                    </div>
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
                  Cuéntanos sobre tu {isBuyer ? "centro" : "empresa"}
                </h1>
                <p className="text-slate-500">
                  Esta información nos ayuda a conectarte mejor
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
                <div className="space-y-2">
                  <Label className="text-slate-700">Nombre de la {isBuyer ? "planta/centro" : "empresa"} *</Label>
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
                    <Label className="text-slate-700">País *</Label>
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
                  onClick={() => requiresStep3 ? setStep(3) : handleSubmit()}
                  disabled={!formData.company_name || !formData.industry_type || !formData.country || loading}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-12 text-base"
                >
                  {requiresStep3 ? "Continuar" : (loading ? "Creando cuenta..." : "Completar registro")}
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && isBuyer && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h1 className="text-3xl font-bold text-slate-900 mb-3">
                  Información adicional requerida
                </h1>
                <p className="text-slate-500">
                  Necesitamos validar tu permiso para operar
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
                <div className="space-y-3">
                  <Label className="text-slate-700">Tipos de residuos que utilizas *</Label>
                  <p className="text-sm text-slate-500">Selecciona los tipos de residuos orgánicos que tu planta puede procesar</p>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    {Object.entries(wasteTypes).map(([key, info]) => (
                      <div
                        key={key}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all",
                          formData.waste_types_needed?.includes(key)
                            ? "border-emerald-500 bg-emerald-50"
                            : "border-slate-200 hover:border-slate-300"
                        )}
                        onClick={() => toggleWasteType(key)}
                      >
                        <Checkbox
                          checked={formData.waste_types_needed?.includes(key)}
                          className="pointer-events-none"
                        />
                        <span className="text-sm font-medium text-slate-700">{info.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-slate-700">Permiso para comprar residuos *</Label>
                  <p className="text-sm text-slate-500">
                    Sube tu permiso o licencia que te autoriza a comprar y procesar residuos orgánicos
                  </p>
                  <div className="mt-3">
                    <label className={cn(
                      "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all",
                      formData.permit_document_url 
                        ? "border-emerald-500 bg-emerald-50" 
                        : "border-slate-300 hover:border-slate-400 bg-slate-50"
                    )}>
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {uploadingDoc ? (
                          <div className="text-slate-500">Subiendo...</div>
                        ) : formData.permit_document_url ? (
                          <>
                            <Check className="w-10 h-10 text-emerald-600 mb-2" />
                            <p className="text-sm text-emerald-700 font-medium">Documento subido</p>
                          </>
                        ) : (
                          <>
                            <Upload className="w-10 h-10 text-slate-400 mb-2" />
                            <p className="text-sm text-slate-600">Click para subir documento</p>
                            <p className="text-xs text-slate-400 mt-1">PDF, JPG o PNG (máx. 10MB)</p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileUpload}
                        disabled={uploadingDoc}
                      />
                    </label>
                  </div>
                </div>

                <div className="bg-sky-50 rounded-xl p-4 border border-sky-200">
                  <p className="text-sm text-sky-700">
                    <strong>Nota:</strong> Tu cuenta será revisada en 24-48 horas. Podrás navegar el marketplace, 
                    pero necesitas aprobación para comprar residuos.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="flex-1 rounded-xl h-12"
                >
                  Atrás
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={
                    !formData.waste_types_needed?.length || 
                    !formData.permit_document_url || 
                    loading
                  }
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