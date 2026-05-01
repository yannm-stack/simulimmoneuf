import { Send, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-gray-100 rounded-t-[40px] mt-20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-6">
          <Logo />
          <p className="text-sm leading-relaxed text-on-surface/60">
            L'immobilier neuf, simplifié. Nous accompagnons les futurs acquéreurs dans la réussite de leur projet grâce à des outils digitaux innovants.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-primary mb-6 uppercase text-xs tracking-[0.2em]">Sitemap</h4>
          <ul className="space-y-4 text-sm text-on-surface/60">
            <li><a href="#" className="hover:text-primary transition-colors">Plan du site</a></li>
            <li><Link to="/ptz" className="hover:text-primary transition-colors">Prêt à Taux Zéro</Link></li>
            <li><Link to="/simulation" className="hover:text-primary transition-colors">Simulateur de prêt</Link></li>
            <li><Link to="/blog" className="hover:text-primary transition-colors">Blog & Actualités</Link></li>
            <li><Link to="/contact" className="hover:text-primary transition-colors">Contact & Support</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-primary mb-6 uppercase text-xs tracking-[0.2em]">Guides</h4>
          <ul className="space-y-4 text-sm text-on-surface/60">
            <li><Link to="/guide/etapes" className="hover:text-primary transition-colors">Les étapes d'achat</Link></li>
            <li><Link to="/guide/garanties" className="hover:text-primary transition-colors">Les garanties du neuf</Link></li>
            <li><Link to="/guide/avantages" className="hover:text-primary transition-colors">Les avantages du neuf</Link></li>
            <li><Link to="/calcul-frais-de-notaire" className="hover:text-primary transition-colors">Calcul frais de notaire</Link></li>
            <li><Link to="/contact#faq" className="hover:text-primary transition-colors">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-primary mb-6 uppercase text-xs tracking-[0.2em]">Légal</h4>
          <ul className="space-y-4 text-sm text-on-surface/60">
            <li><Link to="/mentions-legales" className="hover:text-primary transition-colors">Mentions Légales</Link></li>
            <li><Link to="/politique-de-confidentialite" className="hover:text-primary transition-colors">Politique de Confidentialité</Link></li>
            <li><Link to="/cookies" className="hover:text-primary transition-colors">Cookies</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 mt-16 pt-8 border-t border-gray-200">
        <p className="text-[10px] text-center text-on-surface/40 leading-relaxed">
          © 2024 simulimmoneuf. Expertise Immobilière & Financière. Un crédit vous engage et doit être remboursé. Vérifiez vos capacités de remboursement avant de vous engager.
        </p>
      </div>
    </footer>
  );
}
