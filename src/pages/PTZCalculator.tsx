import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Info, Search, Minus, Plus, ChevronDown, CheckCircle2, Home, Building2, ExternalLink, MapPin, AlertTriangle, HelpCircle } from "lucide-react";
import { calculatePTZ as calculatePTZUtil, Zone } from "../lib/ptzUtils";
import { detectZone } from "../lib/cityZones";
import { DEPARTMENTS } from "../lib/departments";
import Autocomplete from "../components/Autocomplete";

export default function PTZCalculator() {
  const [occupants, setOccupants] = useState(2);
  const [rfr, setRfr] = useState(35000);
  const [totalCost, setTotalCost] = useState(240000);
  const [isNeuf, setIsNeuf] = useState(true);
  const [zone, setZone] = useState<Zone>("A");
  const [propertyType, setPropertyType] = useState<"appartement" | "maison">("appartement");
  const [showResult, setShowResult] = useState(false);
  const [ptzResult, setPtzResult] = useState({ amount: 0, tranche: 0, quotite: 0 });

  const [housingStatus, setHousingStatus] = useState<"locataire" | "proprietaire" | "heberge" | "fonction">("locataire");
  const [dept, setDept] = useState("75");
  const [city, setCity] = useState("Paris");
  const [manualZone, setManualZone] = useState(false);
  const [isZoneVerified, setIsZoneVerified] = useState(false);
  const [deptSuggestions, setDeptSuggestions] = useState<string[]>([]);
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [isSearchingCity, setIsSearchingCity] = useState(false);

  useEffect(() => {
    if (dept.length > 0) {
      const matches = DEPARTMENTS
        .filter(d => d.code.startsWith(dept) || d.name.toLowerCase().includes(dept.toLowerCase()))
        .map(d => `${d.code} - ${d.name}`)
        .slice(0, 5);
      setDeptSuggestions(matches);
    } else {
      setDeptSuggestions([]);
    }
  }, [dept]);

  useEffect(() => {
    if (city.length > 1) {
      setIsSearchingCity(true);
      const url = `https://geo.api.gouv.fr/communes?nom=${city}&codeDepartement=${dept.split(' ')[0]}&limit=5`;
      fetch(url)
        .then(res => res.json())
        .then(data => {
          setCitySuggestions(data.map((c: any) => c.nom));
          setIsSearchingCity(false);
        })
        .catch(() => setIsSearchingCity(false));
    } else {
      setCitySuggestions([]);
    }
  }, [city, dept]);

  useEffect(() => {
    setManualZone(false);
    setIsZoneVerified(false);
  }, [dept, city]);

  useEffect(() => {
    if (dept && city && !manualZone) {
      const detected = detectZone(dept, city);
      setZone(detected);
    }
  }, [dept, city, manualZone]);

  const [showRfrHelp, setShowRfrHelp] = useState(false);

  const handleCalculate = () => {
    if (!isZoneVerified) {
      alert("Veuillez vérifier et confirmer votre zone de financement avant de continuer.");
      return;
    }

    if (housingStatus === "proprietaire") {
      setPtzResult({ amount: 0, tranche: 0, quotite: 0 });
      setShowResult(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const result = calculatePTZUtil(
      rfr, 
      occupants, 
      zone, 
      totalCost, 
      propertyType === "maison"
    );
    setPtzResult(result);
    setShowResult(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-surface pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Hero & Description */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest"
            >
              <CheckCircle2 size={14} />
              Réforme PTZ 2025
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight leading-tight"
            >
              Estimez le montant de votre <span className="text-primary">Prêt à Taux Zéro</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-on-surface-variant leading-relaxed max-w-md"
            >
              Accédez à la propriété avec sérénité. Notre simulateur utilise les derniers barèmes officiels pour calculer vos droits au PTZ en quelques clics.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="hidden lg:block relative rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl"
            >
              <img 
                alt="Architecture moderne" 
                className="object-cover w-full h-full" 
                referrerPolicy="no-referrer"
                src="https://i.imgur.com/GVMGTg6.jpeg" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
            </motion.div>
          </div>

          {/* Form Area */}
          <div className="lg:col-span-7 bg-white/50 backdrop-blur-sm rounded-[2rem] p-1 md:p-2 border border-white/20">
            <div className="bg-white rounded-[1.8rem] shadow-xl p-8 md:p-12 space-y-10 border border-gray-100">
              
              <AnimatePresence mode="wait">
                {showResult ? (
                  <motion.div 
                    key="results"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="bg-primary/5 p-10 rounded-[2.5rem] border border-primary/10 text-center relative overflow-hidden">
                      <div className="relative z-10">
                        <span className="text-primary font-bold uppercase tracking-[0.2em] text-[10px] mb-4 block">Montant du PTZ estimé</span>
                        <h2 className="text-6xl font-black text-primary mb-2">{(ptzResult.amount).toLocaleString()} €</h2>
                        <div className="inline-flex items-center gap-2 px-4 py-1 bg-white border border-primary/20 rounded-full text-[10px] font-black text-primary uppercase tracking-widest mt-4">
                          Tranche {ptzResult.tranche} • Quotité {ptzResult.quotite * 100}%
                        </div>
                      </div>
                      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <Building2 size={120} />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Opération</span>
                        <span className="text-xl font-bold text-gray-900">{totalCost.toLocaleString()} €</span>
                      </div>
                      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Zone Géographique</span>
                        <span className="text-xl font-bold text-gray-900">Zone {zone === 'Abis' ? 'A Bis' : zone}</span>
                      </div>
                    </div>

                    <div className="p-6 bg-gray-50 rounded-3xl flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shrink-0 shadow-sm">
                        <Info size={20} />
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed font-medium">
                        Les résultats fournis sont indicatifs en fonction des données saisies. Cette simulation intègre les réformes de la Loi de finances 2025.
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <button 
                        onClick={() => setShowResult(false)}
                        className="flex-1 py-5 text-gray-500 font-bold hover:bg-gray-50 transition-colors rounded-2xl border border-gray-100 uppercase tracking-widest text-xs"
                      >
                        Modifier
                      </button>
                      <button className="flex-[2] bg-primary text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:brightness-110 active:scale-95 transition-all uppercase tracking-widest">
                        Faites votre simulation
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="form"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-10"
                  >
                    {/* Section: Localisation */}
                    <div className="space-y-8">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-primary/5 text-primary flex items-center justify-center font-bold">1</span>
                        <h2 className="text-xl font-bold tracking-tight">Votre situation & Projet</h2>
                      </div>

                      {/* Nouveau: Situation de la résidence principale */}
                      <div className="space-y-4 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                        <div className="space-y-1">
                          <h3 className="text-2xl font-black text-gray-900 font-headline">Situation perso</h3>
                          <p className="text-sm text-gray-500">
                            Vous êtes <span className="bg-primary/5 text-primary px-2 py-0.5 rounded-lg font-bold">
                              {housingStatus === "locataire" ? "locataire de votre logement" : 
                               housingStatus === "proprietaire" ? "propriétaire de votre logement" :
                               housingStatus === "heberge" ? "hébergé gratuitement" : "dans un logement de fonction"}
                            </span>.
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-2 pt-2">
                          {[
                            { id: "locataire", label: "Locataire de votre logement" },
                            { id: "proprietaire", label: "Propriétaire de votre logement" },
                            { id: "heberge", label: "Hébergé gratuitement" },
                            { id: "fonction", label: "Dans un logement de fonction" }
                          ].map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setHousingStatus(item.id as any)}
                              className={`w-full text-left px-5 py-4 rounded-xl font-bold transition-all border-2 ${housingStatus === item.id ? 'bg-primary border-primary text-white shadow-lg' : 'bg-white border-gray-100 text-gray-700 hover:border-primary/20'}`}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>

                        {housingStatus === "proprietaire" && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-xl mt-4"
                          >
                            <div className="flex gap-3">
                              <AlertTriangle className="text-amber-600 shrink-0" size={20} />
                              <p className="text-xs text-amber-700 font-semibold leading-relaxed">
                                Pour bénéficier du PTZ, vous ne devez pas avoir été propriétaire de votre résidence principale au cours des deux dernières années précédant l’émission de l’offre de prêt.
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Autocomplete 
                          label="Département (N°)"
                          placeholder="Ex: 75, 13, 69..."
                          value={dept}
                          onChange={setDept}
                          onSelect={(val) => {
                            const code = val.split(' ')[0];
                            setDept(code);
                          }}
                          suggestions={deptSuggestions}
                        />
                        <Autocomplete 
                          label="Ville"
                          placeholder="Ex: Paris, Lyon, Marseille..."
                          value={city}
                          onChange={setCity}
                          isLoading={isSearchingCity}
                          suggestions={citySuggestions}
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-6">
                        <section className={`p-8 rounded-2xl shadow-lg transition-all border-2 ${isZoneVerified ? 'bg-white border-green-100 shadow-green-900/5' : 'bg-primary/5 border-primary shadow-primary/10'}`}>
                          <div className="flex justify-between items-center mb-6">
                            <label className="block text-xs font-black uppercase tracking-widest text-primary">Zone de financement (Obligatoire)</label>
                            <div className="flex items-center gap-2">
                               {isZoneVerified ? (
                                 <div className="flex items-center gap-1 text-green-600 font-bold text-[10px] uppercase tracking-widest bg-green-50 px-2 py-1 rounded-full">
                                    <CheckCircle2 size={12} /> Confirmée
                                 </div>
                               ) : (
                                 <div className="flex items-center gap-1 text-amber-600 font-bold text-[10px] uppercase tracking-widest bg-amber-50 px-2 py-1 rounded-full">
                                    <Info size={12} /> À vérifier
                                 </div>
                               )}
                            </div>
                          </div>

                          <div className="mb-6">
                            <p className="text-sm font-medium text-on-surface mb-3">Veuillez consulter le site officiel pour confirmer votre zone :</p>
                            <a 
                              href="https://www.actionlogement.fr/connaitre-votre-zone-geographique" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              onClick={() => setIsZoneVerified(true)}
                              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all ${isZoneVerified ? 'bg-gray-100 text-gray-500 hover:bg-gray-200' : 'bg-primary text-white shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95'}`}
                            >
                              VÉRIFIER MA ZONE <ExternalLink size={16} />
                            </a>
                          </div>

                          <div className="space-y-4">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Modifier manuellement si besoin</label>
                            <div className="grid grid-cols-5 gap-2">
                              {(['Abis', 'A', 'B1', 'B2', 'C'] as Zone[]).map((z) => (
                                <button
                                  key={z}
                                  type="button"
                                  onClick={() => {
                                    setZone(z);
                                    setManualZone(true);
                                    setIsZoneVerified(true);
                                  }}
                                  className={`py-3 rounded-xl text-xs font-black transition-all border ${zone === z ? 'bg-primary border-primary text-white shadow-md' : 'bg-white border-gray-100 text-gray-400 hover:border-primary/20 hover:text-primary'}`}
                                >
                                  {z === 'Abis' ? 'A Bis' : z}
                                </button>
                              ))}
                            </div>
                          </div>
                          
                          <p className="mt-6 text-[10px] text-gray-400 italic flex items-center gap-2">
                            <Info size={12} />
                            {manualZone 
                              ? "Saisie manuelle active." 
                              : `Zone ${zone} détectée automatiquement pour ${city || 'votre ville'}.`}
                          </p>
                        </section>
                        
                        <div className="space-y-2">
                          <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block px-1">Type de bien</label>
                          <div className="flex bg-gray-50 p-1 rounded-2xl border border-gray-200">
                             <button 
                               onClick={() => setPropertyType("appartement")}
                               className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${propertyType === "appartement" ? "bg-white text-primary shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                             >
                                <Building2 size={16} /> Appart.
                             </button>
                             <button 
                               onClick={() => setPropertyType("maison")}
                               className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${propertyType === "maison" ? "bg-white text-primary shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                             >
                                <Home size={16} /> Maison
                             </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section: Composition du foyer */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-primary/5 text-primary flex items-center justify-center font-bold">2</span>
                        <h2 className="text-xl font-bold tracking-tight">Foyer & Revenus</h2>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                        <div className="space-y-2">
                          <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block px-1">Personnes à charge</label>
                          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl p-1">
                            <button 
                              onClick={() => occupants > 1 && setOccupants(occupants - 1)}
                              className="w-12 h-12 flex items-center justify-center hover:bg-white hover:shadow-sm text-primary rounded-xl transition-all"
                            >
                              <Minus size={20} />
                            </button>
                            <div className="flex-1 text-center font-bold text-lg">{occupants}</div>
                            <button 
                              onClick={() => setOccupants(occupants + 1)}
                              className="w-12 h-12 flex items-center justify-center hover:bg-white hover:shadow-sm text-primary rounded-xl transition-all"
                            >
                              <Plus size={20} />
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest flex items-center justify-between px-1">
                            <span>Revenu Fiscal de Référence ( dernier avis impôt )</span>
                            <button 
                              type="button"
                              onClick={() => setShowRfrHelp(true)}
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-all border border-primary/20"
                            >
                              <HelpCircle size={10} /> Aide
                            </button>
                          </label>
                          <div className="relative">
                            <input 
                              type="number"
                              value={rfr}
                              onChange={(e) => setRfr(Number(e.target.value))}
                              className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 pr-12 text-on-surface font-black text-right focus:ring-2 focus:ring-primary/10 transition-all outline-none" 
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-300">€</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section: Détails de l'opération */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-primary/5 text-primary flex items-center justify-center font-bold">3</span>
                        <h2 className="text-xl font-bold tracking-tight">Coût du projet</h2>
                      </div>
                      <div className="space-y-8">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center px-1">
                            <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Budget prévisionnel</label>
                            <span className="text-primary font-black text-xl">{totalCost.toLocaleString()} €</span>
                          </div>
                          <div className="relative pt-1">
                            <input 
                              type="range" 
                              min="50000"
                              max="1000000"
                              step="5000"
                              value={totalCost}
                              onChange={(e) => setTotalCost(Number(e.target.value))}
                              className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary" 
                            />
                            <div className="flex justify-between mt-2 text-[10px] font-bold text-gray-400 uppercase">
                              <span>50 000 €</span>
                              <span>1 000 000 €</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="pt-6">
                      <button 
                        onClick={handleCalculate}
                        disabled={!isZoneVerified}
                        className={`w-full py-6 rounded-2xl font-black text-xl shadow-2xl transition-all duration-300 uppercase tracking-widest ${isZoneVerified ? 'bg-primary text-white shadow-primary/20 hover:scale-[1.01] active:scale-95 cursor-pointer' : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'}`}
                      >
                        Lancer le calcul
                      </button>
                    </div>

                    <div className="flex gap-4 p-6 bg-blue-50 rounded-3xl border border-blue-100">
                      <Info className="text-blue-500 flex-shrink-0" size={20} />
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-blue-700 uppercase tracking-widest">Réforme 2025</h4>
                        <p className="text-[10px] text-blue-600/80 leading-relaxed font-semibold">
                          À partir d'avril 2025, le PTZ est de nouveau ouvert à la construction de maisons individuelles sur tout le territoire. La simulation reflète ces nouveaux barèmes indicatifs.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {showRfrHelp && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
          >
            <div 
              className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm"
              onClick={() => setShowRfrHelp(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Où trouver mon RFR ?</h3>
                  <p className="text-xs text-on-surface-variant font-semibold">Sur votre dernier avis d'imposition</p>
                </div>
                <button 
                  onClick={() => setShowRfrHelp(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Plus size={24} className="rotate-45 text-gray-400" />
                </button>
              </div>
              
              <div className="p-4 bg-gray-50 flex flex-col items-center">
                <div className="relative w-full aspect-[4/5] max-h-[60vh] rounded-xl overflow-hidden shadow-inner border border-gray-200 bg-white">
                  <img 
                    src="https://img.comment-economiser.fr/donnees/2101/avis-imposition-rfr.jpg" 
                    alt="Exemple avis d'imposition RFR" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="mt-6 p-6 bg-primary/5 rounded-2xl border border-primary/10 w-full">
                  <p className="text-sm font-bold text-primary flex items-start gap-3">
                    <Info size={18} className="shrink-0 mt-0.5" />
                    Le Revenu Fiscal de Référence se trouve généralement en bas de la première page de votre avis d'impôt sur le revenu, dans le cadre "Vos références".
                  </p>
                </div>
              </div>
              
              <div className="p-6 bg-white flex justify-center">
                <button 
                  onClick={() => setShowRfrHelp(false)}
                  className="px-10 py-4 bg-gray-900 text-white font-black uppercase tracking-widest rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-xl"
                >
                  J'ai compris
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
