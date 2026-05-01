import { motion } from "motion/react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative h-[640px] flex items-center overflow-hidden bg-white">
      <div className="absolute inset-0 z-0">
        <video 
          src="https://i.imgur.com/TqOsIHE.mp4" 
          autoPlay 
          muted 
          loop 
          playsInline
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 hero-gradient"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <span className="inline-block px-4 py-1.5 bg-primary-fixed text-on-primary-fixed rounded-full text-xs font-bold tracking-widest mb-6 uppercase">
            Expertise Immobilier Neuf
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-on-surface leading-[1.1] tracking-tighter mb-6">
            VOTRE CHEMIN LE PLUS SIMPLE VERS UN LOGEMENT <span className="text-[#00665E]">NEUF</span>
          </h1>
          <p className="text-xl text-on-surface-variant mb-10 leading-relaxed max-w-lg">
            Simulez votre crédit en quelques clics, gratuitement et de manière sécurisée.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/simulation" className="bg-primary text-white px-10 py-5 rounded-xl font-bold text-lg shadow-[0_24px_48px_rgba(0,102,94,0.15)] hover:brightness-110 hover:-translate-y-1 transition-all text-center flex items-center justify-center gap-3">
              Simulez et obtenez vos plans en 24H
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
