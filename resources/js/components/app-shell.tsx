import { usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { FlashMessages } from '@/components/flash-messages';
import { SidebarProvider } from '@/components/ui/sidebar';
import type { AppVariant } from '@/types';

type Props = {
    children: ReactNode;
    variant?: AppVariant;
};

export function AppShell({ children, variant = 'sidebar' }: Props) {
    const isOpen = usePage().props.sidebarOpen;

    const content = (
        <>
            <FlashMessages />
            {children}
        </>
    );

    if (variant === 'header') {
        return (
            <div className="flex min-h-screen w-full flex-col">{content}</div>
        );
    }

    return <SidebarProvider defaultOpen={isOpen}>{content}</SidebarProvider>;
}
