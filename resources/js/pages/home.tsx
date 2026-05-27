import PublicLayout from '@/layouts/public-layout';
import { HeroSection } from '@/components/brand/hero-section';
import { ServiceCard } from '@/components/brand/service-card';
import { BrandGrid } from '@/components/brand/brand-grid';
import { TestimonialCard } from '@/components/brand/testimonial-card';
import { LeadForm } from '@/components/brand/lead-form';
import { Icon } from '@/components/ui/icon';

interface HomeProps {
  featuredServices: any[];
  featuredBrands: any[];
  testimonials: any[];
}

export default function Home({ featuredServices, featuredBrands, testimonials }: HomeProps) {
  return (
    <PublicLayout>
      <HeroSection
        title="Technicien Auto Mobile"
        subtitle="Clés, Diagnostic, Programmation - Intervention Rapide 24/7"
        ctaPrimary={{ text: 'Demander un service', href: '#contact' }}
        ctaSecondary={{ text: 'Appelez maintenant', href: 'tel:+33123456789' }}
      />

      {/* Featured Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Nos Services</h2>
          <p className="text-lg text-muted-foreground">
            Solutions complètes pour tous vos besoins automobiles
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Comment ça marche ?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground mb-4">
                <Icon name="Phone" className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Contactez-nous</h3>
              <p className="text-muted-foreground">
                Appelez-nous ou remplissez notre formulaire en ligne
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground mb-4">
                <Icon name="MapPin" className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Intervention</h3>
              <p className="text-muted-foreground">
                Notre technicien se déplace à votre domicile ou sur site
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground mb-4">
                <Icon name="CheckCircle" className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Service complet</h3>
              <p className="text-muted-foreground">
                Programmation rapide et tests de fonctionnement
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Compatibility */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <BrandGrid
          brands={featuredBrands}
          title="Compatible avec toutes les marques"
        />
      </section>

      {/* Testimonials */}
      <section className="bg-muted py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Témoignages Clients</h2>
            <p className="text-lg text-muted-foreground">
              Ce que nos clients disent de nous
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Demander un devis</h2>
          <p className="text-lg text-muted-foreground">
            Remplissez le formulaire et nous vous recontacterons rapidement
          </p>
        </div>
        <LeadForm />
      </section>
    </PublicLayout>
  );
}
