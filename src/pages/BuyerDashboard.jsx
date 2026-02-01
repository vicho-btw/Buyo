import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { 
  Search, 
  ShoppingCart, 
  DollarSign, 
  Package,
  Leaf,
  BarChart3,
  History,
  Filter,
  X,
  Lock,
  LogOut
} from "lucide-react";
import PendingApproval from "@/components/access/PendingApproval";
import { createPageUrl } from "@/utils";
import StatsCard from "@/components/ui/StatsCard";
import WasteCard from "@/components/marketplace/WasteCard";
import TransactionRow from "@/components/marketplace/TransactionRow";
import WasteTypeIcon, { wasteTypes, getWasteTypeInfo } from "@/components/ui/WasteTypeIcon";
import { cn } from "@/lib/utils";

export default function BuyerDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [filters, setFilters] = useState({
    waste_type: "",
    min_quantity: ""
  });
  const [selectedWaste, setSelectedWaste] = useState(null);
  const [purchaseQuantity, setPurchaseQuantity] = useState(0);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me()
  });

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['buyerProfile'],
    queryFn: async () => {
      const profiles = await base44.entities.UserProfile.filter({ created_by: user?.email });
      return profiles[0];
    },
    enabled: !!user
  });

  const { data: availableWastes = [] } = useQuery({
    queryKey: ['availableWastes', filters, profile?.country],
    queryFn: async () => {
      let query = { status: "disponible" };
      if (filters.waste_type) {
        query.waste_type = filters.waste_type;
      }
      const wastes = await base44.entities.OrganicWaste.filter(query);
      
      // Filter by buyer's country and min quantity
      return wastes.filter(w => {
        const countryMatch = profile?.country ? 
          w.location?.toLowerCase().includes(profile.country.toLowerCase()) : true;
        const quantityMatch = !filters.min_quantity || w.quantity_kg >= parseFloat(filters.min_quantity);
        return countryMatch && quantityMatch;
      });
    },
    enabled: !!profile
  });

  const { data: myTransactions = [] } = useQuery({
    queryKey: ['buyerTransactions'],
    queryFn: async () => {
      return await base44.entities.Transaction.filter({ buyer_id: user?.email }, '-created_date');
    },
    enabled: !!user
  });

  const purchaseMutation = useMutation({
    mutationFn: async ({ waste, quantity }) => {
      const subtotal = quantity * waste.price_per_kg;
      const platformFee = subtotal * 0.01;
      const totalAmount = subtotal + platformFee;
      const sellerEarnings = subtotal - platformFee;

      // Create transaction
      await base44.entities.Transaction.create({
        waste_id: waste.id,
        seller_id: waste.seller_id,
        seller_name: waste.seller_name,
        buyer_id: user.email,
        buyer_name: profile?.company_name || user.full_name,
        waste_type: waste.waste_type,
        quantity_kg: quantity,
        price_per_kg: waste.price_per_kg,
        subtotal: subtotal,
        platform_fee: platformFee,
        total_amount: totalAmount,
        seller_earnings: sellerEarnings,
        status: "completada",
        payment_status: "pagado"
      });

      // Update waste quantity
      const newQuantity = waste.quantity_kg - quantity;
      await base44.entities.OrganicWaste.update(waste.id, {
        quantity_kg: newQuantity,
        status: newQuantity <= 0 ? "vendido" : "disponible"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availableWastes'] });
      queryClient.invalidateQueries({ queryKey: ['buyerTransactions'] });
      setShowPurchaseDialog(false);
      setSelectedWaste(null);
      setPurchaseQuantity(0);
    }
  });

  // Redirect to onboarding if no profile or wrong role
  useEffect(() => {
    if (user && !profileLoading) {
      if (!profile) {
        navigate(createPageUrl("Onboarding"));
      } else if (profile.role !== "buyer_business") {
        navigate(createPageUrl("SellerDashboard"));
      } else if (!profile.onboarding_completed) {
        navigate(createPageUrl("Onboarding"));
      }
    }
  }, [user, profile, profileLoading, navigate]);

  const handleBuyClick = (waste) => {
    if (profile?.approval_status !== "approved") {
      return;
    }
    setSelectedWaste(waste);
    setPurchaseQuantity(Math.min(100, waste.quantity_kg));
    setShowPurchaseDialog(true);
  };

  const canBuy = profile?.approval_status === "approved";

  const totalPurchased = myTransactions
    .filter(t => t.status === "completada")
    .reduce((sum, t) => sum + t.quantity_kg, 0);

  const totalSpent = myTransactions
    .filter(t => t.status === "completada")
    .reduce((sum, t) => sum + t.total_amount, 0);

  const transactionsCount = myTransactions.filter(t => t.status === "completada").length;

  const calculatePurchase = () => {
    if (!selectedWaste) return { subtotal: 0, fee: 0, total: 0 };
    const subtotal = purchaseQuantity * selectedWaste.price_per_kg;
    const fee = subtotal * 0.01;
    return {
      subtotal,
      fee,
      total: subtotal + fee
    };
  };

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
              <p className="text-xs text-slate-500">Panel de Comprador</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => base44.auth.logout()}
            className="rounded-xl"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Hola, {profile?.company_name || user?.full_name} 👋
          </h2>
          <p className="text-slate-500 mt-1">
            Encuentra los residuos orgánicos que necesitas
          </p>
        </div>

        <Tabs defaultValue="marketplace" className="space-y-6">
          <TabsList className="bg-white border border-slate-200 p-1 rounded-xl">
            <TabsTrigger value="marketplace" className="rounded-lg data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
              <Search className="w-4 h-4 mr-2" />
              Marketplace
            </TabsTrigger>
            <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
              <BarChart3 className="w-4 h-4 mr-2" />
              Resumen
            </TabsTrigger>
            <TabsTrigger value="transactions" className="rounded-lg data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
              <History className="w-4 h-4 mr-2" />
              Mis Compras
            </TabsTrigger>
          </TabsList>

          <TabsContent value="marketplace" className="space-y-6">
            {/* Approval Status */}
            {profile?.approval_status !== "approved" && (
              <PendingApproval status={profile?.approval_status} />
            )}

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-slate-500" />
                <h3 className="font-semibold text-slate-900">Buscar Residuos</h3>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-600">Tipo de residuo</Label>
                  <Select
                    value={filters.waste_type}
                    onValueChange={(value) => setFilters({ ...filters, waste_type: value })}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Todos los tipos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={null}>Todos los tipos</SelectItem>
                      {Object.entries(wasteTypes).map(([key, info]) => (
                        <SelectItem key={key} value={key}>
                          {info.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-600">Cantidad mínima (kg)</Label>
                  <Input
                    type="number"
                    value={filters.min_quantity}
                    onChange={(e) => setFilters({ ...filters, min_quantity: e.target.value })}
                    placeholder="Ej: 500"
                    className="rounded-xl"
                  />
                </div>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => setFilters({ waste_type: "", min_quantity: "" })}
                    className="rounded-xl"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Limpiar filtros
                  </Button>
                </div>
              </div>
            </div>

            {/* Results */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">
                  {availableWastes.length} residuos disponibles
                </h3>
              </div>

              {availableWastes.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                  <Package className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                  <h3 className="font-semibold text-slate-900 mb-2">
                    No hay residuos disponibles
                  </h3>
                  <p className="text-slate-500">
                    Intenta con otros filtros o vuelve más tarde
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableWastes.map((waste) => (
                    <WasteCard 
                      key={waste.id} 
                      waste={waste} 
                      onBuy={handleBuyClick}
                      showBuyButton={canBuy}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-4">
              <StatsCard
                title="Total Comprado"
                value={`${totalPurchased.toLocaleString()} kg`}
                icon={Package}
                variant="success"
              />
              <StatsCard
                title="Total Gastado"
                value={`$${totalSpent.toFixed(2)}`}
                subtitle="USD (incluye comisión)"
                icon={DollarSign}
                variant="info"
              />
              <StatsCard
                title="Transacciones"
                value={transactionsCount}
                icon={ShoppingCart}
                variant="purple"
              />
            </div>

            {/* Recent Purchases */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Compras Recientes</h3>
              {myTransactions.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p>Aún no tienes compras registradas</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {myTransactions.slice(0, 5).map((tx) => (
                    <TransactionRow key={tx.id} transaction={tx} viewAs="buyer" />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <h3 className="font-semibold text-slate-900">Historial de Compras</h3>
            
            {myTransactions.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <History className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <h3 className="font-semibold text-slate-900 mb-2">
                  Sin compras aún
                </h3>
                <p className="text-slate-500">
                  Explora el marketplace para encontrar residuos
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {myTransactions.map((tx) => (
                  <TransactionRow key={tx.id} transaction={tx} viewAs="buyer" />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Purchase Dialog */}
      <Dialog open={showPurchaseDialog} onOpenChange={setShowPurchaseDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Compra</DialogTitle>
          </DialogHeader>
          
          {selectedWaste && (
            <div className="space-y-6 py-4">
              {/* Waste Info */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                <WasteTypeIcon type={selectedWaste.waste_type} size="lg" />
                <div>
                  <h4 className="font-semibold text-slate-900">
                    {getWasteTypeInfo(selectedWaste.waste_type).label}
                  </h4>
                  <p className="text-sm text-slate-500">
                    Vendedor: {selectedWaste.seller_name}
                  </p>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-700">Cantidad a comprar</Label>
                  <span className="text-sm text-slate-500">
                    Máx: {selectedWaste.quantity_kg.toLocaleString()} kg
                  </span>
                </div>
                
                <div className="flex items-center gap-4">
                  <Slider
                    value={[purchaseQuantity]}
                    onValueChange={([value]) => setPurchaseQuantity(value)}
                    max={selectedWaste.quantity_kg}
                    min={1}
                    step={1}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={purchaseQuantity}
                    onChange={(e) => setPurchaseQuantity(Math.min(selectedWaste.quantity_kg, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="w-24 rounded-xl text-center"
                  />
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal ({purchaseQuantity} kg × ${selectedWaste.price_per_kg.toFixed(2)})</span>
                  <span className="font-medium">${calculatePurchase().subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Comisión plataforma (1%)</span>
                  <span className="font-medium">${calculatePurchase().fee.toFixed(2)}</span>
                </div>
                <div className="border-t border-emerald-200 pt-3 flex justify-between">
                  <span className="font-semibold text-slate-900">Total</span>
                  <span className="font-bold text-emerald-700 text-lg">
                    ${calculatePurchase().total.toFixed(2)} USD
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => setShowPurchaseDialog(false)}
              className="rounded-xl"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => purchaseMutation.mutate({ waste: selectedWaste, quantity: purchaseQuantity })}
              disabled={purchaseMutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
            >
              {purchaseMutation.isPending ? "Procesando..." : "Confirmar Compra"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}