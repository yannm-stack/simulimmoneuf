import { motion } from "motion/react";
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  UserCheck, 
  Mail, 
  ChevronRight,
  Database,
  RefreshCw,
  Trash2
} from "lucide-react";
import React from "react";

const PrivacySection = ({ icon: Icon, title, content }: { icon: any, title: string, content: string | React.ReactNode }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
  >
    <div className="bg-primary/5 w-12 h-12 flex items-center justify-center rounded-2xl mb-6 text-primary">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold mb-4 text-[#1a1c1c]">{title}</h3>
    <div className="text-gray-500 text-sm leading-relaxed">
      {content}
    </div>
  </motion.div>
);

export default function PrivacyPolicy() {
  return (
    <div className="bg-background min-h-screen pt-24 pb-20">
      {/* Header Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <span className="text-primary font-bold tracking-widest text-[10px] uppercase mb-4 block">Confidentialité</span>
          <h1 className="text-5xl md:text-6xl font-black text-[#1a1c1c] tracking-tighter mb-8 leading-[1.1]">
            Politique de <br/>
            <span className="text-primary">Confidentialité</span>
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed max-w-2xl">
            La protection de vos données personnelles est une priorité absolue pour <span className="font-bold text-primary">simulimmoneuf</span>. Nous nous engageons à traiter vos informations avec transparence, sécurité et respect de votre vie privée.
          </p>
        </motion.div>
      </section>

      {/* Main Content Grid */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PrivacySection 
            icon={Database}
            title="Collecte des données"
            content="Nous collectons uniquement les informations nécessaires au traitement de vos demandes de simulation immobilière : nom, prénom, email, téléphone et les caractéristiques de votre projet immobilier. Ces données sont collectées lors de l'utilisation de nos formulaires."
          />
          <PrivacySection 
            icon={Eye}
            title="Utilisation des données"
            content="Vos données sont utilisées pour réaliser vos simulations financières, vous transmettre les résultats, et si vous le souhaitez, vous mettre en relation avec nos conseillers experts pour affiner votre projet."
          />
          <PrivacySection 
            icon={Lock}
            title="Sécurité & Stockage"
            content="Toutes vos informations sont chiffrées (SSL) et stockées sur des serveurs sécurisés situés au sein de l'Union Européenne. Nous appliquons des protocoles de sécurité rigoureux pour prévenir tout accès non autorisé."
          />
          <PrivacySection 
            icon={UserCheck}
            title="Vos Droits (RGPD)"
            content={
              <ul className="space-y-2">
                <li>• Droit d'accès à vos données</li>
                <li>• Droit de rectification</li>
                <li>• Droit à l'effacement (droit à l'oubli)</li>
                <li>• Droit à la limitation du traitement</li>
              </ul>
            }
          />
        </div>

        {/* Full Width Detailed Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-6 bg-white p-8 md:p-12 rounded-[40px] border border-gray-100 shadow-[0_32px_64px_rgba(0,102,94,0.03)]"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-1">
              <div className="bg-primary/5 w-16 h-16 flex items-center justify-center rounded-3xl mb-6 text-primary">
                <RefreshCw size={32} />
              </div>
              <h2 className="text-2xl font-black text-[#1a1c1c] mb-4">Mises à jour</h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Cette politique peut être modifiée régulièrement pour refléter les évolutions législatives ou de nos services. Nous vous invitons à la consulter périodiquement.
              </p>
            </div>
            
            <div className="md:col-span-2 space-y-8">
              <div>
                <h3 className="text-xl font-bold mb-3 text-[#1a1c1c]">Partage avec des tiers</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Nous ne vendons, n'échangeons ni ne louons vos informations personnelles à des tiers. Vos données ne sont transmises à nos partenaires (banques, promoteurs) qu'avec votre accord explicite dans le cadre de votre projet.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3 text-[#1a1c1c]">Conservation des données</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Nous conservons vos données uniquement pendant la durée nécessaire à la finalité pour laquelle elles ont été collectées, ou conformément aux obligations légales de conservation.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Contact Support Section */}
      <section className="max-w-7xl mx-auto px-6 mt-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-primary p-8 md:p-16 rounded-[40px] text-white flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden"
        >
          <div className="relative z-10 max-w-xl text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight">Exercez vos droits dès maintenant</h2>
            <p className="text-white/80 text-lg mb-8">
              Pour toute question relative à vos données ou pour demander leur suppression, notre Délégué à la Protection des Données est à votre écoute.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a 
                href="mailto:contact@simulimmoneuf.fr" 
                className="bg-white text-primary px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-100 transition-all shadow-xl"
              >
                <Mail size={20} />
                Contacter le DPO
              </a>
              <a 
                href="/contact" 
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/20 transition-all"
              >
                Formulaire de contact
                <ChevronRight size={20} />
              </a>
            </div>
          </div>
          
          <div className="relative z-10 flex flex-col gap-6">
            <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-6 rounded-3xl w-64 rotate-3">
              <div className="bg-white w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-primary shadow-lg">
                <Trash2 size={20} />
              </div>
              <h4 className="font-bold text-sm mb-2">Droit à l'oubli</h4>
              <p className="text-white/60 text-[10px] leading-relaxed">
                Suppression immédiate de votre compte et de vos données sur simple demande par email.
              </p>
            </div>
          </div>

          {/* Decorative glass circles */}
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-white/5 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-white/5 rounded-full blur-[60px]"></div>
        </motion.div>
      </section>
    </div>
  );
}
