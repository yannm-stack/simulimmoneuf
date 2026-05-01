import { motion } from "motion/react";
import { 
  Verified, 
  PiggyBank, 
  Zap, 
  Gavel, 
  Landmark, 
  Banknote, 
  Leaf, 
  ArrowRight,
  FileText
} from "lucide-react";
import { Link } from "react-router-dom";

export default function GuideAvantages() {
  return (
    <div className="bg-white min-h-screen">
      <main className="pt-20 pb-24">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 md:px-8 mb-24">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-5xl md:text-6xl font-headline font-extrabold tracking-tight text-gray-900 mb-6 leading-[1.1]">
                Pourquoi choisir <span className="text-primary italic">l'immobilier neuf ?</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-xl mb-10 leading-relaxed font-body">
                Investir dans le neuf, c'est choisir la sérénité financière et le confort architectural le plus moderne. Découvrez une approche patrimoniale optimisée pour l'avenir.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl flex items-center gap-4 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Verified className="text-primary" size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Garanties</p>
                    <p className="font-bold text-gray-900">10 ans de sécurité</p>
                  </div>
                </div>
                <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl flex items-center gap-4 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <PiggyBank className="text-primary" size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Frais de notaire</p>
                    <p className="font-bold text-gray-900">Réduits à 2-3%</p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative rounded-[40px] overflow-hidden aspect-[4/5] md:aspect-square border-[12px] border-gray-50 shadow-2xl shadow-primary/5"
            >
              <img 
                alt="Architecture Moderne" 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2070" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </motion.div>
          </div>
        </section>

        {/* Comparison Table Section */}
        <section className="bg-gray-50 py-24 border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-headline font-bold text-gray-900 mb-4">Analyse Comparative</h2>
              <p className="text-gray-600 font-medium tracking-tight">L'avantage financier du neuf face à l'immobilier ancien</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 items-center">
              {/* Feature Labels */}
              <div className="hidden md:flex flex-col justify-center gap-16 pr-8">
                <div className="text-right font-headline font-bold text-gray-400 text-lg">Frais d'acquisition</div>
                <div className="text-right font-headline font-bold text-gray-400 text-lg">Performance Énergétique</div>
                <div className="text-right font-headline font-bold text-gray-400 text-lg">Travaux à prévoir</div>
                <div className="text-right font-headline font-bold text-gray-400 text-lg">Exonérations Fiscales</div>
              </div>

              {/* L'Ancien */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white border border-gray-200 rounded-[32px] p-8 md:p-12 shadow-sm"
              >
                <h3 className="text-2xl font-headline font-bold text-gray-400 mb-12 text-center">L'Ancien</h3>
                <div className="space-y-12">
                  <div className="text-center group">
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Notaire</span>
                    <span className="text-2xl md:text-3xl font-headline font-extrabold text-gray-600">7% à 8%</span>
                  </div>
                  <div className="text-center group">
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Isolation</span>
                    <span className="text-2xl md:text-3xl font-headline font-extrabold text-gray-600">Variable</span>
                  </div>
                  <div className="text-center group">
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Entretien</span>
                    <span className="text-2xl md:text-3xl font-headline font-extrabold text-gray-600">Immédiats</span>
                  </div>
                  <div className="text-center group">
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Fiscalité</span>
                    <span className="text-2xl md:text-3xl font-headline font-extrabold text-gray-600">Standard</span>
                  </div>
                </div>
              </motion.div>

              {/* Le Neuf */}
              <motion.div 
                whileHover={{ y: -10 }}
                className="bg-white border-4 border-primary rounded-[40px] p-8 md:p-12 shadow-2xl shadow-primary/10 relative z-10"
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold py-2 px-6 rounded-full uppercase tracking-widest shadow-lg">
                  Le plus avantageux
                </div>
                <h3 className="text-3xl font-headline font-bold text-primary mb-12 text-center">Le Neuf</h3>
                <div className="space-y-12">
                  <div className="text-center">
                    <span className="block text-[10px] font-bold text-primary/50 uppercase tracking-widest mb-2">Notaire</span>
                    <span className="text-3xl md:text-4xl font-headline font-black text-primary">2% à 3%</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-[10px] font-bold text-primary/50 uppercase tracking-widest mb-2">Consommation</span>
                    <span className="text-3xl md:text-4xl font-headline font-black text-primary">RE 2020</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-[10px] font-bold text-primary/50 uppercase tracking-widest mb-2">Entretien</span>
                    <span className="text-3xl md:text-4xl font-headline font-black text-primary">Aucun</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-[10px] font-bold text-primary/50 uppercase tracking-widest mb-2">Exonération</span>
                    <span className="text-3xl md:text-4xl font-headline font-black text-primary">Taxe Foncière</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Bento Grid Section */}
        <section className="max-w-7xl mx-auto px-6 md:px-8 py-24">
          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-8 h-auto">
            {/* Energy */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="md:col-span-2 bg-gray-50 border border-gray-100 rounded-[32px] p-10 flex flex-col justify-between"
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6">
                <Leaf className="text-primary" size={32} />
              </div>
              <div>
                <h4 className="text-2xl font-headline font-bold text-gray-900 mb-3">Coûts d'énergie optimisés</h4>
                <p className="text-gray-600 leading-relaxed font-body">Conformité aux normes RE 2020 garantissant une isolation thermique et acoustique de premier ordre pour des charges réduites.</p>
              </div>
            </motion.div>

            {/* Tax */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-primary text-white rounded-[32px] p-10 flex flex-col justify-between shadow-xl shadow-primary/10"
            >
              <Landmark className="text-white/60 mb-8" size={32} />
              <div>
                <h4 className="text-xl font-headline font-bold mb-3">Dispositifs fiscaux</h4>
                <p className="text-white/80 text-sm font-medium">PTZ (Prêt à Taux Zéro), Pinel, TVA réduite en zone ANRU pour booster votre épargne.</p>
              </div>
            </motion.div>

            {/* Fees */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-gray-100 border border-gray-200 rounded-[32px] p-10 flex flex-col justify-between"
            >
              <Gavel className="text-gray-400 mb-8" size={32} />
              <div>
                <h4 className="text-xl font-headline font-bold text-gray-900 mb-3">Frais réduits</h4>
                <p className="text-gray-500 text-sm">Économisez jusqu'à 5% sur le prix d'achat total par rapport à l'immobilier ancien.</p>
              </div>
            </motion.div>

            {/* Guarantees */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="md:col-span-2 bg-white border border-gray-100 rounded-[32px] p-10 shadow-lg shadow-gray-200/50"
            >
              <h4 className="text-2xl font-headline font-bold text-gray-900 mb-8">Un arsenal de garanties exclusives</h4>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="block font-black text-xl text-primary mb-1 uppercase">GFA</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Achèvement</span>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="block font-black text-xl text-primary mb-1 uppercase">2 ANS</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Équipements</span>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="block font-black text-xl text-primary mb-1 uppercase">10 ANS</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Gros œuvre</span>
                </div>
              </div>
            </motion.div>

            {/* Property Tax */}
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="md:col-span-4 bg-emerald-900 text-white rounded-[32px] p-10 flex flex-col md:flex-row items-center gap-8 shadow-xl shadow-emerald-950/20"
            >
              <div className="flex-1">
                <h4 className="text-2xl font-headline font-bold mb-4">Exonération de taxe foncière dans le neuf</h4>
                <div className="space-y-4 text-emerald-50/90 leading-relaxed font-body text-sm md:text-base">
                  <p>
                    L’acquisition d’un logement neuf (appartement ou maison) ouvre droit à une exonération de taxe foncière pendant les <span className="text-emerald-300 font-bold">deux années</span> qui suivent la livraison.
                  </p>
                  <p className="p-4 bg-white/5 rounded-2xl border border-white/10 italic">
                    "Vous envisagez d’acheter un appartement neuf en VEFA ? Cette exonération peut être totale ou partielle selon les communes, et n’est soumise à aucune condition de ressources."
                  </p>
                  <p className="text-xs text-emerald-200/60 uppercase tracking-widest font-bold">
                    Important : Mieux vaut se renseigner auprès de votre mairie pour connaître l’éligibilité de votre commune.
                  </p>
                </div>
              </div>
              <Banknote size={80} className="text-emerald-600 shrink-0 opacity-40" strokeWidth={1} />
            </motion.div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="max-w-4xl mx-auto px-6 md:px-8 mt-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-100 rounded-[50px] p-12 md:p-16 text-center shadow-2xl shadow-primary/5 border-b-8 border-b-primary"
          >
            <h3 className="text-3xl md:text-4xl font-headline font-extrabold text-gray-900 mb-6">Prêt à simuler votre projet ?</h3>
            <p className="text-lg text-gray-600 mb-10 max-w-xl mx-auto leading-relaxed">
              Nos experts vous accompagnent gratuitement dans l'analyse de votre éligibilité aux aides de l'État et au calcul de votre financement.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link to="/simulation" className="bg-primary text-white px-10 py-5 rounded-[24px] font-headline font-bold text-lg hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2">
                Lancer le simulateur
                <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
