import { Link } from "react-router-dom";

interface LogoProps {
  className?: string;
  showText?: boolean;
  variant?: 'default' | 'white';
  horizontal?: boolean;
}

export default function Logo({ className = "", showText = true, variant = 'default', horizontal = true }: LogoProps) {
  const isWhite = variant === 'white';
  
  return (
    <Link to="/" className={`flex ${horizontal ? 'items-center gap-3' : 'flex-col items-center gap-2'} group ${className}`}>
      {/* Icon Circle */}
      <div className={`relative w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center shrink-0 overflow-hidden ${isWhite ? "bg-white/20" : "bg-primary/95 shadow-lg shadow-primary/20"}`}>
        <div className="absolute inset-0 bg-on-surface-variant/20 translate-x-1/2" />
        <span className="relative text-white font-black text-2xl select-none">S</span>
      </div>

      {showText && (
        <div className={`flex flex-col ${horizontal ? '' : 'items-center'}`}>
          <div className="flex items-baseline">
            <span className={`text-xl md:text-2xl font-black leading-none tracking-tighter ${isWhite ? "text-white" : "text-[#00665E]"}`}>
              simul
            </span>
            <span className={`text-xl md:text-2xl font-black leading-none tracking-tighter ${isWhite ? "text-white/90" : "text-[#1A1A1A]"}`}>
              immoneuf
            </span>
          </div>
          <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-widest ${isWhite ? "text-white/60" : "text-gray-900"} ${horizontal ? '' : 'mt-1'}`}>
            Votre Guide dans le Neuf
          </span>
        </div>
      )}
    </Link>
  );
}
