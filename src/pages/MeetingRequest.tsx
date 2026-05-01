import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Video, 
  ChevronRight,
  Info,
  ShieldCheck,
  Zap,
  Home,
  Euro,
  Users,
  MapPin,
  TrendingDown,
  CreditCard,
  Briefcase,
  ReceiptText,
  Wallet
} from "lucide-react";

export default function MeetingRequest() {
  const location = useLocation();
  const navigate = useNavigate();
  const s = location.state || {};
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    consent: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const fmt = (n: number) => new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'EUR', 
    maximumFractionDigits: 0 
  }).format(n || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consent) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    try {
      const response = await fetch("/api/request-meeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          simulationData: s,
          timestamp: new Date().toISOString()
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error("Error submitting meeting request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-8 bg-gray-50 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full bg-white rounded-[40px] p-12 text-center shadow-2xl border border-gray-100"
        >
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight leading-none uppercase">Demande envoyée !</h2>
          <p className="text-gray-500 font-medium text-lg leading-relaxed mb-10 italic serif">
            Un conseiller expert va vous contacter rapidement pour étudier votre projet.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="px-12 py-5 bg-[#004d47] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#00665e] transition-all shadow-xl shadow-emerald-900/20"
          >
            Retour à l'accueil
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="pt-24 pb-32 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-widest hover:text-primary transition-all mb-12"
        >
          <ArrowLeft size={16} />
          Retour aux résultats
        </button>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Left: Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-xl border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                <ShieldCheck size={160} />
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                    Service Express
                  </div>
                  <div className="h-px w-8 bg-emerald-200"></div>
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter leading-[0.9] mb-6 uppercase">
                  Vos plans <br /> <span className="text-emerald-600">en 24H</span>
                </h1>
                
                <p className="text-gray-500 text-lg font-medium italic mb-12 max-w-xl serif">
                  Échangez avec l'un de nos conseillers experts pour affiner votre projet et accéder au marché immobilier neuf "off-market".
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Prénom</label>
                      <input 
                        required
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="w-full p-5 bg-gray-50 rounded-2xl border border-gray-100 focus:bg-white focus:ring-4 focus:ring-emerald-50 focus:border-emerald-600 transition-all outline-none font-bold text-gray-900" 
                        placeholder="Votre prénom"
                      />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Nom</label>
                       <input 
                        required
                         type="text"
                         value={formData.lastName}
                         onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                         className="w-full p-5 bg-gray-50 rounded-2xl border border-gray-100 focus:bg-white focus:ring-4 focus:ring-emerald-50 focus:border-emerald-600 transition-all outline-none font-bold text-gray-900" 
                         placeholder="Votre nom"
                       />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Email professionnel ou personnel</label>
                    <input 
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full p-5 bg-gray-50 rounded-2xl border border-gray-100 focus:bg-white focus:ring-4 focus:ring-emerald-50 focus:border-emerald-600 transition-all outline-none font-bold text-gray-900" 
                      placeholder="exemple@email.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Téléphone</label>
                    <input 
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full p-5 bg-gray-50 rounded-2xl border border-gray-100 focus:bg-white focus:ring-4 focus:ring-emerald-50 focus:border-emerald-600 transition-all outline-none font-bold text-gray-900" 
                      placeholder="06 00 00 00 00"
                    />
                  </div>

                  <div className="pt-6">
                    <label className="group flex items-start gap-4 p-6 rounded-2xl bg-emerald-50/50 border-2 border-emerald-100 hover:border-emerald-600 cursor-pointer transition-all">
                      <div className="relative mt-1">
                        <input 
                          type="checkbox" 
                          required
                          checked={formData.consent}
                          onChange={(e) => setFormData({...formData, consent: e.target.checked})}
                          className="peer sr-only"
                        />
                        <div className="w-6 h-6 border-2 border-emerald-300 rounded-lg bg-white peer-checked:bg-emerald-600 peer-checked:border-emerald-600 transition-all flex items-center justify-center">
                          <CheckCircle2 size={16} className="text-white opacity-0 peer-checked:opacity-100" />
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-900 leading-relaxed uppercase tracking-tight">
                        Je consens à transmettre les résultats de ma simulation à un conseiller expert pour une étude personnalisée et gratuite de mon projet.
                      </span>
                    </label>
                  </div>

                  <button 
                    disabled={isSubmitting || !formData.consent}
                    className="w-full py-6 bg-[#004d47] text-white rounded-[24px] font-black uppercase tracking-[0.2em] hover:bg-[#00665e] transition-all shadow-xl shadow-emerald-900/10 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {isSubmitting ? (
                      <span className="animate-pulse">Transmission en cours...</span>
                    ) : (
                      <>
                        Confirmer ma demande d'étude 
                        <Zap size={18} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Right: Detailed Simulation Recap */}
          <aside className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-lg">
              <div className="p-8 bg-[#004d47] text-white">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-2">Synthèse de votre projet</p>
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-3xl font-black tracking-tight">{fmt(s.curNetPrice)}</h3>
                </div>
              </div>
              
              <div className="p-8 space-y-8">
                {/* Section 1: Profil & Situation */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Users size={16} />
                    </div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-900">1. Votre Profil</h4>
                  </div>
                  <div className="bg-gray-50/50 rounded-2xl p-5 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400 font-medium italic">Situation</span>
                      <span className="font-bold text-gray-900">{s.isCouple ? "En couple" : "Célibataire"}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400 font-medium italic">Logement actuel</span>
                      <span className="font-bold text-gray-900 capitalize">{s.housingStatus || "Locataire"}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400 font-medium italic">Âges</span>
                      <span className="font-bold text-gray-900">{s.age1} ans {s.isCouple && `/ ${s.age2} ans`}</span>
                    </div>
                  </div>
                </div>

                {/* Section 2: Finances */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Wallet size={16} />
                    </div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-900">2. Finances</h4>
                  </div>
                  <div className="bg-gray-50/50 rounded-2xl p-5 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400 font-medium italic">Revenus totaux</span>
                      <span className="font-bold text-gray-900">{fmt(s.totalRevenus)} / mois</span>
                    </div>
                    {(s.rev1?.other > 0 || s.rev1?.rental > 0 || s.rev1?.pension > 0 || (s.isCouple && (s.rev2?.other > 0 || s.rev2?.rental > 0 || s.rev2?.pension > 0))) && (
                      <div className="space-y-1 pl-2 border-l border-gray-100 mt-1">
                        {s.rev1?.other > 0 && <p className="text-[10px] text-gray-400">Autres (1) : {fmt(s.rev1.other)}</p>}
                        {s.rev1?.rental > 0 && <p className="text-[10px] text-gray-400">Foncier (1) : {fmt(s.rev1.rental)}</p>}
                        {s.rev1?.pension > 0 && <p className="text-[10px] text-gray-400">Pension (1) : {fmt(s.rev1.pension)}</p>}
                        {s.rev2?.other > 0 && <p className="text-[10px] text-gray-400">Autres (2) : {fmt(s.rev2.other)}</p>}
                        {s.rev2?.rental > 0 && <p className="text-[10px] text-gray-400">Foncier (2) : {fmt(s.rev2.rental)}</p>}
                        {s.rev2?.pension > 0 && <p className="text-[10px] text-gray-400">Pension (2) : {fmt(s.rev2.pension)}</p>}
                      </div>
                    )}
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400 font-medium italic">Apport personnel</span>
                      <span className="font-bold text-gray-900">{fmt(s.apport)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400 font-medium italic">Charges crédits</span>
                      <span className="font-bold text-red-600">{fmt(s.existingCreditMonthly)} / mois</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400 font-medium italic">Endettement</span>
                      <span className="font-bold text-emerald-600">{s.debtRatio}%</span>
                    </div>
                  </div>
                </div>

                {/* Section 3: Projet Immobilier */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                      <Home size={16} />
                    </div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-900">3. Projet</h4>
                  </div>
                  <div className="bg-gray-50/50 rounded-2xl p-5 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400 font-medium italic">Type de bien</span>
                      <span className="font-bold text-gray-900 capitalize">{s.propertyType} {s.rooms && `(${s.rooms})`}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400 font-medium italic">Localisation</span>
                      <span className="font-bold text-gray-900 truncate max-w-[140px] text-right">{s.city ? `${s.city} (${s.dept})` : (s.dept ? `Dept ${s.dept}` : 'Non précisé')}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400 font-medium italic">Zone PTZ</span>
                      <span className="font-bold text-primary">Zone {s.zone === 'Abis' ? 'A Bis' : s.zone}</span>
                    </div>
                    {s.nonOwnerDuration && (
                      <div className="flex justify-between items-center text-xs pt-1 border-t border-gray-100">
                        <span className="text-gray-400 font-medium italic">Sans RP depuis</span>
                        <span className="font-bold text-emerald-600">{s.nonOwnerDuration === "moreThan2Years" ? "+ 2 ans" : "- 2 ans"}</span>
                      </div>
                    )}
                    {s.wasPrimaryOwnerBefore && (
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-400 font-medium italic">Proprio avant ?</span>
                        <span className="font-bold text-gray-900">{s.wasPrimaryOwnerBefore === "yes" ? "Oui" : "Non"}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-emerald-600 rounded-[32px] p-8 text-white shadow-xl shadow-emerald-600/20 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                 <ShieldCheck size={80} />
               </div>
               <div className="relative z-10">
                 <h4 className="text-lg font-black uppercase tracking-widest mb-3">Données sécurisées</h4>
                 <p className="text-xs font-medium text-emerald-50 leading-relaxed opacity-80 italic serif">
                   Vos informations de simulation sont cryptées et transmises uniquement à nos conseillers certifiés. Aucun démarchage commercial tiers n'est pratiqué.
                 </p>
               </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
