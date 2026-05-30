import PublicLayout from '@/layouts/public-layout';
import { GalleryCard } from '@/components/gallery/gallery-card';
import { InfiniteScroll, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Icon } from '@/components/ui/icon';
import { index as galleryIndex } from '@/routes/gallery';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface GalleryIndexProps {
  items: {
    data: any[];
    links: any;
    meta: any;
  };
  categories: string[];
  currentCategory: string;
}

export default function GalleryIndex({ items, categories, currentCategory }: GalleryIndexProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [lightboxImageError, setLightboxImageError] = useState(false);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      headerRef.current,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1, ease: 'expo.out' }
    );
  }, []);

  useEffect(() => {
    setLightboxImageError(false);
  }, [selectedItem]);

  const handleFilter = (category: string) => {
    router.visit(galleryIndex.url(), {
      data: { category },
      only: ['items', 'currentCategory'],
      reset: ['items'],
    });
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

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-24">
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

          {/* Gallery Grid with Infinite Scroll */}
          <div ref={containerRef} className="relative">
            <InfiniteScroll data="items">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                {items.data.map((item) => (
                  <div key={item.id} onClick={() => setSelectedItem(item)}>
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
                <button className="group relative w-full bg-racing-red text-white py-6 font-bold uppercase tracking-[0.4em] text-[11px] overflow-hidden transition-all hover:bg-white hover:text-black">
                  <span className="relative z-10">Consulter l'Expert</span>
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Decorative Footer Element */}
      <div className="relative h-64 overflow-hidden">
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
