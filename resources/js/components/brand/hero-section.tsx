import { useEffect, useRef, useState } from 'react';

interface HeroSectionProps {
    title: string;
    subtitle?: string;
    badge?: string;
    heroImageUrl?: string;
    ctaPrimary?: { text: string; href: string };
    ctaSecondary?: { text: string; href: string };
}

const DEFAULT_HERO_IMAGE =
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2500&auto=format&fit=crop';

const STATS = [
    { label: 'Temps de Réponse', value: 15, suffix: ' MIN' },
    { label: 'Taux de Succès', value: 99.9, suffix: '%' },
    { label: 'Expérience Ops', value: 12, suffix: '+ ANS' },
    { label: "Prêt à l'action", value: 24, suffix: '/7' },
];

const PARTICLES = [
    { left: '10%', delay: '0s', duration: '5s' },
    { left: '25%', delay: '1.2s', duration: '4s' },
    { left: '40%', delay: '0.5s', duration: '6s' },
    { left: '55%', delay: '2s', duration: '4.5s' },
    { left: '70%', delay: '0.8s', duration: '5.5s' },
    { left: '82%', delay: '1.8s', duration: '4s' },
    { left: '92%', delay: '0.3s', duration: '6s' },
];

function useCountUp(target: number, duration = 1800, decimals = 0) {
    const [count, setCount] = useState(0);
    const rafRef = useRef<number>(0);

    useEffect(() => {
        const start = performance.now();
        const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            setCount(parseFloat((ease * target).toFixed(decimals)));

            if (progress < 1) {
                rafRef.current = requestAnimationFrame(step);
            }
        };
        rafRef.current = requestAnimationFrame(step);

        return () => cancelAnimationFrame(rafRef.current);
    }, [target, duration, decimals]);

    return count;
}

const CYCLING_KEYWORDS = [
    'Clés Auto',
    'Diagnostic',
    'Programmation',
    'Serrurerie',
];

function useCyclingTypewriter(
    words: string[],
    typeSpeed = 80,
    deleteSpeed = 45,
    pause = 1800,
) {
    const [displayed, setDisplayed] = useState(words[0]);
    const [isDeleting, setIsDeleting] = useState(false);
    const [wordIndex, setWordIndex] = useState(0);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const current = words[wordIndex % words.length];

        const tick = () => {
            if (!isDeleting) {
                if (displayed.length < current.length) {
                    setDisplayed(current.slice(0, displayed.length + 1));
                    timeoutRef.current = setTimeout(tick, typeSpeed);
                } else {
                    timeoutRef.current = setTimeout(
                        () => setIsDeleting(true),
                        pause,
                    );
                }
            } else {
                if (displayed.length > 0) {
                    setDisplayed(current.slice(0, displayed.length - 1));
                    timeoutRef.current = setTimeout(tick, deleteSpeed);
                } else {
                    setIsDeleting(false);
                    setWordIndex((i) => i + 1);
                }
            }
        };

        timeoutRef.current = setTimeout(
            tick,
            isDeleting ? deleteSpeed : typeSpeed,
        );

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [
        displayed,
        isDeleting,
        wordIndex,
        words,
        typeSpeed,
        deleteSpeed,
        pause,
    ]);

    return { displayed, isDeleting };
}

function StatItem({ stat, index }: { stat: (typeof STATS)[0]; index: number }) {
    const decimals = stat.value % 1 !== 0 ? 1 : 0;
    const count = useCountUp(stat.value, 1800 + index * 200, decimals);
    const [flashed, setFlashed] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setFlashed(true), 1800 + index * 200);

        return () => clearTimeout(t);
    }, [index]);

    return (
        <div className="group relative">
            <div
                className={[
                    'mb-1 font-heading text-3xl font-bold transition-colors',
                    flashed ? 'text-white' : 'text-white',
                    'group-hover:text-racing-red',
                ].join(' ')}
                style={flashed ? { animation: 'stat-flash 0.6s ease-out' } : {}}
            >
                {count}
                {stat.suffix}
            </div>
            <div className="font-heading text-[10px] font-bold tracking-widest text-muted-foreground uppercase transition-colors group-hover:text-white">
                {stat.label}
            </div>
            <div className="mt-2 h-[1px] w-0 bg-racing-red transition-all duration-500 group-hover:w-full" />
        </div>
    );
}

export function HeroSection({
    title,
    subtitle,
    badge,
    heroImageUrl,
    ctaPrimary,
    ctaSecondary,
}: HeroSectionProps) {
    const words = title.split(' ');
    const { displayed: cycledWord, isDeleting } =
        useCyclingTypewriter(CYCLING_KEYWORDS);

    return (
        <div className="relative flex min-h-[92vh] items-center overflow-hidden bg-background">
            {/* ── Background image ──────────────────────────────────── */}
            <div className="absolute inset-0 z-0">
                <img
                    src={heroImageUrl || DEFAULT_HERO_IMAGE}
                    alt="Véhicule de luxe haute performance"
                    className="h-full w-full object-cover opacity-35"
                    fetchPriority="high"
                    decoding="async"
                    width="2500"
                    height="1406"
                    style={{
                        animation: 'ken-burns 24s ease-in-out infinite',
                        transformOrigin: 'center center',
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
                <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background" />
            </div>

            {/* ── Scanlines overlay ─────────────────────────────────── */}
            <div
                className="pointer-events-none absolute inset-0 z-[1] opacity-[0.03]"
                style={{
                    backgroundImage:
                        'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.8) 2px, rgba(255,255,255,0.8) 4px)',
                    animation: 'scanlines 3s linear infinite',
                }}
            />

            {/* ── Grid pattern ──────────────────────────────────────── */}
            <div className="bg-grid-pattern absolute inset-0 z-[1] opacity-[0.07]" />

            {/* ── Drifting glow orbs ────────────────────────────────── */}
            <div
                className="pointer-events-none absolute top-1/3 left-1/4 z-[1] h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-racing-red/8 blur-[160px]"
                style={{ animation: 'glow-drift 12s ease-in-out infinite' }}
            />
            <div
                className="pointer-events-none absolute top-2/3 right-1/4 z-[1] h-[400px] w-[400px] rounded-full bg-racing-red/6 blur-[120px]"
                style={{ animation: 'glow-drift-2 18s ease-in-out infinite' }}
            />

            {/* ── Floating particles ────────────────────────────────── */}
            <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
                {PARTICLES.map((p, i) => (
                    <div
                        key={i}
                        className="absolute bottom-0 h-1 w-1 rounded-full bg-racing-red/60"
                        style={{
                            left: p.left,
                            animation: `float-particle ${p.duration} ease-out ${p.delay} infinite`,
                        }}
                    />
                ))}
            </div>

            {/* ── Decorative vertical accent lines ──────────────────── */}
            <div className="absolute top-0 bottom-0 left-8 z-[2] hidden w-[1px] bg-gradient-to-b from-transparent via-racing-red/20 to-transparent lg:block" />
            <div className="absolute right-12 bottom-24 z-[2] hidden h-40 w-[2px] bg-gradient-to-t from-racing-red to-transparent lg:block" />
            <div className="absolute top-20 right-40 z-[2] hidden h-20 w-[1px] bg-gradient-to-b from-racing-red/40 to-transparent lg:block" />

            {/* ── Content ───────────────────────────────────────────── */}
            <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
                <div className="max-w-4xl">
                    {/* Badge */}
                    <div
                        className="mb-10 flex items-center gap-4"
                        style={{
                            animation:
                                'fade-in 0.6s ease-out 0.1s both, slide-in-from-left 0.6s ease-out 0.1s both',
                        }}
                    >
                        <div
                            className="h-[2px] bg-racing-red"
                            style={{
                                animation: 'line-draw 0.8s ease-out 0.3s both',
                            }}
                        />
                        <span className="font-heading text-[11px] font-bold tracking-[0.4em] text-racing-red uppercase">
                            {badge || 'Protocoles de Sécurité Avancés'}
                        </span>
                        <div className="h-[1px] w-8 bg-white/10" />
                    </div>

                    {/* Title — word by word */}
                    <h1 className="mb-4 font-heading text-5xl leading-[1.05] font-bold tracking-tight text-white sm:text-7xl md:text-8xl">
                        {words.map((word, i) => (
                            <span
                                key={i}
                                className="mr-[0.2em] inline-block last:mr-0"
                                style={{
                                    animation: `fade-in 0.5s ease-out ${0.4 + i * 0.12}s both, slide-in-from-bottom 0.5s ease-out ${0.4 + i * 0.12}s both`,
                                }}
                            >
                                {word === 'Technicien' || word === 'Expert' ? (
                                    <span className="text-glow text-racing-red">
                                        {word}
                                    </span>
                                ) : (
                                    word
                                )}
                            </span>
                        ))}
                    </h1>

                    {/* Cycling typewriter — own line, white, smaller */}
                    <div
                        className="mb-10 flex h-9 items-center gap-2"
                        style={{
                            animation: `fade-in 0.5s ease-out ${0.4 + words.length * 0.12}s both`,
                        }}
                    >
                        <span className="font-heading text-xl font-bold tracking-[0.15em] text-white sm:text-2xl">
                            {cycledWord}
                        </span>
                        <span
                            className="inline-block h-[1.1em] w-[2px] translate-y-[1px] bg-white align-middle"
                            style={{
                                animation: isDeleting
                                    ? 'none'
                                    : 'cursor-blink 0.5s step-end infinite',
                                opacity: isDeleting ? 0.2 : 1,
                            }}
                        />
                    </div>

                    {/* Subtitle with animated left border */}
                    {subtitle && (
                        <div
                            className="relative mb-14 pl-8"
                            style={{
                                animation: `fade-in 0.6s ease-out ${0.4 + words.length * 0.12 + 0.2}s both`,
                            }}
                        >
                            <div
                                className="absolute top-0 left-0 w-[2px] bg-racing-red/50"
                                style={{
                                    animation: `float-particle 0s, line-draw 0.001s`,
                                    height: '100%',
                                    width: '2px',
                                    animationName: 'none',
                                    transition: 'none',
                                }}
                            >
                                <div
                                    className="w-full bg-racing-red/50"
                                    style={{
                                        animation: `line-draw-vertical 0.8s ease-out ${0.4 + words.length * 0.12 + 0.4}s both`,
                                        height: '100%',
                                    }}
                                />
                            </div>
                            <p className="max-w-2xl leading-relaxed font-medium tracking-wide text-muted-foreground md:text-xl">
                                {subtitle}
                            </p>
                        </div>
                    )}

                    {/* CTA Buttons */}
                    <div
                        className="mb-24 flex flex-col gap-6 sm:flex-row"
                        style={{
                            animation: `fade-in 0.6s ease-out ${0.4 + words.length * 0.12 + 0.4}s both, slide-in-from-bottom 0.6s ease-out ${0.4 + words.length * 0.12 + 0.4}s both`,
                        }}
                    >
                        {ctaPrimary && (
                            <a
                                href={ctaPrimary.href}
                                className="group/btn skewed-btn relative min-w-[240px] overflow-hidden bg-racing-red text-white transition-colors hover:bg-white hover:text-luxury-black"
                            >
                                {/* Shine sweep */}
                                <span className="absolute inset-0 -translate-x-full skew-x-12 bg-white/20 transition-transform duration-500 group-hover/btn:translate-x-full" />
                                <span className="relative">
                                    {ctaPrimary.text}
                                </span>
                            </a>
                        )}
                        {ctaSecondary && (
                            <a
                                href={ctaSecondary.href}
                                className="group/btn skewed-btn relative min-w-[240px] overflow-hidden border border-white/10 text-white transition-all hover:border-racing-red hover:text-racing-red"
                            >
                                <span className="absolute inset-0 -translate-x-full skew-x-12 bg-racing-red/10 transition-transform duration-500 group-hover/btn:translate-x-full" />
                                <span className="relative">
                                    {ctaSecondary.text}
                                </span>
                            </a>
                        )}
                    </div>

                    {/* Stats with counter-up */}
                    <div
                        className="grid grid-cols-2 gap-12 border-t border-white/5 pt-12 sm:grid-cols-4"
                        style={{
                            animation: `fade-in 0.8s ease-out ${0.4 + words.length * 0.12 + 0.7}s both`,
                        }}
                    >
                        {STATS.map((stat, i) => (
                            <StatItem key={i} stat={stat} index={i} />
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Industrial diagonal divider ───────────────────────── */}
            <div className="absolute bottom-0 left-0 z-20 w-full translate-y-[1px] overflow-hidden leading-[0]">
                <svg
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                    className="relative block h-[100px] w-[calc(100%+1.3px)] fill-background"
                >
                    <path d="M1200 120L0 120 0 0z" />
                </svg>
            </div>
        </div>
    );
}
