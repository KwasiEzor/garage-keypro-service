import { Head, usePage } from '@inertiajs/react';
import { LeadForm } from '@/components/brand/lead-form';
import { ServiceCard } from '@/components/brand/service-card';
import { Icon } from '@/components/ui/icon';
import PublicLayout from '@/layouts/public-layout';

import type { Service } from '@/types';

interface ServiceShowProps {
  service: Service;
  relatedServices: Service[];
}

export default function ServiceShow({ service, relatedServices }: ServiceShowProps) {
  const { settings } = usePage().props as any;
  const siteName = settings?.site_name || 'KeyPro';

  const getServiceImage = (slug: string) => {
    const images: Record<string, string> = {
      'diagnostic-technique': 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2500&auto=format&fit=crop',
      'reproduction-de-cles': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2500&auto=format&fit=crop',
      'ouverture-de-porte': 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2500&auto=format&fit=crop',
      'reprogrammation-moteur': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2500&auto=format&fit=crop',
      'installation-alarme': 'https://images.unsplash.com/photo-1557597774-9d2739f85a76?q=80&w=2500&auto=format&fit=crop',
    };

    return images[slug] || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2500&auto=format&fit=crop';
  };

  const serviceImage = getServiceImage(service.slug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    'name': service.name,
    'description': service.description,
    'provider': {
      '@type': 'LocalBusiness',
      'name': siteName,
      'image': serviceImage,
      'telephone': settings?.contact_phone || '+228 72 11 44 44',
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': 'Lomé',
        'addressCountry': 'TG'
      }
    },
    'areaServed': 'Lomé, Togo',
    'offers': {
      '@type': 'Offer',
      'price': service.starting_price || '0',
      'priceCurrency': 'EUR'
    }
  };

  return (
    <PublicLayout>
      <Head>
        <title>{`${service.name} | ${siteName}`}</title>
        <meta name="description" content={service.description} />
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Head>
      {/* Service Header Section */}
      <section className="relative py-32 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <img 
            src={serviceImage} 
            alt={`Protocole technique pour ${service.name} - KeyPro`}
            className="w-full h-full object-cover opacity-30"
            fetchPriority="high"
            decoding="async"
            width="2500"
            height="1000"
          />
          <div className="absolute inset-0 bg-background/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10 z-1" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24">
          <span className="text-[11px] font-heading font-bold uppercase tracking-[0.4em] text-racing-red mb-6 block animate-in fade-in slide-in-from-top duration-700">Spécification du Protocole</span>
          <h1 className="text-5xl md:text-8xl font-heading font-bold uppercase tracking-tighter text-white mb-8 animate-in fade-in slide-in-from-bottom duration-1000">
            {service.name.split(' ').map((word: string, i: number) => (
              <span key={i} className="inline-block mr-[0.2em] last:mr-0">
                {i === 1 ? <span className="text-racing-red">{word}</span> : word}
              </span>
            ))}
          </h1>
          <div className="h-[2px] w-32 bg-racing-red mx-auto mb-12" />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
          {/* Main Content */}
          <div className="lg:col-span-7 space-y-16 animate-in fade-in slide-in-from-left duration-1000">
            <div className="space-y-8">
              <span className="text-[11px] font-heading font-bold uppercase tracking-[0.4em] text-racing-red mb-4 block">Spécification du Service</span>
              <h1 className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-tighter text-white mb-8 leading-[1.1]">
                {service.name}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed tracking-wide font-medium border-l-4 border-racing-red pl-10 italic">
                {service.description}
              </p>
            </div>

            {service.starting_price && (
              <div className="grid grid-cols-2 gap-px bg-white/5 border border-white/5 rounded-none overflow-hidden">
                <div className="bg-luxury-charcoal p-10">
                  <div className="text-[11px] font-heading font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3">Investissement de Base</div>
                  <div className="text-4xl font-heading font-bold text-white group-hover:text-racing-red transition-colors">
                    {service.starting_price}€
                  </div>
                </div>
                {service.estimated_duration && (
                  <div className="bg-luxury-charcoal p-10">
                    <div className="text-[11px] font-heading font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3">Durée Estimée du Protocole</div>
                    <div className="text-2xl font-heading font-bold text-white flex items-center gap-3">
                      <Icon name="Clock" className="h-6 w-6 text-racing-red" />
                      <span>{service.estimated_duration} MIN</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {service.long_description && (
              <div className="space-y-8">
                <h2 className="text-[11px] font-heading font-bold uppercase tracking-[0.3em] text-white flex items-center gap-6">
                  <span className="w-12 h-[2px] bg-racing-red" />
                  Détails Techniques
                </h2>
                <div className="bg-luxury-charcoal/50 border border-white/5 p-10 rounded-none text-sm leading-relaxed text-muted-foreground tracking-wide space-y-6 font-medium">
                  {service.long_description.split('\n').map((para: string, i: number) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>
            )}

            {service.brands && service.brands.length > 0 && (
              <div className="space-y-8">
                <h2 className="text-[11px] font-heading font-bold uppercase tracking-[0.3em] text-white flex items-center gap-6">
                  <span className="w-12 h-[2px] bg-racing-red" />
                  Compatibilité Marques Vérifiée
                </h2>
                <div className="flex flex-wrap gap-4">
                  {service.brands.map((brand: any) => (
                    <span key={brand.id} className="text-[10px] font-heading font-bold uppercase tracking-[0.2em] px-5 py-3 bg-white/5 border border-white/10 text-white hover:bg-racing-red hover:border-racing-red transition-all cursor-default transform -skew-x-12 inline-block">
                      <span className="inline-block skew-x-12">{brand.name}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Lead Form */}
          <div id="contact" className="lg:col-span-5 animate-in fade-in slide-in-from-right duration-1000">
            <div className="sticky top-32">
              <LeadForm
                serviceId={service.id}
                title="Initialiser le Protocole"
                description="Sécurisez un statut technique prioritaire pour votre véhicule."
              />
              
              <div className="mt-8 bg-luxury-charcoal p-8 border border-white/5 flex items-center gap-6 transform -skew-x-2">
                <div className="w-14 h-14 border border-racing-red/20 flex items-center justify-center text-racing-red bg-racing-red/5">
                  <Icon name="ShieldCheck" className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-[11px] font-heading font-bold uppercase tracking-[0.2em] text-white">Précision Garantie</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mt-1 font-bold">Protection Responsabilité Civile Complète.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Services */}
        {relatedServices.length > 0 && (
          <div className="mt-32 pt-24 border-t border-white/5">
            <div className="flex flex-col items-center text-center mb-20">
              <span className="text-[11px] font-heading font-bold uppercase tracking-[0.4em] text-racing-red mb-4 block">Expansion</span>
              <h2 className="text-4xl font-heading font-bold uppercase tracking-tighter text-white">Protocoles <span className="text-racing-red">Associés</span></h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {relatedServices.map((relatedService) => (
                <ServiceCard key={relatedService.id} service={relatedService} />
              ))}
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}

