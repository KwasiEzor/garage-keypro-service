import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { motion, AnimatePresence } from 'framer-motion';

interface CookieConsentProps {
  enabled: boolean;
  message: string;
  privacyPolicyUrl: string;
}

export function CookieConsent({ enabled, message, privacyPolicyUrl }: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [enabled]);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  if (!enabled) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="bg-luxury-black/95 backdrop-blur-xl border border-white/10 p-6 md:p-8 relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 left-0 w-1 h-full bg-racing-red" />
              <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
              
              <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 border border-racing-red/20 flex items-center justify-center shrink-0 -skew-x-12 bg-racing-red/5">
                    <Icon name="Cookie" className="w-6 h-6 text-racing-red skew-x-12" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-heading font-bold uppercase tracking-widest text-chrome">
                      Gestion des Cookies
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                      {message}{' '}
                      <a href={privacyPolicyUrl} className="text-racing-red hover:underline underline-offset-4">
                        En savoir plus sur notre politique de confidentialité.
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                  <button
                    onClick={declineCookies}
                    className="flex-1 md:flex-none text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground hover:text-white transition-colors"
                  >
                    Refuser
                  </button>
                  <Button
                    onClick={acceptCookies}
                    className="flex-1 md:flex-none skewed-btn bg-racing-red text-white hover:bg-white hover:text-luxury-black px-8"
                  >
                    <span>Accepter</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
