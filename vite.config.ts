import inertia from '@inertiajs/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.tsx',
                'resources/css/filament/admin/theme.css',
            ],
            refresh: true,
            fonts: [
                bunny('Outfit', {
                    weights: [400, 500, 700],
                    display: 'swap',
                }),
                bunny('Syncopate', {
                    weights: [700],
                    display: 'swap',
                }),
            ],
        }),
        inertia({
            ssr: {
                enabled: false, // Disable SSR to prevent hydration mismatches
            },
        }),
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        tailwindcss(),
        wayfinder({
            formVariants: true,
        }),
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        // Core React libs
                        if (id.includes('react') || id.includes('react-dom')) {
                            return 'react-vendor';
                        }
                        // Inertia
                        if (id.includes('@inertiajs')) {
                            return 'inertia';
                        }
                        // Heavy animation libs - only loaded when needed
                        if (id.includes('gsap')) {
                            return 'gsap';
                        }
                        // Radix UI primitives - split into separate chunk
                        if (id.includes('@radix-ui')) {
                            return 'radix-ui';
                        }
                        // Date utilities
                        if (
                            id.includes('date-fns') ||
                            id.includes('react-day-picker')
                        ) {
                            return 'date-utils';
                        }
                        // Icon libraries
                        if (id.includes('lucide-react')) {
                            return 'lucide';
                        }
                        // UI utilities
                        if (
                            id.includes('clsx') ||
                            id.includes('tailwind-merge') ||
                            id.includes('class-variance-authority')
                        ) {
                            return 'ui-utils';
                        }
                    }
                },
            },
        },
        cssCodeSplit: true,
        chunkSizeWarningLimit: 600,
        sourcemap: false,
    },
});
