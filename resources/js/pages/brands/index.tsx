import { useState } from 'react';
import PublicLayout from '@/layouts/public-layout';
import { Input } from '@/components/ui/input';
import { Icon } from '@/components/ui/icon';
import { BrandGrid } from '@/components/brand/brand-grid';

interface BrandsIndexProps {
  brands: any[];
}

export default function BrandsIndex({ brands }: BrandsIndexProps) {
  const [search, setSearch] = useState('');

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(search.toLowerCase())
  );

  const featuredBrands = filteredBrands.filter(b => b.is_featured);
  const otherBrands = filteredBrands.filter(b => !b.is_featured);

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative py-48 overflow-hidden bg-luxury-black border-b border-white/5">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-racing-red/5 blur-[150px] rounded-full" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <span className="text-[11px] font-heading font-bold uppercase tracking-[0.5em] text-racing-red mb-6 block animate-in fade-in slide-in-from-left duration-1000">
              Répertoire Technique de Précision
            </span>
            <h1 className="text-5xl md:text-8xl font-heading font-bold uppercase tracking-tighter text-white mb-8 leading-none animate-in fade-in slide-in-from-bottom duration-1000 delay-200">
              Écosystème <br /><span className="text-racing-red">Automobile</span>
            </h1>
            <div className="h-[2px] w-32 bg-racing-red mb-12 animate-in fade-in scale-in-x duration-1000 delay-500 origin-left" />
            
            <p className="text-lg text-muted-foreground leading-loose tracking-wide max-w-xl font-medium italic border-l-4 border-racing-red/50 pl-8 animate-in fade-in slide-in-from-bottom duration-1000 delay-300">
              "Nous maintenons une compatibilité totale avec les protocoles de sécurité les plus complexes, garantissant une intégrité absolue pour chaque intervention."
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl relative group">
            <div className="absolute -inset-2 bg-racing-red/5 blur-xl group-focus-within:bg-racing-red/10 transition-all opacity-0 group-focus-within:opacity-100" />
            <div className="relative flex items-center">
              <div className="absolute left-6 text-white/20 group-focus-within:text-racing-red transition-colors">
                <Icon name="Search" className="h-5 w-5" />
              </div>
              <Input
                type="search"
                placeholder="Identifier un constructeur..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-16 bg-luxury-charcoal/50 border-white/10 text-white focus:border-racing-red/50 focus:ring-0 transition-all rounded-none pl-16 pr-8 placeholder:text-white/20 font-heading font-bold uppercase tracking-[0.2em] text-[11px] transform -skew-x-6"
              />
              <div className="absolute right-4 h-8 w-px bg-white/10" />
              <div className="absolute right-8 text-[10px] font-heading font-bold text-white/20 uppercase tracking-widest hidden sm:block">
                {filteredBrands.length} Unités
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        {featuredBrands.length > 0 && (
          <div className="animate-in fade-in duration-1000">
            <BrandGrid
              brands={featuredBrands}
              title="Marques Élite"
            />
          </div>
        )}

        {otherBrands.length > 0 && (
          <div className="mt-20 pt-20 border-t border-white/5 animate-in fade-in duration-1000 delay-500">
            <BrandGrid
              brands={otherBrands}
              title="Couverture Étendue"
            />
          </div>
        )}

        {filteredBrands.length === 0 && (
          <div className="text-center py-48 bg-luxury-charcoal/30 border border-dashed border-white/10 transform -skew-x-6 mt-20">
            <div className="skew-x-6">
              <div className="relative inline-block mb-8">
                <Icon name="SearchX" className="h-20 w-20 text-racing-red/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Icon name="AlertTriangle" className="h-8 w-8 text-racing-red animate-pulse" />
                </div>
              </div>
              <p className="text-[12px] font-heading font-bold uppercase tracking-[0.5em] text-muted-foreground">
                Signal non identifié : "{search}"
              </p>
              <button 
                onClick={() => setSearch('')}
                className="mt-8 text-[10px] font-heading font-bold uppercase tracking-widest text-racing-red hover:text-white transition-colors border-b border-racing-red/30 hover:border-white pb-1"
              >
                Réinitialiser le Scanner
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Decoration */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-racing-red/30 to-transparent" />
    </PublicLayout>
  );
}
