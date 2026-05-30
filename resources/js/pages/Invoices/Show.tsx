import { Head, usePage } from '@inertiajs/react';
import InvoiceView from '@/components/invoice-view';
import AppLayout from '@/layouts/app-layout';
import PublicLayout from '@/layouts/public-layout';
import type { BreadcrumbItem } from '@/types';

interface Props {
    invoice: any;
}

export default function Show({ invoice }: Props) {
    const { auth } = usePage().props as any;
    
    // Determine if we should use the AppLayout (authenticated) or PublicLayout
    const isDashboard = auth?.user && window.location.pathname.startsWith('/dashboard');

    const content = (
        <>
            <Head title={`Invoice #${invoice.number}`} />
            <div className={isDashboard ? "flex h-full flex-1 flex-col gap-4 p-4" : "py-12 bg-white dark:bg-zinc-950 min-h-screen"}>
                <InvoiceView invoice={invoice} />
            </div>
        </>
    );

    if (isDashboard) {
        const breadcrumbs: BreadcrumbItem[] = [
            {
                title: 'Invoices',
                href: '/dashboard/invoices',
            },
            {
                title: `#${invoice.number}`,
                href: `/dashboard/invoices/${invoice.uuid}`,
            },
        ];

        return <AppLayout breadcrumbs={breadcrumbs}>{content}</AppLayout>;
    }

    return <PublicLayout>{content}</PublicLayout>;
}
