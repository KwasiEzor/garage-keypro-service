import { Head, usePage, Deferred } from '@inertiajs/react';
import { BrandGrid } from '@/components/brand/brand-grid';
import { HeroSection } from '@/components/brand/hero-section';
import { LeadForm } from '@/components/brand/lead-form';
import { ServiceCard } from '@/components/brand/service-card';
import { PremiumCarShowcase } from '@/components/premium/premium-car-showcase';
import { CircularTestimonials } from '@/components/ui/circular-testimonials';
import { Icon } from '@/components/ui/icon';
import PublicLayout from '@/layouts/public-layout';
import type { Service, Brand, Testimonial } from '@/types';

interface HomeProps {
    featuredServices: Service[];
    featuredBrands: Brand[];
    testimonials: Testimonial[];
}

export default function Home({
    featuredServices,
    featuredBrands,
    testimonials,
}: HomeProps) {
    const { settings } = usePage().props as any;
    const siteName = settings?.site_name || 'KeyPro';
    const contactPhone = settings?.contact_phone || '+228 72 11 44 44';

    // Safety fallbacks for props that might arrive as objects due to corrupted cache
    const servicesList = Array.isArray(featuredServices)
        ? featuredServices
        : [];

    return (
        <PublicLayout>
            <Head>
                <title>{`${settings?.seo_title || 'Expert Clés Auto & Diagnostic'} | ${siteName}`}</title>
                <meta
                    name="description"
                    content={
                        settings?.seo_description ||
                        'Spécialiste en reproduction de clés, programmation électronique et diagnostic automobile à Lomé.'
                    }
                />
            </Head>

            <HeroSection
                title="Expert Clés Auto"
                subtitle="Spécialiste en reproduction de clés, programmation électronique et diagnostic automobile. Assistance mobile rapide à Lomé et ses environs."
                ctaPrimary={{
                    text: 'Réserver un Rendez-vous',
                    href: '/appointments',
                }}
                ctaSecondary={{
                    text: "Appel d'Urgence",
                    href: `tel:${contactPhone.replace(/\s+/g, '')}`,
                }}
            />

            {/* Featured Services */}
            <section className="relative overflow-hidden border-b border-white/5 bg-background py-32">
                <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-racing-red/5 blur-[150px]" />

                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-24 flex flex-col justify-between gap-8 md:flex-row md:items-end">
                        <div className="max-w-2xl border-l-4 border-racing-red pl-8">
                            <span className="mb-4 block font-heading text-[11px] font-bold tracking-[0.4em] text-racing-red uppercase">
                                Nos Spécialités
                            </span>
                            <h2 className="font-heading text-4xl leading-[1.1] font-bold tracking-tighter text-white uppercase md:text-6xl">
                                Solutions <br />
                                <span className="text-racing-red">
                                    Automobiles
                                </span>
                            </h2>
                        </div>
                        <p className="max-w-xs text-xs leading-loose font-bold tracking-[0.25em] text-muted-foreground uppercase">
                            Expertise technique multi-marques pour tous vos
                            problèmes de clés et électronique embarquée.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
                        {servicesList.map((service) => (
                            <div key={service.id}>
                                <ServiceCard service={service} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works - The Process */}
            <section className="relative overflow-hidden border-b border-white/5 bg-luxury-black py-40">
                <div className="bg-grid-pattern absolute inset-0 opacity-10" />

                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-32 text-center">
                        <span className="mb-4 block font-heading text-[11px] font-bold tracking-[0.4em] text-racing-red uppercase">
                            Notre Méthodologie
                        </span>
                        <h2 className="mb-8 font-heading text-4xl font-bold tracking-tighter text-white uppercase md:text-6xl">
                            Protocole{' '}
                            <span className="text-racing-red">d'Exécution</span>
                        </h2>
                        <div className="mx-auto h-[2px] w-24 bg-racing-red" />
                    </div>

                    <div className="grid grid-cols-1 gap-16 md:grid-cols-3 lg:gap-24">
                        {[
                            {
                                step: '01',
                                icon: 'Phone',
                                title: 'Activation',
                                desc: 'Analyse rapide de votre besoin en clés ou diagnostic électronique par nos techniciens.',
                            },
                            {
                                step: '02',
                                icon: 'Zap',
                                title: 'Intervention',
                                desc: 'Déploiement immédiat de notre unité mobile à Lomé pour une solution sur site.',
                            },
                            {
                                step: '03',
                                icon: 'Award',
                                title: 'Validation',
                                desc: 'Programmation, test de conformité et remise des clés avec garantie de fiabilité.',
                            },
                        ].map((item, i) => (
                            <div key={i} className="group relative text-center">
                                <div className="relative mb-10 inline-flex h-28 w-28 -skew-x-12 transform items-center justify-center border border-white/10 bg-luxury-charcoal transition-all duration-700 group-hover:border-racing-red/50">
                                    <div className="absolute inset-0 bg-racing-red/5 opacity-0 transition-opacity group-hover:opacity-100" />
                                    <Icon
                                        name={item.icon as any}
                                        className="h-9 w-9 skew-x-12 text-racing-red transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute -top-4 -right-4 flex h-10 w-10 skew-x-12 items-center justify-center border border-white/10 bg-luxury-black font-heading text-[12px] font-bold text-white transition-all group-hover:border-racing-red group-hover:bg-racing-red">
                                        {item.step}
                                    </div>
                                </div>
                                <h3 className="mb-6 font-heading text-2xl font-bold tracking-widest text-white uppercase transition-colors group-hover:text-racing-red">
                                    {item.title}
                                </h3>
                                <p className="px-4 text-sm leading-relaxed font-medium tracking-wide text-muted-foreground">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* High-Impact Mission Section */}
            <section className="relative overflow-hidden py-48">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1555212697-194d092e3b8f?q=75&w=1920&auto=format&fit=crop&fm=webp"
                        alt="Détails techniques d'une clé de voiture moderne - Précision Technique"
                        className="h-full w-full object-cover opacity-30 grayscale"
                        loading="lazy"
                        decoding="async"
                        width="1920"
                        height="1080"
                    />
                    <div className="absolute inset-0 bg-background/90" />
                    <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
                </div>

                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 items-center gap-24 lg:grid-cols-2">
                        <div className="space-y-10">
                            <span className="block font-heading text-[11px] font-bold tracking-[0.4em] text-racing-red uppercase">
                                Notre Mission à Lomé
                            </span>
                            <h2 className="font-heading text-4xl leading-none font-bold tracking-tighter text-white uppercase md:text-7xl">
                                Innovation <br />
                                et Expertise <br />
                                <span className="text-racing-red">
                                    Technique
                                </span>
                            </h2>
                            <div className="h-[2px] w-32 bg-racing-red" />
                            <p className="max-w-xl border-l-4 border-racing-red/50 pl-8 text-lg leading-loose font-medium tracking-wide text-muted-foreground italic">
                                "Fournir des solutions rapides, fiables et
                                accessibles pour tous les problèmes liés aux
                                clés automobiles et aux systèmes électroniques
                                des véhicules."
                            </p>
                            <div className="flex gap-12 pt-6">
                                <div>
                                    <div className="mb-2 font-heading text-4xl font-bold text-white">
                                        98%
                                    </div>
                                    <div className="font-heading text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Client Satisfaits
                                    </div>
                                </div>
                                <div>
                                    <div className="mb-2 font-heading text-4xl font-bold text-white">
                                        24h/7
                                    </div>
                                    <div className="font-heading text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        Assistance Urgente
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="group relative">
                            <div className="absolute -inset-4 -skew-x-6 transform border border-racing-red/20 transition-all duration-700 group-hover:border-racing-red/50" />
                            <div className="relative -skew-x-6 transform overflow-hidden bg-luxury-charcoal">
                                <img
                                    src="/images/premium-cars/BMW-X1-2026.avif"
                                    alt="BMW X1 2026 - Expertise technique en programmation de clés et diagnostic automobile premium"
                                    className="w-full transition-all duration-1000 group-hover:scale-105"
                                    loading="lazy"
                                    decoding="async"
                                    width="800"
                                    height="600"
                                />
                                <div className="absolute inset-0 bg-racing-red/10 transition-opacity group-hover:opacity-0" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Premium Vehicles Showcase */}
            <PremiumCarShowcase />

            {/* Brand Compatibility */}
            <section className="relative border-b border-white/5 bg-background py-32">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Deferred
                        data="featuredBrands"
                        fallback={
                            <div className="animate-pulse space-y-12">
                                <div className="mx-auto h-12 w-64 rounded-none bg-white/5" />
                                <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6">
                                    {[...Array(12)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="h-24 rounded-none bg-white/5"
                                        />
                                    ))}
                                </div>
                            </div>
                        }
                    >
                        <BrandGrid
                            brands={
                                Array.isArray(featuredBrands)
                                    ? featuredBrands
                                    : []
                            }
                            title="Capacité Marques"
                        />
                    </Deferred>
                </div>
            </section>

            {/* Testimonials */}
            <section className="relative overflow-hidden bg-luxury-black py-40">
                <div className="absolute top-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-racing-red/30 to-transparent" />

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-24 flex flex-col items-center text-center">
                        <span className="mb-4 block font-heading text-[11px] font-bold tracking-[0.4em] text-racing-red uppercase">
                            Rapports Système
                        </span>
                        <h2 className="font-heading text-4xl font-bold tracking-tighter text-white uppercase md:text-6xl">
                            Intelligence{' '}
                            <span className="text-racing-red">Client</span>
                        </h2>
                    </div>

                    <div className="flex min-h-[500px] justify-center">
                        <Deferred
                            data="testimonials"
                            fallback={
                                <div className="flex animate-pulse flex-col items-center gap-12">
                                    <div className="h-64 w-64 rounded-full border border-white/10 bg-white/5" />
                                    <div className="space-y-4 text-center">
                                        <div className="mx-auto h-8 w-48 rounded-none bg-white/5" />
                                        <div className="mx-auto h-4 w-64 rounded-none bg-white/5" />
                                    </div>
                                </div>
                            }
                        >
                            <CircularTestimonials
                                testimonials={(Array.isArray(testimonials)
                                    ? testimonials
                                    : []
                                ).map((t, i) => ({
                                    quote: t.content,
                                    name: t.customer_name,
                                    designation:
                                        t.customer_location ||
                                        t.vehicle_info ||
                                        'Client Satisfait',
                                    src: `https://images.unsplash.com/photo-${
                                        [
                                            '1507003211169-0a1dd7228f2d',
                                            '1500648767791-00dcc994a43e',
                                            '1494790108377-be9c29b29330',
                                            '1534528741775-53994a69daeb',
                                            '1506794778202-cad84cf45f1d',
                                        ][i % 5]
                                    }?q=75&w=400&auto=format&fit=crop&fm=webp`,
                                }))}
                                colors={{
                                    name: '#ffffff',
                                    designation: '#ef4444',
                                    testimony: '#a3a3a3',
                                    arrowBackground: '#171717',
                                    arrowForeground: '#ffffff',
                                    arrowHoverBackground: '#ef4444',
                                }}
                                fontSizes={{
                                    name: '24px',
                                    designation: '14px',
                                    quote: '18px',
                                }}
                            />
                        </Deferred>
                    </div>
                </div>
            </section>

            {/* Contact Form */}
            <section id="contact" className="relative bg-background py-40">
                <div className="bg-grid-pattern absolute inset-0 opacity-5" />
                <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-24 border-b-2 border-racing-red pb-12 text-center">
                        <h2 className="mb-6 font-heading text-4xl font-bold tracking-tighter text-white uppercase md:text-6xl">
                            Demander une{' '}
                            <span className="text-racing-red">
                                Intervention
                            </span>
                        </h2>
                        <p className="mx-auto max-w-xl text-[11px] leading-loose font-bold tracking-[0.3em] text-muted-foreground uppercase">
                            Établissez un statut technique prioritaire en
                            soumettant vos besoins opérationnels.
                        </p>
                    </div>
                    <div className="animate-in duration-1000 fade-in slide-in-from-bottom">
                        <LeadForm />
                    </div>
                </div>

                {/* Background decorative element */}
                <div className="absolute top-1/2 left-0 h-[2px] w-64 bg-gradient-to-r from-racing-red/20 to-transparent" />
                <div className="absolute top-1/2 right-0 h-[2px] w-64 bg-gradient-to-l from-racing-red/20 to-transparent" />
            </section>
        </PublicLayout>
    );
}
