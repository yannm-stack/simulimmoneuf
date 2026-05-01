import { Info, Clock, Home as HomeIcon, Percent, CheckCircle2, Wallet, RefreshCcw } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

export default function PTZ() {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="z-10"
          >
            <span className="inline-block py-1 px-3 mb-6 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-bold tracking-widest uppercase">
              Réforme Logement 2025
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-on-surface tracking-tighter mb-8 leading-[1.1]">
              PTZ 2025-2027 : Le <span className="text-primary">Nouveau PTZ</span>
            </h1>
            <p className="text-lg md:text-xl text-on-surface-variant leading-relaxed max-w-xl">
              Le prêt à taux zéro évolue au 1er avril 2025. Découvrez les nouvelles conditions pour financer votre maison ou votre appartement neuf sans intérêts.
            </p>
            <div className="mt-10 flex gap-4">
              <Link to="/simulateur-ptz" className="bg-primary text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all active:scale-95 text-center">
                Calculer mon PTZ 2025
              </Link>
            </div>
          </motion.div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl">
              <img 
                src="https://i.imgur.com/GVMGTg6.jpeg" 
                alt="Résidence neuve moderne" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white/90 p-8 rounded-2xl shadow-xl max-w-[240px] backdrop-blur-md border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Percent size={20} className="text-primary fill-primary/20" />
                <span className="font-bold text-on-surface">Maisons & Apparts</span>
              </div>
              <p className="text-sm text-on-surface-variant">Eligibles partout en France pour le neuf dès avril 2025.</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 -z-10 w-1/3 h-full bg-gradient-to-l from-primary-fixed/20 to-transparent blur-3xl opacity-50"></div>
      </section>

      {/* Intro Section - Detailed Text from User */}
      <section className="bg-white py-24 px-8 border-y border-gray-100">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-on-surface tracking-tight">C'est quoi le PTZ ?</h2>
            <p className="text-lg text-on-surface-variant leading-relaxed">
              Le prêt à taux zéro est réservé aux personnes qui financent l'acquisition de leur première résidence principale (les <strong>« primo-accédants »</strong>). Plus exactement, il est dédié aux personnes n'ayant pas été propriétaires de leur logement dans les deux ans précédant l'offre de prêt ainsi qu'aux personnes en invalidité, handicapées ou victimes de catastrophes.
            </p>
            <p className="text-lg text-on-surface-variant leading-relaxed">
              Le bien immobilier concerné par le prêt doit devenir <strong>obligatoirement la résidence principale</strong> des personnes déclarées dans l'opération.
            </p>
          </div>

          <div className="bg-primary/5 p-8 md:p-12 rounded-[2.5rem] border border-primary/10">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <RefreshCcw className="text-primary" /> La Grande Réforme 2025
            </h3>
            <div className="space-y-6 text-on-surface-variant leading-relaxed">
              <p>
                Jusqu'en 2024, le bien devait répondre à des conditions géographiques strictes. Mais la <strong>Loi de finances pour 2025</strong> a réformé le prêt à taux zéro à compter du 1er avril. 
              </p>
              <p className="font-bold text-primary text-xl">
                Jusqu'en 2027, les futurs acquéreurs pourront profiter, pour l'acquisition d'un logement neuf, d'un prêt à taux zéro aussi bien pour un appartement que pour une maison individuelle, et ce sur tout le territoire.
              </p>
              <p>
                Même dans les zones dites "détendues" où l'immobilier est plus abordable, le PTZ devient accessible pour la construction ou l'achat d'une maison neuve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Operations List */}
      <section className="bg-gray-50 py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-16 tracking-tight">Ce que vous pouvez financer en 2025</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-8">
                <HomeIcon size={28} />
              </div>
              <h3 className="text-xl font-bold mb-4">Neuf : Maison ou Appartement</h3>
              <p className="text-on-surface-variant leading-relaxed text-sm">
                Acquisition ou construction dans un bâtiment d'habitation collectif ou pour une maison individuelle. <strong>Partout en France.</strong>
              </p>
            </div>

            <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-8">
                <RefreshCcw size={28} />
              </div>
              <h3 className="text-xl font-bold mb-4">Ancien avec travaux</h3>
              <p className="text-on-surface-variant leading-relaxed text-sm">
                Achat d'un logement ancien avec travaux en zone détendue (<strong>zones B2 et C uniquement</strong>). Travaux de rénovation énergétique importants requis.
              </p>
            </div>

            <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8">
                <Wallet size={28} />
              </div>
              <h3 className="text-xl font-bold mb-4">Accession Sociale</h3>
              <p className="text-on-surface-variant leading-relaxed text-sm">
                Logement neuf en location-accession (PSLA), bail réel solidaire (BRS) ou contrat d'accession avec TVA réduite. <strong>Toutes zones.</strong>
              </p>
            </div>
          </div>
          
          <div className="mt-12 p-8 bg-amber-50 rounded-3xl border border-amber-200 flex gap-6 items-start max-w-4xl mx-auto">
            <Info className="text-amber-600 shrink-0 mt-1" />
            <p className="text-sm text-amber-900 leading-relaxed font-medium">
              Notez que l'acquisition d'un logement ancien nécessitant des travaux de rénovation de grande ampleur peut être assimilé à du neuf. En revanche, <strong>l'acquisition d'un bien ancien sans travaux est complètement exclue du dispositif.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-24 px-8 bg-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-black mb-8 tracking-tight">Le PTZ en quelques chiffres</h2>
            <p className="text-lg text-on-surface-variant leading-relaxed mb-10">
              D'après le ministère chargé du Logement, le dispositif reste un levier majeur pour l'accession à la propriété.
            </p>
            <div className="space-y-6">
              {[
                { label: "Prêts octroyés en 2024", value: "45 000 +" },
                { label: "Destinés à l'achat de logements neufs", value: "25 000 +" },
                { label: "Destinés aux logements anciens", value: "17 000 +" },
                { label: "Acquisitions en HLM", value: "3 900" }
              ].map((stat, i) => (
                <div key={i} className="flex justify-between items-center py-4 border-b border-gray-100">
                  <span className="font-bold text-on-surface-variant">{stat.label}</span>
                  <span className="text-2xl font-black text-primary">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-surface p-1 rounded-[3rem] shadow-2xl relative">
            <div className="bg-white p-12 rounded-[2.8rem] space-y-8">
              <h3 className="text-2xl font-bold">Un dispositif prolongé</h3>
              <p className="text-on-surface-variant leading-relaxed">
                Le dispositif du prêt à taux zéro a été prolongé successivement par les différentes Lois de finances. La Loi de finances pour 2024 l'avait prorogé jusqu'au 31 décembre 2027, confirmant son rôle stratégique dans la politique du logement.
              </p>
              <div className="flex items-center gap-4 p-6 bg-primary/5 rounded-2xl">
                <CheckCircle2 className="text-primary" />
                <span className="font-black text-primary text-sm uppercase tracking-widest">Garanti jusqu'au 31/12/2027</span>
              </div>
              <Link to="/simulateur-ptz" className="w-full py-5 bg-primary text-white rounded-2xl font-black text-center block shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
                Vérifier mon éligibilité
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
