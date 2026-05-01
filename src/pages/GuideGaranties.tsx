import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { 
  ShieldCheck, 
  Eye, 
  Building2, 
  Wrench, 
  VolumeX, 
  ArrowRight,
  Download,
  Calendar
} from "lucide-react";

export default function GuideGaranties() {
  return (
    <div className="bg-white min-h-screen">
      <main className="pt-24 pb-20">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 md:px-8 mb-24">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full md:w-3/5"
            >
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-8 leading-[1.1] font-headline">
                Votre sérénité,<br/>
                <span className="text-primary italic">Notre engagement.</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-xl leading-relaxed font-body">
                L'acquisition d'un bien immobilier est une étape majeure. Chez simulimmoneuf, nous encadrons votre projet par des garanties juridiques et techniques strictes pour sécuriser votre investissement sur le long terme.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full md:w-2/5"
            >
              <div className="aspect-[4/5] rounded-[60px] overflow-hidden shadow-2xl relative border-[12px] border-gray-50">
                <img 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                  alt="Architecture Moderne et Assurance"
                  src="https://i.imgur.com/oox8o6R.jpeg" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent"></div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Guarantee Grid (Bento Style) */}
        <section className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* GFA Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-8 bg-white p-10 rounded-[48px] shadow-2xl shadow-gray-200/50 border border-gray-100"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shadow-sm">
                  <ShieldCheck className="text-primary" size={32} />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 font-headline">Garantie Financière d'Achèvement (GFA)</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg mb-10 font-body">
                La GFA est la protection ultime de l'acquéreur en VEFA (Vente en l'État Futur d'Achèvement). Elle assure que, même en cas de défaillance du promoteur, le financement de l'achèvement de l'immeuble est garanti par un organisme bancaire ou une compagnie d'assurance.
              </p>
              <div className="mt-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <p className="text-xs font-black text-primary uppercase tracking-widest mb-2">Protection</p>
                  <p className="text-gray-900 font-bold">Sécurité financière intégrale</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <p className="text-xs font-black text-primary uppercase tracking-widest mb-2">Engagement</p>
                  <p className="text-gray-900 font-bold">Achèvement certifié du chantier</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Apparent Defects */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-4 bg-primary text-white p-10 rounded-[48px] flex flex-col justify-center shadow-xl shadow-primary/20"
          >
            <Eye className="text-white/40 mb-8" size={32} />
            <h2 className="text-2xl font-bold mb-6 font-headline">Vices Apparents</h2>
            <p className="text-white/80 leading-relaxed font-body">
              Lors de la livraison, vous disposez d'un mois pour signaler tout défaut visible. Nous nous engageons à corriger ces imperfections dans les plus brefs délais pour une finition irréprochable.
            </p>
          </motion.div>

          {/* Decennial Guarantee */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-6 bg-white p-10 rounded-[48px] shadow-2xl shadow-gray-200/50 border border-gray-100"
          >
            <div className="flex items-center gap-6 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100">
                <Building2 className="text-primary" size={28} />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 font-headline">Garantie Décennale</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-8 font-body">
              Pendant 10 ans après la réception des travaux, cette garantie couvre les dommages qui compromettent la solidité du bâtiment ou le rendent impropre à sa destination. Elle concerne la structure : fondations, murs, toiture.
            </p>
            <div className="flex items-center justify-end">
              <span className="text-5xl font-black text-gray-100">10 ANS</span>
            </div>
          </motion.div>

          {/* Biennial Guarantee */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-6 bg-white p-10 rounded-[48px] shadow-2xl shadow-gray-200/50 border border-gray-100"
          >
            <div className="flex items-center gap-6 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100">
                <Wrench className="text-primary" size={28} />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 font-headline">Garantie Biennale</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-8 font-body">
              Aussi appelée garantie de bon fonctionnement, elle couvre pendant 2 ans les éléments d'équipement dissociables du bâti : radiateurs, robinetterie, volets roulants, portes intérieures.
            </p>
            <div className="flex items-center justify-end">
              <span className="text-5xl font-black text-gray-100">2 ANS</span>
            </div>
          </motion.div>

          {/* Acoustic Insulation Special Section */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-12 relative overflow-hidden rounded-[60px] bg-gray-900 text-white min-h-[450px] flex items-center mt-8 shadow-2xl shadow-black/10"
          >
            <img 
              className="absolute inset-0 w-full h-full object-cover opacity-40" 
              alt="Intérieur calme et confortable"
              referrerPolicy="no-referrer"
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faeaa6?auto=format&fit=crop&q=80&w=2000" 
            />
            <div className="relative z-10 p-10 md:p-20 max-w-3xl">
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 mb-8">
                <VolumeX className="text-primary" size={16} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Excellence Acoustique</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-8 font-headline leading-tight font-headline">Isolation Phonique & Confort</h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-10 font-body">
                Le silence est le luxe ultime. Nous appliquons les normes d'isolation acoustique les plus exigeantes (NRA) pour garantir votre tranquillité. Des chapes flottantes aux doubles vitrages haute performance, chaque détail est pensé pour filtrer les nuisances extérieures et intérieures.
              </p>
              <div className="flex gap-12">
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-primary italic font-headline">6dB</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Gain moyen</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-primary italic font-headline">NRA+</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Certification</span>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Final Consultation CTA */}
        <section className="max-w-7xl mx-auto px-6 md:px-8 mt-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gray-50 p-12 md:p-20 rounded-[80px] text-center border border-gray-100"
          >
            <h2 className="text-3xl md:text-4xl font-headline font-extrabold text-gray-900 mb-6">Des questions sur nos engagements ?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-12 font-body text-lg">Nos conseillers juridiques et techniques sont à votre disposition pour détailler chaque point de notre charte qualité.</p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/contact" className="inline-flex items-center gap-3 bg-primary text-white px-10 py-5 rounded-3xl font-headline font-bold text-sm tracking-widest uppercase hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-primary/20">
                <Calendar size={20} />
                Prendre rendez-vous
              </Link>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
