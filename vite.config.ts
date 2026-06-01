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
            input: ['resources/css/app.css', 'resources/js/app.tsx', 'resources/css/filament/admin/theme.css'],
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
        inertia(),
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
                        if (id.includes('react') || id.includes('react-dom')) {
                            return 'react-vendor';
                        }
                        if (id.includes('@inertiajs')) {
                            return 'inertia';
                        }
                        if (id.includes('gsap')) {
                            return 'gsap';
                        }
                        if (id.includes('date-fns')) {
                            return 'date-fns';
                        }
                    }
                },
            },
        },
        chunkSizeWarningLimit: 600,
    },
});
