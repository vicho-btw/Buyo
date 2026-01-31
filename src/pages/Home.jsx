import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";
import { 
  Leaf, 
  ArrowRight, 
  Factory, 
  Building2, 
  TreePine,
  Zap,
  Shield,
  TrendingUp
} from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const auth = await base44.auth.isAuthenticated();
        setIsAuthenticated(auth);
        
        if (auth) {
          const user = await base44.auth.me();
          const profiles = await base44.entities.UserProfile.filter({ created_by: user.email });
          
          if (profiles.length > 0) {
            const profile = profiles[0];
            if (profile.role === "seller") {
              navigate(createPageUrl("SellerDashboard"));
            } else {
              navigate(createPageUrl("BuyerDashboard"));
            }
          } else {
            navigate(createPageUrl("Onboarding"));
          }
        }
      } catch (error) {
        console.log("Not authenticated");
      }
      setChecking(false);
    };
    
    checkAuth();
  }, [navigate]);

  const features = [
    {
      icon: TreePine,
      title: "Impacto Ambiental",
      description: "Cada kg de residuo reutilizado contribuye a salvar árboles y reducir emisiones"
    },
    {
      icon: Zap,
      title: "Energía Renovable",
      description: "Conectamos residuos con plantas de biogás para generar energía limpia"
    },
    {
      icon: Shield,
      title: "Transacciones Seguras",
      description: "Plataforma confiable con solo 1% de comisión por transacción"
    },
    {
      icon: TrendingUp,
      title: "Economía Circular",
      description: "Convierte tus residuos en ingresos y contribuye al medio ambiente"
    }
  ];

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="animate-pulse flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-slate-900">BioMarket</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <header className="border-b border-emerald-100 bg-white/70 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900">BioMarket</span>
          </div>
          <Button
            onClick={() => base44.auth.redirectToLogin()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
          >
            Iniciar Sesión
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-6">
            <TreePine className="w-4 h-4" />
            Marketplace B2B de Residuos Orgánicos
          </span>
          
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Transforma residuos en
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600"> energía limpia</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Conectamos granjas e industrias que generan residuos orgánicos con empresas de biogás y energía renovable.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => base44.auth.redirectToLogin()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-14 px-8 text-base w-full sm:w-auto"
            >
              Comenzar Ahora
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </motion.div>
      </section>

      {/* User Types */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg shadow-slate-100"
          >
            <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-6">
              <Factory className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Para Vendedores</h3>
            <p className="text-slate-600 mb-6">
              Granjas, industrias ganaderas y agroindustriales que generan residuos orgánicos y buscan monetizarlos.
            </p>
            <ul className="space-y-3 text-slate-600">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                Registra tus residuos fácilmente
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                Recibe pagos de compradores verificados
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                Visualiza tu impacto ambiental
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg shadow-slate-100"
          >
            <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center mb-6">
              <Building2 className="w-8 h-8 text-sky-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Para Compradores</h3>
            <p className="text-slate-600 mb-6">
              Empresas de biogás, generación de energía y otras industrias que necesitan materia prima orgánica.
            </p>
            <ul className="space-y-3 text-slate-600">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                Busca residuos por tipo y cantidad
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                Compra directamente a productores
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                Historial completo de transacciones
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            ¿Por qué BioMarket?
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Una plataforma diseñada para facilitar la economía circular y el aprovechamiento de residuos
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Modelo Simple y Transparente</h2>
          <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">
            Los vendedores establecen sus precios libremente. La plataforma solo cobra 1% de comisión por transacción.
          </p>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <p className="text-4xl font-bold mb-2">1%</p>
              <p className="text-emerald-100">Comisión</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <p className="text-4xl font-bold mb-2">$0</p>
              <p className="text-emerald-100">Costo de registro</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          ¿Listo para comenzar?
        </h2>
        <p className="text-slate-600 mb-8">
          Únete a la revolución de la economía circular
        </p>
        <Button
          size="lg"
          onClick={() => base44.auth.redirectToLogin()}
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-14 px-8 text-base"
        >
          Crear Cuenta Gratis
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-slate-900">BioMarket</span>
            </div>
            <p className="text-sm text-slate-500">
              © 2024 BioMarket. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}