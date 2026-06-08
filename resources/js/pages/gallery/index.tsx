import { InfiniteScroll, router } from '@inertiajs/react';
import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';
import { LeadForm } from '@/components/brand/lead-form';
import { GalleryCard } from '@/components/gallery/gallery-card';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import PublicLayout from '@/layouts/public-layout';
import { index as galleryIndex } from '@/routes/gallery';

interface GalleryIndexProps {
  items: {
    data: any[];
    links: any;
    meta: any;
  };
  categories: string[];
  currentCategory: string;
  search: string | null;
}

export default function GalleryIndex({ items, categories, currentCategory, search: initialSearch }: GalleryIndexProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [lightboxImageError, setLightboxImageError] = useState(false);
  const [search, setSearch] = useState(initialSearch || '');
  const [isSearching, setIsSearching] = useState(false);

  // Sync search state with prop changes (e.g., browser navigation)
  // Using a state-based sync pattern instead of useEffect to avoid extra renders
  const [prevInitialSearch, setPrevInitialSearch] = useState(initialSearch);
  if (initialSearch !== prevInitialSearch) {
    setSearch(initialSearch || '');
    setPrevInitialSearch(initialSearch);
  }

  // Derived state to show spinner when local search doesn't match URL state
  const searchIsStale = search !== (initialSearch || '');
  const showSpinner = isSearching || searchIsStale;

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      headerRef.current,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1, ease: 'expo.out' }
    );
  }, []);

  // Debounced Search
  useEffect(() => {
    // Skip if search matches what's already in the URL/props
    if (!searchIsStale) {
      return;
    }

    setIsSearching(true);
    const timeout = setTimeout(() => {
      router.get(galleryIndex.url(), {
        category: currentCategory,
        search: search || undefined,
      }, {
        preserveState: true,
        preserveScroll: true,
        only: ['items', 'search'],
        reset: ['items'],
        replace: true,
        onFinish: () => setIsSearching(false),
      });
    }, 400);

    return () => clearTimeout(timeout);
  }, [search, currentCategory, searchIsStale]);

  const handleFilter = (category: string) => {
    router.visit(galleryIndex.url(), {
      data: { 
        category,
        search: search || undefined,
      },
      only: ['items', 'currentCategory'],
      reset: ['items'],
      replace: true,
    });
  };

  const handleSelectItem = (item: any) => {
    setSelectedItem(item);
    setLightboxImageError(false);
  };

  return (
    <PublicLayout>
      <div className="relative overflow-hidden pt-32 pb-48">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-racing-red/5 blur-[180px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Header */}
          <div ref={headerRef} className="text-center mb-32">
            <span className="text-[11px] font-heading font-bold uppercase tracking-[0.6em] text-racing-red mb-6 block animate-pulse">
              Archive Opérationnelle
            </span>
            <h1 className="text-5xl md:text-8xl font-heading font-bold uppercase tracking-tighter text-white mb-10 leading-[0.9]">
              Galerie <br />
              <span className="text-racing-red">Technique</span>
            </h1>
            <div className="flex items-center justify-center gap-6">
              <div className="h-[2px] w-12 bg-racing-red" />
              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.4em] font-bold">
                Standards de Précision & Résultats
              </p>
              <div className="h-[2px] w-12 bg-racing-red" />
            </div>
          </div>

          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto mb-24">
            <div className="relative group mb-12">
              <div className="absolute -inset-1 bg-gradient-to-r from-racing-red/20 to-transparent blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
              <div className="relative flex items-center bg-luxury-black border border-white/10 p-2 transform -skew-x-12">
                <div className="px-6 skew-x-12 flex items-center">
                  {isSearching ? (
                    <div className="w-5 h-5 border-2 border-racing-red/20 border-t-racing-red rounded-full animate-spin" />
                  ) : (
                    <Icon name="Search" className="h-5 w-5 text-racing-red" />
                  )}
                </div>
                <Input
                  type="text"
                  placeholder="Rechercher une intervention, un véhicule ou une technologie..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent border-none text-white font-heading text-[12px] uppercase tracking-[0.1em] placeholder:text-muted-foreground/30 focus-visible:ring-0 skew-x-12 h-12"
                />
                {search && !isSearching && (
                  <button 
                    onClick={() => setSearch('')}
                    className="px-6 skew-x-12 text-muted-foreground hover:text-white transition-colors"
                    aria-label="Effacer la recherche"
                  >
                    <Icon name="X" className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleFilter(category)}
                  className={`
                    px-8 py-3 text-[10px] font-heading font-bold uppercase tracking-[0.2em] transition-all transform -skew-x-12 border
                    ${currentCategory === category 
                      ? 'bg-racing-red border-racing-red text-white' 
                      : 'bg-luxury-black border-white/10 text-muted-foreground hover:border-racing-red/50 hover:text-white'
                    }
                  `}
                >
                  <span className="inline-block skew-x-12">{category}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Gallery Grid with Infinite Scroll */}
          <div ref={containerRef} className="relative">
            {items.data.length > 0 ? (
              <InfiniteScroll data="items">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                  {items.data.map((item) => (
                    <div key={item.id} onClick={() => handleSelectItem(item)} className="cursor-pointer">
                      <GalleryCard item={item} />
                    </div>
                  ))}
                </div>
                
                {/* Loading State for Infinite Scroll */}
                <div className="mt-24 flex justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-2 border-racing-red/20 border-t-racing-red rounded-none animate-spin transform -skew-x-12" />
                    <span className="text-[9px] font-heading font-bold uppercase tracking-[0.3em] text-muted-foreground animate-pulse">
                      Synchronisation des données...
                    </span>
                  </div>
                </div>
              </InfiniteScroll>
            ) : (
              <div className="py-32 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 border border-white/5 transform rotate-45 flex items-center justify-center mb-12 opacity-20">
                  <Icon name="SearchX" className="h-10 w-10 text-white -rotate-45" />
                </div>
                <h3 className="text-2xl font-heading font-bold uppercase tracking-tighter text-white mb-4">
                  Aucun résultat trouvé
                </h3>
                <p className="text-[11px] text-muted-foreground uppercase tracking-[0.3em] max-w-md mx-auto leading-loose">
                  Votre recherche pour "<span className="text-racing-red">{search}</span>" n'a retourné aucune archive technique dans la catégorie <span className="text-white">{currentCategory}</span>.
                </p>
                <button 
                  onClick={() => {
                    setSearch('');
                    handleFilter('All');
                  }}
                  className="mt-12 px-10 py-4 bg-white/5 border border-white/10 text-[10px] font-heading font-bold uppercase tracking-[0.3em] text-white hover:bg-racing-red hover:border-racing-red transition-all transform -skew-x-12"
                  aria-label="Réinitialiser tous les filtres de recherche"
                >
                  <span className="inline-block skew-x-12">Réinitialiser les filtres</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => {
        if (!open) {
          setSelectedItem(null);
          setLightboxImageError(false);
        }
      }}>
        <DialogContent className="sm:max-w-none max-w-[95vw] lg:max-w-7xl bg-luxury-black border-white/10 p-0 overflow-hidden rounded-none gap-0 outline-none">
          <div className="flex flex-col lg:flex-row w-full min-h-[50vh] max-h-[90vh]">
            {/* Image Section */}
            <div className="lg:w-3/4 bg-black relative flex items-center justify-center min-h-[400px] lg:min-h-[700px] group/lightbox overflow-hidden">
              <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
              {!lightboxImageError ? (
                <img
                  src={selectedItem?.image_path}
                  alt={selectedItem?.title}
                  className="relative z-10 w-full h-full object-contain p-4 lg:p-12 transition-transform duration-700 group-hover/lightbox:scale-[1.02]"
                  decoding="async"
                  width="1200"
                  height="800"
                  onError={() => setLightboxImageError(true)}
                />
              ) : (
                <div className="relative z-10 flex flex-col items-center justify-center gap-6">
                  <Icon name="ImageOff" className="h-24 w-24 text-white/20" />
                  <span className="text-[11px] font-heading font-bold uppercase tracking-[0.3em] text-white/40">
                    Image indisponible
                  </span>
                </div>
              )}
              
              {/* Luxury Accents */}
              <div className="absolute top-8 left-8 w-12 h-[1px] bg-racing-red/60 z-20" />
              <div className="absolute top-8 left-8 w-[1px] h-12 bg-racing-red/60 z-20" />
              <div className="absolute bottom-8 right-8 w-12 h-[1px] bg-racing-red/60 z-20" />
              <div className="absolute bottom-8 right-8 w-[1px] h-12 bg-racing-red/60 z-20" />
              
              {/* ID Badge */}
              <div className="absolute top-8 right-8 z-20 hidden lg:block">
                <span className="text-[9px] font-mono text-white/20 uppercase tracking-[0.5em]">
                  REF: GS-{selectedItem?.id?.toString().padStart(4, '0')}
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="lg:w-1/4 p-8 lg:p-12 flex flex-col justify-between bg-luxury-charcoal border-t lg:border-t-0 lg:border-l border-white/5 relative overflow-y-auto">
              <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-10">
                  <div className="h-[2px] w-10 bg-racing-red" />
                  <span className="text-[11px] font-heading font-bold uppercase tracking-[0.5em] text-racing-red">
                    {selectedItem?.category}
                  </span>
                </div>

                <DialogTitle className="text-4xl lg:text-5xl font-heading font-bold uppercase tracking-tighter text-white mb-12 leading-[0.85]">
                  {selectedItem?.title?.split(' ').map((word: string, i: number) => (
                    <span key={i} className="block">{word}</span>
                  ))}
                </DialogTitle>
                
                <div className="space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-racing-red rotate-45" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">Spécifications</span>
                  </div>
                  <DialogDescription className="text-[13px] text-muted-foreground leading-relaxed tracking-wide font-medium border-l border-racing-red/20 pl-6 py-2">
                    {selectedItem?.description}
                  </DialogDescription>
                </div>
              </div>
              
              <div className="relative z-10 mt-16 pt-12 border-t border-white/5">
                <button 
                  className="group relative w-full bg-racing-red text-white py-6 font-bold uppercase tracking-[0.4em] text-[11px] overflow-hidden transition-all hover:bg-white hover:text-black"
                  aria-label={`Consulter l'expert pour le projet : ${selectedItem?.title}`}
                >
                  <span className="relative z-10">Consulter l'Expert</span>
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contact Section */}
      <section id="contact" className="relative py-48 bg-luxury-charcoal/30 overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-racing-red/5 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-24">
            <span className="text-[11px] font-heading font-bold uppercase tracking-[0.5em] text-racing-red mb-6 block">Assistance Opérationnelle</span>
            <h2 className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-tighter text-white mb-10 leading-[0.9]">
              Une Question sur <br />
              <span className="text-racing-red">Nos Interventions ?</span>
            </h2>
            <div className="flex items-center justify-center gap-6">
              <div className="h-[2px] w-12 bg-white/10" />
              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.4em] font-bold">
                Experts disponibles pour analyse technique
              </p>
              <div className="h-[2px] w-12 bg-white/10" />
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-4 bg-racing-red/10 blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000" />
            <LeadForm 
              title="Formulaire de Liaison" 
              description="Détaillez votre projet technique pour une réponse prioritaire"
              className="relative z-10"
            />
          </div>
        </div>
      </section>

      {/* Decorative Footer Element */}
      <div className="relative h-64 overflow-hidden bg-luxury-black">
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black to-transparent" />
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-racing-red/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-24 h-24 border border-racing-red/30 transform rotate-45 flex items-center justify-center">
            <Icon name="KeyRound" className="h-8 w-8 text-racing-red/40 -rotate-45" />
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
