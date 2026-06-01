import * as Inertia from '@inertiajs/react';
import { BrandGrid } from '@/components/brand/brand-grid';
import { HeroSection } from '@/components/brand/hero-section';
import { LeadForm } from '@/components/brand/lead-form';
import { ServiceCard } from '@/components/brand/service-card';
import { CircularTestimonials } from '@/components/ui/circular-testimonials';
import { Icon } from '@/components/ui/icon';
import PublicLayout from '@/layouts/public-layout';
import type { Service, Brand, Testimonial } from '@/types';

interface HomeProps {
  featuredServices: Service[];
  featuredBrands: Brand[];
  testimonials: Testimonial[];
}

export default function Home({ featuredServices, featuredBrands, testimonials }: HomeProps) {
  const { settings } = Inertia.usePage().props as any;
  const contactPhone = settings?.contact_phone || '+228 72 11 44 44';

  return (
    <PublicLayout>
      <HeroSection
        title="Expert Clés Auto"
        subtitle="Spécialiste en reproduction de clés, programmation électronique et diagnostic automobile. Assistance mobile rapide à Lomé et ses environs."
        ctaPrimary={{ text: 'Réserver une Intervention', href: '#contact' }}
        ctaSecondary={{ text: 'Appel d\'Urgence', href: `tel:${contactPhone.replace(/\s+/g, '')}` }}
      />

      {/* Featured Services */}
      <section className="bg-background py-32 overflow-hidden relative border-b border-white/5">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-racing-red/5 blur-[150px] rounded-full" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
            <div className="max-w-2xl border-l-4 border-racing-red pl-8">
              <span className="text-[11px] font-heading font-bold uppercase tracking-[0.4em] text-racing-red mb-4 block">Nos Spécialités</span>
              <h2 className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-tighter text-white leading-[1.1]">
                Solutions <br /><span className="text-racing-red">Automobiles</span>
              </h2>
            </div>
            <p className="text-xs text-muted-foreground uppercase tracking-[0.25em] max-w-xs leading-loose font-bold">
              Expertise technique multi-marques pour tous vos problèmes de clés et électronique embarquée.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredServices.map((service) => (
              <div key={service.id}>
                <ServiceCard service={service} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - The Process */}
      <section className="bg-luxury-black py-40 border-b border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-32">
            <span className="text-[11px] font-heading font-bold uppercase tracking-[0.4em] text-racing-red mb-4 block">Notre Méthodologie</span>
            <h2 className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-tighter mb-8 text-white">Protocole <span className="text-racing-red">d'Exécution</span></h2>
            <div className="h-[2px] w-24 bg-racing-red mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24">
            {[
              { 
                step: '01', 
                icon: 'Phone', 
                title: 'Activation', 
                desc: 'Analyse rapide de votre besoin en clés ou diagnostic électronique par nos techniciens.' 
              },
              { 
                step: '02', 
                icon: 'Zap', 
                title: 'Intervention', 
                desc: 'Déploiement immédiat de notre unité mobile à Lomé pour une solution sur site.' 
              },
              { 
                step: '03', 
                icon: 'Award', 
                title: 'Validation', 
                desc: 'Programmation, test de conformité et remise des clés avec garantie de fiabilité.' 
              },
            ].map((item, i) => (
              <div key={i} className="group relative text-center">
                <div className="relative inline-flex items-center justify-center w-28 h-28 border border-white/10 mb-10 group-hover:border-racing-red/50 transition-all duration-700 transform -skew-x-12 bg-luxury-charcoal">
                  <div className="absolute inset-0 bg-racing-red/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Icon name={item.icon as any} className="h-9 w-9 text-racing-red group-hover:scale-110 transition-transform duration-700 skew-x-12" />
                  <div className="absolute -top-4 -right-4 w-10 h-10 bg-luxury-black border border-white/10 flex items-center justify-center text-[12px] font-heading font-bold text-white group-hover:bg-racing-red group-hover:border-racing-red transition-all skew-x-12">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-2xl font-heading font-bold uppercase tracking-widest mb-6 text-white group-hover:text-racing-red transition-colors">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed tracking-wide px-4 font-medium">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* High-Impact Mission Section */}
      <section className="relative py-48 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1555212697-194d092e3b8f?q=75&w=1920&auto=format&fit=crop&fm=webp"
            alt="Détails techniques d'une clé de voiture moderne - Précision Technique"
            className="w-full h-full object-cover grayscale opacity-30"
            loading="lazy"
            decoding="async"
            width="1920"
            height="1080"
          />
          <div className="absolute inset-0 bg-background/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-10">
              <span className="text-[11px] font-heading font-bold uppercase tracking-[0.4em] text-racing-red block">Notre Mission à Lomé</span>
              <h2 className="text-4xl md:text-7xl font-heading font-bold uppercase tracking-tighter text-white leading-none">
                Innovation <br />et Expertise <br /><span className="text-racing-red">Technique</span>
              </h2>
              <div className="h-[2px] w-32 bg-racing-red" />
              <p className="text-lg text-muted-foreground leading-loose tracking-wide max-w-xl font-medium italic border-l-4 border-racing-red/50 pl-8">
                "Fournir des solutions rapides, fiables et accessibles pour tous les problèmes liés aux clés automobiles et aux systèmes électroniques des véhicules."
              </p>
              <div className="flex gap-12 pt-6">
                <div>
                  <div className="text-4xl font-heading font-bold text-white mb-2">98%</div>
                  <div className="text-[10px] font-heading uppercase tracking-widest text-muted-foreground font-bold">Client Satisfaits</div>
                </div>
                <div>
                  <div className="text-4xl font-heading font-bold text-white mb-2">24h/7</div>
                  <div className="text-[10px] font-heading uppercase tracking-widest text-muted-foreground font-bold">Assistance Urgente</div>
                </div>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-4 border border-racing-red/20 transform -skew-x-6 group-hover:border-racing-red/50 transition-all duration-700" />
              <div className="relative overflow-hidden transform -skew-x-6">
                <img
                  src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=75&w=800&auto=format&fit=crop&fm=webp"
                  alt="Expertise technique en ingénierie automobile haute performance"
                  className="w-full grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                  width="800"
                  height="600"
                />
                <div className="absolute inset-0 bg-racing-red/10 group-hover:opacity-0 transition-opacity" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Compatibility */}
      <section className="bg-background relative py-32 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BrandGrid
            brands={featuredBrands}
            title="Capacité Marques"
          />
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-luxury-black py-40 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-racing-red/30 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center mb-24">
            <span className="text-[11px] font-heading font-bold uppercase tracking-[0.4em] text-racing-red mb-4 block">Rapports Système</span>
            <h2 className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-tighter text-white">Intelligence <span className="text-racing-red">Client</span></h2>
          </div>
          
          <div className="flex justify-center">
            <CircularTestimonials 
              testimonials={testimonials.map((t, i) => ({
                quote: t.content,
                name: t.customer_name,
                designation: t.customer_location || t.vehicle_info || 'Client Satisfait',
                src: `https://images.unsplash.com/photo-${[
                  '1507003211169-0a1dd7228f2d',
                  '1500648767791-00dcc994a43e',
                  '1494790108377-be9c29b29330',
                  '1534528741775-53994a69daeb',
                  '1506794778202-cad84cf45f1d'
                ][i % 5]}?q=75&w=400&auto=format&fit=crop&fm=webp`
              }))}
              colors={{
                name: "#ffffff",
                designation: "#ef4444",
                testimony: "#a3a3a3",
                arrowBackground: "#171717",
                arrowForeground: "#ffffff",
                arrowHoverBackground: "#ef4444",
              }}
              fontSizes={{
                name: "24px",
                designation: "14px",
                quote: "18px",
              }}
            />
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="bg-background py-40 relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-24 border-b-2 border-racing-red pb-12">
            <h2 className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-tighter mb-6 text-white">Demander une <span className="text-racing-red">Intervention</span></h2>
            <p className="text-[11px] text-muted-foreground uppercase tracking-[0.3em] max-w-xl mx-auto leading-loose font-bold">
              Établissez un statut technique prioritaire en soumettant vos besoins opérationnels.
            </p>
          </div>
          <div className="animate-in fade-in slide-in-from-bottom duration-1000">
            <LeadForm />
          </div>
        </div>
        
        {/* Background decorative element */}
        <div className="absolute top-1/2 left-0 w-64 h-[2px] bg-gradient-to-r from-racing-red/20 to-transparent" />
        <div className="absolute top-1/2 right-0 w-64 h-[2px] bg-gradient-to-l from-racing-red/20 to-transparent" />
      </section>
    </PublicLayout>
  );
}

