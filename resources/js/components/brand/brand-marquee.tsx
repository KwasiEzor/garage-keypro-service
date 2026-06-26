import type { Brand } from '@/types/models';

interface BrandMarqueeProps {
    brands: Brand[];
}

function BrandCard({ brand }: { brand: Brand }) {
    return (
        <div className="group relative mx-3 flex min-w-[180px] flex-shrink-0 items-center gap-4 border border-white/5 bg-luxury-charcoal/60 px-8 py-5 transition-all duration-500 hover:border-racing-red/40">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 h-3 w-3 border-t border-l border-white/10 transition-colors duration-500 group-hover:border-racing-red" />
            <div className="absolute right-0 bottom-0 h-3 w-3 border-r border-b border-white/10 transition-colors duration-500 group-hover:border-racing-red" />

            {/* Red glow on hover */}
            <div className="absolute inset-0 bg-racing-red/0 transition-colors duration-500 group-hover:bg-racing-red/5" />

            {brand.logo_path ? (
                <img
                    src={brand.logo_path}
                    alt={brand.name}
                    width={36}
                    height={36}
                    className="h-9 w-9 flex-shrink-0 object-contain opacity-40 brightness-200 grayscale filter transition-all duration-500 group-hover:opacity-100 group-hover:brightness-100 group-hover:grayscale-0"
                    loading="lazy"
                    decoding="async"
                />
            ) : (
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center border border-white/10 bg-white/5 transition-colors duration-500 group-hover:border-racing-red/30">
                    <span className="font-heading text-sm font-bold text-white/30 transition-colors duration-500 group-hover:text-racing-red">
                        {brand.name.charAt(0)}
                    </span>
                </div>
            )}

            <div>
                <span className="font-heading text-[11px] font-bold tracking-[0.2em] whitespace-nowrap text-white/40 uppercase transition-colors duration-500 group-hover:text-white">
                    {brand.name}
                </span>
                {brand.is_featured && (
                    <div className="mt-0.5">
                        <span className="font-heading text-[8px] font-bold tracking-[0.3em] text-racing-red/60 uppercase transition-colors duration-500 group-hover:text-racing-red">
                            Élite
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

function MarqueeRow({
    brands,
    reverse = false,
}: {
    brands: Brand[];
    reverse?: boolean;
}) {
    // Duplicate for seamless loop
    const items = [...brands, ...brands];

    return (
        <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
            <div
                className={[
                    'flex w-max',
                    reverse ? 'animate-marquee-reverse' : 'animate-marquee',
                    'group-hover/marquee:[animation-play-state:paused]',
                ].join(' ')}
            >
                {items.map((brand, i) => (
                    <BrandCard key={`${brand.id}-${i}`} brand={brand} />
                ))}
            </div>
        </div>
    );
}

export function BrandMarquee({ brands }: BrandMarqueeProps) {
    // Split into two rows
    const mid = Math.ceil(brands.length / 2);
    const row1 = brands.slice(0, mid);
    const row2 = brands.slice(mid);

    return (
        <div className="py-24">
            {/* Header */}
            <div className="mx-auto mb-16 max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
                    <div className="max-w-2xl border-l-4 border-racing-red pl-8">
                        <span className="mb-4 block font-heading text-[11px] font-bold tracking-[0.4em] text-racing-red uppercase">
                            Capacité Opérationnelle
                        </span>
                        <h2 className="font-heading text-4xl leading-none font-bold tracking-tighter text-white uppercase md:text-6xl">
                            Marques{' '}
                            <span className="text-racing-red">Certifiées</span>
                        </h2>
                    </div>
                    <p className="max-w-xs border-r border-white/10 pr-6 text-right text-[10px] leading-loose font-bold tracking-[0.25em] text-muted-foreground uppercase">
                        Protocoles de diagnostic exclusifs pour les
                        architectures automobiles d&apos;élite.
                    </p>
                </div>
            </div>

            {/* Marquee rows */}
            <div className="group/marquee flex flex-col gap-4">
                <MarqueeRow brands={row1} />
                <MarqueeRow brands={row2} reverse />
            </div>

            {/* Bottom label */}
            <div className="mx-auto mt-10 flex max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <span className="font-heading text-[10px] font-bold tracking-[0.35em] text-white/20 uppercase">
                    {brands.length}+ marques couvertes
                </span>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>
        </div>
    );
}
