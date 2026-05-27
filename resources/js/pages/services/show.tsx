import PublicLayout from '@/layouts/public-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BrandBadge } from '@/components/brand/brand-badge';
import { ServiceCard } from '@/components/brand/service-card';
import { LeadForm } from '@/components/brand/lead-form';
import { Icon } from '@/components/ui/icon';

interface ServiceShowProps {
  service: any;
  relatedServices: any[];
}

export default function ServiceShow({ service, relatedServices }: ServiceShowProps) {
  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-4">{service.name}</h1>
              <p className="text-lg text-muted-foreground">{service.description}</p>
            </div>

            {service.starting_price && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">À partir de</div>
                      <div className="text-3xl font-bold text-primary">
                        {service.starting_price}€
                      </div>
                    </div>
                    {service.estimated_duration && (
                      <div>
                        <div className="text-sm text-muted-foreground">Durée estimée</div>
                        <div className="text-xl font-semibold">
                          {service.estimated_duration} minutes
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {service.long_description && (
              <Card>
                <CardHeader>
                  <CardTitle>Description détaillée</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed">{service.long_description}</p>
                </CardContent>
              </Card>
            )}

            {service.brands && service.brands.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Marques compatibles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {service.brands.map((brand: any) => (
                      <BrandBadge key={brand.id} brand={brand} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            <LeadForm
              serviceId={service.id}
              title="Demander ce service"
              description="Remplissez le formulaire pour obtenir un devis"
            />
          </div>
        </div>

        {relatedServices.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Services associés</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
