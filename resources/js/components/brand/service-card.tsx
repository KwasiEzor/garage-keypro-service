import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from '@inertiajs/react';
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
      <div className="absolute inset-0 bg-racing-red/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <Card className="accent-border-top flex flex-col h-full bg-card border-white/5 hover:border-white/10 transition-all duration-500 overflow-hidden rounded-none relative">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <img 
            src={serviceImage} 
            alt={service.name}
            className="w-full h-full object-cover opacity-10 group-hover:opacity-20 transition-opacity duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/90 to-card/40" />
        </div>

        <div className="relative z-10 flex flex-col h-full">
          <CardHeader className="pt-10 px-8">
            <div className="flex items-start justify-between mb-8">
              <div className="w-16 h-16 border border-white/5 flex items-center justify-center bg-luxury-charcoal group-hover:bg-racing-red transition-all duration-500 transform -skew-x-12">
                {service.icon && <Icon name={service.icon as any} className="h-7 w-7 text-racing-red group-hover:text-white transition-colors skew-x-12" />}
              </div>
              {service.is_featured && (
                <span className="text-[10px] font-heading font-bold uppercase tracking-[0.2em] px-3 py-1 bg-racing-red text-white">
                  Protocole Prioritaire
                </span>
              )}
            </div>
            <CardTitle className="text-2xl font-heading font-bold uppercase tracking-tighter text-white mb-4 group-hover:text-racing-red transition-all duration-500">
              {service.name}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground leading-relaxed line-clamp-3 font-medium">
              {service.description}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-8 pb-10 flex-1">
            <div className="flex flex-col gap-5 mt-6 pt-10 border-t border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-heading font-bold uppercase tracking-[0.2em] text-muted-foreground">Investissement</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xs font-bold text-muted-foreground uppercase mr-1">Dès</span>
                  <span className="text-3xl font-heading font-bold text-white group-hover:text-racing-red transition-all">
                    {service.starting_price}€
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-heading font-bold uppercase tracking-[0.2em] text-muted-foreground">Durée du Protocole</span>
                <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                  <Icon name="Clock" className="h-3.5 w-3.5 text-racing-red" />
                  <span>~{service.estimated_duration} MIN</span>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="px-8 pb-10 pt-0">
            <Link 
              href={`/services/${service.slug}`}
              className="skewed-btn w-full bg-white/5 border border-white/10 text-white hover:bg-racing-red hover:border-racing-red hover:text-white transition-all duration-500"
            >
              <span>Explorer le Protocole</span>
            </Link>
          </CardFooter>
        </div>
      </Card>
    </div>
  );
}

