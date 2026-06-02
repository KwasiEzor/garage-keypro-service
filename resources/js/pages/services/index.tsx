import { LeadForm } from '@/components/brand/lead-form';
import { ServiceCard } from '@/components/brand/service-card';
import { Icon } from '@/components/ui/icon';
import PublicLayout from '@/layouts/public-layout';
import type { Service } from '@/types';

interface ServicesProps {
  services: Service[];
}

export default function ServicesIndex({ services }: ServicesProps) {
  const servicesList = Array.isArray(services) ? services : [];

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center mb-24 animate-in fade-in slide-in-from-bottom duration-1000">
          <span className="text-[11px] font-heading font-bold uppercase tracking-[0.4em] text-racing-red mb-4 block">Portefeuille de Services</span>
          <h1 className="text-4xl md:text-7xl font-heading font-bold uppercase tracking-tighter text-white mb-8">Capacités Techniques</h1>
          <div className="h-[2px] w-24 bg-racing-red mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {servicesList.map((service) => (
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
              <a href="#contact" className="skewed-btn px-12 py-5 bg-white text-luxury-black hover:bg-racing-red hover:text-white transition-all group/cta">
                <span className="flex items-center gap-3">
                  <span>Demander une Consultation</span>
                  <Icon name="ArrowRight" className="h-4 w-4 transition-transform group-hover/cta:translate-x-1" />
                </span>
              </a>
            </div>
          </div>
          
          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-racing-red/10 border-b border-l border-white/10 -translate-y-8 translate-x-8 rotate-45" />
        </div>

        {/* Contact Section */}
        <section id="contact" className="mt-40 pt-40 border-t border-white/5">
          <div className="text-center mb-24">
            <span className="text-[11px] font-heading font-bold uppercase tracking-[0.5em] text-racing-red mb-6 block">Assistance Technique</span>
            <h2 className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-tighter text-white mb-10 leading-[0.9]">
              Initialiser un <br />
              <span className="text-racing-red">Nouveau Protocole</span>
            </h2>
            <div className="flex items-center justify-center gap-6">
              <div className="h-[2px] w-12 bg-white/10" />
              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.4em] font-bold">
                Experts disponibles pour intervention immédiate
              </p>
              <div className="h-[2px] w-12 bg-white/10" />
            </div>
          </div>

          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom duration-1000">
            <LeadForm />
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
