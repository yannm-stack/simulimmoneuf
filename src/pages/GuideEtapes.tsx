import { motion } from "motion/react";
import { 
  PencilRuler, 
  FileText, 
  Landmark, 
  History, 
  HardHat, 
  Key, 
  PartyPopper,
  ShieldCheck,
  Wallet
} from "lucide-react";

export default function GuideEtapes() {
  return (
    <div className="bg-white min-h-screen">
      <main className="pt-32 pb-24">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-8 mb-24 text-center lg:text-left">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-headline text-sm font-bold mb-8"
          >
            <PencilRuler size={14} />
            GUIDE IMMOBILIER
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-headline font-extrabold tracking-tighter text-gray-900 mb-8 leading-[1.1]"
          >
            Les étapes <span className="text-primary italic">du neuf</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl leading-relaxed font-body"
          >
            De la réservation à la remise des clés, découvrez le parcours structuré et sécurisant de votre acquisition immobilière en VEFA.
          </motion.p>
        </section>

        {/* Interactive Timeline Section */}
        <section className="max-w-7xl mx-auto px-8">
          <div className="relative flex flex-col lg:flex-row gap-8 lg:gap-4 items-stretch">
            
            {/* Step 1: Réservation */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex-1 group relative"
            >
              <div className="relative z-10 flex flex-col h-full p-8 rounded-3xl bg-white border border-gray-100 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-2">
                <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center mb-8 shadow-lg shadow-primary/20">
                  <FileText size={32} />
                </div>
                <h3 className="text-2xl font-headline font-bold text-gray-900 mb-6">1. Réservation</h3>
                <div className="mt-auto space-y-6">
                  <div className="p-4 rounded-2xl bg-primary/5 border-l-4 border-primary">
                    <span className="block font-black text-primary text-[10px] uppercase tracking-widest mb-1">Document clé</span>
                    <p className="text-sm font-bold text-gray-900">Contrat de réservation</p>
                  </div>
                  <ul className="space-y-3 text-gray-500 text-sm font-medium">
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      Dépôt de garantie
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      10 jours de réflexion
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Step 2: Financement */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex-1 group relative"
            >
              <div className="relative z-10 flex flex-col h-full p-8 rounded-3xl bg-gray-50 border border-transparent transition-all duration-500 hover:bg-white hover:border-gray-100 hover:shadow-xl hover:-translate-y-2">
                <div className="w-16 h-16 rounded-2xl bg-gray-200 text-gray-400 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Landmark size={32} />
                </div>
                <h3 className="text-2xl font-headline font-bold text-gray-900 mb-6">2. Financement</h3>
                <div className="mt-auto space-y-6">
                  <p className="text-sm leading-relaxed text-gray-500 font-medium">
                    Recherche de prêt, accord de principe et édition de l'offre bancaire définitive par votre établissement.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-white border border-gray-100 rounded-full text-[10px] font-bold text-primary uppercase tracking-widest">Offre de prêt</span>
                    <span className="px-3 py-1 bg-white border border-gray-100 rounded-full text-[10px] font-bold text-primary uppercase tracking-widest">Assurance</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Step 3: Acte Authentique */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex-1 group relative"
            >
              <div className="relative z-10 flex flex-col h-full p-8 rounded-3xl bg-gray-50 border border-transparent transition-all duration-500 hover:bg-white hover:border-gray-100 hover:shadow-xl hover:-translate-y-2">
                <div className="w-16 h-16 rounded-2xl bg-gray-200 text-gray-400 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <History size={32} />
                </div>
                <h3 className="text-2xl font-headline font-bold text-gray-900 mb-6">3. Acte Authentique</h3>
                <div className="mt-auto space-y-6">
                  <div className="p-4 rounded-2xl bg-white shadow-sm border border-gray-100">
                    <p className="text-sm font-bold text-gray-900 mb-1">Signature Notaire</p>
                    <p className="text-xs text-gray-400 font-medium leading-relaxed">
                      L'acte authentique officialise la vente. Vous devenez propriétaire du terrain et des constructions.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Step 4: Construction */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex-1 group relative"
            >
              <div className="relative z-10 flex flex-col h-full p-8 rounded-3xl bg-gray-50 border border-transparent transition-all duration-500 hover:bg-white hover:border-gray-100 hover:shadow-xl hover:-translate-y-2">
                <div className="w-16 h-16 rounded-2xl bg-gray-200 text-gray-400 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <HardHat size={32} />
                </div>
                <h3 className="text-2xl font-headline font-bold text-gray-900 mb-6">4. Construction</h3>
                <div className="mt-auto space-y-6">
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Visites de chantier</p>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-2/3 transition-all duration-1000" />
                    </div>
                  </div>
                  <ul className="space-y-3 text-gray-500 text-sm font-medium">
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary/40" />
                      Choix des finitions
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary/40" />
                      Appels de fonds
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Step 5: Livraison */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex-1 group relative"
            >
              <div className="relative z-10 flex flex-col h-full p-8 rounded-3xl bg-primary text-white transition-all duration-500 shadow-2xl shadow-primary/20 hover:-translate-y-2">
                <div className="w-16 h-16 rounded-2xl bg-white/20 text-white flex items-center justify-center mb-8">
                  <Key size={32} />
                </div>
                <h3 className="text-2xl font-headline font-bold mb-6 italic underline underline-offset-8 decoration-white/20">5. Livraison</h3>
                <div className="mt-auto space-y-8">
                  <p className="text-sm font-medium opacity-90 leading-relaxed text-white">
                    Remise officielle des clés, vérification de la conformité et levée des réserves.
                  </p>
                  <div className="pt-6 border-t border-white/20">
                    <div className="flex items-center gap-3">
                      <PartyPopper size={24} className="text-white" />
                      <span className="font-bold text-sm tracking-tight">Bienvenue chez vous !</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </section>

        {/* Asymmetric Detail Section */}
        <section className="max-w-7xl mx-auto px-8 mt-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Image & Overlay */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5 relative"
            >
              <div className="rounded-[40px] overflow-hidden aspect-[4/5] shadow-2xl relative border-[12px] border-gray-50">
                <img 
                  alt="Intérieur de luxe" 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2070" 
                />
                <div className="absolute inset-x-8 bottom-8 p-8 bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl">
                  <span className="text-primary font-black text-[10px] uppercase tracking-widest block mb-2">Focus Finitions</span>
                  <p className="text-gray-900 font-headline font-extrabold text-lg leading-tight">Personnalisez votre futur espace selon vos envies.</p>
                </div>
              </div>
            </motion.div>

            {/* Content & Cards */}
            <div className="lg:col-span-7 space-y-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tighter text-gray-900 mb-8 leading-tight">
                  Accompagnement <br/>
                  <span className="text-primary italic">à chaque étape</span>
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                  <motion.div 
                    whileHover={{ x: 5 }}
                    className="p-8 rounded-3xl bg-white border border-gray-100 border-l-8 border-l-primary shadow-sm"
                  >
                    <ShieldCheck className="text-primary mb-4" size={32} />
                    <h4 className="font-bold text-gray-900 text-lg mb-2">Parfait achèvement</h4>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed">Droit à la réparation gratuite des désordres durant la 1ère année.</p>
                  </motion.div>
                  <motion.div 
                    whileHover={{ x: 5 }}
                    className="p-8 rounded-3xl bg-white border border-gray-100 border-l-8 border-l-primary shadow-sm"
                  >
                    <Wallet className="text-primary mb-4" size={32} />
                    <h4 className="font-bold text-gray-900 text-lg mb-2">Frais de notaire</h4>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed">Réduits à 2-3% contre 7-8% dans l'immobilier ancien.</p>
                  </motion.div>
                </div>

                {/* Expert Quote Card */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="bg-gray-50 p-10 rounded-[40px] border border-gray-100 relative"
                >
                  <p className="text-xl font-headline font-bold italic text-gray-700 leading-relaxed mb-8">
                    "L'achat dans le neuf est un marathon, pas un sprint. Notre rôle est de vous fournir la visibilité et la sécurité nécessaires pour avancer sereinement jusqu'à vos clés."
                  </p>
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md">
                      <img 
                        alt="Portrait Expert" 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                        src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=1974" 
                      />
                    </div>
                    <div>
                      <p className="font-black text-gray-900 font-headline uppercase tracking-tight">Marc Lefebvre</p>
                      <p className="text-xs text-primary font-bold uppercase tracking-widest">Expert Conseil VEFA</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>

          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto px-8 mt-32 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-primary text-white p-12 md:p-16 rounded-[48px] shadow-2xl shadow-primary/20"
          >
            <h3 className="text-3xl md:text-4xl font-headline font-bold mb-6">Démarrons votre projet ensemble</h3>
            <p className="text-white/80 mb-12 text-lg font-medium max-w-xl mx-auto leading-relaxed">
              Utilisez notre simulateur pour évaluer votre capacité d'emprunt et votre éligibilité au Prêt à Taux Zéro en quelques minutes.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <a href="/simulation" className="bg-white text-primary px-10 py-5 rounded-[24px] font-headline font-bold text-lg hover:scale-105 transition-all shadow-xl">
                Simuler mon prêt
              </a>
              <a href="/contact" className="bg-primary-container text-white px-10 py-5 rounded-[24px] font-headline font-bold text-lg border border-white/20 hover:bg-white/10 transition-all">
                Contactez-nous
              </a>
            </div>
          </motion.div>
        </section>

      </main>
    </div>
  );
}
