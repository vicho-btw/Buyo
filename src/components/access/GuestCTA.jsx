import { Button } from "@/components/ui/button";
import { Lock, LogIn, UserPlus } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { cn } from "@/lib/utils";

export default function GuestCTA({ message = "Inicia sesión para realizar esta acción", className }) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50",
      className
    )}>
      <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center mb-4">
        <Lock className="w-8 h-8 text-slate-400" />
      </div>
      <p className="text-slate-600 text-center mb-6 max-w-md">
        {message}
      </p>
      <div className="flex gap-3">
        <Button
          onClick={() => base44.auth.redirectToLogin()}
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
        >
          <LogIn className="w-4 h-4 mr-2" />
          Iniciar Sesión
        </Button>
        <Button
          onClick={() => base44.auth.redirectToLogin()}
          variant="outline"
          className="rounded-xl"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Registrarse
        </Button>
      </div>
    </div>
  );
}

export function GuestBlockButton({ children, onClick, className, ...props }) {
  return (
    <div className="relative group">
      <Button
        disabled
        className={cn("relative", className)}
        {...props}
      >
        <Lock className="w-4 h-4 mr-2" />
        {children}
      </Button>
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="absolute inset-0 bg-slate-900/10 rounded-xl" />
      </div>
    </div>
  );
}