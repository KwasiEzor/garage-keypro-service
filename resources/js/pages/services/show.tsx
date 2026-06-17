import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeftIcon,
    ShieldCheckIcon,
    ClockIcon,
    BadgeCheckIcon,
} from 'lucide-react';
import { ServiceCard } from '@/components/brand/service-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { premiumCars } from '@/data/premium-cars';
import PublicLayout from '@/layouts/public-layout';

interface Service {
    id: number;
    name: string;
    slug: string;
    description: string;
    content?: string;
    starting_price: number;
    duration_minutes: number;
    image_url?: string;
    is_featured: boolean;
}

interface Props {
    service: Service;
    relatedServices: Service[];
}

export default function Show({ service, relatedServices }: Props) {
    return (
        <PublicLayout>
            <Head title={`${service.name} - Protocoles KEYPRO`} />

            <div className="relative mx-auto max-w-7xl px-4 pt-32 pb-24 sm:px-6 lg:px-8">
                {/* Navigation / Breadcrumbs */}
                <div className="mb-12">
                    <Link
                        href="/services"
                        className="group flex items-center gap-2 font-heading text-[10px] font-bold tracking-[0.3em] text-muted-foreground uppercase transition-all hover:text-racing-red"
                    >
                        <ArrowLeftIcon className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                        Retour aux Services
                    </Link>
                </div>

                <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-12">
                    {/* Left Column: Media & Specs */}
                    <div className="space-y-8 lg:col-span-5">
                        <div className="group relative aspect-[4/5] overflow-hidden border border-white/5 bg-luxury-charcoal">
                            {service.image_url ? (
                                <img
                                    src={service.image_url}
                                    alt={service.name}
                                    className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-luxury-black/50">
                                    <ShieldCheckIcon className="h-24 w-24 text-racing-red/10" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-transparent opacity-60" />

                            <div className="absolute bottom-0 left-0 w-full p-8">
                                <Badge className="mb-4 rounded-none border-none bg-racing-red px-4 py-1.5 font-heading text-[10px] font-bold tracking-widest text-white uppercase">
                                    Protocole Certifié
                                </Badge>
                            </div>
                        </div>

                        {/* Technical Specifications Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 border border-white/5 bg-luxury-charcoal/30 p-6">
                                <ClockIcon className="h-4 w-4 text-racing-red" />
                                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                    Durée Standard
                                </p>
                                <p className="font-heading text-xl font-bold text-white uppercase">
                                    {service.duration_minutes} MIN
                                </p>
                            </div>
                            <div className="space-y-2 border border-white/5 bg-luxury-charcoal/30 p-6">
                                <BadgeCheckIcon className="h-4 w-4 text-racing-red" />
                                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                    Garantie
                                </p>
                                <p className="font-heading text-xl font-bold text-white uppercase">
                                    12 MOIS
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Information & Booking */}
                    <div className="space-y-12 lg:col-span-7">
                        <div>
                            <div className="mb-6 flex items-center gap-3">
                                <div className="h-8 w-[4px] bg-racing-red" />
                                <span className="font-heading text-[11px] font-bold tracking-[0.5em] text-muted-foreground uppercase">
                                    Spécification Technique
                                </span>
                            </div>
                            <h1 className="font-heading text-5xl leading-none font-bold tracking-tighter text-white uppercase md:text-6xl">
                                {service.name.split(' ').map((word, i) => (
                                    <span
                                        key={i}
                                        className={
                                            i === 0
                                                ? 'text-chrome'
                                                : 'text-white'
                                        }
                                    >
                                        {word}{' '}
                                    </span>
                                ))}
                            </h1>
                            <div className="mt-8 flex items-baseline gap-4">
                                <span className="text-[10px] font-bold tracking-[0.3em] text-muted-foreground uppercase">
                                    À partir de
                                </span>
                                <span className="font-heading text-4xl font-bold tracking-tighter text-racing-red">
                                    {service.starting_price}€
                                </span>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="prose prose-invert max-w-none">
                                <p className="text-lg leading-relaxed font-light text-white/80">
                                    {service.description}
                                </p>
                                {service.content && (
                                    <div
                                        className="mt-8 border-t border-white/5 pt-8 leading-relaxed text-muted-foreground"
                                        dangerouslySetInnerHTML={{
                                            __html: service.content,
                                        }}
                                    />
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-8 border-t border-white/5 pt-8 md:grid-cols-2">
                                <div className="space-y-4">
                                    <h3 className="font-heading text-[10px] font-bold tracking-[0.2em] text-white uppercase">
                                        Inclusions du Protocole
                                    </h3>
                                    <ul className="space-y-3">
                                        {[
                                            'Diagnostic Précis',
                                            'Pièces Certifiées',
                                            'Rapport Technique',
                                            'Nettoyage Final',
                                        ].map((item, i) => (
                                            <li
                                                key={i}
                                                className="flex items-center gap-3 text-[10px] font-bold tracking-widest text-muted-foreground uppercase"
                                            >
                                                <div className="h-1 w-1 bg-racing-red" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="font-heading text-[10px] font-bold tracking-[0.2em] text-white uppercase">
                                        Sécurité & Normes
                                    </h3>
                                    <div className="flex items-start gap-3 border border-racing-red/10 bg-racing-red/5 p-4">
                                        <ShieldCheckIcon className="h-5 w-5 shrink-0 text-racing-red" />
                                        <p className="text-[10px] leading-relaxed tracking-wider text-muted-foreground uppercase">
                                            Tous nos protocoles respectent les
                                            standards de sécurité les plus
                                            stricts de l'industrie automobile.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-6 pt-8 sm:flex-row">
                                <Link href="/appointments" className="flex-1">
                                    <Button className="skewed-btn h-16 w-full bg-racing-red font-heading font-bold tracking-[0.2em] text-white uppercase transition-all hover:bg-white hover:text-luxury-black">
                                        Initialiser le Protocole
                                    </Button>
                                </Link>
                                <Button
                                    variant="outline"
                                    className="h-16 rounded-none border-white/10 px-8 font-heading font-bold tracking-[0.2em] text-white uppercase hover:bg-white/5"
                                >
                                    Fiche Technique (PDF)
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Premium Vehicles We Service */}
                <div className="mt-32 border-t border-white/5 pt-24">
                    <div className="mb-20 text-center">
                        <span className="mb-4 block font-heading text-[11px] font-bold tracking-[0.4em] text-racing-red uppercase">
                            Expertise Premium
                        </span>
                        <h2 className="mb-8 font-heading text-4xl font-bold tracking-tighter text-white uppercase">
                            Véhicules{' '}
                            <span className="text-racing-red">Haute Gamme</span>
                        </h2>
                        <p className="mx-auto max-w-2xl text-xs font-bold tracking-[0.25em] text-muted-foreground uppercase">
                            Nous intervenons sur les modèles les plus
                            sophistiqués
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
                        {premiumCars.map((car) => (
                            <Link
                                key={car.id}
                                href="/gallery"
                                className="group relative overflow-hidden border border-white/10 bg-luxury-charcoal transition-all hover:border-racing-red/50"
                            >
                                <div className="aspect-[3/4] overflow-hidden">
                                    <img
                                        src={car.image}
                                        alt={`${car.brand} ${car.name}`}
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-transparent opacity-80 group-hover:opacity-60" />
                                </div>
                                <div className="absolute right-0 bottom-0 left-0 p-4">
                                    <div className="font-heading text-[10px] font-bold tracking-wider text-racing-red uppercase">
                                        {car.brand}
                                    </div>
                                    <div className="text-[9px] font-medium text-white">
                                        {car.name}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Related Services */}
                {relatedServices.length > 0 && (
                    <div className="mt-32 border-t border-white/5 pt-24">
                        <div className="mb-20 flex flex-col items-center text-center">
                            <span className="mb-4 block font-heading text-[11px] font-bold tracking-[0.4em] text-racing-red uppercase">
                                Expansion
                            </span>
                            <h2 className="font-heading text-4xl font-bold tracking-tighter text-white uppercase">
                                Protocoles{' '}
                                <span className="text-racing-red">
                                    Associés
                                </span>
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
                            {relatedServices.map((relatedService) => (
                                <ServiceCard
                                    key={relatedService.id}
                                    service={relatedService}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
