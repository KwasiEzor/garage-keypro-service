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

        // Mouse position tracking
        let mouseX = 0;
        let mouseY = 0;

        const onMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Instant position for dot
            gsap.to(cursorDot, {
                x: mouseX,
                y: mouseY,
                duration: 0,
            });

            // Smooth lag for outline
            gsap.to(cursorOutline, {
                x: mouseX,
                y: mouseY,
                duration: 0.15,
                ease: 'power2.out',
            });

            // Even smoother for text
            gsap.to(cursorText, {
                x: mouseX,
                y: mouseY,
                duration: 0.2,
                ease: 'power2.out',
            });
        };

        // Interactive element hover effects
        const interactiveElements = document.querySelectorAll(
            'a, button, input, textarea, select, [role="button"], .cursor-pointer'
        );

        const onMouseEnter = (e: Event) => {
            const target = e.currentTarget as HTMLElement;
            const isLink = target.tagName === 'A';

            gsap.to(cursorDot, {
                scale: 0.5,
                duration: 0.3,
                ease: 'back.out(2)',
            });

            gsap.to(cursorOutline, {
                scale: 1.5,
                borderWidth: 2,
                duration: 0.3,
                ease: 'back.out(2)',
            });

            if (isLink && cursorText) {
                const text = target.getAttribute('aria-label') || 'View';
                cursorText.textContent = text;
                gsap.to(cursorText, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.2,
                });
            }
        };

        const onMouseLeave = () => {
            gsap.to(cursorDot, {
                scale: 1,
                duration: 0.3,
                ease: 'back.out(2)',
            });

            gsap.to(cursorOutline, {
                scale: 1,
                borderWidth: 1,
                duration: 0.3,
                ease: 'back.out(2)',
            });

            gsap.to(cursorText, {
                opacity: 0,
                scale: 0.8,
                duration: 0.2,
            });
        };

        // Click effect
        const onClick = () => {
            gsap.to(cursorDot, {
                scale: 0.8,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
            });

            gsap.to(cursorOutline, {
                scale: 1.3,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
            });
        };

        // Attach listeners
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('click', onClick);

        interactiveElements.forEach((el) => {
            el.addEventListener('mouseenter', onMouseEnter);
            el.addEventListener('mouseleave', onMouseLeave);
        });

        // Cleanup
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('click', onClick);
            interactiveElements.forEach((el) => {
                el.removeEventListener('mouseenter', onMouseEnter);
                el.removeEventListener('mouseleave', onMouseLeave);
            });
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
