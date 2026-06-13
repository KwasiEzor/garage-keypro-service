import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { Icon } from '@/components/ui/icon';
import { premiumCars } from '@/data/premium-cars';
import { cn } from '@/lib/utils';

interface PremiumCarShowcaseProps {
    title?: string;
    subtitle?: string;
    limit?: number;
    showCTA?: boolean;
}

export function PremiumCarShowcase({
    title = 'Véhicules Premium',
    subtitle = 'Expertise certifiée sur véhicules haut de gamme',
    limit,
    showCTA = true,
}: PremiumCarShowcaseProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const displayCars = limit ? premiumCars.slice(0, limit) : premiumCars;

    return (
        <section className="relative overflow-hidden border-b border-white/5 bg-luxury-black py-32">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-1/4 h-[400px] w-[400px] rounded-full bg-racing-red/5 blur-[120px]" />
            <div className="absolute right-1/4 bottom-0 h-[400px] w-[400px] rounded-full bg-white/5 blur-[120px]" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="mb-24 text-center">
                    <span className="mb-4 block font-heading text-[11px] font-bold tracking-[0.4em] text-racing-red uppercase">
                        Excellence Automobile
                    </span>
                    <h2 className="mb-8 font-heading text-4xl font-bold tracking-tighter text-white uppercase md:text-6xl">
                        {title.split(' ').map((word, i) => (
                            <span key={i}>
                                {i === title.split(' ').length - 1 ? (
                                    <span className="text-racing-red">
                                        {word}
                                    </span>
                                ) : (
                                    `${word} `
                                )}
                            </span>
                        ))}
                    </h2>
                    <p className="mx-auto max-w-2xl text-xs font-bold tracking-[0.25em] text-muted-foreground uppercase">
                        {subtitle}
                    </p>
                    <div className="mx-auto mt-8 h-[2px] w-24 bg-racing-red" />
                </div>

                {/* Main Featured Car */}
                <div className="mb-16 grid grid-cols-1 gap-16 lg:grid-cols-2">
                    <div className="group relative">
                        <div className="absolute -inset-6 -skew-y-3 transform border border-racing-red/20 transition-all duration-700 group-hover:border-racing-red/50" />
                        <div className="relative -skew-y-3 transform overflow-hidden bg-luxury-charcoal">
                            <img
                                src={displayCars[activeIndex].image}
                                alt={`${displayCars[activeIndex].brand} ${displayCars[activeIndex].name}`}
                                className="w-full object-cover transition-all duration-1000 group-hover:scale-110"
                                style={{ minHeight: '400px' }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/80 via-transparent to-transparent" />

                            {/* Car badge */}
                            <div className="absolute bottom-6 left-6 skew-y-3">
                                <div className="border border-white/20 bg-luxury-black/90 p-6 backdrop-blur-sm">
                                    <div className="mb-2 font-heading text-sm font-bold tracking-widest text-racing-red uppercase">
                                        {displayCars[activeIndex].brand}
                                    </div>
                                    <div className="font-heading text-2xl font-bold text-white">
                                        {displayCars[activeIndex].name}
                                    </div>
                                    <div className="mt-2 text-xs font-medium tracking-wide text-muted-foreground">
                                        {displayCars[activeIndex].year}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center space-y-8">
                        <div className="flex items-center gap-4">
                            <Icon
                                name="Key"
                                className="h-6 w-6 text-racing-red"
                            />
                            <span className="font-heading text-[10px] font-bold tracking-[0.2em] text-white uppercase">
                                Programmation Avancée
                            </span>
                        </div>

                        {/* Features list */}
                        <div className="space-y-4">
                            {[
                                'Programmation clé électronique',
                                'Diagnostic système embarqué',
                                'Remplacement clé de luxe',
                                'Service mobile prioritaire',
                            ].map((feature, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-4 border-b border-white/5 pb-4"
                                >
                                    <div className="flex h-8 w-8 -skew-x-12 items-center justify-center border border-racing-red/30 bg-racing-red/10">
                                        <Icon
                                            name="Check"
                                            className="h-4 w-4 skew-x-12 text-racing-red"
                                        />
                                    </div>
                                    <span className="text-sm font-medium tracking-wide text-white">
                                        {feature}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {showCTA && (
                            <div className="pt-6">
                                <Link
                                    href="/appointments"
                                    className="group inline-flex items-center gap-4 border border-racing-red bg-racing-red px-10 py-4 font-heading text-sm font-bold tracking-widest text-white uppercase transition-all hover:bg-racing-red/90"
                                >
                                    Réserver Intervention
                                    <Icon
                                        name="ArrowRight"
                                        className="h-4 w-4 transition-transform group-hover:translate-x-2"
                                    />
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Car Grid Selector */}
                <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
                    {displayCars.map((car, index) => (
                        <button
                            key={car.id}
                            onClick={() => setActiveIndex(index)}
                            className={cn(
                                'group relative overflow-hidden border bg-luxury-charcoal transition-all',
                                activeIndex === index
                                    ? 'border-racing-red'
                                    : 'border-white/10 hover:border-white/30',
                            )}
                        >
                            <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-luxury-charcoal to-luxury-black">
                                <img
                                    src={car.image}
                                    alt={`${car.brand} ${car.name}`}
                                    className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-110"
                                />
                                <div
                                    className={cn(
                                        'absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent transition-opacity',
                                        activeIndex === index
                                            ? 'opacity-40'
                                            : 'opacity-80 group-hover:opacity-60',
                                    )}
                                />
                            </div>
                            <div className="absolute right-0 bottom-0 left-0 p-3">
                                <div
                                    className={cn(
                                        'font-heading text-[10px] font-bold tracking-wider uppercase transition-colors',
                                        activeIndex === index
                                            ? 'text-racing-red'
                                            : 'text-white',
                                    )}
                                >
                                    {car.brand}
                                </div>
                                <div className="text-[9px] font-medium text-muted-foreground">
                                    {car.name}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
