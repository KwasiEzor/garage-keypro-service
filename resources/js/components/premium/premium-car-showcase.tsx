import { Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { premiumCars } from '@/data/premium-cars';
import { cn } from '@/lib/utils';

interface PremiumCarShowcaseProps {
    title?: string;
    subtitle?: string;
    limit?: number;
    showCTA?: boolean;
}

export function PremiumCarShowcase({
    title = 'Véhicules d\'Exception',
    subtitle = 'Expertise certifiée sur les véhicules les plus sophistiqués du monde.',
    limit,
    showCTA = true,
}: PremiumCarShowcaseProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const displayCars = limit ? premiumCars.slice(0, limit) : premiumCars;
    const active = displayCars[activeIndex];

    const startAutoPlay = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setActiveIndex((i) => (i + 1) % displayCars.length);
        }, 5000);
    };

    useEffect(() => {
        if (isAutoPlaying) startAutoPlay();
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isAutoPlaying, displayCars.length]);

    const handleSelect = (index: number) => {
        setActiveIndex(index);
        setIsAutoPlaying(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    return (
        <section className="relative overflow-hidden bg-black">
            {/* Hero area */}
            <div className="relative min-h-[90vh] w-full">
                {/* Full-bleed background image */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={active.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.9, ease: 'easeInOut' }}
                        className="absolute inset-0"
                    >
                        <img
                            src={active.image}
                            alt={`${active.brand} ${active.name}`}
                            className="h-full w-full object-cover"
                        />
                        {/* Multi-stop gradient: strong left for text, fade to transparent right */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-black/10" />
                        {/* Bottom fade */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </motion.div>
                </AnimatePresence>

                {/* Content overlay */}
                <div className="relative flex h-full min-h-[90vh] items-center">
                    <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:px-8 lg:px-12">
                        <div className="max-w-xl">
                            {/* Eyebrow */}
                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={`eyebrow-${active.id}`}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    className="mb-5 text-xs font-medium tracking-[0.3em] text-white/50 uppercase"
                                >
                                    {active.tagline}
                                </motion.p>
                            </AnimatePresence>

                            {/* Brand + Model headline */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`title-${active.id}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -12 }}
                                    transition={{ duration: 0.6, delay: 0.15 }}
                                >
                                    <h2 className="font-sans text-[56px] font-thin leading-none tracking-tight text-white md:text-[80px] lg:text-[96px]">
                                        {active.brand}
                                    </h2>
                                    <p className="mt-1 font-sans text-[28px] font-light tracking-wide text-white/60 md:text-[36px]">
                                        {active.name}
                                    </p>
                                </motion.div>
                            </AnimatePresence>

                            {/* Description */}
                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={`desc-${active.id}`}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.5, delay: 0.25 }}
                                    className="mt-8 max-w-sm text-sm font-light leading-relaxed text-white/50"
                                >
                                    {active.description}
                                </motion.p>
                            </AnimatePresence>

                            {/* CTA */}
                            {showCTA && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                    className="mt-12 flex items-center gap-8"
                                >
                                    <Link
                                        href="/appointments"
                                        className="group inline-flex items-center gap-3 text-sm font-medium text-white transition-opacity hover:opacity-70"
                                    >
                                        Réserver une intervention
                                        <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                                    </Link>
                                    <Link
                                        href="/services"
                                        className="text-sm font-light text-white/40 transition-colors hover:text-white/70"
                                    >
                                        Voir nos services
                                    </Link>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Progress bar */}
                {isAutoPlaying && (
                    <div className="absolute right-0 bottom-0 left-0 h-[2px] bg-white/10">
                        <motion.div
                            key={`progress-${active.id}`}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 5, ease: 'linear' }}
                            className="h-full origin-left bg-white/40"
                        />
                    </div>
                )}
            </div>

            {/* Car selector strip */}
            <div className="border-t border-white/5 bg-black">
                <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
                    <div className="grid grid-cols-3 divide-x divide-white/5 sm:grid-cols-6">
                        {displayCars.map((car, index) => (
                            <button
                                key={car.id}
                                onClick={() => handleSelect(index)}
                                className={cn(
                                    'group relative flex flex-col items-center gap-3 px-4 py-6 transition-all duration-300',
                                    activeIndex === index
                                        ? 'bg-white/5'
                                        : 'hover:bg-white/[0.03]',
                                )}
                            >
                                {/* Thumbnail */}
                                <div className="relative h-14 w-full overflow-hidden">
                                    <img
                                        src={`${car.image}&w=240&h=140&fit=crop`}
                                        alt={`${car.brand} ${car.name}`}
                                        className={cn(
                                            'h-full w-full object-cover transition-all duration-500',
                                            activeIndex === index
                                                ? 'opacity-100'
                                                : 'opacity-30 group-hover:opacity-50',
                                        )}
                                    />
                                </div>

                                {/* Label */}
                                <div className="text-center">
                                    <p
                                        className={cn(
                                            'text-[11px] font-medium tracking-wider transition-colors uppercase',
                                            activeIndex === index
                                                ? 'text-white'
                                                : 'text-white/30 group-hover:text-white/50',
                                        )}
                                    >
                                        {car.brand}
                                    </p>
                                    <p
                                        className={cn(
                                            'mt-0.5 text-[10px] font-light transition-colors',
                                            activeIndex === index
                                                ? 'text-white/50'
                                                : 'text-white/20',
                                        )}
                                    >
                                        {car.name}
                                    </p>
                                </div>

                                {/* Active indicator */}
                                <div
                                    className={cn(
                                        'absolute bottom-0 left-1/2 h-[2px] -translate-x-1/2 bg-white transition-all duration-300',
                                        activeIndex === index ? 'w-8' : 'w-0',
                                    )}
                                />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
