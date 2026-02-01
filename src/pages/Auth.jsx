import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, User, Factory, Building, ArrowRight } from "lucide-react";
import { createPageUrl } from "@/utils";
import { cn } from "@/lib/utils";

export default function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("welcome"); // welcome, register
  const [selectedRole, setSelectedRole] = useState("");

  const handleLogin = () => {
    base44.auth.redirectToLogin(createPageUrl("Home"));
  };

  const handleRegister = () => {
    setMode("register");
  };

  const handleContinue = () => {
    if (selectedRole) {
      // Guardar el rol seleccionado en localStorage temporalmente
      localStorage.setItem("pending_role", selectedRole);
      // Redirigir al registro de Base44
      base44.auth.redirectToLogin(createPageUrl("Onboarding"));
    }
  };

  if (mode === "welcome") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12 justify-center">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl text-slate-900">BioMarket</span>
          </div>

          {/* Welcome Card */}
          <Card className="border-slate-200 shadow-xl">
            <CardContent className="p-8">
              <h1 className="text-3xl font-bold text-slate-900 text-center mb-3">
                ¡Bienvenido a BioMarket!
              </h1>
              <p className="text-slate-500 text-center mb-8">
                El marketplace B2B de residuos orgánicos
              </p>

              <div className="space-y-4">
                <Button
                  onClick={handleRegister}
                  className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-base"
                >
                  Crear cuenta nueva
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                <Button
                  variant="outline"
                  onClick={handleLogin}
                  className="w-full h-14 rounded-xl text-base"
                >
                  Ya tengo cuenta - Iniciar sesión
                </Button>
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-slate-500 mt-6">
            Al continuar, aceptas nuestros términos y condiciones
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white/70 backdrop-blur-sm">
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
          <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-semibold">
            1
          </div>
          <div className="w-20 h-1 bg-slate-200 rounded-full" />
          <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-semibold">
            2
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            ¡Bienvenido a BioMarket!
          </h1>
          <p className="text-slate-500 text-lg">
            ¿Cómo participarás en nuestra plataforma?
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <Card 
            className={cn(
              "cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
              selectedRole === "seller_personal" 
                ? "border-emerald-500 ring-2 ring-emerald-500/20" 
                : "border-slate-200 hover:border-emerald-300"
            )}
            onClick={() => setSelectedRole("seller_personal")}
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
              selectedRole === "seller_business" 
                ? "border-emerald-500 ring-2 ring-emerald-500/20" 
                : "border-slate-200 hover:border-emerald-300"
            )}
            onClick={() => setSelectedRole("seller_business")}
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
              selectedRole === "buyer_business" 
                ? "border-emerald-500 ring-2 ring-emerald-500/20" 
                : "border-slate-200 hover:border-emerald-300"
            )}
            onClick={() => setSelectedRole("buyer_business")}
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
          onClick={handleContinue}
          disabled={!selectedRole}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-14 text-base"
        >
          Continuar
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>

        <div className="text-center mt-6">
          <button
            onClick={() => setMode("welcome")}
            className="text-sm text-slate-500 hover:text-slate-700 underline"
          >
            ← Volver
          </button>
        </div>
      </div>
    </div>
  );
}