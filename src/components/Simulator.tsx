import { Users, Building2, ArrowRight, Lock, CheckCircle2, Check, History, HelpCircle } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Simulator() {
  const [selection, setSelection] = useState<"primo" | "invest" | null>(null);

  return (
    <section className="py-12 md:py-24 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-[10px] md:text-sm font-bold text-primary tracking-[0.2em] uppercase mb-4">Étape 1 : Votre Projet</h2>
          <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">SIMULATEUR DE PRÊT</h3>
        </div>

        {/* Progress Tracker */}
        <div className="mb-12">
          <div className="flex justify-between items-end mb-3">
            <span className="text-sm font-bold text-on-surface">PROGRESSION</span>
            <span className="text-3xl font-black text-primary">1<span className="text-lg text-gray-300">/4</span></span>
          </div>
          <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "25%" }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-primary rounded-full transition-all duration-500"
            />
          </div>
        </div>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <CheckCircle2 size={24} className="text-primary shrink-0" />
            <h3 className="text-xl md:text-2xl font-bold text-gray-900">Est-ce votre premier achat immobilier ?</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <button 
              onClick={() => setSelection("primo")}
              className={`relative flex flex-col items-center justify-center p-8 md:p-12 rounded-3xl transition-all border-2 ${
                selection === "primo" 
                  ? "border-primary bg-primary/[0.03] shadow-sm" 
                  : "border-gray-100 bg-white hover:border-gray-200"
              }`}
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 border-2 transition-colors ${
                selection === "primo" 
                  ? "bg-primary/5 border-primary text-primary" 
                  : "bg-gray-50 border-gray-100 text-gray-300"
              }`}>
                <Check size={28} />
              </div>
              <div className="text-center">
                <span className={`block text-xl font-bold mb-1 ${selection === "primo" ? "text-gray-900" : "text-gray-900"}`}>Oui</span>
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-gray-500 font-medium whitespace-nowrap">Primo-accédant</span>
                  <HelpCircle size={16} className="text-gray-300 cursor-help" />
                </div>
              </div>
            </button>

            <button 
              onClick={() => setSelection("invest")}
              className={`relative flex flex-col items-center justify-center p-8 md:p-12 rounded-3xl transition-all border-2 ${
                selection === "invest" 
                  ? "border-primary bg-primary/[0.03] shadow-sm" 
                  : "border-gray-100 bg-white hover:border-gray-200"
              }`}
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 border-2 transition-colors ${
                selection === "invest" 
                  ? "bg-primary/5 border-primary text-primary" 
                  : "bg-gray-50 border-gray-100 text-gray-300"
              }`}>
                <History size={28} />
              </div>
              <div className="text-center">
                <span className="block text-xl font-bold mb-1 text-gray-900">Non</span>
                <span className="text-gray-500 font-medium">Déjà propriétaire</span>
              </div>
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-6">
          <Link 
            to={selection ? `/simulation?type=${selection}` : "/simulation"} 
            className={`bg-primary text-white w-full max-w-sm py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:brightness-110 transition-all ${!selection && "opacity-50 cursor-not-allowed"}`}
            onClick={(e) => !selection && e.preventDefault()}
          >
            SUIVANT
            <ArrowRight size={20} />
          </Link>
          <div className="flex items-center gap-2 text-on-surface-variant/60 text-xs font-medium uppercase tracking-widest font-headline">
            <Lock size={14} className="fill-current" />
            Données 100% sécurisées et anonymes
          </div>
        </div>
      </div>
    </section>
  );
}
