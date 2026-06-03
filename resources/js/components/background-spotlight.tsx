import { gsap } from 'gsap';
import { useEffect, useRef, useState } from 'react';

export default function BackgroundSpotlight() {
    const spotlightRef = useRef<HTMLDivElement>(null);
    const [isDesktop, setIsDesktop] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    });
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    });

    useEffect(() => {
        const hoverMediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
        const motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

        const hoverHandler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
        const motionHandler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);

        hoverMediaQuery.addEventListener('change', hoverHandler);
        motionMediaQuery.addEventListener('change', motionHandler);

        return () => {
            hoverMediaQuery.removeEventListener('change', hoverHandler);
            motionMediaQuery.removeEventListener('change', motionHandler);
        };
    }, []);

    useEffect(() => {
        if (!isDesktop || prefersReducedMotion) {
            return;
        }

        const spotlight = spotlightRef.current;

        if (!spotlight) {
            return;
        }

        // Initially hidden
        gsap.set(spotlight, { opacity: 0 });

        // Smoothly track mouse with a bit more lag than the cursor for a "glow" feel
        const moveX = gsap.quickTo(spotlight, 'left', { duration: 1.2, ease: 'power2.out' });
        const moveY = gsap.quickTo(spotlight, 'top', { duration: 1.2, ease: 'power2.out' });

        const onMouseMove = (e: MouseEvent) => {
            moveX(e.clientX);
            moveY(e.clientY);

            // Fade in on first move
            if (gsap.getProperty(spotlight, 'opacity') === 0) {
                gsap.to(spotlight, { opacity: 0.08, duration: 2 });
            }
        };

        window.addEventListener('mousemove', onMouseMove, { passive: true });

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
        };
    }, [isDesktop, prefersReducedMotion]);

    if (!isDesktop || prefersReducedMotion) {
        return null;
    }

    return (
        <div
            ref={spotlightRef}
            className="pointer-events-none fixed z-0 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 will-change-[top,left]"
            style={{
                background: 'radial-gradient(circle, var(--color-racing-red) 0%, transparent 70%)',
                filter: 'blur(120px)',
                opacity: 0.07, // Very subtle
            }}
        />
    );
}
