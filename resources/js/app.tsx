import { createInertiaApp } from '@inertiajs/react';
import { lazy, Suspense, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';

// Lazy load layouts to reduce initial bundle size
const AppLayout = lazy(() => import('@/layouts/app-layout'));
const AuthLayout = lazy(() => import('@/layouts/auth-layout'));
const SettingsLayout = lazy(() => import('@/layouts/settings/layout'));
const CustomCursor = lazy(() => import('@/components/custom-cursor'));

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Pages that don't need custom cursor (only exclude form-heavy booking pages)
const pagesWithoutCursor = [
    'appointments/index', // Booking wizard - needs precise clicking
    'appointments/show',
    'appointments/reschedule',
];

const shouldShowCursor = (name?: string) => {
    if (!name) {
        return true;
    } // Default to showing cursor

    return !pagesWithoutCursor.some(
        (page) => name === page || name.startsWith(page),
    );
};

// Track root for HMR cleanup
let root: Root | null = null;

// Cleanup on HMR to prevent double initialization
if (import.meta.hot) {
    import.meta.hot.dispose(() => {
        root?.unmount();
        root = null;
    });
}

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => {
        const pages = import.meta.glob('./pages/**/*.tsx', { eager: true });
        const page = pages[`./pages/${name}.tsx`];

        if (!page) {
            throw new Error(`Page not found: ${name}`);
        }

        return page;
    },
    setup({ el, App, props }) {
        // SSR: el is a string, not a DOM element
        if (typeof el === 'string') {
            return;
        }

        if (!root) {
            root = createRoot(el);
        }

        const name = props.initialPage.component;

        root.render(
            <StrictMode>
                <TooltipProvider delayDuration={0}>
                    {shouldShowCursor(name) && (
                        <Suspense fallback={null}>
                            <CustomCursor />
                        </Suspense>
                    )}
                    <App {...props} />
                    <Toaster />
                </TooltipProvider>
            </StrictMode>,
        );
    },
    progress: {
        color: '#4B5563',
    },
    layout: (name) => {
        switch (true) {
            case name === 'welcome':
            case name === 'home':
            case name === 'appointments/index':
            case name.startsWith('services/'):
            case name.startsWith('brands/'):
            case name.startsWith('gallery/'):
            case name.startsWith('legal/'):
            case name === 'faq':
            case name === 'Invoices/Show':
                return null;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
            case name.startsWith('teams/'):
                return [AppLayout, SettingsLayout];
            default:
                return AppLayout;
        }
    },
});

// This will set light / dark mode on load...
initializeTheme();
