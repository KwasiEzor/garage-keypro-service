import { Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';

interface ServiceCardProps {
  service: {
    id: number;
    name: string;
    slug: string;
    description: string;
    icon?: string;
    starting_price?: number;
    estimated_duration?: number;
    is_featured: boolean;
  };
}

export function ServiceCard({ service }: ServiceCardProps) {
  const getServiceImage = (slug: string) => {
    const images: Record<string, string> = {
      'diagnostic-technique': 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=800&auto=format&fit=crop',
      'reproduction-de-cles': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=800&auto=format&fit=crop',
      'ouverture-de-porte': 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=800&auto=format&fit=crop',
      'reprogrammation-moteur': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop',
      'installation-alarme': 'https://images.unsplash.com/photo-1557597774-9d2739f85a76?q=80&w=800&auto=format&fit=crop',
    };

    return images[slug] || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=800&auto=format&fit=crop';
  };

  const serviceImage = getServiceImage(service.slug);

  return (
    <div className="group relative h-full">
      <Card className="accent-border-top flex flex-col h-full bg-card border-white/5 hover:border-racing-red/30 transition-colors duration-200 overflow-hidden rounded-none relative">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <img
            src={serviceImage}
            alt={service.name}
            className="w-full h-full object-cover opacity-10"
            loading="lazy"
            width="800"
            height="600"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/90 to-card/40" />
        </div>

        <div className="relative z-10 flex flex-col h-full">
          <CardHeader className="pt-8 px-8 pb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 border border-white/5 group-hover:border-racing-red/30 flex items-center justify-center bg-luxury-charcoal group-hover:bg-racing-red transition-colors duration-200 transform -skew-x-12">
                {service.icon && <Icon name={service.icon as any} className="h-6 w-6 text-racing-red group-hover:text-white transition-colors duration-200 skew-x-12" />}
              </div>
              {service.is_featured && (
                <span className="text-[9px] font-heading font-bold uppercase tracking-[0.25em] px-2.5 py-1.5 bg-racing-red text-white">
                  Protocole Prioritaire
                </span>
              )}
            </div>
            <CardTitle className="text-xl font-heading font-bold uppercase tracking-tight text-white mb-3 group-hover:text-racing-red transition-colors duration-200 leading-tight">
              {service.name}
            </CardTitle>
            <CardDescription className="text-[13px] text-muted-foreground leading-relaxed line-clamp-3 font-normal">
              {service.description}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-8 pb-8 flex-1 flex flex-col justify-end">
            <div className="space-y-6 pt-8 border-t border-white/5">
              {/* Price Section */}
              <div className="space-y-2">
                <span className="text-[10px] font-heading font-bold uppercase tracking-[0.3em] text-muted-foreground">
                  Investissement
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-bold text-muted-foreground uppercase">
                    Dès
                  </span>
                  <span className="text-4xl font-heading font-bold text-white group-hover:text-racing-red transition-colors duration-200">
                    {service.starting_price}€
                  </span>
                </div>
              </div>

              {/* Duration Section */}
              <div className="flex items-center gap-3 pt-2">
                <Icon name="Clock" className="h-4 w-4 text-racing-red flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-heading font-bold uppercase tracking-[0.3em] text-muted-foreground">
                    Durée du Protocole
                  </span>
                  <span className="text-sm font-bold text-white">
                    ~{service.estimated_duration} MIN
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="px-8 pb-8 pt-0">
            <Link
              href={`/services/${service.slug}`}
              className="skewed-btn w-full bg-white/5 border border-white/10 text-white hover:bg-racing-red hover:border-racing-red transition-colors duration-200"
            >
              <span className="text-[11px]">Explorer le Protocole</span>
            </Link>
          </CardFooter>
        </div>
      </Card>
    </div>
  );
}

