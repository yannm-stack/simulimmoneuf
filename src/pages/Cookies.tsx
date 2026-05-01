import { motion } from "motion/react";
import { 
  Shield, 
  Settings, 
  BarChart3, 
  Zap, 
  Megaphone, 
  HelpCircle,
  Check,
  ChevronRight,
  Mail
} from "lucide-react";

const CookieCategory = ({ icon: Icon, title, description, isAlwaysActive = false, defaultChecked = false }: any) => {
  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_24px_48px_rgba(0,102,94,0.04)] flex flex-col justify-between hover:shadow-xl transition-all duration-300">
      <div>
        <div className="flex justify-between items-start mb-6">
          <div className="bg-[#00665E]/5 p-3 rounded-2xl">
            <Icon size={24} className="text-[#00665E]" />
          </div>
          {isAlwaysActive ? (
            <div className="bg-gray-100 px-4 py-1.5 rounded-full">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Toujours actif</span>
            </div>
          ) : (
            <label className="relative inline-flex items-center cursor-pointer group">
              <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
              <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00665E]"></div>
            </label>
          )}
        </div>
        <h3 className="text-xl font-bold mb-3 text-[#1a1c1c]">{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          {description}
        </p>
      </div>
    </div>
  );
};

export default function Cookies() {
  return (
    <div className="bg-background min-h-screen pt-24 pb-20">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-20">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full md:w-3/5"
          >
            <span className="text-primary font-bold tracking-widest text-sm uppercase mb-4 block">Confidentialité</span>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-on-surface mb-8 leading-tight">
              Gestion des <span className="text-primary">Cookies</span>
            </h1>
            <p className="text-lg text-on-surface-variant leading-relaxed max-w-2xl">
              Chez <span className="font-bold">simulimmoneuf</span>, nous utilisons des cookies pour enrichir votre expérience de simulation immobilière. Ils nous permettent de comprendre vos besoins et d'optimiser la performance de nos outils financiers.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full md:w-2/5"
          >
            <div className="rounded-3xl overflow-hidden aspect-square border-8 border-gray-100 shadow-2xl relative group">
              <img 
                alt="Gestion Cookies" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                src="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=1000" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Preferences Grid */}
      <section className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gray-50/50 rounded-[40px] p-8 md:p-12 border border-gray-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CookieCategory 
              icon={Shield}
              title="Nécessaires"
              description="Ces cookies sont indispensables au bon fonctionnement du site. Ils assurent les fonctions de base et les fonctions de sécurité, de manière anonyme."
              isAlwaysActive={true}
            />
            <CookieCategory 
              icon={Settings}
              title="Fonctionnels"
              description="Ils permettent d'exécuter certaines fonctionnalités comme le partage du contenu du site sur les réseaux sociaux ou d'autres fonctions tierces."
              defaultChecked={true}
            />
            <CookieCategory 
              icon={BarChart3}
              title="Analytique"
              description="Utilisés pour comprendre comment les visiteurs interagissent avec le site. Ils fournissent des informations sur le nombre de visiteurs, le taux de rebond, etc."
            />
            <CookieCategory 
              icon={Zap}
              title="Performance"
              description="Ces cookies servent à comprendre et analyser les indicateurs de performance clés du site, ce qui aide à offrir une meilleure expérience utilisateur."
              defaultChecked={true}
            />
            <CookieCategory 
              icon={Megaphone}
              title="Publicité"
              description="Utilisés pour fournir aux visiteurs des publicités personnalisées basées sur les pages visitées précédemment et pour analyser l'efficacité des campagnes."
            />
            <CookieCategory 
              icon={HelpCircle}
              title="Non classé"
              description="Ces cookies sont en cours d'analyse et n'ont pas encore été classés dans une catégorie spécifique."
            />
          </div>

          {/* Action Bar */}
          <div className="mt-12 flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-xl">
            <p className="text-sm text-gray-500 mb-4 md:mb-0 max-w-md">
              En cliquant sur enregistrer, vous acceptez l'utilisation des catégories sélectionnées ci-dessus.
            </p>
            <div className="flex gap-4">
              <button className="px-8 py-4 text-on-surface font-bold text-sm hover:text-primary transition-colors">
                Tout refuser
              </button>
              <button className="bg-primary text-white px-10 py-4 rounded-2xl font-bold text-sm shadow-[0_8px_24px_rgba(0,102,94,0.2)] hover:brightness-110 active:scale-95 transition-all">
                Enregistrer mes préférences
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Trust Section */}
      <section className="max-w-7xl mx-auto px-6 mt-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <motion.div 
            whileHover={{ y: -5 }}
            className="group"
          >
            <div className="h-48 w-full rounded-3xl overflow-hidden mb-6 grayscale hover:grayscale-0 transition-all duration-500 border border-gray-100">
              <img 
                alt="Transparence" 
                className="w-full h-full object-cover" 
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=600" 
              />
            </div>
            <h4 className="font-bold text-lg mb-2">Transparence Totale</h4>
            <p className="text-sm text-gray-500 leading-relaxed">
              Nous listons chaque technologie utilisée pour garantir une navigation saine et sécurisée.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="group"
          >
            <div className="h-48 w-full rounded-3xl overflow-hidden mb-6 grayscale hover:grayscale-0 transition-all duration-500 border border-gray-100">
              <img 
                alt="Protection" 
                className="w-full h-full object-cover" 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600" 
              />
            </div>
            <h4 className="font-bold text-lg mb-2">Protection des Données</h4>
            <p className="text-sm text-gray-500 leading-relaxed">
              Vos choix sont respectés et stockés conformément aux réglementations RGPD en vigueur.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#00665E]/5 p-10 rounded-[32px] border-l-4 border-primary flex flex-col justify-center"
          >
            <h4 className="font-bold text-xl text-primary mb-4">Besoin d'aide ?</h4>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              Notre équipe est disponible pour répondre à toutes vos questions sur la confidentialité de vos données.
            </p>
            <a href="#" className="flex items-center gap-2 text-primary font-bold text-sm group">
              Contactez-nous
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
