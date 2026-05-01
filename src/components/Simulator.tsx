import { Users, Building2, ArrowRight, Lock } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Simulator() {
  const [selection, setSelection] = useState<"primo" | "invest" | null>(null);

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-4xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-primary tracking-[0.2em] uppercase mb-4">Étape 1 : Votre Projet</h2>
          <h3 className="text-3xl font-extrabold tracking-tight">SIMULATEUR DE PRÊT</h3>
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

        {/* Card Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <button 
            onClick={() => setSelection("primo")}
            className={`group p-8 bg-white rounded-xl text-left transition-all border-2 shadow-sm hover:shadow-md ${selection === "primo" ? "border-primary bg-primary/5" : "border-transparent hover:border-primary/50"}`}
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${selection === "primo" ? "bg-primary text-white" : "bg-primary-fixed text-primary"}`}>
              <Users size={32} />
            </div>
            <h4 className="text-xl font-bold mb-2">Je suis Primo-accédant</h4>
            <p className="text-sm text-on-surface-variant">C'est ma première acquisition pour ma résidence principale.</p>
          </button>
          <button 
            onClick={() => setSelection("invest")}
            className={`group p-8 bg-white rounded-xl text-left transition-all border-2 shadow-sm hover:shadow-md ${selection === "invest" ? "border-primary bg-primary/5" : "border-transparent hover:border-primary/50"}`}
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${selection === "invest" ? "bg-primary text-white" : "bg-surface-container text-on-surface-variant"}`}>
              <Building2 size={32} />
            </div>
            <h4 className="text-xl font-bold mb-2">Je suis Investisseur</h4>
            <p className="text-sm text-on-surface-variant">Je souhaite constituer un patrimoine ou défiscaliser.</p>
          </button>
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
