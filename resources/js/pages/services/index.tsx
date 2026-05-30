import PublicLayout from '@/layouts/public-layout';
import { ServiceCard } from '@/components/brand/service-card';
import { Service } from '@/types';

interface ServicesProps {
  services: Service[];
}

export default function ServicesIndex({ services }: ServicesProps) {
  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center mb-24 animate-in fade-in slide-in-from-bottom duration-1000">
          <span className="text-[11px] font-heading font-bold uppercase tracking-[0.4em] text-racing-red mb-4 block">Portefeuille de Services</span>
          <h1 className="text-4xl md:text-7xl font-heading font-bold uppercase tracking-tighter text-white mb-8">Capacités Techniques</h1>
          <div className="h-[2px] w-24 bg-racing-red mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service) => (
            <div key={service.id}>
              <ServiceCard service={service} />
            </div>
          ))}
        </div>
        
        {/* Call to action section */}
        <div className="mt-32 bg-luxury-charcoal p-16 rounded-none border border-white/5 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="absolute inset-0 bg-racing-red/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="relative z-10 space-y-8">
            <h2 className="text-3xl md:text-4xl font-heading font-bold uppercase tracking-tighter text-white">Besoins Spécifiques ?</h2>
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-bold max-w-xl mx-auto leading-loose">
              Nos techniciens experts traitent les défis de diagnostic les plus complexes pour toutes les marques d'élite.
            </p>
            <div className="pt-4">
              <a href="/#contact" className="inline-flex items-center justify-center px-12 py-5 bg-white text-luxury-black font-heading font-bold text-[10px] uppercase tracking-[0.4em] hover:bg-racing-red hover:text-white transition-all rounded-none transform -skew-x-12">
                <span className="skew-x-12">Demander une Consultation</span>
              </a>
            </div>
          </div>
          
          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-racing-red/10 border-b border-l border-white/10 -translate-y-8 translate-x-8 rotate-45" />
        </div>
      </div>
    </PublicLayout>
  );
}
