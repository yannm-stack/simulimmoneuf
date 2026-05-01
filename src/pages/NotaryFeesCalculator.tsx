import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Info, 
  Home, 
  Building2, 
  Construction,
  Landmark,
  Euro,
  HelpCircle,
  CheckCircle2,
  Banknote
} from "lucide-react";

type PropertyType = 'ancien' | 'neuf' | 'construction';

export default function NotaryFeesCalculator() {
  const [propertyType, setPropertyType] = useState<PropertyType>('neuf');
  const [price, setPrice] = useState<number>(250000);
  const [landPrice, setLandPrice] = useState<number>(100000);
  const [fees, setFees] = useState<number>(0);
  const [percentage, setPercentage] = useState<number>(0);

  useEffect(() => {
    let calculatedFees = 0;
    let basePrice = price;

    if (propertyType === 'neuf') {
      // Neuf: between 2% and 3%
      const rate = 0.025;
      calculatedFees = price * rate;
      setPercentage(rate * 100);
    } else if (propertyType === 'ancien') {
      // Ancien: between 7% and 8%
      const rate = 0.08;
      calculatedFees = price * rate;
      setPercentage(rate * 100);
    } else if (propertyType === 'construction') {
      // Construction: fees on land price only
      const rate = 0.08; // Land is taxed like old property
      calculatedFees = landPrice * rate;
      setPercentage((calculatedFees / (price + landPrice)) * 100);
    }

    setFees(calculatedFees);
  }, [propertyType, price, landPrice]);

  const fmt = (val: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-12 pb-24 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest"
          >
            <Landmark size={14} />
            Simulateur Immobilier
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter leading-none uppercase"
          >
            Calcul des <br />
            <span className="text-primary italic">frais de notaire</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 font-medium italic serif text-lg max-w-xl mx-auto"
          >
            Estimez précisément le montant de vos frais d'acquisition selon la nature de votre projet.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Card */}
          <div className="lg:col-span-12">
            <div className="bg-white rounded-[40px] shadow-2xl shadow-primary/5 border border-gray-100 overflow-hidden">
              <div className="grid md:grid-cols-2">
                
                {/* Left: Inputs */}
                <div className="p-8 md:p-12 space-y-10 border-r border-gray-50">
                  
                  {/* Property Type Selection */}
                  <div className="space-y-6">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 block ml-1">
                      Type de projet
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      <button 
                        onClick={() => setPropertyType('neuf')}
                        className={`group p-6 rounded-3xl border-2 transition-all text-left flex items-center gap-5 ${
                          propertyType === 'neuf' 
                          ? 'border-primary bg-primary/5 shadow-lg shadow-primary/5' 
                          : 'border-gray-100 hover:border-gray-200 bg-white'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                          propertyType === 'neuf' ? 'bg-primary text-white scale-110' : 'bg-gray-50 text-gray-400'
                        }`}>
                          <Building2 size={24} />
                        </div>
                        <div className="flex-1">
                          <p className={`font-black uppercase tracking-widest text-sm ${propertyType === 'neuf' ? 'text-primary' : 'text-gray-500'}`}>Neuf / VEFA</p>
                          <p className="text-[11px] text-gray-400 font-medium italic mt-0.5">Frais réduits (~2-3%)</p>
                        </div>
                        {propertyType === 'neuf' && <CheckCircle2 className="text-primary" size={20} />}
                      </button>

                      <button 
                        onClick={() => setPropertyType('ancien')}
                        className={`group p-6 rounded-3xl border-2 transition-all text-left flex items-center gap-5 ${
                          propertyType === 'ancien' 
                          ? 'border-primary bg-primary/5 shadow-lg shadow-primary/5' 
                          : 'border-gray-100 hover:border-gray-200 bg-white'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                          propertyType === 'ancien' ? 'bg-primary text-white scale-110' : 'bg-gray-50 text-gray-400'
                        }`}>
                          <Home size={24} />
                        </div>
                        <div className="flex-1">
                          <p className={`font-black uppercase tracking-widest text-sm ${propertyType === 'ancien' ? 'text-primary' : 'text-gray-500'}`}>Ancien</p>
                          <p className="text-[11px] text-gray-400 font-medium italic mt-0.5">Frais standards (~8%)</p>
                        </div>
                        {propertyType === 'ancien' && <CheckCircle2 className="text-primary" size={20} />}
                      </button>

                      <button 
                        onClick={() => setPropertyType('construction')}
                        className={`group p-6 rounded-3xl border-2 transition-all text-left flex items-center gap-5 ${
                          propertyType === 'construction' 
                          ? 'border-primary bg-primary/5 shadow-lg shadow-primary/5' 
                          : 'border-gray-100 hover:border-gray-200 bg-white'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                          propertyType === 'construction' ? 'bg-primary text-white scale-110' : 'bg-gray-50 text-gray-400'
                        }`}>
                          <Construction size={24} />
                        </div>
                        <div className="flex-1">
                          <p className={`font-black uppercase tracking-widest text-sm ${propertyType === 'construction' ? 'text-primary' : 'text-gray-500'}`}>Construction Maison</p>
                          <p className="text-[11px] text-gray-400 font-medium italic mt-0.5">Calculé sur le terrain</p>
                        </div>
                        {propertyType === 'construction' && <CheckCircle2 className="text-primary" size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* Price Input */}
                  <div className="space-y-6">
                    <div className="flex justify-between items-end">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 block ml-1">
                        {propertyType === 'construction' ? "Prix de la construction" : "Prix du bien"}
                      </label>
                      <span className="text-2xl font-black text-gray-900 tabular-nums">{fmt(price)}</span>
                    </div>
                    <div className="relative pt-6">
                      <input 
                        type="range" 
                        min="50000" 
                        max="2000000" 
                        step="5000"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                      <div className="flex justify-between mt-4 text-[10px] font-black uppercase tracking-widest text-gray-300">
                        <span>50k€</span>
                        <span>2M€</span>
                      </div>
                    </div>
                  </div>

                  {/* Land Price Input (Conditional) */}
                  <AnimatePresence>
                    {propertyType === 'construction' && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 40 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="space-y-6 overflow-hidden"
                      >
                        <div className="flex justify-between items-end">
                          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                            Prix du terrain <Info size={12} className="opacity-40" />
                          </label>
                          <span className="text-2xl font-black text-primary tabular-nums">{fmt(landPrice)}</span>
                        </div>
                        <div className="relative pt-6">
                          <input 
                            type="range" 
                            min="20000" 
                            max="1000000" 
                            step="1000"
                            value={landPrice}
                            onChange={(e) => setLandPrice(Number(e.target.value))}
                            className="w-full h-2 bg-primary/10 rounded-lg appearance-none cursor-pointer accent-primary"
                          />
                          <div className="flex justify-between mt-4 text-[10px] font-black uppercase tracking-widest text-primary/30">
                            <span>20k€</span>
                            <span>1M€</span>
                          </div>
                        </div>
                        <p className="p-4 rounded-xl bg-primary/5 text-[11px] font-medium italic text-primary/80 border border-primary/10">
                          Note : Pour une construction, les droits de mutation ne s'appliquent que sur le prix d'achat du terrain à bâtir.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Right: Results Display */}
                <div className="bg-gray-900 p-8 md:p-12 flex flex-col justify-center relative overflow-hidden">
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Landmark size={240} className="text-white" />
                  </div>
                  
                  <div className="relative z-10 space-y-12">
                    <div className="space-y-4">
                      <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary/60">Estimation totale des frais</p>
                      <div className="flex items-baseline gap-4">
                        <h2 className="text-6xl md:text-7xl font-black text-white tracking-tighter tabular-nums">
                          {fmt(fees).replace('€', '')}<span className="text-3xl text-primary ml-1">€</span>
                        </h2>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-widest border border-white/10">
                          {percentage.toFixed(1)}% du prix total
                        </div>
                        <div className="h-px flex-1 bg-white/5"></div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center shrink-0">
                          <Euro size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Total opération</p>
                          <p className="text-lg font-bold text-white mb-1">{fmt(propertyType === 'construction' ? price + landPrice + fees : price + fees)}</p>
                          <p className="text-[11px] text-white/30 font-medium italic">(Prix + Notaire)</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-5 rounded-3xl bg-white/5 border border-white/10">
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Impôts (DMTG)</p>
                          <p className="text-sm font-bold text-white">{fmt(fees * 0.8)}</p>
                        </div>
                        <div className="p-5 rounded-3xl bg-white/5 border border-white/10">
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Émoluments</p>
                          <p className="text-sm font-bold text-white">{fmt(fees * 0.2)}</p>
                        </div>
                      </div>
                    </div>


                    <p className="text-[10px] text-center text-white/30 font-medium italic tracking-tight">
                      * Estimation indicative hors frais d'hypothèque ou de garantie de prêt.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/50 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <HelpCircle size={20} />
            </div>
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-900">Que comprennent les frais ?</h3>
            <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
              Contrairement aux idées reçues, 80% des "frais de notaire" sont en réalité des taxes reversées à l'État (Droits de Mutation). Seul une petite partie revient à l'étude.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/50 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Landmark size={20} />
            </div>
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-900">L'avantage du neuf</h3>
            <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
              Dans le neuf (VEFA), les frais sont "réduits" à environ 2,5% car la taxe de publicité foncière est allégée. C'est l'un des piliers de l'économie à l'achat neuf.
            </p>
          </div>

          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/50 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Construction size={20} />
            </div>
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-900">Le cas de la construction</h3>
            <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
              Lorsque vous faites construire, l'acte authentique ne porte que sur le terrain. Vous économisez les droits de mutation sur toute la valeur de la maison construite.
            </p>
          </div>
        </div>

        {/* Property Tax Highlight */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-emerald-900 text-white p-8 md:p-12 rounded-[40px] shadow-2xl shadow-emerald-900/10 relative overflow-hidden group"
        >
          <div className="relative z-10 grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-[10px] font-black uppercase tracking-widest border border-white/10">
                Bonus Fiscal
              </div>
              <h2 className="text-3xl md:text-4xl font-headline font-black tracking-tight leading-none">
                Exonération de <br />
                <span className="text-emerald-400 italic">Taxe Foncière</span>
              </h2>
              <p className="text-emerald-50/80 text-sm md:text-base leading-relaxed font-medium italic serif">
                "L’acquisition d’un logement neuf (appartement ou maison) ouvre droit à une exonération de taxe foncière pendant les deux années qui suivent la livraison. En fonction des communes, cette exonération peut être totale ou partielle et elle n’est soumise à aucune condition de ressources. Mieux vaut donc se renseigner auprès de votre mairie."
              </p>
            </div>
            <div className="md:col-span-4 flex justify-end">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-emerald-800/50 flex items-center justify-center border border-white/5 relative">
                <div className="absolute inset-0 bg-emerald-400/10 rounded-full animate-pulse"></div>
                <Banknote size={80} className="text-emerald-400 relative z-10" strokeWidth={1} />
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
