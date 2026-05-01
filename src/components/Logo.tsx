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
