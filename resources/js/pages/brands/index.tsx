import { useState } from 'react';
import { BrandGrid } from '@/components/brand/brand-grid';
import { LeadForm } from '@/components/brand/lead-form';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { premiumCars } from '@/data/premium-cars';
import PublicLayout from '@/layouts/public-layout';

import type { Brand } from '@/types';

interface BrandsIndexProps {
    brands: Brand[];
}

export default function BrandsIndex({ brands }: BrandsIndexProps) {
    const brandsList = Array.isArray(brands) ? brands : [];
    const [search, setSearch] = useState('');

    const filteredBrands = brandsList.filter((brand) =>
        brand.name.toLowerCase().includes(search.toLowerCase()),
    );

    const featuredBrands = filteredBrands.filter((b) => b.is_featured);
    const otherBrands = filteredBrands.filter((b) => !b.is_featured);

    return (
        <PublicLayout>
            {/* Hero Section */}
            <section className="relative overflow-hidden border-b border-white/5 bg-luxury-black py-48">
                <div className="bg-grid-pattern absolute inset-0 opacity-10" />
                <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-racing-red/5 blur-[150px]" />

                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <span className="mb-6 block animate-in font-heading text-[11px] font-bold tracking-[0.5em] text-racing-red uppercase duration-1000 fade-in slide-in-from-left">
                            Répertoire Technique de Précision
                        </span>
                        <h1 className="mb-8 animate-in font-heading text-5xl leading-none font-bold tracking-tighter text-white uppercase delay-200 duration-1000 fade-in slide-in-from-bottom md:text-8xl">
                            Écosystème <br />
                            <span className="text-racing-red">Automobile</span>
                        </h1>
                        <div className="scale-in-x mb-12 h-[2px] w-32 origin-left animate-in bg-racing-red delay-500 duration-1000 fade-in" />

                        <p className="max-w-xl animate-in border-l-4 border-racing-red/50 pl-8 text-lg leading-loose font-medium tracking-wide text-muted-foreground italic delay-300 duration-1000 fade-in slide-in-from-bottom">
                            "Nous maintenons une compatibilité totale avec les
                            protocoles de sécurité les plus complexes,
                            garantissant une intégrité absolue pour chaque
                            intervention."
                        </p>
                    </div>
                </div>
            </section>

            {/* Search & Filter Section */}
            <section className="sticky top-0 z-40 border-b border-white/5 bg-background/80 py-8 backdrop-blur-xl">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="group relative max-w-xl">
                        <div className="absolute -inset-2 bg-racing-red/5 opacity-0 blur-xl transition-all group-focus-within:bg-racing-red/10 group-focus-within:opacity-100" />
                        <div className="relative flex items-center">
                            <div className="absolute left-6 text-white/20 transition-colors group-focus-within:text-racing-red">
                                <Icon name="Search" className="h-5 w-5" />
                            </div>
                            <Input
                                type="search"
                                placeholder="Identifier un constructeur..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-16 -skew-x-6 transform rounded-none border-white/10 bg-luxury-charcoal/50 pr-8 pl-16 font-heading text-[11px] font-bold tracking-[0.2em] text-white uppercase transition-all placeholder:text-white/20 focus:border-racing-red/50 focus:ring-0"
                            />
                            <div className="absolute right-4 h-8 w-px bg-white/10" />
                            <div className="absolute right-8 hidden font-heading text-[10px] font-bold tracking-widest text-white/20 uppercase sm:block">
                                {filteredBrands.length} Unités
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="mx-auto max-w-7xl px-4 pb-32 sm:px-6 lg:px-8">
                {featuredBrands.length > 0 && (
                    <div className="animate-in duration-1000 fade-in">
                        <BrandGrid
                            brands={featuredBrands}
                            title="Marques Élite"
                        />
                    </div>
                )}

                {otherBrands.length > 0 && (
                    <div className="mt-20 animate-in border-t border-white/5 pt-20 delay-500 duration-1000 fade-in">
                        <BrandGrid
                            brands={otherBrands}
                            title="Couverture Étendue"
                        />
                    </div>
                )}

                {filteredBrands.length === 0 && (
                    <div className="mt-20 -skew-x-6 transform border border-dashed border-white/10 bg-luxury-charcoal/30 py-48 text-center">
                        <div className="skew-x-6">
                            <div className="relative mb-8 inline-block">
                                <Icon
                                    name="SearchX"
                                    className="h-20 w-20 text-racing-red/10"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Icon
                                        name="AlertTriangle"
                                        className="h-8 w-8 animate-pulse text-racing-red"
                                    />
                                </div>
                            </div>
                            <p className="font-heading text-[12px] font-bold tracking-[0.5em] text-muted-foreground uppercase">
                                Signal non identifié : "{search}"
                            </p>
                            <button
                                onClick={() => setSearch('')}
                                className="mt-8 border-b border-racing-red/30 pb-1 font-heading text-[10px] font-bold tracking-widest text-racing-red uppercase transition-colors hover:border-white hover:text-white"
                            >
                                Réinitialiser le Scanner
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Premium Vehicles Showcase */}
            <section className="relative overflow-hidden border-t border-white/5 bg-luxury-black py-32">
                <div className="absolute top-0 left-1/3 h-[400px] w-[400px] rounded-full bg-racing-red/5 blur-[120px]" />

                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-24 text-center">
                        <span className="mb-4 block font-heading text-[11px] font-bold tracking-[0.4em] text-racing-red uppercase">
                            Portfolio Premium
                        </span>
                        <h2 className="mb-8 font-heading text-4xl font-bold tracking-tighter text-white uppercase md:text-6xl">
                            Véhicules{' '}
                            <span className="text-racing-red">
                                Haute Performance
                            </span>
                        </h2>
                        <p className="mx-auto max-w-2xl text-xs font-bold tracking-[0.25em] text-muted-foreground uppercase">
                            Expertise certifiée sur les modèles les plus
                            sophistiqués du marché
                        </p>
                        <div className="mx-auto mt-8 h-[2px] w-24 bg-racing-red" />
                    </div>

                    <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
                        {premiumCars.map((car, index) => (
                            <div
                                key={car.id}
                                className="group relative overflow-hidden border border-white/10 bg-luxury-charcoal transition-all hover:border-racing-red/50"
                                style={{
                                    animationDelay: `${index * 100}ms`,
                                }}
                            >
                                <div className="aspect-[3/4] overflow-hidden">
                                    <img
                                        src={car.image}
                                        alt={`${car.brand} ${car.name} - ${car.year}`}
                                        className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-60" />
                                </div>
                                <div className="absolute right-0 bottom-0 left-0 p-4">
                                    <div className="mb-1 font-heading text-[10px] font-bold tracking-wider text-racing-red uppercase">
                                        {car.brand}
                                    </div>
                                    <div className="text-[9px] font-medium text-white">
                                        {car.name}
                                    </div>
                                    <div className="mt-1 text-[8px] text-muted-foreground">
                                        {car.year}
                                    </div>
                                </div>

                                {/* Hover overlay */}
                                <div className="absolute inset-0 flex items-center justify-center bg-luxury-black/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                    <div className="px-4 text-center">
                                        <Icon
                                            name="Key"
                                            className="mx-auto mb-2 h-8 w-8 text-racing-red"
                                        />
                                        <p className="text-[8px] font-bold tracking-widest text-white uppercase">
                                            Programmation Certifiée
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <a
                            href="/gallery"
                            className="group inline-flex items-center gap-4 border border-racing-red bg-transparent px-10 py-4 font-heading text-sm font-bold tracking-widest text-racing-red uppercase transition-all hover:bg-racing-red hover:text-white"
                        >
                            Voir la Galerie Complète
                            <Icon
                                name="ArrowRight"
                                className="h-4 w-4 transition-transform group-hover:translate-x-2"
                            />
                        </a>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section
                id="contact"
                className="relative overflow-hidden border-t border-white/5 bg-luxury-charcoal/30 py-48"
            >
                <div className="bg-grid-pattern pointer-events-none absolute inset-0 opacity-5" />
                <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-24 text-center">
                        <span className="mb-6 block font-heading text-[11px] font-bold tracking-[0.5em] text-racing-red uppercase">
                            Support Clientèle
                        </span>
                        <h2 className="mb-10 font-heading text-4xl leading-[0.9] font-bold tracking-tighter text-white uppercase md:text-6xl">
                            Votre Marque <br />
                            <span className="text-racing-red">
                                N'est Pas Listée ?
                            </span>
                        </h2>
                        <div className="flex items-center justify-center gap-6">
                            <div className="h-[2px] w-12 bg-white/10" />
                            <p className="text-[10px] font-bold tracking-[0.4em] text-muted-foreground uppercase">
                                Contactez-nous pour une validation de
                                compatibilité
                            </p>
                            <div className="h-[2px] w-12 bg-white/10" />
                        </div>
                    </div>

                    <div className="animate-in duration-1000 fade-in slide-in-from-bottom">
                        <LeadForm title="Consultation Technique" />
                    </div>
                </div>
            </section>

            {/* Footer Decoration */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-racing-red/30 to-transparent" />
        </PublicLayout>
    );
}
