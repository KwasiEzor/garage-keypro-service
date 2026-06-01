import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function CustomCursor() {
    const cursorDotRef = useRef<HTMLDivElement>(null);
    const cursorOutlineRef = useRef<HTMLDivElement>(null);
    const cursorTextRef = useRef<HTMLDivElement>(null);
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        // Only show on desktop with fine pointer (not touch devices)
        const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
        setIsDesktop(mediaQuery.matches);

        const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    useEffect(() => {
        if (!isDesktop) return;
        const cursorDot = cursorDotRef.current;
        const cursorOutline = cursorOutlineRef.current;
        const cursorText = cursorTextRef.current;

        if (!cursorDot || !cursorOutline || !cursorText) return;

        // GSAP quickTo for high-performance position updates
        const moveDotX = gsap.quickTo(cursorDot, 'x', { duration: 0.016, ease: 'none' });
        const moveDotY = gsap.quickTo(cursorDot, 'y', { duration: 0.016, ease: 'none' });

        const moveOutlineX = gsap.quickTo(cursorOutline, 'x', { duration: 0.1, ease: 'power2.out' });
        const moveOutlineY = gsap.quickTo(cursorOutline, 'y', { duration: 0.1, ease: 'power2.out' });

        const moveTextX = gsap.quickTo(cursorText, 'x', { duration: 0.15, ease: 'power2.out' });
        const moveTextY = gsap.quickTo(cursorText, 'y', { duration: 0.15, ease: 'power2.out' });

        const onMouseMove = (e: MouseEvent) => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            // Use quickTo for instant, optimized updates
            moveDotX(mouseX);
            moveDotY(mouseY);
            moveOutlineX(mouseX);
            moveOutlineY(mouseY);
            moveTextX(mouseX);
            moveTextY(mouseY);
        };

        // Event delegation for hover effects (works with dynamic content)
        const onMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const interactive = target.closest('a, button, input, textarea, select, [role="button"], .cursor-pointer');

            if (interactive) {
                const isLink = interactive.tagName === 'A';

                gsap.to(cursorDot, {
                    scale: 0.5,
                    duration: 0.2,
                    ease: 'power2.out',
                    overwrite: 'auto',
                });

                gsap.to(cursorOutline, {
                    scale: 1.5,
                    borderWidth: 2,
                    duration: 0.2,
                    ease: 'power2.out',
                    overwrite: 'auto',
                });

                if (isLink) {
                    const text = interactive.getAttribute('aria-label') || 'View';
                    cursorText.textContent = text;
                    gsap.to(cursorText, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.15,
                        overwrite: 'auto',
                    });
                }
            }
        };

        const onMouseOut = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const interactive = target.closest('a, button, input, textarea, select, [role="button"], .cursor-pointer');

            if (interactive) {
                gsap.to(cursorDot, {
                    scale: 1,
                    duration: 0.2,
                    ease: 'power2.out',
                    overwrite: 'auto',
                });

                gsap.to(cursorOutline, {
                    scale: 1,
                    borderWidth: 1,
                    duration: 0.2,
                    ease: 'power2.out',
                    overwrite: 'auto',
                });

                gsap.to(cursorText, {
                    opacity: 0,
                    scale: 0.8,
                    duration: 0.15,
                    overwrite: 'auto',
                });
            }
        };

        // Click effect
        const onClick = () => {
            gsap.timeline()
                .to(cursorDot, { scale: 0.8, duration: 0.08 })
                .to(cursorDot, { scale: 1, duration: 0.08 })
                .to(cursorOutline, { scale: 1.3, duration: 0.08 }, 0)
                .to(cursorOutline, { scale: 1, duration: 0.08 }, 0.08);
        };

        // Attach listeners
        window.addEventListener('mousemove', onMouseMove, { passive: true });
        window.addEventListener('click', onClick);
        document.addEventListener('mouseover', onMouseOver);
        document.addEventListener('mouseout', onMouseOut);

        // Cleanup
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('click', onClick);
            document.removeEventListener('mouseover', onMouseOver);
            document.removeEventListener('mouseout', onMouseOut);
        };
    }, [isDesktop]);

    if (!isDesktop) return null;

    return (
        <>
            {/* Inner dot */}
            <div
                ref={cursorDotRef}
                className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-racing-red shadow-[0_0_20px_rgba(239,68,68,0.5)]"
                style={{ willChange: 'transform' }}
            />

            {/* Outer outline */}
            <div
                ref={cursorOutlineRef}
                className="pointer-events-none fixed left-0 top-0 z-[9998] h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-racing-red/60 shadow-[0_0_30px_rgba(239,68,68,0.3)]"
                style={{ willChange: 'transform' }}
            />

            {/* Text label */}
            <div
                ref={cursorTextRef}
                className="pointer-events-none fixed left-0 top-0 z-[9997] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded bg-racing-red px-3 py-1.5 text-xs font-heading font-bold uppercase tracking-wider text-white opacity-0 shadow-lg"
                style={{ willChange: 'transform, opacity', marginTop: '40px' }}
            />
        </>
    );
}
