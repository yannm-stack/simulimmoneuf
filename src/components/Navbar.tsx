import { Menu, X, ChevronDown } from "lucide-react";
import { useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const location = useLocation();

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 150);
  };

  const isActive = (path: string) => location.pathname === path;

  const guideLinks = [
    { name: "Les étapes d'achat", path: "/guide/etapes" },
    { name: "Les garanties", path: "/guide/garanties" },
    { name: "Les avantages du neuf", path: "/guide/avantages" },
    { name: "Calcul frais de notaire", path: "/calcul-frais-de-notaire" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-[0_4px_24px_rgba(0,102,94,0.04)]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Logo />

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 font-semibold tracking-tight text-sm">
          <Link to="/" className={`${isActive("/") ? "text-primary border-b-2 border-primary" : "text-on-surface/70"} font-bold pb-1 hover:text-primary transition-all`}>Accueil</Link>
          <Link to="/#taux" className="text-on-surface/70 hover:text-primary transition-colors">Taux</Link>
          <Link to="/ptz" className={`${isActive("/ptz") ? "text-primary border-b-2 border-primary" : "text-on-surface/70"} font-bold pb-1 hover:text-primary transition-all`}>PTZ</Link>
          
          {/* Dropdown "Tout savoir" */}
          <div 
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button className={`${guideLinks.some(link => isActive(link.path)) ? "text-primary" : "text-on-surface/70"} flex items-center gap-1 font-bold pb-1 hover:text-primary transition-all cursor-pointer`}>
              Tout savoir <ChevronDown size={14} className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            
            {isDropdownOpen && (
              <>
                {/* Invisible bridge to prevent closing on hover gap */}
                <div className="absolute top-full left-0 w-full h-2"></div>
                <div className="absolute top-[calc(100%+8px)] left-0 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden p-2 transform origin-top animate-in fade-in slide-in-from-top-1 duration-200">
                  {guideLinks.map((link) => (
                    <Link 
                      key={link.path}
                      to={link.path}
                      className={`block px-4 py-3 rounded-xl text-xs font-bold transition-all hover:bg-primary/5 hover:text-primary ${isActive(link.path) ? "bg-primary/10 text-primary" : "text-gray-600"}`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>

          <Link to="/blog" className={`${isActive("/blog") ? "text-primary border-b-2 border-primary" : "text-on-surface/70"} font-bold pb-1 hover:text-primary transition-all`}>Blog</Link>
          <Link to="/contact" className={`${isActive("/contact") ? "text-primary border-b-2 border-primary" : "text-on-surface/70"} font-bold pb-1 hover:text-primary transition-all`}>Contact</Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link to="/simulation" className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm tracking-tight hover:brightness-110 active:scale-95 transition-all">
            Simulateur de prêt
          </Link>
          
          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-on-surface" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-6 flex flex-col gap-4 font-semibold text-sm">
          <Link to="/" onClick={() => setIsOpen(false)} className={isActive("/") ? "text-primary" : ""}>Accueil</Link>
          <Link to="/#taux" onClick={() => setIsOpen(false)}>Taux</Link>
          <Link to="/ptz" onClick={() => setIsOpen(false)} className={isActive("/ptz") ? "text-primary" : ""}>PTZ</Link>
          
          <div className="flex flex-col gap-3 pb-2">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">Tout savoir</span>
            {guideLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                onClick={() => setIsOpen(false)} 
                className={`pl-4 ${isActive(link.path) ? "text-primary border-l-2 border-primary" : "text-gray-600 border-l-2 border-transparent"}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <Link to="/blog" onClick={() => setIsOpen(false)} className={isActive("/blog") ? "text-primary" : ""}>Blog</Link>
          <Link to="/contact" onClick={() => setIsOpen(false)} className={isActive("/contact") ? "text-primary" : ""}>Contact</Link>
        </div>
      )}
    </nav>
  );
}
