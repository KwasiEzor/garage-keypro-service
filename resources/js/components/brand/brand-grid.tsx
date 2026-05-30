import { Icon } from '@/components/ui/icon';
import { BrandBadge } from './brand-badge';

interface Brand {
  id: number;
  name: string;
  slug: string;
  logo_path?: string;
  is_featured?: boolean;
}

interface BrandGridProps {
  brands: Brand[];
  title?: string;
}

export function BrandGrid({ brands, title }: BrandGridProps) {
  return (
    <div className="py-24">
      {title && (
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl border-l-4 border-racing-red pl-8">
            <span className="text-[11px] font-heading font-bold uppercase tracking-[0.4em] text-racing-red mb-4 block">Capacité Opérationnelle</span>
            <h2 className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-tighter text-white leading-none">
              Marques <span className="text-racing-red">Certifiées</span>
            </h2>
          </div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.25em] max-w-xs leading-loose font-bold border-r border-white/10 pr-6 text-right">
            Protocoles de diagnostic exclusifs pour les architectures automobiles d'élite.
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {brands.map((brand, i) => (
          <div
            key={brand.id}
            className="group relative h-48 bg-luxury-charcoal/50 border border-white/5 hover:border-racing-red/50 transition-all duration-700 transform -skew-x-6 overflow-hidden animate-in fade-in slide-in-from-bottom duration-1000"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            {/* Background Texture/Grid */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5 group-hover:opacity-10 transition-opacity" />
            
            {/* Glow Effect */}
            <div className="absolute -inset-10 bg-racing-red/10 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 skew-x-6">
              {brand.is_featured && (
                <div className="absolute top-4 right-6">
                  <span className="text-[8px] font-heading font-bold uppercase tracking-[0.3em] text-racing-red bg-racing-red/10 px-2 py-0.5 border border-racing-red/20">
                    Élite
                  </span>
                </div>
              )}

              {brand.logo_path ? (
                <div className="relative w-full h-24 mb-4 flex items-center justify-center transition-transform duration-700 group-hover:scale-110">
                  <img 
                    src={brand.logo_path} 
                    alt={brand.name} 
                    className="max-w-[70%] max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-700 brightness-200 group-hover:brightness-100 opacity-50 group-hover:opacity-100"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 bg-white/5 flex items-center justify-center mb-4 border border-white/10 group-hover:border-racing-red/30 transition-colors">
                  <Icon name="Car" className="h-8 w-8 text-white/20 group-hover:text-racing-red transition-colors" />
                </div>
              )}
              
              <div className="text-center">
                <span className="text-xs font-heading font-bold uppercase tracking-[0.25em] text-white/40 group-hover:text-white transition-all duration-500">
                  {brand.name}
                </span>
                <div className="mt-2 h-[1px] w-0 group-hover:w-full bg-racing-red transition-all duration-700 mx-auto" />
              </div>
            </div>

            {/* Tech Corner Accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/10 group-hover:border-racing-red transition-colors" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/10 group-hover:border-racing-red transition-colors" />
            
            {/* Hover Scanline */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-racing-red/5 to-transparent h-1/2 w-full -translate-y-full group-hover:animate-scanline pointer-events-none" />
          </div>
        ))}
      </div>
    </div>
  );
}
