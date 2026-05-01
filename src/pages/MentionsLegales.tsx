import { motion } from "motion/react";
import { 
  Building2, 
  MapPin, 
  ArrowRight, 
  Server, 
  Scale, 
  ShieldCheck,
  Info as InfoIcon
} from "lucide-react";

export default function MentionsLegales() {
  return (
    <div className="bg-background min-h-screen pt-24 pb-20">
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <span className="text-primary font-bold tracking-widest text-sm uppercase mb-4 block">Information Légale</span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-on-surface tracking-tighter mb-6">
            Mentions Légales
          </h1>
          <p className="text-lg text-on-surface-variant leading-relaxed font-body">
            Conformément aux dispositions des Articles 6-III et 19 de la Loi n°2004-575 du 21 juin 2004 pour la Confiance dans l'Économie Numérique (L.C.E.N.), nous portons à la connaissance des utilisateurs les informations suivantes.
          </p>
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Editeur Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-8 bg-white p-10 rounded-3xl border border-gray-100 shadow-[0_24px_48px_rgba(0,102,94,0.04)]"
          >
            <div className="flex items-start justify-between mb-8">
              <div className="bg-[#94f3e7]/30 p-3 rounded-2xl">
                <Building2 className="text-primary" size={24} />
              </div>
              <span className="text-gray-400 font-mono text-xs">SECTION 01</span>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-primary">Éditeur du site</h2>
            <div className="space-y-4">
              <p className="text-xl font-bold text-on-surface">simulimmoneuf marque de Jennifer Volga</p>
              <div className="pt-2">
                <p className="text-on-surface-variant text-sm font-medium">Numéro SIRET</p>
                <p className="text-on-surface font-mono font-bold">88222021300020</p>
              </div>
            </div>
          </motion.div>

          {/* Contact Side Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="md:col-span-4 bg-primary text-white p-10 rounded-3xl flex flex-col justify-between shadow-2xl"
          >
            <div>
              <h3 className="text-xl font-bold mb-6">Contact Direct</h3>
              <p className="opacity-80 mb-8">Une question concernant nos mentions légales ou vos données ?</p>
            </div>
            <a className="flex items-center justify-between group" href="mailto:contact@simulimmoneuf.fr">
              <span className="font-bold underline underline-offset-4">contact@simulimmoneuf.fr</span>
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={24} />
            </a>
          </motion.div>

          {/* Hébergement Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="md:col-span-4 bg-gray-50/50 p-10 rounded-3xl border border-gray-100"
          >
            <div className="bg-white w-12 h-12 flex items-center justify-center rounded-2xl shadow-sm mb-6">
              <Server className="text-primary" size={24} />
            </div>
            <h2 className="text-xl font-bold mb-3">Hébergement</h2>
            <p className="text-on-surface-variant text-xs leading-relaxed">
              Ce site est hébergé par la société Vercel Inc., située 340 S Lemon Ave #4133 Walnut, CA 91789, et joignable au (559) 288-7060
            </p>
          </motion.div>

          {/* Propriété Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="md:col-span-4 bg-gray-50/50 p-10 rounded-3xl border border-gray-100"
          >
            <div className="bg-white w-12 h-12 flex items-center justify-center rounded-2xl shadow-sm mb-6">
              <Scale className="text-primary" size={24} />
            </div>
            <h2 className="text-xl font-bold mb-3">Propriété Intellectuelle</h2>
            <p className="text-on-surface-variant text-xs leading-relaxed">
              L'intégralité du site simulimmoneuf (structure, textes, logos, bases de données) est protégée par le droit d'auteur. Toute reproduction est strictement interdite sans accord préalable.
            </p>
          </motion.div>

          {/* Données Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="md:col-span-4 bg-gray-50/50 p-10 rounded-3xl border border-gray-100"
          >
            <div className="bg-white w-12 h-12 flex items-center justify-center rounded-2xl shadow-sm mb-6">
              <ShieldCheck className="text-primary" size={24} />
            </div>
            <h2 className="text-xl font-bold mb-3">Données Personnelles</h2>
            <p className="text-on-surface-variant text-xs leading-relaxed">
              Notre plateforme est entièrement conforme au RGPD. Vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles sur simple demande.
            </p>
          </motion.div>

          {/* Background Abstract Image */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="md:col-span-12 h-64 rounded-3xl overflow-hidden relative mt-6 bg-[#00665E]/5 border border-[#00665E]/10"
          >
            <div className="absolute inset-0 flex items-center px-10">
              <div className="max-w-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <ShieldCheck className="text-primary" size={20} />
                  </div>
                  <h3 className="text-2xl font-bold text-on-surface">Simulez en toute confiance.</h3>
                </div>
                <p className="text-on-surface-variant leading-relaxed">
                  Nos outils sont mis à jour quotidiennement selon les régulations bancaires en vigueur pour vous garantir une précision maximale.
                </p>
              </div>
            </div>
            <div className="absolute bottom-[-50%] right-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
