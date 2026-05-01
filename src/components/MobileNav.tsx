import { Home, Calculator, Lightbulb, Mail } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function MobileNav() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 md:hidden bg-white shadow-[0_-8px_32px_rgba(0,102,94,0.08)] border-t border-gray-100 rounded-t-3xl">
      <Link to="/" className={`flex flex-col items-center justify-center rounded-2xl px-4 py-2 transition-all active:scale-95 ${isActive("/") ? "bg-primary/10 text-primary" : "text-gray-400"}`}>
        <Home size={20} />
        <span className="text-[10px] font-medium uppercase tracking-widest mt-1">Accueil</span>
      </Link>
      <Link to="/simulation" className={`flex flex-col items-center justify-center rounded-2xl px-4 py-2 transition-all active:scale-95 ${isActive("/simulation") ? "bg-primary/10 text-primary" : "text-gray-400"}`}>
        <Calculator size={20} />
        <span className="text-[10px] font-medium uppercase tracking-widest mt-1">Simulation</span>
      </Link>
      <Link to="/ptz" className={`flex flex-col items-center justify-center rounded-2xl px-4 py-2 transition-all active:scale-95 ${isActive("/ptz") ? "bg-primary/10 text-primary" : "text-gray-400"}`}>
        <Lightbulb size={20} />
        <span className="text-[10px] font-medium uppercase tracking-widest mt-1">Conseils</span>
      </Link>
      <Link to="/contact" className={`flex flex-col items-center justify-center rounded-2xl px-4 py-2 transition-all active:scale-95 ${isActive("/contact") ? "bg-primary/10 text-primary" : "text-gray-400"}`}>
        <Mail size={20} />
        <span className="text-[10px] font-medium uppercase tracking-widest mt-1">Contact</span>
      </Link>
    </div>
  );
}
