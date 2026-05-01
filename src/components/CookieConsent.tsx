import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie, X, Check } from 'lucide-react';

const CookieConsent: React.FC = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShow(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:max-w-md z-[100]"
          id="cookie-consent-banner"
        >
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/50 relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-secondary/5 rounded-full blur-3xl" />

            <div className="relative flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                  <Cookie size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 leading-tight">Préférences des cookies</h3>
                  <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider uppercase">Respect de la vie privée</p>
                </div>
                <button 
                  onClick={() => setShow(false)}
                  className="ml-auto p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400"
                  id="close-cookie-banner"
                >
                  <X size={16} />
                </button>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed">
                Nous utilisons des cookies pour améliorer votre expérience, analyser le trafic et personnaliser le contenu. En continuant votre navigation, vous acceptez notre utilisation des cookies.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <button
                  onClick={handleAccept}
                  className="flex-1 px-6 py-3 bg-primary text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group"
                  id="accept-cookies"
                >
                  <Check size={18} className="group-hover:scale-110 transition-transform" />
                  Tout accepter
                </button>
                <button
                  onClick={handleDecline}
                  className="px-6 py-3 bg-gray-50 text-gray-500 hover:text-gray-900 rounded-2xl font-medium text-sm border border-gray-100 transition-all hover:bg-gray-100"
                  id="decline-cookies"
                >
                  Refuser
                </button>
              </div>
              
              <div className="text-center">
                <a href="/mentions-legales" className="text-[10px] text-primary/60 hover:text-primary font-medium hover:underline transition-all">
                  En savoir plus sur notre politique de confidentialité
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
