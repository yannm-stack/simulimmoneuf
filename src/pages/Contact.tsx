import { Mail, CheckCircle2, ChevronDown, Send } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";

export default function Contact() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "Qu’est-ce qu’une VEFA ?",
      answer: "Acheter un logement dans le neuf signifie dans la majorité des cas, acheter un logement sur plan. C'est ce que l'on appelle une Vente en l'état futur d'achèvement ou VEFA.\n\nCe type de vente est très réglementée afin de garantir au futur propriétaire d'effectuer son achat en toute sérénité."
    },
    {
      question: "VEFA, ce qu’il faut savoir",
      answer: "Tout d'abord acheter un logement sur plan, c'est rentrer dans un logement neuf « clé en main », c'est-à-dire sans vous soucier des travaux. C'est aussi bénéficier des dernières normes en matière d'isolation, de sécurité et de confort."
    },
    {
      question: "Quelles sont les différentes étapes d’une VEFA ?",
      answer: "Nous allons détailler les différentes étapes et garanties de cette vente pour que vous puissiez bien comprendre le déroulement de ce type de transaction.\n\nDans un premier temps vous allez signer un contrat de réservation qui se conclura par un acte définitif devant notaire.\n\nLe contrat de réservation : Il est signé en principe sous seing privé, directement avec le promoteur sans l'intervention du notaire. C'est à ce moment-là, que le vendeur s'engage à vous réserver le logement que vous avez choisi.\n\nLe dépôt de garantie : En contrepartie de la réservation du logement, le vendeur demande le versement d'un dépôt de garantie qui varie de 2% à 5% maximum en fonction du délai de signature de l'acte définitif. Comme tout acquéreur de bien immobilier à usage d'habitation, vous bénéficiez d'un droit de rétractation de sept jours.\n\nL'acte de vente définitif : L'article L. 261-11 du Code de la construction et de l'habitation impose la rédaction d'un acte notarié. Le vendeur a son notaire, mais rien ne vous empêche de choisir le vôtre. Dans ce cas, les honoraires sont partagés. L'achat d'un logement neuf est soumis à des frais « réduits », qui sont compris entre 2 et 3% du prix d'acquisition."
    },
    {
      question: "Comment se déroule le paiement dans le cadre d’une VEFA ?",
      answer: "Lors d'une Vente en l'état futur d'achèvement, le paiement est toujours échelonné et les versements ont lieu au fur et à mesure de l'avancée des travaux.\n\nPour un appartement (avec garantie d'achèvement) :\n• 35 % à l'achèvement des fondations (y compris le dépôt de garantie payable à la réservation) ;\n• 35 % à la mise “hors d'eau”;\n• 25 % à l'achèvement de l'immeuble ;\n• 5 % à la remise des clés, acte qui concrétise le transfert de propriété du bien construit.\n\nPour une maison :\n• 30 % à l'achèvement des fondations ;\n• 15 % à la mise “hors d'eau” ;\n• 40 % à l'achèvement de la maison ;\n• 15 % à la remise des clés.\n\nLes établissements bancaires proposent de plus en plus des crédits destinés à l'achat de logements neufs. Ils prévoient des différés de remboursements (partiels ou totaux)."
    },
    {
      question: "Quand est-ce que mon logement est livré ?",
      answer: "Lorsque les travaux sont achevés, le vendeur vous convoque pour vous remettre les clés de votre logement. C'est à ce moment-là que vous effectuez un état des lieux pour vérifier que le logement est en bon état et conforme à ce qui a été prévu initialement dans le contrat de vente."
    },
    {
      question: "Qu’est-ce que l’investissement locatif ?",
      answer: "L'investissement locatif est un moyen de se constituer un patrimoine, de générer des revenus complémentaires, de préparer sa retraite, de protéger tous vos proches tout en réduisant vos impôts.\n\nPRINCIPE :\n• Vous achetez un appartement neuf ou maison neuve que vous mettez à la location.\n• Vous percevez un loyer tous les mois ce qui vous constitue des revenus complémentaires.\n• Vous vous créez un patrimoine immobilier à transmettre à vos héritiers.\n• Vous bénéficiez des frais de notaire réduits, environ 2 à 3% du prix d'acquisition du bien.\n• Vous déduisez votre avantage fiscal directement du montant de votre impôt à payer !"
    },
    {
      question: "Quel est le principe du dispositif LLI ?",
      answer: "Le Logement Locatif Intermédiaire (LLI) est un dispositif fiscal désormais accessible aux particuliers. Mis en place par l’État, il vise à faciliter l’accès au logement dans des zones attractives à forte demande locative. Ces secteurs offrent une bonne qualité de locataires et des loyers avantageux. Bien qu’il diffère du dispositif Pinel, le LLI demeure particulièrement intéressant pour les investisseurs particuliers. Il revêt également une dimension sociale en proposant des loyers modérés."
    },
    {
      question: "Le LMNP",
      answer: "Le Loueur en Meublé Non Professionnel (LMNP) permet à un particulier d’investir dans un bien meublé et de le louer tout en bénéficiant d’une fiscalité avantageuse. Il offre la possibilité de déduire les charges et d’amortir le bien, réduisant ainsi l’imposition sur les loyers. Le LMNP combine donc rentabilité, souplesse et avantages fiscaux."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-64 flex items-center justify-center overflow-hidden bg-gray-50">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover opacity-10" 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2069" 
            alt="Bureau moderne"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-white"></div>
        </div>
        <div className="relative z-10 text-center px-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary mb-4"
          >
            Contactez nos experts
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 max-w-xl mx-auto text-lg"
          >
            Un accompagnement sur mesure pour vos projets immobiliers.
          </motion.p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
          {/* Left Column: Form */}
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl shadow-gray-100 border border-gray-50">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Nom complet</label>
                    <input className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all text-gray-900 outline-none" placeholder="Jean Dupont" type="text"/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Email</label>
                    <input className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all text-gray-900 outline-none" placeholder="jean.dupont@email.com" type="email"/>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Téléphone</label>
                    <input className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all text-gray-900 outline-none" placeholder="01 23 45 67 89" type="tel"/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Objet</label>
                    <select className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all text-gray-900 outline-none appearance-none cursor-pointer">
                      <option>Simulation de prêt</option>
                      <option>Recherche de bien neuf</option>
                      <option>Problème site</option>
                      <option>Autre</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Votre message</label>
                  <textarea className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all text-gray-900 resize-none outline-none" placeholder="Comment pouvons-nous vous aider ?" rows={6}></textarea>
                </div>
                <button className="w-full md:w-auto px-10 py-4 bg-primary text-white rounded-xl font-bold hover:brightness-110 hover:-translate-y-1 transition-all shadow-lg shadow-primary/10 flex items-center justify-center gap-2" type="submit">
                  Envoyer le message <Send size={18} />
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Support Info */}
          <div className="lg:col-span-2 space-y-12">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold tracking-tight text-primary font-headline">Informations de support</h2>
              <div className="flex items-start space-x-4 p-6 bg-gray-50 rounded-2xl">
                <div className="bg-primary/10 p-3 rounded-xl text-primary">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Adresse e-mail</p>
                  <p className="text-lg font-semibold text-gray-900">contact@simulimmoneuf.fr</p>
                </div>
              </div>
            </div>

            {/* Trust Section */}
            <div className="bg-primary text-white p-8 rounded-[32px] relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
              <h3 className="text-xl font-bold mb-6 relative z-10 font-headline">Pourquoi nous contacter ?</h3>
              <ul className="space-y-4 relative z-10">
                <li className="flex items-center space-x-3 text-sm">
                  <CheckCircle2 size={20} className="text-white/80" />
                  <span>Réponse garantie rapidement</span>
                </li>
                <li className="flex items-center space-x-3 text-sm">
                  <CheckCircle2 size={20} className="text-white/80" />
                  <span>Expertise certifiée en crédit immobilier</span>
                </li>
                <li className="flex items-center space-x-3 text-sm">
                  <CheckCircle2 size={20} className="text-white/80" />
                  <span>Conseils personnalisés et gratuits</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="max-w-4xl mx-auto px-6 md:px-8 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-primary mb-4 font-headline">FAQ</h2>
          <div className="w-16 h-1 bg-primary/20 mx-auto rounded-full"></div>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-100">
              <button
                className="w-full flex justify-between items-center py-6 cursor-pointer group text-left"
                onClick={() => toggleFaq(index)}
              >
                <span className={`font-semibold transition-colors ${openFaq === index ? "text-primary" : "text-gray-900 group-hover:text-primary"}`}>
                  {faq.question}
                </span>
                <ChevronDown 
                  size={20} 
                  className={`text-gray-400 transition-transform duration-300 ${openFaq === index ? "rotate-180 text-primary" : ""}`} 
                />
              </button>
              <div 
                className={`overflow-hidden transition-all duration-300 ${openFaq === index ? "max-h-[1000px] pb-6 opacity-100" : "max-h-0 opacity-0"}`}
              >
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
