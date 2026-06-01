import { Link, Head } from '@inertiajs/react';
import * as Inertia from '@inertiajs/react';
import { useState } from 'react';
import { CookieConsent } from '@/components/cookie-consent';
import { Icon } from '@/components/ui/icon';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { WhatsAppButton } from '@/components/ui/whatsapp-button';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { settings } = Inertia.usePage().props as any;

  const siteName = settings?.site_name || 'KEYPRO';
  const contactPhone = settings?.contact_phone || '+228 72 11 44 44';
  const openingHours = settings?.opening_hours || 'Lun - Sam : 08:00 - 19:00';
  const footerText = settings?.footer_text || `&copy; ${new Date().getFullYear()} KEYPRO. Ingénierie de Performance.`;

  const seoTitle = settings?.seo_title || siteName;
  const seoDescription = settings?.seo_description || 'Serrurerie automobile d\'élite et diagnostics techniques de pointe.';
  const seoKeywords = settings?.seo_keywords || 'serrurerie, automobile, diagnostic, clé voiture, KEYPRO';
  const seoRobots = settings?.seo_robots || 'index, follow';

  const navigation = [
    { name: 'Services', href: '/services' },
    { name: 'Marques', href: '/brands' },
    { name: 'Galerie', href: '/gallery' },
    { name: 'FAQ', href: '/faq' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground bg-grid-pattern">
      <Head>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content={seoKeywords} />
        <meta name="robots" content={seoRobots} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:site_name" content={siteName} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />

        {/* Analytics & Tracking */}
        {settings?.google_analytics_id && (
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${settings.google_analytics_id}`} />
        )}
        {settings?.google_analytics_id && (
          <script dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${settings.google_analytics_id}');
            `
          }} />
        )}
        
        {settings?.facebook_pixel_id && (
          <script dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${settings.facebook_pixel_id}');
              fbq('track', 'PageView');
            `
          }} />
        )}
      </Head>
      {/* Top Info Bar */}
      <div className="hidden lg:block w-full bg-luxury-black border-b border-white/5 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex gap-8">
            <div className="flex items-center gap-2 text-[10px] font-heading font-bold uppercase tracking-[0.2em] text-muted-foreground">
              <Icon name="Phone" className="h-3 w-3 text-racing-red" />
              <span>{contactPhone}</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-heading font-bold uppercase tracking-[0.2em] text-muted-foreground">
              <Icon name="Clock" className="h-3 w-3 text-racing-red" />
              <span>{openingHours}</span>
            </div>
          </div>
          <div className="flex gap-6">
            {['Instagram', 'Facebook', 'Twitter'].map(social => (
              <a 
                key={social} 
                href="#" 
                className="text-muted-foreground hover:text-racing-red transition-colors"
                aria-label={`Suivez-nous sur ${social}`}
              >
                <Icon name={social as any} className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="sticky top-0 z-50 w-full bg-luxury-black/95 backdrop-blur-md border-b border-white/5">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <Icon name="KeyRound" className="h-9 w-9 text-racing-red transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-racing-red/20 blur-xl rounded-none opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-2xl font-heading font-bold tracking-[0.3em] uppercase text-chrome">
                Key<span className="text-racing-red">Pro</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-12">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-[11px] font-heading font-bold uppercase tracking-[0.25em] text-muted-foreground hover:text-white transition-all duration-300 relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-racing-red transition-all duration-500 group-hover:w-full" />
                </Link>
              ))}
              
              <Link 
                href="#contact"
                className="skewed-btn bg-racing-red text-white hover:bg-white hover:text-luxury-black transition-colors"
              >
                <span>Réserver</span>
              </Link>
            </div>

            <div className="md:hidden">
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <button 
                    className="text-racing-red p-2"
                    aria-label="Ouvrir le menu"
                  >
                    <Icon name="Menu" className="h-6 w-6" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-luxury-black border-white/10 p-0 overflow-hidden">
                  <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
                  
                  <SheetHeader className="p-8 border-b border-white/5">
                    <SheetTitle>
                      <Link href="/" className="flex items-center gap-3" onClick={() => setIsMenuOpen(false)}>
                        <Icon name="KeyRound" className="h-7 w-7 text-racing-red" />
                        <span className="text-xl font-heading font-bold tracking-[0.2em] uppercase text-chrome">
                          Key<span className="text-racing-red">Pro</span>
                        </span>
                      </Link>
                    </SheetTitle>
                    <SheetDescription className="sr-only">
                      Menu de navigation principal
                    </SheetDescription>
                  </SheetHeader>

                  <div className="flex flex-col p-8 gap-8">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="text-xl font-heading font-bold uppercase tracking-[0.3em] text-muted-foreground hover:text-racing-red transition-all"
                      >
                        {item.name}
                      </Link>
                    ))}

                    <Link 
                      href="#contact"
                      onClick={() => setIsMenuOpen(false)}
                      className="mt-4 skewed-btn bg-racing-red text-white py-4 text-center font-bold uppercase tracking-[0.2em]"
                    >
                      <span>Réserver</span>
                    </Link>

                    <div className="mt-12 pt-12 border-t border-white/5 flex gap-6">
                      {['Instagram', 'Facebook', 'Twitter'].map(social => (
                        <a 
                          key={social} 
                          href="#" 
                          className="w-10 h-10 border border-white/10 flex items-center justify-center text-muted-foreground hover:bg-racing-red hover:text-white hover:border-racing-red transition-all transform -skew-x-12"
                          aria-label={`Suivez-nous sur ${social}`}
                        >
                          <Icon name={social as any} className="w-4 h-4 skew-x-12" />
                        </a>
                      ))}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-luxury-black border-t-4 border-racing-red pt-24 pb-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] bg-grid-pattern pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
            <div className="md:col-span-5">
              <div className="flex items-center gap-3 mb-8">
                <Icon name="KeyRound" className="h-7 w-7 text-racing-red" />
                <span className="text-xl font-heading font-bold tracking-[0.2em] uppercase text-chrome">
                  Key<span className="text-racing-red">Pro</span>
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                Serrurerie automobile d'élite et diagnostics techniques de pointe. 
                Ingénierie de précision pour marques de prestige et protocoles de sécurité avancés.
              </p>
              
              <div className="mt-10 flex gap-4">
                {['Instagram', 'Twitter', 'Facebook'].map(social => (
                  <a 
                    key={social} 
                    href="#" 
                    className="w-12 h-12 border border-white/5 flex items-center justify-center text-muted-foreground hover:bg-racing-red hover:text-white hover:border-racing-red transition-all transform -skew-x-12"
                    aria-label={`Suivez-nous sur ${social}`}
                  >
                    <Icon name={social as any} className="w-4 h-4 skew-x-12" />
                  </a>
                ))}
              </div>
            </div>

            <div className="md:col-span-3">
              <h3 className="text-[11px] font-heading font-bold uppercase tracking-[0.2em] text-white mb-8 border-l-2 border-racing-red pl-4">Entreprise</h3>
              <ul className="space-y-4">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-sm text-muted-foreground hover:text-racing-red transition-all inline-block uppercase tracking-wider">
                      {item.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="#contact" className="text-sm text-muted-foreground hover:text-racing-red transition-all inline-block uppercase tracking-wider">
                    Protocoles
                  </Link>
                </li>
              </ul>
            </div>

            <div className="md:col-span-4">
              <h3 className="text-[11px] font-heading font-bold uppercase tracking-[0.2em] text-white mb-8 border-l-2 border-racing-red pl-4">Intervention 24/7</h3>
              <div className="bg-luxury-charcoal p-8 border border-white/5 relative group">
                <div className="absolute top-0 left-0 w-1 h-0 bg-racing-red transition-all duration-500 group-hover:h-full" />
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3">Ligne Technique Prioritaire</p>
                <a href={`tel:${contactPhone.replace(/\s+/g, '')}`} className="text-2xl font-heading font-bold text-chrome hover:text-racing-red transition-all">
                  {contactPhone}
                </a>
                <div className="mt-6 pt-6 border-t border-white/5 flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  <div className="w-2.5 h-2.5 bg-racing-red animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                  Unités d'intervention actives
                </div>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-heading uppercase tracking-[0.3em] text-muted-foreground">
              {footerText}
            </p>
            <div className="flex gap-8">
              <Link 
                href={settings?.privacy_policy_url || "/privacy-policy"} 
                className="text-[10px] font-heading uppercase tracking-[0.3em] text-muted-foreground hover:text-racing-red transition-all"
              >
                Confidentialité
              </Link>
              <Link 
                href={settings?.terms_of_service_url || "/terms-of-service"} 
                className="text-[10px] font-heading uppercase tracking-[0.3em] text-muted-foreground hover:text-racing-red transition-all"
              >
                Conditions
              </Link>
            </div>
          </div>
        </div>
      </footer>
      <WhatsAppButton />
      <CookieConsent 
        enabled={settings?.cookie_consent_enabled === "1" || settings?.cookie_consent_enabled === true}
        message={settings?.cookie_consent_message || "Nous utilisons des cookies pour améliorer votre expérience sur notre site."}
        privacyPolicyUrl={settings?.privacy_policy_url || "/privacy-policy"}
      />
    </div>
  );
}

