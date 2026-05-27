import PublicLayout from '@/layouts/public-layout';
import { ServiceCard } from '@/components/brand/service-card';

interface ServicesIndexProps {
  services: any[];
}

export default function ServicesIndex({ services }: ServicesIndexProps) {
  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Nos Services</h1>
          <p className="text-lg text-muted-foreground">
            Solutions professionnelles pour tous vos besoins automobiles
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
