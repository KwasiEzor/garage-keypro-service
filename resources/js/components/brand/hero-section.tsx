
interface HeroSectionProps {
  title: string;
  subtitle?: string;
  badge?: string;
  heroImageUrl?: string;
  ctaPrimary?: { text: string; href: string };
  ctaSecondary?: { text: string; href: string };
}

const DEFAULT_HERO_IMAGE = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2500&auto=format&fit=crop';

export function HeroSection({ title, subtitle, badge, heroImageUrl, ctaPrimary, ctaSecondary }: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden bg-background min-h-[90vh] flex items-center">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImageUrl || DEFAULT_HERO_IMAGE}
          alt="Véhicule de luxe haute performance - Service de serrurerie KeyPro"
          className="w-full h-full object-cover opacity-40"
          fetchPriority="high"
          decoding="async"
          width="2500"
          height="1406"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background" />
      </div>

      {/* Background Patterns */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 z-1" />
      
      {/* Animated Glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-racing-red/5 blur-[120px] rounded-full pointer-events-none animate-pulse z-1" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full z-10">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="mb-8 flex items-center gap-4 animate-in fade-in slide-in-from-left duration-700">
            <div className="h-[2px] w-12 bg-racing-red" />
            <span className="text-[11px] font-heading font-bold uppercase tracking-[0.4em] text-racing-red">
              {badge || 'Protocoles de Sécurité Avancés'}
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-heading font-bold mb-8 leading-[1.05] tracking-tight text-white animate-in fade-in slide-in-from-bottom duration-1000">
            {title.split(' ').map((word, i) => (
              <span key={i} className="inline-block mr-[0.2em] last:mr-0">
                {word === 'Technicien' || word === 'Expert' ? (
                  <span className="text-racing-red text-glow">
                    {word}
                  </span>
                ) : word}
              </span>
            ))}
          </h1>

          {subtitle && (
            <p className="text-lg md:text-xl mb-12 text-muted-foreground max-w-2xl leading-relaxed tracking-wide animate-in fade-in slide-in-from-bottom duration-1000 delay-200 border-l-2 border-racing-red/30 pl-8 font-medium">
              {subtitle}
            </p>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 mb-24 animate-in fade-in slide-in-from-bottom duration-1000 delay-300">
            {ctaPrimary && (
              <a
                href={ctaPrimary.href}
                className="skewed-btn bg-racing-red text-white hover:bg-white hover:text-luxury-black transition-colors min-w-[240px]"
              >
                <span>{ctaPrimary.text}</span>
              </a>
            )}
            {ctaSecondary && (
              <a
                href={ctaSecondary.href}
                className="skewed-btn border border-white/10 text-white hover:border-racing-red hover:text-racing-red transition-all min-w-[240px]"
              >
                <span>{ctaSecondary.text}</span>
              </a>
            )}
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-12 pt-12 border-t border-white/5 animate-in fade-in slide-in-from-bottom duration-1000 delay-500">
            {[
              { label: 'Temps de Réponse', value: '15 MIN' },
              { label: 'Taux de Succès', value: '99.9%' },
              { label: 'Expérience Ops', value: '12+ ANS' },
              { label: 'Prêt à l\'action', value: '24/7' },
            ].map((stat, i) => (
              <div key={i} className="group">
                <div className="text-3xl font-heading font-bold text-white mb-1 group-hover:text-racing-red transition-colors">{stat.value}</div>
                <div className="text-[10px] font-heading uppercase tracking-widest text-muted-foreground group-hover:text-white transition-colors font-bold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Industrial Diagonal Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform translate-y-[1px] z-20">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[100px] fill-background">
          <path d="M1200 120L0 120 0 0z"></path>
        </svg>
      </div>
      
      {/* Decorative vertical line */}
      <div className="absolute right-12 bottom-24 w-[2px] h-32 bg-gradient-to-t from-racing-red to-transparent hidden lg:block z-20" />
    </div>
  );
}

