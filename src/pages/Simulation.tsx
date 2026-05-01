import { User, Wallet, ReceiptText, Home, Shield, ChevronDown, CheckCircle2, History, Heart, Briefcase, Banknote, PlusCircle, ArrowLeft, ArrowRight, Info, MapPin, Building2, Check, Clock, ShieldCheck, ExternalLink, RotateCcw, AlertTriangle, HelpCircle } from "lucide-react";
import { useState, FormEvent, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Zone } from "../lib/ptzUtils";
import { getMaxDuration, getRateForDuration, MarketRate } from "../lib/loanUtils";
import { detectZone } from "../lib/cityZones";
import { DEPARTMENTS } from "../lib/departments";
import Autocomplete from "../components/Autocomplete";

export default function Simulation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get("type");
  
  const [step, setStep] = useState(1);
  const [primo, setPrimo] = useState(initialType === "invest" ? "no" : "yes");
  const [housingStatus, setHousingStatus] = useState<"locataire" | "proprietaire" | "heberge" | "fonction">("locataire");
  const [nonOwnerDuration, setNonOwnerDuration] = useState<"moreThan2Years" | "lessThan2Years" | null>(null);
  const [wasPrimaryOwnerBefore, setWasPrimaryOwnerBefore] = useState<"yes" | "no" | null>(null);
  const [situation, setSituation] = useState("couple");
  const [age1, setAge1] = useState("");
  const [age2, setAge2] = useState("");
  const [children, setChildren] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [marketRates, setMarketRates] = useState<MarketRate[]>([]);

  useEffect(() => {
    fetch("/api/rates")
      .then(res => res.json())
      .then(data => setMarketRates(data))
      .catch(err => console.error("Error fetching market rates:", err));
  }, []);
  
  // Step 2: Revenues
  const [rev1Net, setRev1Net] = useState<number | undefined>(undefined);
  const [rev1Months, setRev1Months] = useState(12);
  const [rev1Other, setRev1Other] = useState(0);
  const [rev1Rental, setRev1Rental] = useState(0);
  const [rev1Pension, setRev1Pension] = useState(0);
  const [contractType1, setContractType1] = useState("");
  const [contractType2, setContractType2] = useState("");
  const [rev2Net, setRev2Net] = useState<number | undefined>(undefined);
  const [rev2Months, setRev2Months] = useState(12);
  const [rev2Other, setRev2Other] = useState(0);
  const [rev2Rental, setRev2Rental] = useState(0);
  const [rev2Pension, setRev2Pension] = useState(0);
  const [apport1, setApport1] = useState<number | undefined>(undefined);
  const [apport2, setApport2] = useState(0);
  const [rfr1, setRfr1] = useState<number | undefined>(undefined);
  const [rfr2, setRfr2] = useState(0);
  
  const [seniority1, setSeniority1] = useState<string>("");
  const [trialFinished1, setTrialFinished1] = useState<boolean>(false);
  const [trialEnd1, setTrialEnd1] = useState<string>("");

  const [seniority2, setSeniority2] = useState<string>("");
  const [trialFinished2, setTrialFinished2] = useState<boolean>(false);
  const [trialEnd2, setTrialEnd2] = useState<string>("");
  
  // Step 3: Charges
  const [chargesConso, setChargesConso] = useState(0);
  const [chargesImmo, setChargesImmo] = useState(0);
  const [chargesPension, setChargesPension] = useState(0);

  // Step 4: Projet
  const [dept, setDept] = useState("");
  const [city, setCity] = useState("");
  const [zone, setZone] = useState<Zone>('Abis');
  const [manualZone, setManualZone] = useState(false);
  const [propertyType, setPropertyType] = useState<'appartement' | 'maison' | ''>('');
  const [floor, setFloor] = useState("");
  const [hasExterior, setHasExterior] = useState(false);
  const [hasParking, setHasParking] = useState(false);
  const [rooms, setRooms] = useState("");
  const [deliveryYear, setDeliveryYear] = useState("");
  const [deliveryQuarter, setDeliveryQuarter] = useState("");
  const [isZoneVerified, setIsZoneVerified] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const MandatoryDot = () => <span className="text-red-500 ml-1 font-bold">*</span>;

  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [isSearchingCity, setIsSearchingCity] = useState(false);
  const [deptSuggestions, setDeptSuggestions] = useState<string[]>([]);

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

  const handleFieldChange = (field: string, setter: (val: any) => void, val: any) => {
    setter(val);
    setErrors(prev => prev.filter(e => e !== field));
  };

  useEffect(() => {
    if (dept && city && !manualZone) {
      const detected = detectZone(dept, city);
      setZone(detected);
    }
  }, [dept, city, manualZone]);

  const nextStep = () => {
    // Validation for each step
    if (step === 1) {
      const missing = [];
      const newErrors = [];
      if (!maritalStatus) { missing.push("Régime patrimonial"); newErrors.push("maritalStatus"); }
      if (!children) { missing.push("Nombre d'enfants à charge"); newErrors.push("children"); }
      if (!age1) { missing.push("Âge de l'emprunteur"); newErrors.push("age1"); }
      if (situation === 'couple' && !age2) { missing.push("Âge du co-emprunteur"); newErrors.push("age2"); }
      
      if (newErrors.length > 0) {
        setErrors(newErrors);
        alert("Veuillez remplir les champs obligatoires suivants : \n- " + missing.join("\n- "));
        return;
      }
    }
    if (step === 2) {
      const missing = [];
      const newErrors = [];
      
      // Acq 1
      if (rev1Net === undefined) { missing.push("Revenu net (Acq 1)"); newErrors.push("rev1Net"); }
      if (!contractType1) { missing.push("Type de contrat (Acq 1)"); newErrors.push("contractType1"); }
      if (!seniority1) { missing.push("Ancienneté (Acq 1)"); newErrors.push("seniority1"); }
      if (seniority1 === 'Moins de 1 an' && !trialFinished1 && !trialEnd1) {
        missing.push("Fin de période d'essai (Acq 1)");
        newErrors.push("trialEnd1");
      }

      // Acq 2
      if (situation === 'couple') {
        if (rev2Net === undefined) { missing.push("Revenu net (Acq 2)"); newErrors.push("rev2Net"); }
        if (!contractType2) { missing.push("Type de contrat (Acq 2)"); newErrors.push("contractType2"); }
        if (!seniority2) { missing.push("Ancienneté (Acq 2)"); newErrors.push("seniority2"); }
        if (seniority2 === 'Moins de 1 an' && !trialFinished2 && !trialEnd2) {
          missing.push("Fin de période d'essai (Acq 2)");
          newErrors.push("trialEnd2");
        }
      }

      // Economics
      if (apport1 === undefined) { missing.push("Apport personnel"); newErrors.push("apport1"); }
      if (rfr1 === undefined) { missing.push("Revenu Fiscal de Référence (RFR)"); newErrors.push("rfr1"); }

      if (newErrors.length > 0) {
        setErrors(newErrors);
        alert("Veuillez compléter les informations suivantes : \n- " + missing.join("\n- "));
        return;
      }
    }
    if (step === 3) {
      // Charges are usually optional but let's keep it simple for now as not requested explicitly
    }

    setErrors([]);
    setStep(step + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (situation === "single") {
      setMaritalStatus("Célibataire");
    } else if (maritalStatus === "Célibataire") {
      setMaritalStatus("Marié(e)");
    }
  }, [situation]);

  const handleFinalSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isZoneVerified) {
      alert("Veuillez vérifier et confirmer votre zone de financement avant de continuer.");
      return;
    }

    const missing = [];
    const newErrors = [];
    if (!dept) { missing.push("Département"); newErrors.push("dept"); }
    if (!city) { missing.push("Ville"); newErrors.push("city"); }
    if (!propertyType) { missing.push("Type de bien"); newErrors.push("propertyType"); }
    if (!rooms) { missing.push("Nombre de pièces"); newErrors.push("rooms"); }
    if (!floor) { missing.push("Étage"); newErrors.push("floor"); }
    if (!deliveryYear) { missing.push("Année de livraison"); newErrors.push("deliveryYear"); }
    if (!deliveryQuarter) { missing.push("Trimestre de livraison"); newErrors.push("deliveryQuarter"); }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      alert("Veuillez remplir vos préférences de logement manquantes : \n- " + missing.join("\n- "));
      return;
    }
    setErrors([]);
    const ageNum1 = parseInt(age1) || 0;
    const ageNum2 = situation === "couple" ? (parseInt(age2) || 0) : 0;
    const maxAge = Math.max(ageNum1, ageNum2);
    
    const durationYears = 25;
    const interestRate = getRateForDuration(durationYears, marketRates);

    const data = {
      clientName: "Simulation Immobilier",
      isCouple: situation === "couple",
      children: parseInt(children) || 0,
      age1: ageNum1,
      age2: ageNum2,
      maritalStatus: maritalStatus,
      maxAge: maxAge,
      durationYears: durationYears,
      interestRate: interestRate,
      rev1Net,
      rev1Months,
      rev1Other,
      rev2Net,
      rev2Months,
      rev2Other,
      rev1: { net: Math.round(((rev1Net || 0) * rev1Months) / 12), other: rev1Other, rental: rev1Rental, pension: rev1Pension },
      rev2: { net: Math.round(((rev2Net || 0) * rev2Months) / 12), other: rev2Other, rental: rev2Rental, pension: rev2Pension },
      contractType1,
      contractType2,
      seniority1,
      trialFinished1,
      trialEnd1,
      seniority2,
      trialFinished2,
      trialEnd2,
      apport1: apport1 || 0,
      apport2: apport2 || 0,
      apport: (apport1 || 0) + (apport2 || 0),
      rfr1: rfr1 || 0,
      rfr2: rfr2 || 0,
      rfr: (rfr1 || 0) + (rfr2 || 0),
      chargesConso,
      chargesImmo,
      chargesPension,
      existingCreditMonthly: chargesConso + chargesImmo + chargesPension,
      housingStatus: housingStatus,
      primo: primo,
      nonOwnerDuration,
      wasPrimaryOwnerBefore,
      zone: zone,
      propertyType: propertyType,
      rooms: rooms,
      hasParking: hasParking,
      hasExterior: hasExterior,
      floor: floor,
      deliveryYear: deliveryYear,
      deliveryQuarter: deliveryQuarter,
      dept: dept,
      city: city,
      // Default or calculated values for other fields
      mode: 'neuf' as const
    };
    navigate('/results', { state: data });
  };

  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto min-h-[calc(100vh-76px)] bg-white">
      {/* SideNavBar */}
      <aside className="hidden md:flex flex-col p-6 gap-4 h-full w-64 border-r border-gray-100 bg-gray-50/50">
        <div className="mb-8">
          <h2 className="text-primary font-bold text-lg">Simulateur de Prêt</h2>
          <p className="text-gray-500 text-sm">Étape {step} sur 4</p>
        </div>
        <nav className="flex flex-col gap-2">
          <button 
            onClick={() => step > 1 && setStep(1)}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all w-full text-left ${step === 1 ? "bg-primary/10 text-primary font-bold" : step > 1 ? "text-primary hover:bg-primary/5" : "text-gray-500 opacity-60"}`}
          >
            <User size={20} className={step === 1 ? "fill-primary/20" : ""} />
            <span>Identité</span>
            {step > 1 && <CheckCircle2 size={16} className="ml-auto" />}
          </button>
          <button 
            onClick={() => step > 2 && setStep(2)}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all w-full text-left ${step === 2 ? "bg-primary/10 text-primary font-bold" : step > 2 ? "text-primary hover:bg-primary/5" : "text-gray-500 opacity-60"}`}
          >
            <Wallet size={20} className={step === 2 ? "fill-primary/20" : ""} />
            <span>Revenus</span>
            {step > 2 && <CheckCircle2 size={16} className="ml-auto" />}
          </button>
          <button 
            onClick={() => step > 3 && setStep(3)}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all w-full text-left ${step === 3 ? "bg-primary/10 text-primary font-bold" : step > 3 ? "text-primary hover:bg-primary/5" : "text-gray-500 opacity-60"}`}
          >
            <ReceiptText size={20} className={step === 3 ? "fill-primary/20" : ""} />
            <span>Charges</span>
            {step > 3 && <CheckCircle2 size={16} className="ml-auto" />}
          </button>
          <button 
            onClick={() => step > 4 && setStep(4)}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all w-full text-left ${step === 4 ? "bg-primary/10 text-primary font-bold" : step > 4 ? "text-primary hover:bg-primary/5" : "text-gray-500 opacity-60"}`}
          >
            <Home size={20} className={step === 4 ? "fill-primary/20" : ""} />
            <span>Projet</span>
            {step > 4 && <CheckCircle2 size={16} className="ml-auto" />}
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 lg:p-16 bg-white overflow-y-auto pb-32 md:pb-16 relative">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto"
            >
              <header className="mb-12">
                <span className="text-primary font-bold tracking-widest uppercase text-xs mb-2 block">Informations personnelles</span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight leading-tight">Dites-nous en plus sur vous.</h1>
                <p className="text-on-surface-variant mt-4 text-lg">Nous avons besoin de quelques détails pour adapter les meilleures options de financement à votre futur projet immobilier.</p>
              </header>

              <form className="space-y-12" onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
                <section>
                  <h3 className="text-xl font-bold mb-6 text-on-surface flex items-center gap-2">
                    <CheckCircle2 size={20} className="text-primary" /> Est-ce votre premier achat immobilier ?
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      type="button"
                      onClick={() => setPrimo("yes")}
                      className={`relative flex flex-col items-center justify-center p-6 rounded-xl transition-all border-2 ${primo === "yes" ? "border-primary bg-primary/5" : "border-gray-100 bg-white hover:bg-gray-50"}`}
                    >
                      <CheckCircle2 size={32} className={`mb-2 ${primo === "yes" ? "text-primary fill-primary/10" : "text-gray-300"}`} />
                      <span className="font-bold text-on-surface">Oui</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm text-on-surface-variant">Primo-accédant</span>
                        <div className="group relative">
                          <HelpCircle size={14} className="text-gray-400 cursor-help transition-colors hover:text-primary" />
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-72 p-4 bg-gray-900 text-white text-[11px] font-medium leading-relaxed rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none italic serif">
                            Un primo-accédant désigne toute personne ou ménage qui achète un bien immobilier pour la première fois en tant que résidence principale. Ce statut s'applique également aux personnes n'ayant pas été propriétaires de leur résidence principale durant les 24 derniers mois. Cette définition permet ainsi à des anciens propriétaires de redevenir primo-accédants après une période locative de deux ans minimum.
                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-8 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </div>
                    </button>
                    <button 
                      type="button"
                      onClick={() => setPrimo("no")}
                      className={`relative flex flex-col items-center justify-center p-6 rounded-xl transition-all border-2 ${primo === "no" ? "border-primary bg-primary/5" : "border-gray-100 bg-white hover:bg-gray-50"}`}
                    >
                      <History size={32} className={`mb-2 ${primo === "no" ? "text-primary fill-primary/10" : "text-gray-300"}`} />
                      <span className="font-bold text-on-surface">Non</span>
                      <span className="text-sm text-on-surface-variant">Déjà propriétaire</span>
                    </button>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-bold mb-6 text-on-surface flex items-center gap-2">
                    <Home size={20} className="text-primary" /> Situation de votre résidence principale
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {[
                      { id: "locataire", label: "Locataire", sub: "Titulaire du bail", icon: Home },
                      { id: "proprietaire", label: "Propriétaire", sub: "Prêt en cours ou soldé", icon: ShieldCheck },
                      { id: "heberge", label: "Hébergé", sub: "À titre gratuit", icon: Heart },
                      { id: "fonction", label: "Logement de fonction", sub: "Via votre employeur", icon: Briefcase }
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setHousingStatus(item.id as any);
                            if (item.id === "proprietaire") {
                              setPrimo("no");
                              setNonOwnerDuration(null);
                              setWasPrimaryOwnerBefore(null);
                            } else {
                              // Reset sub-questions if status changes
                              setNonOwnerDuration(null);
                              setWasPrimaryOwnerBefore(null);
                            }
                          }}
                          className={`relative flex items-center p-5 rounded-xl transition-all border-2 ${housingStatus === item.id ? 'bg-primary/5 border-primary shadow-sm' : 'bg-white border-gray-100 hover:border-primary/20'}`}
                        >
                          <div className={`w-12 h-12 flex items-center justify-center rounded-full mr-4 ${housingStatus === item.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                            <Icon size={24} />
                          </div>
                          <div className="text-left">
                            <span className="block font-bold text-on-surface leading-tight">{item.label}</span>
                            <span className="text-xs text-gray-400 font-medium">{item.sub}</span>
                          </div>
                          {housingStatus === item.id && <div className="absolute top-2 right-2 h-2 w-2 bg-primary rounded-full" />}
                        </button>
                      );
                    })}
                  </div>

                  <AnimatePresence>
                    {(primo === "no" && housingStatus !== "proprietaire") && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-8 space-y-6 overflow-hidden"
                      >
                        <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 space-y-6">
                          <h4 className="text-sm font-black uppercase tracking-widest text-gray-900 flex items-center gap-2">
                            <Clock size={16} className="text-primary" /> 
                            Depuis quand n'êtes-vous plus propriétaire de votre résidence principale ?
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            <button
                              type="button"
                              onClick={() => {
                                setNonOwnerDuration("moreThan2Years");
                                setPrimo("yes"); // Eligible to PTZ based on 2-year rule
                              }}
                              className={`p-4 rounded-xl border-2 transition-all font-bold text-sm ${nonOwnerDuration === "moreThan2Years" ? "border-primary bg-primary/5 text-primary" : "border-white bg-white text-gray-500 hover:border-gray-200"}`}
                            >
                              Plus de 2 ans
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setNonOwnerDuration("lessThan2Years");
                                setPrimo("no"); // Not necessarily eligible yet
                              }}
                              className={`p-4 rounded-xl border-2 transition-all font-bold text-sm ${nonOwnerDuration === "lessThan2Years" ? "border-primary bg-primary/5 text-primary" : "border-white bg-white text-gray-500 hover:border-gray-200"}`}
                            >
                              Moins de 2 ans
                            </button>
                          </div>

                          <AnimatePresence>
                            {nonOwnerDuration === "lessThan2Years" && (
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-4 pt-4 border-t border-gray-200"
                              >
                                <p className="text-xs font-bold text-gray-900">Étiez-vous propriétaire de votre résidence principale avant cette période ?</p>
                                <div className="grid grid-cols-2 gap-4">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setWasPrimaryOwnerBefore("yes");
                                      setPrimo("no");
                                    }}
                                    className={`p-4 rounded-xl border-2 transition-all font-bold text-sm ${wasPrimaryOwnerBefore === "yes" ? "border-primary bg-primary/5 text-primary" : "border-white bg-white text-gray-500 hover:border-gray-200"}`}
                                  >
                                    Oui
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setWasPrimaryOwnerBefore("no");
                                      setPrimo("yes"); // Eligible if they weren't owners before neither (e.g. they only owned rental properties)
                                    }}
                                    className={`p-4 rounded-xl border-2 transition-all font-bold text-sm ${wasPrimaryOwnerBefore === "no" ? "border-primary bg-primary/5 text-primary" : "border-white bg-white text-gray-500 hover:border-gray-200"}`}
                                  >
                                    Non
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {housingStatus === "proprietaire" && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded-2xl mt-6 shadow-sm ring-1 ring-amber-500/10"
                    >
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                          <AlertTriangle className="text-amber-600" size={20} />
                        </div>
                        <div className="space-y-1">
                          <p className="text-[11px] font-black uppercase tracking-widest text-amber-600">Information PTZ</p>
                          <p className="text-xs text-amber-800 font-bold leading-relaxed">
                            À partir d'avril 2025, le PTZ est ouvert aux maisons individuelles neuves sur tout le territoire pour les primo-accédants (n'ayant pas été propriétaires depuis 2 ans).
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </section>


                <section>
                  <h3 className="text-xl font-bold mb-6 text-on-surface flex items-center gap-2">
                    <Heart size={20} className="text-primary" /> Situation familiale
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button 
                      type="button"
                      onClick={() => setSituation("single")}
                      className={`relative flex items-center p-5 rounded-xl transition-all border-2 ${situation === "single" ? "border-primary bg-primary/5" : "border-gray-100 bg-white hover:bg-gray-50"}`}
                    >
                      <div className={`w-12 h-12 flex items-center justify-center rounded-full mr-4 ${situation === "single" ? "bg-primary text-white" : "bg-gray-100 text-gray-400"}`}>
                        <User size={24} />
                      </div>
                      <div className="text-left">
                        <span className="block font-bold text-on-surface">Célibataire</span>
                        <span className="text-sm text-on-surface-variant">Emprunteur seul</span>
                      </div>
                    </button>
                    <button 
                      type="button"
                      onClick={() => setSituation("couple")}
                      className={`relative flex items-center p-5 rounded-xl transition-all border-2 ${situation === "couple" ? "border-primary bg-primary/5" : "border-gray-100 bg-white hover:bg-gray-50"}`}
                    >
                      <div className={`w-12 h-12 flex items-center justify-center rounded-full mr-4 ${situation === "couple" ? "bg-primary text-white" : "bg-gray-100 text-gray-400"}`}>
                        <Heart size={24} />
                      </div>
                      <div className="text-left">
                        <span className="block font-bold text-on-surface">En couple</span>
                        <span className="text-sm text-on-surface-variant">Co-emprunteur</span>
                      </div>
                    </button>
                  </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <section>
                    <label className="block text-xl font-bold mb-4 text-on-surface flex items-center gap-2 uppercase text-xs tracking-widest">
                      Régime patrimonial <MandatoryDot />
                    </label>
                    <div className="relative">
                      <select 
                        value={maritalStatus}
                        onChange={(e) => handleFieldChange("maritalStatus", setMaritalStatus, e.target.value)}
                        className={`w-full p-5 bg-gray-50 border-2 ${errors.includes("maritalStatus") ? 'border-red-500' : 'border-transparent'} rounded-xl text-lg font-semibold focus:ring-2 focus:ring-primary/20 outline-none appearance-none cursor-pointer`}
                      >
                        <option value="">Sélectionnez</option>
                        <option value="Célibataire">Célibataire</option>
                        <option value="Marié(e)">Marié(e)</option>
                        <option value="Pacsé(e)">Pacsé(e)</option>
                        <option value="Séparé(e)">Séparé(e)</option>
                        <option value="Divorcé(e)">Divorcé(e)</option>
                        <option value="Union libre">Union libre</option>
                      </select>
                      <ChevronDown size={24} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                    </div>
                  </section>
                  <section>
                    <label className="block text-xl font-bold mb-4 text-on-surface flex items-center gap-2 uppercase text-xs tracking-widest">
                      NOMBRE D'ENFANT A CHARGE <MandatoryDot />
                    </label>
                    <div className="relative">
                      <select 
                        value={children}
                        onChange={(e) => handleFieldChange("children", setChildren, e.target.value)}
                        className={`w-full p-5 bg-gray-50 border-2 ${errors.includes("children") ? 'border-red-500' : 'border-transparent'} rounded-xl text-lg font-semibold focus:ring-2 focus:ring-primary/20 outline-none appearance-none cursor-pointer`}
                      >
                        <option value="">Sélectionnez</option>
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4+">4+</option>
                      </select>
                      <ChevronDown size={24} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                    </div>
                  </section>
                  <section>
                    <label className="block text-xl font-bold mb-4 text-on-surface flex items-center gap-2 uppercase text-xs tracking-widest">
                      Âge de l'emprunteur <MandatoryDot />
                    </label>
                    <div className="relative">
                      <input 
                        type="number" 
                        placeholder="ex: 32" 
                        value={age1}
                        onChange={(e) => handleFieldChange("age1", setAge1, e.target.value)}
                        className={`w-full p-5 bg-gray-50 border-2 ${errors.includes("age1") ? 'border-red-500' : 'border-transparent'} rounded-xl text-lg font-semibold focus:ring-2 focus:ring-primary/20 outline-none`} 
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">ans</span>
                    </div>
                  </section>
                </div>

                {situation === "couple" && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <section>
                      <label className="block text-xl font-bold mb-4 text-on-surface flex items-center gap-2 uppercase text-xs tracking-widest">
                        Âge du co-emprunteur <MandatoryDot />
                      </label>
                      <div className="relative">
                        <input 
                          type="number" 
                          placeholder="ex: 30" 
                          value={age2}
                          onChange={(e) => handleFieldChange("age2", setAge2, e.target.value)}
                          className={`w-full p-5 bg-gray-50 border-2 ${errors.includes("age2") ? 'border-red-500' : 'border-transparent'} rounded-xl text-lg font-semibold focus:ring-2 focus:ring-primary/20 outline-none`} 
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">ans</span>
                      </div>
                    </section>
                  </motion.div>
                )}

                <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4 text-on-surface-variant/60 max-w-sm text-left">
                    <Shield size={24} className="text-primary flex-shrink-0" />
                    <span className="text-xs">Vos données sont cryptées et sécurisées selon la conformité RGPD.</span>
                  </div>
                  <button 
                    type="submit"
                    className="w-full md:w-auto px-12 py-5 bg-primary text-white rounded-xl font-bold text-lg shadow-xl shadow-primary/10 hover:brightness-110 active:scale-95 transition-all"
                  >
                    Étape suivante
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-3xl mx-auto"
            >
              <header className="mb-12">
                <span className="text-primary font-bold tracking-widest text-xs uppercase">Santé financière</span>
                <h1 className="text-4xl font-extrabold text-on-surface tracking-tight mt-2">Revenus & Ressources</h1>
                <p className="text-on-surface-variant mt-4 text-lg leading-relaxed max-w-xl">
                  Pour fournir une simulation précise, nous avons besoin de comprendre vos revenus actuels. Ces données sont cryptées et utilisées uniquement pour votre calcul de prêt.
                </p>
              </header>

              <form className="space-y-12" onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
                {/* Situation professionnelle */}
                <section>
                  <div className="flex items-center gap-2 mb-6">
                    <Briefcase size={20} className="text-primary fill-primary/10" />
                    <h3 className="text-xl font-bold">Situation professionnelle {situation === "couple" && "- Acquéreur 1"}</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-on-surface-variant flex items-center justify-between">
                        <span>Type de contrat <MandatoryDot /></span>
                        <Info size={14} className="text-gray-400 cursor-help" title="Le CDI est privilégié par les banques" />
                      </label>
                      <div className="relative">
                        <select 
                          value={contractType1}
                          onChange={(e) => handleFieldChange("contractType1", setContractType1, e.target.value)}
                          className={`w-full p-4 bg-white border ${errors.includes("contractType1") ? 'border-red-500' : 'border-gray-100'} rounded-xl focus:ring-2 focus:ring-primary/10 text-on-surface shadow-sm appearance-none outline-none`}
                        >
                          <option value="">Sélectionnez</option>
                          <option>CDI</option>
                          <option>CDD</option>
                          <option>Intérim / Freelance</option>
                          <option>Secteur Public</option>
                        </select>
                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                      {(contractType1 === "CDD" || contractType1 === "Intérim / Freelance") && (
                        <p className="text-[11px] font-bold text-red-600 mt-1 uppercase tracking-tight">
                           Les banques demandent généralement 3 ans d'ancienneté
                        </p>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-on-surface-variant flex items-center justify-between">
                          <span>Ancienneté dans l'entreprise <MandatoryDot /></span>
                          <Info size={14} className="text-gray-400 cursor-help" title="Depuis votre date d'embauche" />
                        </label>
                        <div className="relative">
                          <select 
                            value={seniority1}
                            onChange={(e) => {
                              handleFieldChange("seniority1", setSeniority1, e.target.value);
                              if (e.target.value !== 'Moins de 1 an') {
                                setTrialFinished1(false);
                                setTrialEnd1("");
                              }
                            }}
                            className={`w-full p-4 bg-white border ${errors.includes("seniority1") ? 'border-red-500' : 'border-gray-100'} rounded-xl focus:ring-2 focus:ring-primary/10 text-on-surface shadow-sm appearance-none outline-none`}
                          >
                            <option value="">Sélectionnez</option>
                            <option>Moins de 1 an</option>
                            <option>1 an</option>
                            <option>2 ans</option>
                            <option>3 ans</option>
                            <option>4 ans et +</option>
                          </select>
                          <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                      </div>

                      <AnimatePresence>
                        {seniority1 === "Moins de 1 an" && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden space-y-4 pt-2"
                          >
                            <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10">
                              <input 
                                type="checkbox" 
                                id="trial1"
                                checked={trialFinished1}
                                onChange={(e) => {
                                  setTrialFinished1(e.target.checked);
                                  if (e.target.checked) setTrialEnd1("");
                                }}
                                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                              />
                              <label htmlFor="trial1" className="text-sm font-medium text-on-surface cursor-pointer">
                                Période d'essai finie ?
                              </label>
                            </div>

                            {!trialFinished1 && (
                              <div className="space-y-2">
                                <label className="text-sm font-semibold text-on-surface-variant">Quand se termine la période d'essai ? <MandatoryDot /></label>
                                <div className="relative">
                                  <select 
                                    value={trialEnd1}
                                    onChange={(e) => handleFieldChange("trialEnd1", setTrialEnd1, e.target.value)}
                                    className={`w-full p-4 bg-white border ${errors.includes("trialEnd1") ? 'border-red-500' : 'border-gray-100'} rounded-xl focus:ring-2 focus:ring-primary/10 text-on-surface shadow-sm appearance-none outline-none`}
                                  >
                                    <option value="">Sélectionnez</option>
                                    {[1, 2, 3, 4, 5, 6].map(m => (
                                      <option key={m} value={m}>{m} mois</option>
                                    ))}
                                  </select>
                                  <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </section>

                {situation === "couple" && (
                  <section>
                    <div className="flex items-center gap-2 mb-6">
                      <Briefcase size={20} className="text-primary fill-primary/10" />
                      <h3 className="text-xl font-bold">Situation professionnelle - Acquéreur 2</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-on-surface-variant flex items-center justify-between">
                          <span>Type de contrat <MandatoryDot /></span>
                          <Info size={14} className="text-gray-400 cursor-help" title="Le CDI est privilégié par les banques" />
                        </label>
                        <div className="relative">
                          <select 
                            value={contractType2}
                            onChange={(e) => handleFieldChange("contractType2", setContractType2, e.target.value)}
                            className={`w-full p-4 bg-white border ${errors.includes("contractType2") ? 'border-red-500' : 'border-gray-100'} rounded-xl focus:ring-2 focus:ring-primary/10 text-on-surface shadow-sm appearance-none outline-none`}
                          >
                            <option value="">Sélectionnez</option>
                            <option>CDI</option>
                            <option>CDD</option>
                            <option>Intérim / Freelance</option>
                            <option>Secteur Public</option>
                          </select>
                          <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                        {(contractType2 === "CDD" || contractType2 === "Intérim / Freelance") && (
                          <p className="text-[11px] font-bold text-red-600 mt-1 uppercase tracking-tight">
                             Les banques demandent généralement 3 ans d'ancienneté
                          </p>
                        )}
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-on-surface-variant flex items-center justify-between">
                            <span>Ancienneté dans l'entreprise <MandatoryDot /></span>
                            <Info size={14} className="text-gray-400 cursor-help" title="Depuis votre date d'embauche" />
                          </label>
                          <div className="relative">
                            <select 
                              value={seniority2}
                              onChange={(e) => {
                                handleFieldChange("seniority2", setSeniority2, e.target.value);
                                if (e.target.value !== 'Moins de 1 an') {
                                  setTrialFinished2(false);
                                  setTrialEnd2("");
                                }
                              }}
                              className={`w-full p-4 bg-white border ${errors.includes("seniority2") ? 'border-red-500' : 'border-gray-100'} rounded-xl focus:ring-2 focus:ring-primary/10 text-on-surface shadow-sm appearance-none outline-none`}
                            >
                              <option value="">Sélectionnez</option>
                              <option>Moins de 1 an</option>
                              <option>1 an</option>
                              <option>2 ans</option>
                              <option>3 ans</option>
                              <option>4 ans et +</option>
                            </select>
                            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                          </div>
                        </div>

                        <AnimatePresence>
                          {seniority2 === "Moins de 1 an" && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden space-y-4 pt-2"
                            >
                              <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10">
                                <input 
                                  type="checkbox" 
                                  id="trial2"
                                  checked={trialFinished2}
                                  onChange={(e) => {
                                    setTrialFinished2(e.target.checked);
                                    if (e.target.checked) setTrialEnd2("");
                                  }}
                                  className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <label htmlFor="trial2" className="text-sm font-medium text-on-surface cursor-pointer">
                                  Période d'essai finie ?
                                </label>
                              </div>

                              {!trialFinished2 && (
                                <div className="space-y-2">
                                  <label className="text-sm font-semibold text-on-surface-variant">Quand se termine la période d'essai ? <MandatoryDot /></label>
                                  <div className="relative">
                                    <select 
                                      value={trialEnd2}
                                      onChange={(e) => handleFieldChange("trialEnd2", setTrialEnd2, e.target.value)}
                                      className={`w-full p-4 bg-white border ${errors.includes("trialEnd2") ? 'border-red-500' : 'border-gray-100'} rounded-xl focus:ring-2 focus:ring-primary/10 text-on-surface shadow-sm appearance-none outline-none`}
                                    >
                                      <option value="">Sélectionnez</option>
                                      {[1, 2, 3, 4, 5, 6].map(m => (
                                        <option key={m} value={m}>{m} mois</option>
                                      ))}
                                    </select>
                                    <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </section>
                )}

                {/* Revenus principaux */}
                <section className="p-8 bg-gray-50 rounded-3xl border border-gray-100">
                <div className="flex items-center justify-between gap-2 mb-6">
                  <div className="flex items-center gap-2">
                    <Banknote size={20} className="text-primary fill-primary/10" />
                    <h3 className="text-xl font-bold">Revenus principaux</h3>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => {
                      setRev1Net(0); setRev2Net(0); 
                      setApport1(0); setApport2(0); 
                      setRfr1(0); setRfr2(0);
                      setRev1Other(0); setRev1Rental(0); setRev1Pension(0);
                      setRev2Other(0); setRev2Rental(0); setRev2Pension(0);
                      setSeniority1(""); setSeniority2("");
                      setTrialFinished1(false); setTrialEnd1("");
                      setTrialFinished2(false); setTrialEnd2("");
                    }}
                    className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-primary transition-all flex items-center gap-1.5"
                  >
                    <RotateCcw size={12} /> Réinitialiser
                  </button>
                </div>
                  <div className="grid grid-cols-1 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-on-surface-variant flex items-center justify-between">
                        <span>Salaire mensuel net (avant impôts) - Acquéreur 1 <MandatoryDot /></span>
                        <Info size={14} className="text-gray-400 cursor-help" />
                      </label>
                      <div className="relative">
                         <input 
                          className={`w-full p-6 text-2xl font-bold bg-white border ${errors.includes("rev1Net") ? 'border-red-500' : 'border-gray-100'} rounded-2xl focus:ring-2 focus:ring-primary/20 text-primary outline-none`} 
                          placeholder="3 500" 
                          type="number" 
                          value={rev1Net === undefined ? '' : rev1Net}
                          onChange={(e) => handleFieldChange("rev1Net", setRev1Net, e.target.value === '' ? undefined : Number(e.target.value))}
                        />
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-300">€</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-on-surface-variant">
                        Vous êtes payé sur combien de mois ? (Acquéreur 1) <MandatoryDot />
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {[12, 13, 14].map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setRev1Months(m)}
                            className={`p-4 rounded-xl border-2 transition-all font-bold text-sm ${rev1Months === m ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 bg-white text-gray-500 hover:border-primary/20'}`}
                          >
                            {m} mois
                          </button>
                        ))}
                      </div>
                      {rev1Months > 12 && (
                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-start gap-3">
                          <Info size={16} className="text-primary shrink-0 mt-0.5" />
                          <p className="text-[11px] text-primary font-medium leading-relaxed italic">
                            Le salaire retenu pour la simulation est calculé sur 12 mois pour correspondre aux normes bancaires. <br />
                            <span className="font-bold">Salaire lissé : {Math.round((rev1Net * rev1Months) / 12)}€ / mois.</span>
                          </p>
                        </div>
                      )}
                    </div>

                    {situation === "couple" && (
                      <>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-on-surface-variant flex items-center justify-between">
                            <span>Salaire mensuel net - Acquéreur 2 <MandatoryDot /></span>
                            <Info size={14} className="text-gray-400 cursor-help" />
                          </label>
                          <div className="relative">
                             <input 
                              className={`w-full p-6 text-2xl font-bold bg-white border ${errors.includes("rev2Net") ? 'border-red-500' : 'border-gray-100'} rounded-2xl focus:ring-2 focus:ring-primary/20 text-primary outline-none`} 
                              placeholder="2 500" 
                              type="number" 
                              value={rev2Net === undefined ? '' : rev2Net}
                              onChange={(e) => handleFieldChange("rev2Net", setRev2Net, e.target.value === '' ? undefined : Number(e.target.value))}
                            />
                            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-300">€</span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="text-sm font-semibold text-on-surface-variant">
                            Vous êtes payé sur combien de mois ? (Acquéreur 2) <MandatoryDot />
                          </label>
                          <div className="grid grid-cols-3 gap-3">
                            {[12, 13, 14].map((m) => (
                              <button
                                key={m}
                                type="button"
                                onClick={() => setRev2Months(m)}
                                className={`p-4 rounded-xl border-2 transition-all font-bold text-sm ${rev2Months === m ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 bg-white text-gray-500 hover:border-primary/20'}`}
                              >
                                {m} mois
                              </button>
                            ))}
                          </div>
                          {rev2Months > 12 && (
                            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-start gap-3">
                              <Info size={16} className="text-primary shrink-0 mt-0.5" />
                              <p className="text-[11px] text-primary font-medium leading-relaxed italic">
                                Salaire retenu pour la simulation (lissé sur 12 mois) : <span className="font-bold">{Math.round((rev2Net * rev2Months) / 12)}€ / mois.</span>
                              </p>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </section>

                {/* Apport & RFR per acquirer */}
                <section className="p-8 bg-primary/5 rounded-3xl border border-primary/10">
                  <div className="flex items-center gap-2 mb-6">
                    <ReceiptText size={20} className="text-primary fill-primary/10" />
                    <h3 className="text-xl font-bold">Apport & Fiscalité</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Apport */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-on-surface-variant flex items-center gap-1">
                          Apport personnel (Total) <MandatoryDot />
                        </label>
                        <div className="relative">
                         <input 
                            className={`w-full p-4 bg-white border ${errors.includes("apport1") ? 'border-red-500' : 'border-gray-100'} rounded-xl focus:ring-2 focus:ring-primary/10 text-on-surface shadow-sm outline-none font-bold`} 
                            type="number" 
                            placeholder="Ex: 20 000"
                            value={apport1 === undefined ? '' : apport1}
                            onChange={(e) => handleFieldChange("apport1", setApport1, e.target.value === '' ? undefined : Number(e.target.value))}
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">€</span>
                        </div>
                      </div>
                      {situation === "couple" && (
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-on-surface-variant">Apport personnel (Acq 2)</label>
                          <div className="relative">
                            <input 
                              className="w-full p-4 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/10 text-on-surface shadow-sm outline-none font-bold" 
                              type="number" 
                              value={apport2 || ''}
                              onChange={(e) => setApport2(Number(e.target.value))}
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">€</span>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* RFR */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-on-surface-variant flex items-center justify-between">
                          <span>RFR (Dernier avis) <MandatoryDot /></span>
                          <Info size={14} className="text-gray-400 cursor-help" title="Revenu Fiscal de Référence" />
                        </label>
                        <div className="relative">
                          <input 
                            className={`w-full p-4 bg-white border ${errors.includes("rfr1") ? 'border-red-500' : 'border-gray-100'} rounded-xl focus:ring-2 focus:ring-primary/10 text-on-surface shadow-sm outline-none font-bold`} 
                            type="number" 
                            placeholder="Ex: 35 000"
                            value={rfr1 === undefined ? '' : rfr1}
                            onChange={(e) => handleFieldChange("rfr1", setRfr1, e.target.value === '' ? undefined : Number(e.target.value))}
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">€</span>
                        </div>
                      </div>
                      {situation === "couple" && (
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-on-surface-variant flex items-center justify-between">
                            RFR (Dernier avis) - Acq 2
                            <Info size={14} className="text-gray-400 cursor-help" />
                          </label>
                          <div className="relative">
                            <input 
                              className="w-full p-4 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/10 text-on-surface shadow-sm outline-none font-bold" 
                              type="number" 
                              value={rfr2 || ''}
                              onChange={(e) => setRfr2(Number(e.target.value))}
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">€</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                {/* Ressources complémentaires */}
                <section>
                  <div className="flex items-center gap-2 mb-6">
                    <PlusCircle size={20} className="text-primary fill-primary/10" />
                    <h3 className="text-xl font-bold">Ressources complémentaires</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Colonne Acquéreur 1 */}
                    <div className="space-y-6">
                      {situation === "couple" && <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-2 px-1">Acquéreur 1</h4>}
                      
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-on-surface-variant">Autres revenus (Acq 1)</label>
                        <div className="relative">
                          <input 
                            className="w-full p-4 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/10 text-on-surface shadow-sm outline-none" 
                            placeholder="0" 
                            type="number" 
                            value={rev1Other || ''}
                            onChange={(e) => setRev1Other(Number(e.target.value))}
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">€</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-on-surface-variant">Revenus fonciers (Acq 1)</label>
                        <div className="relative">
                          <input 
                            className="w-full p-4 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/10 text-on-surface shadow-sm outline-none" 
                            placeholder="0" 
                            type="number" 
                            value={rev1Rental || ''}
                            onChange={(e) => setRev1Rental(Number(e.target.value))}
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">€</span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1 italic">Retenu à 70% soit : {Math.round(rev1Rental * 0.7)} €</p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-on-surface-variant">Pension alimentaire reçue (Acq 1)</label>
                        <div className="relative">
                          <input 
                            className="w-full p-4 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/10 text-on-surface shadow-sm outline-none" 
                            placeholder="0" 
                            type="number" 
                            value={rev1Pension || ''}
                            onChange={(e) => setRev1Pension(Number(e.target.value))}
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">€</span>
                        </div>
                        {rev1Pension > 0 && (
                          <p className="text-[10px] font-bold text-red-600 mt-1 uppercase tracking-tight">
                             Attention à l'âge de vos enfants
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Colonne Acquéreur 2 */}
                    {situation === "couple" && (
                      <div className="space-y-6">
                        <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-2 px-1">Acquéreur 2</h4>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-on-surface-variant">Autres revenus (Acq 2)</label>
                          <div className="relative">
                            <input 
                              className="w-full p-4 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/10 text-on-surface shadow-sm outline-none" 
                              placeholder="0" 
                              type="number" 
                              value={rev2Other || ''}
                              onChange={(e) => setRev2Other(Number(e.target.value))}
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">€</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-on-surface-variant">Revenus fonciers (Acq 2)</label>
                          <div className="relative">
                            <input 
                              className="w-full p-4 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/10 text-on-surface shadow-sm outline-none" 
                              placeholder="0" 
                              type="number" 
                              value={rev2Rental || ''}
                              onChange={(e) => setRev2Rental(Number(e.target.value))}
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">€</span>
                          </div>
                          <p className="text-[10px] text-gray-400 mt-1 italic">Retenu à 70% soit : {Math.round(rev2Rental * 0.7)} €</p>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-on-surface-variant">Pension alimentaire reçue (Acq 2)</label>
                          <div className="relative">
                            <input 
                              className="w-full p-4 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/10 text-on-surface shadow-sm outline-none" 
                              placeholder="0" 
                              type="number" 
                              value={rev2Pension || ''}
                              onChange={(e) => setRev2Pension(Number(e.target.value))}
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">€</span>
                          </div>
                          {rev2Pension > 0 && (
                            <p className="text-[10px] font-bold text-red-600 mt-1 uppercase tracking-tight">
                               Attention à l'âge de vos enfants
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                <div className="mt-16 pt-8 border-t border-gray-100 flex items-center justify-between">
                  <button 
                    type="button" 
                    onClick={prevStep}
                    className="flex items-center gap-2 px-8 py-4 text-gray-500 font-semibold hover:bg-gray-50 rounded-xl transition-all"
                  >
                    <ArrowLeft size={20} /> Retour
                  </button>
                  <button 
                    type="submit"
                    className="flex items-center gap-2 px-10 py-4 bg-primary text-white font-bold rounded-xl shadow-xl hover:brightness-110 hover:-translate-y-1 transition-all"
                  >
                    Étape suivante <ArrowRight size={20} />
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="mb-12">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <span className="text-primary font-bold tracking-widest text-[10px] uppercase block mb-1">Santé Financière</span>
                    <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">Charges actuelles</h1>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => {
                      setChargesConso(0); setChargesImmo(0); setChargesPension(0);
                    }}
                    className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-primary transition-all flex items-center gap-1.5 mb-1"
                  >
                    <RotateCcw size={12} /> Réinitialiser
                  </button>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-3/4 rounded-full"></div>
                </div>
              </div>

              <form className="space-y-12" onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
                <div className="space-y-8">
                  <div className="group">
                    <label className="block mb-4">
                      <span className="text-sm font-semibold text-on-surface-variant flex items-center gap-2">
                        <Banknote size={18} className="text-primary" /> Mensualités de crédits conso
                      </span>
                    </label>
                    <div className="relative">
                      <input 
                        className="w-full bg-gray-50 border-0 rounded-xl p-6 text-2xl font-bold text-on-surface focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-200" 
                        placeholder="0.00" 
                        type="number" 
                        value={chargesConso || ''}
                        onChange={(e) => setChargesConso(Number(e.target.value))}
                      />
                      <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-200 font-headline text-xl">€</span>
                    </div>
                    <p className="mt-2 text-xs text-gray-500 italic">Incluez les prêts personnels, financements auto et crédits renouvelables.</p>
                  </div>

                  <div className="group">
                    <label className="block mb-4">
                      <span className="text-sm font-semibold text-on-surface-variant flex items-center gap-2">
                        <Home size={18} className="text-primary" /> Mensualités de crédits immo existants
                      </span>
                    </label>
                    <div className="relative">
                      <input 
                        className="w-full bg-gray-50 border-0 rounded-xl p-6 text-2xl font-bold text-on-surface focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-200" 
                        placeholder="0.00" 
                        type="number" 
                        value={chargesImmo || ''}
                        onChange={(e) => setChargesImmo(Number(e.target.value))}
                      />
                      <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-200 font-headline text-xl">€</span>
                    </div>
                    <p className="mt-2 text-xs text-gray-500 italic">Crédits en cours sur d'autres biens (locatif ou secondaire).</p>
                  </div>

                  <div className="group">
                    <label className="block mb-4">
                      <span className="text-sm font-semibold text-on-surface-variant flex items-center gap-2">
                        <User size={18} className="text-primary" /> Pension alimentaire versée
                      </span>
                    </label>
                    <div className="relative">
                      <input 
                        className="w-full bg-gray-50 border-0 rounded-xl p-6 text-2xl font-bold text-on-surface focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-200" 
                        placeholder="0.00" 
                        type="number" 
                        value={chargesPension || ''}
                        onChange={(e) => setChargesPension(Number(e.target.value))}
                      />
                      <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-200 font-headline text-xl">€</span>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/5 p-8 rounded-xl border border-primary/10">
                  <div className="text-left">
                    <p className="text-on-surface text-sm leading-relaxed">"La précision est essentielle. Des charges exactes nous aident à calculer correctement votre <span className="font-bold text-primary">taux d'endettement</span> pour que votre projet reste soutenable."</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-8">
                  <button type="button" onClick={prevStep} className="flex items-center gap-2 text-gray-500 font-semibold hover:text-on-surface transition-colors cursor-pointer">
                    <ArrowLeft size={20} /> Retour
                  </button>
                  <button type="submit" className="bg-primary hover:brightness-110 text-white px-12 py-4 rounded-xl font-bold text-lg transition-all transform hover:-translate-y-1 active:scale-95 shadow-lg shadow-primary/20">
                    Continuer vers le projet
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto"
            >
              <header className="mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight text-on-surface mb-4">Votre futur projet</h1>
                <p className="text-lg text-gray-500 leading-relaxed max-w-2xl">Dernière étape pour affiner votre recherche. Ces informations nous permettent de cibler les meilleures opportunités immobilières et bancaires pour vous.</p>
              </header>

              <form className="space-y-12" onSubmit={handleFinalSubmit}>
                <section>
                  <h3 className="text-xl font-bold mb-6 text-on-surface flex items-center gap-2">
                    <MapPin size={20} className="text-primary" /> Localisation du projet
                  </h3>
                  <p className="text-sm text-gray-500 mb-6 italic">La zone PTZ ({zone}) est automatiquement détectée selon votre ville pour optimiser votre financement.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Autocomplete 
                      label={<span>Département (N°) <MandatoryDot /></span>}
                      placeholder="Ex: 75, 13, 69..."
                      value={dept}
                      onChange={(val) => handleFieldChange("dept", setDept, val)}
                      onSelect={(val) => {
                        const code = val.split(' ')[0];
                        handleFieldChange("dept", setDept, code);
                      }}
                      suggestions={deptSuggestions}
                      error={errors.includes("dept")}
                    />
                    <Autocomplete 
                      label={<span>Ville <MandatoryDot /></span>}
                      placeholder="Ex: Paris, Lyon, Marseille..."
                      value={city}
                      onChange={(val) => handleFieldChange("city", setCity, val)}
                      isLoading={isSearchingCity}
                      suggestions={citySuggestions}
                      error={errors.includes("city")}
                    />
                  </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                    <label className="block text-sm font-semibold text-gray-500 mb-3 uppercase tracking-widest">
                       Type de bien <MandatoryDot />
                    </label>
                    <div className="relative">
                      <select 
                        value={propertyType}
                        onChange={(e) => handleFieldChange("propertyType", setPropertyType, e.target.value as 'appartement' | 'maison')}
                        className={`w-full px-4 py-4 bg-gray-50 border-2 ${errors.includes("propertyType") ? 'border-red-500' : 'border-transparent'} focus:ring-2 focus:ring-primary/20 rounded-xl text-lg font-medium appearance-none outline-none cursor-pointer`}
                      >
                        <option value="">Sélectionnez</option>
                        <option value="appartement">Appartement Collectif</option>
                        <option value="maison">Maison Individuelle</option>
                      </select>
                      <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </section>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-headline font-bold text-xl mb-6">Préférences du logement</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-4 uppercase tracking-wider">
                           Nombre de pièces <MandatoryDot />
                        </label>
                        <div className="relative">
                          <select 
                            value={rooms}
                            onChange={(e) => handleFieldChange("rooms", setRooms, e.target.value)}
                            className={`w-full px-4 py-2 bg-gray-50 border ${errors.includes("rooms") ? 'border-red-500' : 'border-gray-200'} rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 appearance-none outline-none cursor-pointer`}
                          >
                            <option value="">Sélectionnez</option>
                            <option>Studio</option>
                            <option>2 pièces</option>
                            <option>3 pièces</option>
                            <option>4 pièces</option>
                            <option>5 pièces et +</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-4 uppercase tracking-wider">
                          Étage souhaité <MandatoryDot />
                        </label>
                        <div className={`flex flex-wrap gap-2 p-1 rounded-xl ${errors.includes("floor") ? 'ring-2 ring-red-500' : ''}`}>
                          {["RDC", "Etage", "Dernier"].map((f) => (
                            <button
                              key={f}
                              type="button"
                              onClick={() => handleFieldChange("floor", setFloor, f)}
                              className={`px-4 py-2 rounded-full border transition-all text-sm font-medium ${floor === f ? "bg-primary text-white border-primary shadow-md" : "border-gray-200 text-gray-500 hover:border-primary"}`}
                            >
                              {f}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-4 uppercase tracking-wider">Extérieur & Parking</label>
                        <div className="space-y-4">
                          <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="w-6 h-6 rounded border-2 border-gray-200 group-hover:border-primary flex items-center justify-center transition-colors bg-white">
                              {hasExterior && <Check size={14} className="text-primary" />}
                            </div>
                            <input 
                              checked={hasExterior} 
                              onChange={(e) => setHasExterior(e.target.checked)}
                              type="checkbox" 
                              className="hidden" 
                            />
                            <span className="text-sm font-medium text-gray-700">Balcon / Terrasse / Jardin</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="w-6 h-6 rounded border-2 border-gray-100 group-hover:border-primary flex items-center justify-center transition-colors bg-white">
                              {hasParking && <Check size={14} className="text-primary" />}
                            </div>
                            <input 
                              checked={hasParking}
                              onChange={(e) => setHasParking(e.target.checked)}
                              type="checkbox" 
                              className="hidden" 
                            />
                            <span className="text-sm font-medium text-gray-700">Parking / Box</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-primary p-8 rounded-xl text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                      <label className="block text-xs font-bold mb-4 uppercase tracking-wider opacity-80">Livraison</label>
                      <h3 className="font-headline font-bold text-2xl mb-4 leading-tight">Quand souhaitez-vous emménager ?</h3>
                    </div>
                    <div className="relative z-10 flex flex-col gap-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="relative">
                          <label className="block text-[10px] font-bold text-white/60 mb-2 uppercase tracking-widest">
                            Trimestre <MandatoryDot />
                          </label>
                          <select 
                            value={deliveryQuarter}
                            onChange={(e) => handleFieldChange("deliveryQuarter", setDeliveryQuarter, e.target.value)}
                            className={`w-full px-4 py-3 bg-white/10 backdrop-blur-md border ${errors.includes("deliveryQuarter") ? 'border-red-500' : 'border-white/20'} rounded-xl text-white font-semibold focus:outline-none appearance-none cursor-pointer text-sm`}
                          >
                            <option value="" className="text-gray-900">Sélectionnez</option>
                            <option className="text-gray-900">1er trimestre</option>
                            <option className="text-gray-900">2ème trimestre</option>
                            <option className="text-gray-900">3ème trimestre</option>
                            <option className="text-gray-900">4ème trimestre</option>
                          </select>
                          <ChevronDown size={16} className="absolute right-3 bottom-3 text-white pointer-events-none" />
                        </div>
                        <div className="relative">
                          <label className="block text-[10px] font-bold text-white/60 mb-2 uppercase tracking-widest">
                            Année <MandatoryDot />
                          </label>
                          <select 
                            value={deliveryYear}
                            onChange={(e) => handleFieldChange("deliveryYear", setDeliveryYear, e.target.value)}
                            className={`w-full px-4 py-3 bg-white/10 backdrop-blur-md border ${errors.includes("deliveryYear") ? 'border-red-500' : 'border-white/20'} rounded-xl text-white font-semibold focus:outline-none appearance-none cursor-pointer text-sm`}
                          >
                            <option value="" className="text-gray-900">Sélectionnez</option>
                            {Array.from({ length: 2040 - 2026 + 1 }, (_, i) => 2026 + i).map(y => (
                              <option key={y} className="text-gray-900" value={y}>{y}</option>
                            ))}
                          </select>
                          <ChevronDown size={16} className="absolute right-3 bottom-3 text-white pointer-events-none" />
                        </div>
                      </div>
                    </div>
                    <div className="absolute -right-8 -bottom-8 opacity-10">
                      <Clock size={160} />
                    </div>
                  </div>
                </div>

                <div className="relative h-64 rounded-2xl overflow-hidden group">
                  <img 
                    alt="Vue architecturale" 
                    className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 transition-all duration-700" 
                    referrerPolicy="no-referrer"
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2070" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
                    <p className="text-white/80 font-medium text-sm mb-1 uppercase tracking-widest">Précision financière</p>
                    <h4 className="text-white font-headline text-2xl font-bold">Un simulateur calqué sur la réalité du marché.</h4>
                  </div>
                </div>

                <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex items-center gap-4 text-gray-500">
                    <ShieldCheck size={48} className="text-primary opacity-80" />
                    <p className="text-sm max-w-xs leading-relaxed text-left">Vos données sont sécurisées et utilisées uniquement pour votre simulation d'emprunt.</p>
                  </div>
                  <button 
                    type="submit" 
                    disabled={!isZoneVerified}
                    className={`w-full md:w-auto px-10 py-5 rounded-xl font-headline font-extrabold text-xl shadow-2xl transition-all flex items-center justify-center gap-3 group ${isZoneVerified ? 'bg-primary text-white shadow-primary/20 hover:brightness-110 transform active:scale-95 cursor-pointer' : 'bg-gray-200 text-gray-400 shadow-none cursor-not-allowed'}`}
                  >
                    Voir ma capacité d'emprunt
                    <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                <div className="flex justify-start">
                  <button type="button" onClick={prevStep} className="flex items-center gap-2 text-gray-400 font-semibold hover:text-primary transition-colors cursor-pointer text-sm">
                    <ArrowLeft size={16} /> Retour aux charges
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
