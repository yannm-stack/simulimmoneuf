import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X, Share } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect iOS and standalone mode
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    const isStandalone = (window.navigator as any).standalone || 
      window.matchMedia('(display-mode: standalone)').matches;

    setIsIOS(isIOSDevice);

    let dismissalTime = 0;
    try {
      const storage = typeof window !== 'undefined' ? window.localStorage : null;
      if (storage) {
        const isDismissed = storage.getItem('install_prompt_dismissed');
        dismissalTime = isDismissed ? parseInt(isDismissed) : 0;
      }
    } catch (e) {
      console.warn('LocalStorage access failed:', e);
    }
    
    const now = Date.now();
    const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      if (!isStandalone && (now - dismissalTime > SEVEN_DAYS)) {
        setIsVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    // If it's iOS and not already in standalone mode
    if (isIOSDevice && !isStandalone) {
      if (now - dismissalTime > SEVEN_DAYS) {
        // Small delay to show after initial load
        const timer = setTimeout(() => setIsVisible(true), 3000);
        return () => clearTimeout(timer);
      }
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleDismiss = () => {
    try {
      const storage = typeof window !== 'undefined' ? window.localStorage : null;
      if (storage) {
        storage.setItem('install_prompt_dismissed', Date.now().toString());
      }
    } catch (e) {
      console.warn('Could not save dismissal to localStorage:', e);
    }
    setIsVisible(false);
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsVisible(false);
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-24 left-4 right-4 z-[100] md:bottom-8 md:right-8 md:left-auto md:w-96"
      >
        <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
          
          <button 
            onClick={handleDismiss}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
              <Download className="text-primary" size={24} />
            </div>
            
            <div className="flex-1 pr-6">
              <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">
                Installer l'application
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">
                Accédez à Simulimmoneuf plus rapidement et profitez d'une meilleure expérience.
              </p>

              {isIOS ? (
                <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-600 mb-2 border border-gray-100 italic">
                  <div className="flex items-center gap-2 mb-2">
                    <Share size={14} className="text-primary" />
                    <span className="font-bold">Instructions pour iPhone :</span>
                  </div>
                  Cliquez sur le bouton "Partager" en bas de votre navigateur, puis faites défiler et choisissez <span className="font-bold text-primary">"Sur l'écran d'accueil"</span>.
                </div>
              ) : (
                <button 
                  onClick={handleInstallClick}
                  className="w-full bg-primary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20"
                >
                  <Download size={18} />
                  Installer maintenant
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
