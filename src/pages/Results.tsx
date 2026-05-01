import { 
  ShieldCheck, 
  TrendingUp, 
  Euro,
  CreditCard,
  Calculator,
  Home,
  ReceiptText,
  MapPin,
  Sparkles,
  Users,
  Wallet,
  ArrowLeft,
  ArrowRight,
  Sliders,
  RotateCcw
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useLocation, useNavigate } from "react-router-dom";
import { calculatePTZ, Zone } from "../lib/ptzUtils";
import { getMaxDuration, getRateForDuration, MarketRate } from "../lib/loanUtils";

export default function Results() {
  const location = useLocation();
  const s = location.state || {};

  const [marketRates, setMarketRates] = useState<MarketRate[]>([]);

  useEffect(() => {
    fetch("/api/rates")
      .then(res => res.json())
      .then(data => {
        setMarketRates(data);
        if (!s.interestRate) {
          setInterestRate(getRateForDuration(durationYears, data));
        }
      })
      .catch(err => console.error("Error fetching market rates:", err));
  }, []);

  // --- Simulation State (Ported from shared code) ---
  const [mode, setMode] = useState<'neuf' | 'ancien'>(s.mode || 'neuf');
  const [clientName, setClientName] = useState(s.clientName || 'Jean Dupont');
  const [durationYears, setDurationYears] = useState(s.durationYears || 25);
  const [interestRate, setInterestRate] = useState(s.interestRate || 3.42);
  const [insuranceRate, setInsuranceRate] = useState(0.15);
  const [debtRatio, setDebtRatio] = useState(35);
  const [targetMonthly, setTargetMonthly] = useState(0);
  const [desiredBudget, setDesiredBudget] = useState(0);
  const [adjustmentMode, setAdjustmentMode] = useState<'none' | 'monthly' | 'budget'>('none');
  const [isCouple, setIsCouple] = useState(s.isCouple !== undefined ? s.isCouple : true);
  const [children, setChildren] = useState(s.children !== undefined ? s.children : 0);
  const [maritalStatus, setMaritalStatus] = useState(s.maritalStatus || 'Marié(e)');
  const [notaryFeesOffered, setNotaryFeesOffered] = useState(false);
  const res1 = s.rev1 || { net: 2900, other: 0, rental: 0, pension: 0 };
  const res2 = s.rev2 || { net: 2500, other: 0, rental: 0, pension: 0 };
  const dept = s.dept || "";
  const city = s.city || "";
  const [rev1, setRev1] = useState(res1);
  const [rev2, setRev2] = useState(res2);
  const [existingCreditMonthly, setExistingCreditMonthly] = useState(s.existingCreditMonthly || 0);
  const [existingCreditDuration, setExistingCreditDuration] = useState(0);
  const [apport, setApport] = useState(s.apport !== undefined ? s.apport : 45000);
  const [age1, setAge1] = useState(s.age1 || 35);
  const [age2, setAge2] = useState(s.age2 || 35);
  const [rfr, setRfr] = useState(s.rfr || 42000);
  const [zone, setZone] = useState<Zone>(s.zone || 'A');
  const [propertyType, setPropertyType] = useState<'appartement' | 'maison'>(s.propertyType || 'appartement');
  const [ptzAmount, setPtzAmount] = useState(100000);
  const [actionLogementAmount, setActionLogementAmount] = useState(0);
  const [isLocked, setIsLocked] = useState(true);
  const [brokerageFees, setBrokerageFees] = useState(0);
  const [bankFees, setBankFees] = useState(0);

  const isAncienMode = mode === 'ancien';
  const nbOccupants = (isCouple ? 2 : 1) + parseInt(children.toString());
  const maxAge = Math.max(age1, (isCouple ? age2 : 0));
  const ageAtEnd = maxAge + durationYears;
  const isTooOld = ageAtEnd > 75;
  
  // --- Helpers ---
  const fmt = (n: number) => new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'EUR', 
    maximumFractionDigits: 0 
  }).format(n || 0);

  // --- Calculations Logic (Ported from shared code) ---
  const rev1Total = (rev1.net || 0) + (rev1.other || 0) + ((rev1.rental || 0) * 0.7) + (rev1.pension || 0);
  const rev2Total = isCouple ? ((rev2.net || 0) + (rev2.other || 0) + ((rev2.rental || 0) * 0.7) + (rev2.pension || 0)) : 0;
  const totalRevenus = rev1Total + rev2Total;
  const theoreticalCap = totalRevenus * (debtRatio / 100);
  const calcMaxPayment = Math.max(0, theoreticalCap - existingCreditMonthly);
  const maxMonthlyPayment = targetMonthly > 0 ? targetMonthly : calcMaxPayment;

  const calcPrincipal = (budget: number, rate: number, insRate: number, years: number) => {
    if (years === 0 || budget <= 0) return 0;
    const combinedRate = (rate + insRate) / 100 / 12;
    const n = years * 12;
    if (combinedRate === 0) return budget * n;
    return budget * (1 - Math.pow(1 + combinedRate, -n)) / combinedRate;
  };

  const resPTZ = calculatePTZ(rfr, nbOccupants, zone, 500000, propertyType === 'maison'); // Use high value to get max potential ptz
  const ptzTranche = resPTZ.tranche;
  
  const ptzMonthlyNeuf = ptzAmount * 0.0035;
  const rAL = 1.0 / 100 / 12;
  const iAL = insuranceRate / 100 / 12;
  const nAL = durationYears * 12;
  const afAL = rAL / (1 - Math.pow(1 + rAL, -nAL));
  const actionLogMonthlyNeuf = actionLogementAmount * (afAL + iAL);

  const avlForMainNeuf = Math.max(0, maxMonthlyPayment - ptzMonthlyNeuf - actionLogMonthlyNeuf);
  const mainLoanNeuf = calcPrincipal(avlForMainNeuf, interestRate, insuranceRate, durationYears);
  const budgetGlobalNeuf = mainLoanNeuf + ptzAmount + apport + actionLogementAmount;
  const notaryRateNeuf = notaryFeesOffered ? 0 : 0.022;
  const notaryFeesNeuf = Math.round(budgetGlobalNeuf * notaryRateNeuf / 100) * 100;
  const guaranteeFeesNeuf = Math.round((ptzAmount + mainLoanNeuf + actionLogementAmount) * 0.011 / 100) * 100;
  const netPriceNeuf = Math.round(budgetGlobalNeuf - notaryFeesNeuf - guaranteeFeesNeuf - brokerageFees - bankFees);

  const mainLoanAncien = calcPrincipal(maxMonthlyPayment, interestRate, insuranceRate, durationYears);
  const budgetGlobalAncien = mainLoanAncien + apport;
  const notaryFeesAncien = Math.round(budgetGlobalAncien * 0.074 / 100) * 100;
  const guaranteeFeesAncien = Math.round(mainLoanAncien * 0.011 / 100) * 100;
  const netPriceAncien = Math.round(budgetGlobalAncien - notaryFeesAncien - guaranteeFeesAncien - brokerageFees - bankFees);

  const curPtz = isAncienMode ? 0 : ptzAmount;
  const curAL = isAncienMode ? 0 : actionLogementAmount;
  const curPtzMonthly = isAncienMode ? 0 : ptzMonthlyNeuf;
  const curALMonthly = isAncienMode ? 0 : actionLogMonthlyNeuf;
  const curMainLoan = isAncienMode ? mainLoanAncien : mainLoanNeuf;
  const curBudget = isAncienMode ? budgetGlobalAncien : budgetGlobalNeuf;
  const curNotary = isAncienMode ? notaryFeesAncien : notaryFeesNeuf;
  const curGuarantee = isAncienMode ? guaranteeFeesAncien : guaranteeFeesNeuf;
  const curNetPrice = isAncienMode ? netPriceAncien : netPriceNeuf;
  const displayedNetPrice = (adjustmentMode === 'budget' && desiredBudget > 0) ? desiredBudget : curNetPrice;
  const isOverMax = targetMonthly > calcMaxPayment && adjustmentMode !== 'none';
  const curInsMain = curMainLoan * (insuranceRate / 100 / 12);
  const curCreditMain = (isAncienMode ? maxMonthlyPayment : avlForMainNeuf) - curInsMain;

  // --- Automatic PTZ Calculation Update ---
  useEffect(() => {
    const nOcc = (isCouple ? 2 : 1) + parseInt(children.toString());
    // Use a stable budget for PTZ calculation to avoid circular dependency loops
    const stableBudget = curBudget;
    
    // Si le client est propriétaire, pas de PTZ
    if (s.housingStatus === "proprietaire") {
      setPtzAmount(0);
      return;
    }

    const res = calculatePTZ(rfr, nOcc, zone, stableBudget, propertyType === 'maison');
    const roundedAmount = Math.round(res.amount / 100) * 100;
    
    // Only update if difference is more than 100€ to avoid flip-flop loops
    if (Math.abs(roundedAmount - ptzAmount) > 100) {
      setPtzAmount(roundedAmount);
    }
  }, [rfr, isCouple, children, zone, propertyType, mode, curBudget, ptzAmount]);

  // --- Automatic Duration & Rate Adjustment based on Age ---
  useEffect(() => {
    const calculatedMax = getMaxDuration(maxAge);
    if (durationYears > calculatedMax) {
      setDurationYears(calculatedMax);
      setInterestRate(getRateForDuration(calculatedMax, marketRates));
    }
    // Note: We don't automatically update rate if duration is manual but valid, 
    // but the user asked to "baser sur tableau taux d'interet actuels".
    // Let's force update rate if duration changes to match table.
  }, [maxAge, marketRates]);

  useEffect(() => {
    setInterestRate(getRateForDuration(durationYears, marketRates));
  }, [durationYears, marketRates]);

  useEffect(() => {
    let rate = age1 >= 50 ? 0.60 : 0.15;
    if (isCouple) {
      rate += (age2 >= 50 ? 0.60 : 0.15);
    }
    // We round to 2 decimals to avoid floating point weirdness
    setInsuranceRate(Math.round(rate * 100) / 100);
  }, [age1, age2, isCouple]);

  const navigate = useNavigate();

  const handleReset = () => {
    setClientName(''); setDurationYears(25); setInterestRate(3.42); setInsuranceRate(0.15);
    setIsCouple(false); setChildren(0); setNotaryFeesOffered(false); setTargetMonthly(0); setDesiredBudget(0);
    setAdjustmentMode('none');
    setRev1({ net: 0, other: 0, rental: 0, pension: 0 }); setRev2({ net: 0, other: 0, rental: 0, pension: 0 });
    setExistingCreditMonthly(0); setExistingCreditDuration(0);
    setApport(0); setAge1(35); setAge2(35); setRfr(0); setZone('A'); setPropertyType('appartement'); setPtzAmount(100000); setActionLogementAmount(0);
    setDebtRatio(35); setBrokerageFees(0); setBankFees(0);
  };


  return (
    <main className="pt-8 pb-32 max-w-7xl mx-auto px-6 md:px-8 bg-white min-h-screen">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl ${isAncienMode ? "bg-orange-600" : "bg-primary"} flex items-center justify-center shadow-lg transition-colors`}>
            <Home className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight font-headline">
              Simulation Budget {isAncienMode ? "Ancien" : "Neuf"}
            </h1>
            <p className="text-gray-500 text-sm">Analyse personnalisée de votre projet immobilier</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => navigate('/simulation')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all font-headline"
          >
            <ArrowLeft size={16} />
            Retour
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        
        {/* RIGHT COLUMN: RESULTS SUMMARY */}
        <section className="w-full">
          <div className="bg-white rounded-[40px] border border-gray-100 shadow-2xl shadow-gray-200/40 overflow-hidden">
            {/* Elegant Header */}
            <div className={`p-10 md:p-16 text-center relative overflow-hidden ${isAncienMode ? "bg-orange-600" : "bg-[#004d47]"}`}>
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,white,transparent)]" />
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10"
              >
                <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-white/10 backdrop-blur-sm">
                  Financement Immobilier • {isAncienMode ? "Ancien" : "Neuf"}
                </span>
                <h2 className={`text-4xl md:text-6xl font-black tracking-tighter mb-4 font-headline leading-[0.9] ${isOverMax ? 'text-red-400' : 'text-white'}`}>
                  {fmt(displayedNetPrice)}
                </h2>
                <p className="text-white/60 font-medium text-lg italic serif">
                  {isOverMax ? "Budget supérieur à votre capacité" : "Votre capacité d'acquisition nette"}
                </p>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 inline-flex flex-col items-center gap-1 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Mensualité estimée</span>
                    <span className={`text-2xl font-black ${isOverMax ? 'text-red-400' : 'text-white'}`}>{Math.floor(maxMonthlyPayment)}€</span>
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">/ mois</span>
                  </div>
                  <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Estimation 100% GRATUITE</span>
                </motion.div>
                <div className="mt-4 max-w-md mx-auto">
                  <p className="text-[8px] leading-relaxed text-white/30 text-center uppercase tracking-tighter">
                    <span className="font-black text-white/40">Attention : </span>
                    Les résultats fournis par ce simulateur reposent uniquement sur les informations que vous avez déclarées. 
                    Ils sont donc donnés à titre strictement indicatif et n’ont pas de valeur contractuelle.
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="px-8 md:px-12 pt-10">
              <button 
                onClick={() => navigate('/etude-projet', { state: { 
                  ...s, // Pass everything from initial simulation
                  curNetPrice, 
                  maxMonthlyPayment, 
                  durationYears, 
                  apport, 
                  ptzAmount, 
                  zone, 
                  mode, 
                  propertyType, 
                  isCouple, 
                  children,
                  age1,
                  age2,
                  maritalStatus,
                  rfr,
                  city: city || s.city,
                  dept: dept || s.dept,
                  rooms: s.rooms,
                  hasParking: s.hasParking,
                  hasExterior: s.hasExterior,
                  floor: s.floor,
                  deliveryYear: s.deliveryYear,
                  deliveryQuarter: s.deliveryQuarter,
                  deliveryTime: s.deliveryTime,
                  rev1,
                  rev2,
                  existingCreditMonthly,
                  existingCreditDuration,
                  debtRatio,
                  interestRate,
                  insuranceRate,
                  totalRevenus
                } })}
                className="w-full group relative overflow-hidden bg-white border-2 border-[#004d47] text-[#004d47] p-6 rounded-3xl transition-all hover:bg-[#004d47] hover:text-white shadow-xl shadow-gray-200/50 flex flex-col items-center justify-center gap-1"
              >
                <div className="flex items-center gap-3 font-headline">
                  <Sparkles className="text-primary group-hover:text-white transition-colors" size={24} />
                  <span className="text-sm md:text-lg font-black uppercase tracking-widest leading-none">
                    Découvrez les biens éligibles à votre budget
                  </span>
                </div>
                <span className="text-[10px] md:text-xs font-bold opacity-60 uppercase tracking-[0.1em] text-center max-w-md">
                  Recevez une sélection de plans sous 24h après un court échange avec nos experts
                </span>
                <div className="absolute top-1/2 right-8 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all">
                  <ArrowRight size={24} />
                </div>
              </button>
            </div>

            <div className="p-8 md:p-12 space-y-12">
              {/* Detailed Simulation Summary */}
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-gray-100"></div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Récapitulatif complet de votre saisie</h3>
                  <div className="h-px flex-1 bg-gray-100"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Phase 1: Profil */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Users size={16} />
                      </div>
                      <h4 className="text-xs font-black uppercase tracking-widest text-gray-900">1. Profil</h4>
                    </div>
                    <div className="bg-gray-50/50 rounded-2xl p-4 space-y-3">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-gray-400 font-medium italic">Situation</span>
                        <span className="font-bold text-gray-900">{isCouple ? "En couple" : "Célibataire"}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-gray-400 font-medium italic">Statut</span>
                        <span className="font-bold text-gray-900">{maritalStatus}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-gray-400 font-medium italic">Enfants</span>
                        <span className="font-bold text-gray-900">{children}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-gray-400 font-medium italic">Âges</span>
                        <span className="font-bold text-gray-900">{age1} ans {isCouple && `/ ${age2} ans`}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-gray-400 font-medium italic">Logement actuel</span>
                        <span className="font-bold text-gray-900 capitalize">{s.housingStatus || "Locataire"}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-gray-400 font-medium italic">Primo-accédant</span>
                        <span className="font-bold text-gray-900">{s.primo === "yes" ? "Oui" : "Non"}</span>
                      </div>
                      {s.nonOwnerDuration && (
                        <div className="flex justify-between items-center text-[11px] pt-1 border-t border-gray-100">
                          <span className="text-gray-400 font-medium italic">Sans RP depuis</span>
                          <span className="font-bold text-primary">{s.nonOwnerDuration === "moreThan2Years" ? "+ 2 ans" : "- 2 ans"}</span>
                        </div>
                      )}
                      {s.wasPrimaryOwnerBefore && (
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-gray-400 font-medium italic">Proprio avant ?</span>
                          <span className="font-bold text-gray-900">{s.wasPrimaryOwnerBefore === "yes" ? "Oui" : "Non"}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Phase 2: Revenus & Apport */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <Wallet size={16} />
                      </div>
                      <h4 className="text-xs font-black uppercase tracking-widest text-gray-900">2. Revenus</h4>
                    </div>
                    <div className="bg-gray-50/50 rounded-2xl p-4 space-y-3">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-gray-400 font-medium italic">Revenu Net 1</span>
                        <span className="font-bold text-gray-900">{fmt(rev1.net)} / mois</span>
                      </div>
                      {(rev1.other > 0 || rev1.rental > 0 || rev1.pension > 0) && (
                        <div className="space-y-1 pl-2 border-l border-gray-100">
                          {rev1.other > 0 && (
                            <div className="flex justify-between items-center text-[9px]">
                              <span className="text-gray-400">Autres revenus (1)</span>
                              <span className="font-bold text-gray-700">{fmt(rev1.other)}</span>
                            </div>
                          )}
                          {rev1.rental > 0 && (
                            <div className="flex justify-between items-center text-[9px]">
                              <span className="text-gray-400">Foncier (1)</span>
                              <span className="font-bold text-gray-700">{fmt(rev1.rental)}</span>
                            </div>
                          )}
                          {rev1.pension > 0 && (
                            <div className="flex justify-between items-center text-[9px]">
                              <span className="text-gray-400">Pension reçue (1)</span>
                              <span className="font-bold text-gray-700">{fmt(rev1.pension)}</span>
                            </div>
                          )}
                        </div>
                      )}
                      {isCouple && (
                        <>
                          <div className="flex justify-between items-center text-[11px] pt-1 border-t border-gray-50/50">
                            <span className="text-gray-400 font-medium italic">Revenu Net 2</span>
                            <span className="font-bold text-gray-900">{fmt(rev2.net)} / mois</span>
                          </div>
                          {(rev2.other > 0 || rev2.rental > 0 || rev2.pension > 0) && (
                            <div className="space-y-1 pl-2 border-l border-gray-100">
                              {rev2.other > 0 && (
                                <div className="flex justify-between items-center text-[9px]">
                                  <span className="text-gray-400">Autres revenus (2)</span>
                                  <span className="font-bold text-gray-700">{fmt(rev2.other)}</span>
                                </div>
                              )}
                              {rev2.rental > 0 && (
                                <div className="flex justify-between items-center text-[9px]">
                                  <span className="text-gray-400">Foncier (2)</span>
                                  <span className="font-bold text-gray-700">{fmt(rev2.rental)}</span>
                                </div>
                              )}
                              {rev2.pension > 0 && (
                                <div className="flex justify-between items-center text-[9px]">
                                  <span className="text-gray-400">Pension reçue (2)</span>
                                  <span className="font-bold text-gray-700">{fmt(rev2.pension)}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-gray-400 font-medium italic">Contrats</span>
                        <span className="font-bold text-gray-900 text-[9px]">{s.contractType1}{isCouple && ` / ${s.contractType2}`}</span>
                      </div>
                      <div className="flex flex-col gap-1 border-y border-gray-100 py-2">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-gray-400 font-medium italic">Ancienneté Acq 1</span>
                          <span className="font-bold text-gray-900">{s.seniority1}</span>
                        </div>
                        {s.seniority1 === "Moins de 1 an" && (
                          <div className="flex justify-between items-center text-[10px] pl-2 text-primary">
                            <span className="font-medium">Trial : {s.trialFinished1 ? "Terminé" : `Fin dans ${s.trialEnd1} mois`}</span>
                          </div>
                        )}
                        {isCouple && (
                          <>
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="text-gray-400 font-medium italic">Ancienneté Acq 2</span>
                              <span className="font-bold text-gray-900">{s.seniority2}</span>
                            </div>
                            {s.seniority2 === "Moins de 1 an" && (
                              <div className="flex justify-between items-center text-[10px] pl-2 text-primary">
                                <span className="font-medium">Trial : {s.trialFinished2 ? "Terminé" : `Fin dans ${s.trialEnd2} mois`}</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-gray-400 font-medium italic">Apport total</span>
                        <span className="font-bold text-gray-900">{fmt(apport)}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-gray-400 font-medium italic">RFR Cumulé</span>
                        <span className="font-bold text-gray-900">{fmt(s.rfr || 0)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Phase 3: Charges */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                        <ReceiptText size={16} />
                      </div>
                      <h4 className="text-xs font-black uppercase tracking-widest text-gray-900">3. Charges</h4>
                    </div>
                    <div className="bg-gray-50/50 rounded-2xl p-4 space-y-3">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-gray-400 font-medium italic">Total Crédits</span>
                        <span className="font-bold text-red-600">{fmt(existingCreditMonthly)} / mois</span>
                      </div>
                      {s.chargesConso > 0 && (
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-gray-400 font-medium italic">Consommation</span>
                          <span className="font-bold text-gray-900">{fmt(s.chargesConso)}</span>
                        </div>
                      )}
                      {s.chargesImmo > 0 && (
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-gray-400 font-medium italic">Immobilier</span>
                          <span className="font-bold text-gray-900">{fmt(s.chargesImmo)}</span>
                        </div>
                      )}
                      {s.chargesPension > 0 && (
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-gray-400 font-medium italic">Pension</span>
                          <span className="font-bold text-gray-900">{fmt(s.chargesPension)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Phase 4: Projet */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                        <Home size={16} />
                      </div>
                      <h4 className="text-xs font-black uppercase tracking-widest text-gray-900">4. Projet</h4>
                    </div>
                    <div className="bg-gray-50/50 rounded-2xl p-4 space-y-3">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-gray-400 font-medium italic">Type</span>
                        <span className="font-bold text-gray-900 capitalize">{propertyType} {s.rooms && `(${s.rooms})`}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-gray-400 font-medium italic">Ville</span>
                        <span className="font-bold text-gray-900">{city} ({dept})</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-gray-400 font-medium italic">Zone PTZ</span>
                        <span className="font-bold text-primary">Zone {zone === 'Abis' ? 'A Bis' : zone}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-gray-400 font-medium italic">Extérieur</span>
                        <span className="font-bold text-gray-900">{s.hasExterior ? "Oui" : "Non"}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-gray-400 font-medium italic">Parking</span>
                        <span className="font-bold text-gray-900">{s.hasParking ? "Oui" : "Non"}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-gray-400 font-medium italic">Livraison</span>
                        <span className="font-bold text-gray-900">{s.deliveryQuarter} {s.deliveryYear}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Core Stats Bar */}
              <div className="grid grid-cols-2 border border-gray-100 rounded-[32px] overflow-hidden bg-gray-50/50">
                {[
                  { label: "Durée", val: `${durationYears} ans`, desc: `${interestRate}% / an` },
                  { label: "Apport", val: fmt(apport), desc: "Mobilisé" }
                ].map((stat, i) => (
                  <div key={i} className="p-6 text-center border-r last:border-r-0 border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-xl font-black text-gray-900">{stat.val}</p>
                    <p className="text-[9px] text-gray-400 font-medium italic mt-1">{stat.desc}</p>
                  </div>
                ))}
              </div>

              {/* Two-Column Detail Cards */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Financial Structure */}
                <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-2xl bg-primary/5 text-primary flex items-center justify-center">
                      <Calculator size={20} />
                    </div>
                    <h3 className="text-lg font-black tracking-tight text-gray-800">Plan de Financement</h3>
                  </div>
                  <div className="space-y-5">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 font-medium italic">Apport personnel</span>
                      <span className="font-bold text-gray-900">{fmt(apport)}</span>
                    </div>
                    {!isAncienMode && ptzAmount > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 font-medium italic">Prêt à Taux Zéro (PTZ)</span>
                        <span className="font-bold text-primary">{fmt(ptzAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 font-medium italic">Prêt Bancaire Principal</span>
                      <span className="font-bold text-gray-900">{fmt(curMainLoan)}</span>
                    </div>
                    <div className="pt-5 border-t border-gray-100 flex justify-between items-center">
                      <span className="text-xs font-black uppercase tracking-widest text-gray-400">Budget de l'opération</span>
                      <span className="text-2xl font-black text-gray-900">{fmt(curBudget)}</span>
                    </div>
                  </div>
                </div>

                {/* Fees Breakdown */}
                <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
                      <ReceiptText size={20} />
                    </div>
                    <h3 className="text-lg font-black tracking-tight text-gray-800">Frais Annexes</h3>
                  </div>
                  <div className="space-y-5">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 font-medium italic">Frais de Notaire</span>
                      {notaryFeesOffered && !isAncienMode ? (
                        <span className="bg-[#004d47] text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Offerts</span>
                      ) : (
                        <span className="font-bold text-gray-900">{fmt(curNotary)}</span>
                      )}
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 font-medium italic">Garantie Bancaire</span>
                      <span className="font-bold text-gray-900">{fmt(curGuarantee)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 font-medium italic">Frais (Dossier + Courtage)</span>
                      <span className="font-bold text-gray-900">{fmt(bankFees + brokerageFees)}</span>
                    </div>
                    <div className="pt-5 border-t border-gray-100 flex justify-between items-center">
                      <span className="text-xs font-black uppercase tracking-widest text-gray-400">Total des frais</span>
                      <span className="text-2xl font-black text-gray-900">{fmt(curNotary + curGuarantee + bankFees + brokerageFees)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Big CTA Section */}
              <div className="pt-4 space-y-8">
                {/* Bidirectional Adjustment Section */}
                <div className="bg-gray-50 rounded-[32px] p-8 border border-gray-100 space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sliders size={18} className="text-primary" />
                      <h4 className="text-sm font-black uppercase tracking-widest text-gray-900 font-headline">Ajustement Express</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          setDurationYears(s.durationYears || 25);
                          setTargetMonthly(0);
                          setDesiredBudget(0);
                          setAdjustmentMode('none');
                        }}
                        className="px-3 py-1 bg-white border border-gray-200 rounded-full text-[9px] font-black text-gray-400 uppercase tracking-widest hover:text-primary hover:border-primary transition-all flex items-center gap-1.5"
                      >
                        <RotateCcw size={10} /> Réinitialiser
                      </button>
                      <div className="px-3 py-1 bg-primary/10 rounded-full">
                         <span className="text-[10px] font-black text-primary uppercase tracking-widest italic tracking-tighter">Taux "Très Bon" Appliqué</span>
                      </div>
                    </div>
                  </div>

                  {/* Duration Slider (Cursor) */}
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4 px-1">
                      <div className="flex justify-between items-end">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Durée du prêt</label>
                        <span className="text-2xl font-black text-primary">{durationYears} ans</span>
                      </div>
                      <div className="relative pt-2 pb-6">
                        <input 
                          type="range" 
                          min="7" 
                          max="25" 
                          step="1"
                          value={durationYears}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            // Snap to common durations if close
                            const steps = [7, 10, 15, 20, 25];
                            const snapped = steps.reduce((prev, curr) => 
                              Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev
                            );
                            setDurationYears(snapped);
                          }}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <div className="flex justify-between mt-4 px-1">
                          {[7, 10, 15, 20, 25].map(y => (
                            <button 
                              key={y}
                              onClick={() => setDurationYears(y)}
                              className={`text-[9px] font-black transition-colors ${durationYears === y ? "text-primary" : "text-gray-300 hover:text-gray-400"}`}
                            >
                              {y} ans
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 px-1">
                      <div className="flex justify-between items-end">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Taux d'endettement</label>
                        <span className="text-2xl font-black text-primary">{debtRatio}%</span>
                      </div>
                      <div className="relative pt-2 pb-6">
                        <input 
                          type="range" 
                          min="20" 
                          max="40" 
                          step="1"
                          value={debtRatio}
                          onChange={(e) => setDebtRatio(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <div className="flex justify-between mt-4 px-1">
                          {[25, 30, 33, 35, 40].map(r => (
                            <button 
                              key={r}
                              onClick={() => setDebtRatio(r)}
                              className={`text-[9px] font-black transition-colors ${debtRatio === r ? "text-primary" : "text-gray-300 hover:text-gray-400"}`}
                            >
                              {r}%
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block px-1">Limiter mes mensualités</label>
                       <div className="relative">
                         <input 
                           type="number" 
                           value={targetMonthly || ''}
                           onFocus={() => {
                             if (adjustmentMode === 'budget') {
                               setAdjustmentMode('none');
                               setDesiredBudget(0);
                             }
                           }}
                           onChange={(e) => {
                             const val = Number(e.target.value);
                             setTargetMonthly(val);
                             if (val > 0) {
                               setAdjustmentMode('monthly');
                               setDesiredBudget(0);
                             } else {
                               setAdjustmentMode('none');
                             }
                           }}
                           placeholder="0"
                           className={`w-full p-4 bg-white border border-gray-200 rounded-2xl font-black text-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-primary ${adjustmentMode === 'budget' ? 'opacity-40 grayscale cursor-pointer' : ''}`}
                         />
                         <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 font-bold">€/mois</span>
                       </div>
                       <p className="text-[9px] text-gray-400 font-medium px-1 underline decoration-dotted">Recalcule automatiquement votre budget</p>
                     </div>
                     <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block px-1">Budget Souhaité</label>
                       <div className="relative">
                         <input 
                           type="number" 
                           value={desiredBudget || ''}
                           onFocus={() => {
                             if (adjustmentMode === 'monthly') {
                               setAdjustmentMode('none');
                               setTargetMonthly(0);
                             }
                           }}
                           placeholder="0"
                           onChange={(e) => {
                             const budget = Number(e.target.value);
                             setDesiredBudget(budget);
                             if (budget > 0) {
                               setAdjustmentMode('budget');
                               // Precise calculation factoring in all fees to avoid drift
                               const nRate = isAncienMode ? 0.074 : (notaryFeesOffered ? 0 : 0.022);
                               const gRate = 0.011;
                               const otherFees = brokerageFees + bankFees;
                               const aides = isAncienMode ? 0 : (ptzAmount + actionLogementAmount);
                               
                               // budgetGlobal * (1 - nRate - gRate) = budget - (aides + apport) * gRate + otherFees
                               const bGlobal = (budget - (aides + apport) * gRate + otherFees) / (1 - nRate - gRate);
                               const p = Math.max(0, bGlobal - aides - apport);
                               
                               const r = interestRate / 100 / 12;
                               const ins = insuranceRate / 100 / 12;
                               const n = durationYears * 12;
                               const af = r === 0 ? 1 / n : r / (1 - Math.pow(1 + r, -n));
                               const mMain = p * (af + ins);
                               const mTotal = mMain + (isAncienMode ? 0 : (ptzMonthlyNeuf + actionLogMonthlyNeuf));
                               
                               setTargetMonthly(Math.round(mTotal));
                             } else {
                               setAdjustmentMode('none');
                               setTargetMonthly(0);
                             }
                           }}
                           className={`w-full p-4 bg-white border border-gray-200 rounded-2xl font-black text-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-primary ${adjustmentMode === 'monthly' ? 'opacity-40 grayscale cursor-pointer' : ''}`}
                         />
                         <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 font-bold">€</span>
                       </div>
                       <p className="text-[9px] text-gray-400 font-medium px-1 underline decoration-dotted">Recalcule automatiquement vos mensualités</p>
                     </div>
                  </div>
                </div>

                <div className="bg-[#004d47]/5 border-2 border-[#004d47]/10 rounded-[40px] p-10 space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#004d47] text-white rounded-2xl flex items-center justify-center shadow-lg">
                      <Sparkles size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-[#004d47] tracking-tight">Conseils & Recommandations</h3>
                      <p className="text-[#004d47]/60 font-bold uppercase text-[10px] tracking-[0.2em]">Optimisez votre dossier de financement</p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-3">
                      <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                        <ShieldCheck size={20} />
                      </div>
                      <p className="font-black text-sm text-gray-900 leading-tight">Justifiez votre apport</p>
                      <p className="text-xs text-gray-500 leading-relaxed font-medium">L'origine de vos fonds (épargne, don familial) doit être traçable pour la banque.</p>
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-3">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                        <Users size={20} />
                      </div>
                      <p className="font-black text-sm text-gray-900 leading-tight">Aides selon le profil</p>
                      <p className="text-xs text-gray-500 leading-relaxed font-medium">Certaines banques proposent des coups de pouce (Taux 0% local, réduction de frais) selon votre âge ou le bien.</p>
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-3">
                      <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                        <ReceiptText size={20} />
                      </div>
                      <p className="font-black text-sm text-gray-900 leading-tight">Frais de notaire offerts</p>
                      <p className="text-xs text-gray-500 leading-relaxed font-medium">En neuf, les promoteurs offrent parfois ces frais. Vérifiez les programmes en cours.</p>
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-3">
                      <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                        <TrendingUp size={20} />
                      </div>
                      <p className="font-black text-sm text-gray-900 leading-tight">Suivez les taux</p>
                      <p className="text-xs text-gray-500 leading-relaxed font-medium">Le marché change vite ! Refaites une simulation chaque mois pour rester à jour.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Small Note */}
              <div className="flex gap-4 p-8 bg-gray-50 rounded-[28px] border border-gray-100">
                <ShieldCheck className="text-primary flex-shrink-0" size={24} />
                <div className="space-y-1">
                  <p className="text-xs font-black uppercase tracking-tight text-gray-900">Estimation 100% Gratuite</p>
                  <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                    Cette simulation est basée sur les barèmes bancaires actuels. Elle ne constitue pas une offre ferme de prêt et doit être validée par un conseiller financier.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
