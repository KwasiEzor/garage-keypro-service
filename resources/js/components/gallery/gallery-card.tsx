import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/ui/icon';

interface GalleryCardProps {
  item: {
    id: number;
    title: string;
    description: string;
    image_path: string;
    category: string;
    is_featured: boolean;
  };
}

export function GalleryCard({ item }: GalleryCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );
    }
  }, []);

  const handleMouseEnter = () => {
    gsap.to(imageRef.current, { scale: 1.1, duration: 0.6, ease: 'power2.out' });
    gsap.to(overlayRef.current, { opacity: 0.9, duration: 0.4 });
  };

  const handleMouseLeave = () => {
    gsap.to(imageRef.current, { scale: 1, duration: 0.6, ease: 'power2.out' });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.4 });
  };

  return (
    <div 
      ref={cardRef}
      className="group relative overflow-hidden aspect-[4/5] bg-luxury-black border border-white/5 cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {!imageError ? (
        <img
          ref={imageRef}
          src={item.image_path}
          alt={item.title}
          className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
          loading="lazy"
          decoding="async"
          width="800"
          height="1000"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-full bg-luxury-charcoal flex flex-col items-center justify-center gap-4">
          <Icon name="ImageOff" className="h-16 w-16 text-white/20" />
          <span className="text-[10px] font-heading font-bold uppercase tracking-[0.3em] text-white/40">
            Image indisponible
          </span>
        </div>
      )}
      
      {/* Category Badge - Always visible */}
      <div className="absolute top-4 left-4 z-20">
        <span className="text-[9px] font-heading font-bold uppercase tracking-[0.2em] px-3 py-1 bg-racing-red text-white">
          {item.category}
        </span>
      </div>

      {/* Featured Indicator */}
      {item.is_featured && (
        <div className="absolute top-4 right-4 z-20">
          <Icon name="Star" className="h-4 w-4 text-racing-red fill-racing-red" />
        </div>
      )}

      {/* Hover Overlay */}
      <div 
        ref={overlayRef}
        className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/60 to-transparent opacity-0 flex flex-col justify-end p-8 z-10"
      >
        <h3 className="text-xl font-heading font-bold uppercase tracking-tighter text-white mb-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          {item.title}
        </h3>
        <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2 uppercase tracking-wider font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
          {item.description}
        </p>
        <div className="mt-6 flex items-center gap-2 text-racing-red group-hover:gap-4 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 delay-150">
          <span className="text-[10px] font-heading font-bold uppercase tracking-[0.3em]">Voir le Dossier</span>
          <Icon name="ArrowRight" className="h-3 w-3" />
        </div>
      </div>

      {/* Border Highlight */}
      <div className="absolute inset-0 border-2 border-racing-red/0 group-hover:border-racing-red/20 transition-all duration-500 pointer-events-none" />
    </div>
  );
}
