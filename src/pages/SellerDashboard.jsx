import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Package, 
  DollarSign, 
  TrendingUp,
  Leaf,
  BarChart3,
  History,
  Settings
} from "lucide-react";
import { createPageUrl } from "@/utils";
import StatsCard from "@/components/ui/StatsCard";
import ImpactCard from "@/components/ui/ImpactCard";
import WasteCard from "@/components/marketplace/WasteCard";
import TransactionRow from "@/components/marketplace/TransactionRow";
import { wasteTypes } from "@/components/ui/WasteTypeIcon";

export default function SellerDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showAddWaste, setShowAddWaste] = useState(false);
  const [newWaste, setNewWaste] = useState({
    waste_type: "",
    quantity_kg: "",
    price_per_kg: "",
    frequency: "",
    location: "",
    description: ""
  });

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me()
  });

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const profiles = await base44.entities.UserProfile.filter({ created_by: user?.email });
      return profiles[0];
    },
    enabled: !!user
  });

  const { data: myWastes = [] } = useQuery({
    queryKey: ['myWastes'],
    queryFn: async () => {
      return await base44.entities.OrganicWaste.filter({ seller_id: user?.email });
    },
    enabled: !!user
  });

  const { data: myTransactions = [] } = useQuery({
    queryKey: ['sellerTransactions'],
    queryFn: async () => {
      return await base44.entities.Transaction.filter({ seller_id: user?.email }, '-created_date');
    },
    enabled: !!user
  });

  const createWasteMutation = useMutation({
    mutationFn: async (wasteData) => {
      return await base44.entities.OrganicWaste.create({
        ...wasteData,
        seller_id: user.email,
        seller_name: profile?.company_name || user.full_name,
        status: "disponible",
        original_quantity: wasteData.quantity_kg
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myWastes'] });
      setShowAddWaste(false);
      setNewWaste({
        waste_type: "",
        quantity_kg: "",
        price_per_kg: "",
        frequency: "",
        location: "",
        description: ""
      });
    }
  });

  // Redirect to onboarding if no profile or wrong role
  useEffect(() => {
    if (user && !profileLoading) {
      if (!profile) {
        navigate(createPageUrl("Onboarding"));
      } else if (profile.role === "buyer_business") {
        navigate(createPageUrl("BuyerDashboard"));
      } else if (!profile.onboarding_completed) {
        navigate(createPageUrl("Onboarding"));
      }
    }
  }, [user, profile, profileLoading, navigate]);

  const totalSold = myTransactions
    .filter(t => t.status === "completada")
    .reduce((sum, t) => sum + t.quantity_kg, 0);

  const grossEarnings = myTransactions
    .filter(t => t.status === "completada")
    .reduce((sum, t) => sum + t.subtotal, 0);

  const netEarnings = myTransactions
    .filter(t => t.status === "completada")
    .reduce((sum, t) => sum + t.seller_earnings, 0);

  const availableStock = myWastes
    .filter(w => w.status === "disponible")
    .reduce((sum, w) => sum + w.quantity_kg, 0);

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-emerald-600">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900">BioMarket</h1>
              <p className="text-xs text-slate-500">Panel de Vendedor</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowAddWaste(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Residuo
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Hola, {profile?.company_name || user?.full_name} 👋
          </h2>
          <p className="text-slate-500 mt-1">
            Aquí tienes el resumen de tu actividad
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white border border-slate-200 p-1 rounded-xl">
            <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
              <BarChart3 className="w-4 h-4 mr-2" />
              Resumen
            </TabsTrigger>
            <TabsTrigger value="inventory" className="rounded-lg data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
              <Package className="w-4 h-4 mr-2" />
              Inventario
            </TabsTrigger>
            <TabsTrigger value="transactions" className="rounded-lg data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
              <History className="w-4 h-4 mr-2" />
              Transacciones
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard
                title="Total Vendido"
                value={`${totalSold.toLocaleString()} kg`}
                icon={Package}
                variant="success"
              />
              <StatsCard
                title="Ingresos Brutos"
                value={`$${grossEarnings.toLocaleString()}`}
                subtitle="USD"
                icon={DollarSign}
                variant="info"
              />
              <StatsCard
                title="Ingresos Netos"
                value={`$${netEarnings.toLocaleString()}`}
                subtitle="Después del 1% de comisión"
                icon={TrendingUp}
                variant="success"
              />
              <StatsCard
                title="Stock Disponible"
                value={`${availableStock.toLocaleString()} kg`}
                icon={Package}
                variant="warning"
              />
            </div>

            {/* Impact Card */}
            <ImpactCard totalKg={totalSold} />

            {/* Recent Transactions */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Últimas Ventas</h3>
              {myTransactions.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <History className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p>Aún no tienes ventas registradas</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {myTransactions.slice(0, 5).map((tx) => (
                    <TransactionRow key={tx.id} transaction={tx} viewAs="seller" />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Mis Residuos</h3>
              <Button
                onClick={() => setShowAddWaste(true)}
                variant="outline"
                className="rounded-xl"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar
              </Button>
            </div>

            {myWastes.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <Package className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <h3 className="font-semibold text-slate-900 mb-2">
                  No tienes residuos registrados
                </h3>
                <p className="text-slate-500 mb-6">
                  Comienza agregando los residuos orgánicos que generas
                </p>
                <Button
                  onClick={() => setShowAddWaste(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar primer residuo
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myWastes.map((waste) => (
                  <WasteCard 
                    key={waste.id} 
                    waste={waste} 
                    showBuyButton={false}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <h3 className="font-semibold text-slate-900">Historial de Transacciones</h3>
            
            {myTransactions.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <History className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <h3 className="font-semibold text-slate-900 mb-2">
                  Sin transacciones aún
                </h3>
                <p className="text-slate-500">
                  Las ventas aparecerán aquí cuando los compradores adquieran tus residuos
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {myTransactions.map((tx) => (
                  <TransactionRow key={tx.id} transaction={tx} viewAs="seller" />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Add Waste Dialog */}
      <Dialog open={showAddWaste} onOpenChange={setShowAddWaste}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Registrar Nuevo Residuo</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Tipo de residuo *</Label>
              <Select
                value={newWaste.waste_type}
                onValueChange={(value) => setNewWaste({ ...newWaste, waste_type: value })}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Selecciona el tipo" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(wasteTypes).map(([key, info]) => (
                    <SelectItem key={key} value={key}>
                      {info.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Cantidad disponible (kg) *</Label>
              <Input
                type="number"
                value={newWaste.quantity_kg}
                onChange={(e) => setNewWaste({ ...newWaste, quantity_kg: parseFloat(e.target.value) || "" })}
                placeholder="Ej: 1000"
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label>Precio por kg (USD) *</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={newWaste.price_per_kg}
                onChange={(e) => setNewWaste({ ...newWaste, price_per_kg: parseFloat(e.target.value) || "" })}
                placeholder="Ej: 1.50"
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label>Frecuencia de generación</Label>
              <Select
                value={newWaste.frequency}
                onValueChange={(value) => setNewWaste({ ...newWaste, frequency: value })}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Selecciona frecuencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unica">Única vez</SelectItem>
                  <SelectItem value="semanal">Semanal</SelectItem>
                  <SelectItem value="mensual">Mensual</SelectItem>
                  <SelectItem value="continua">Continua</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Ubicación</Label>
              <Input
                value={newWaste.location}
                onChange={(e) => setNewWaste({ ...newWaste, location: e.target.value })}
                placeholder="Ej: Jalisco, México"
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label>Descripción adicional</Label>
              <Textarea
                value={newWaste.description}
                onChange={(e) => setNewWaste({ ...newWaste, description: e.target.value })}
                placeholder="Detalles sobre el residuo..."
                className="rounded-xl resize-none"
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowAddWaste(false)}
                className="flex-1 rounded-xl"
              >
                Cancelar
              </Button>
              <Button
                onClick={() => createWasteMutation.mutate(newWaste)}
                disabled={!newWaste.waste_type || !newWaste.quantity_kg || !newWaste.price_per_kg || createWasteMutation.isPending}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
              >
                {createWasteMutation.isPending ? "Guardando..." : "Registrar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}