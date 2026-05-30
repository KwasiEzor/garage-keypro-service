import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface Invoice {
    id: number;
    uuid: string;
    number: string;
    total_amount: number;
    currency: string;
    status: string;
    issue_date: string;
    due_date: string;
    team: {
        name: string;
    };
}

interface Props {
    invoices: {
        data: Invoice[];
        links: any[];
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Invoices',
        href: '/dashboard/invoices',
    },
];

export default function Index({ invoices }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Invoices" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Invoices</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b">
                                        <th className="pb-3 font-medium">Number</th>
                                        <th className="pb-3 font-medium">From</th>
                                        <th className="pb-3 font-medium">Issued</th>
                                        <th className="pb-3 font-medium">Due</th>
                                        <th className="pb-3 font-medium">Status</th>
                                        <th className="pb-3 font-medium text-right">Amount</th>
                                        <th className="pb-3 font-medium"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoices.data.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="py-8 text-center text-muted-foreground">
                                                No invoices found.
                                            </td>
                                        </tr>
                                    )}
                                    {invoices.data.map((invoice) => (
                                        <tr key={invoice.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                                            <td className="py-4 font-medium">{invoice.number}</td>
                                            <td className="py-4">{invoice.team.name}</td>
                                            <td className="py-4 text-sm">{format(new Date(invoice.issue_date), 'MMM d, yyyy')}</td>
                                            <td className="py-4 text-sm">{format(new Date(invoice.due_date), 'MMM d, yyyy')}</td>
                                            <td className="py-4">
                                                <Badge variant={invoice.status === 'paid' ? 'default' : 'outline'}>
                                                    {invoice.status.toUpperCase()}
                                                </Badge>
                                            </td>
                                            <td className="py-4 text-right font-medium">
                                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: invoice.currency }).format(invoice.total_amount)}
                                            </td>
                                            <td className="py-4 text-right">
                                                <Link 
                                                    href={`/dashboard/invoices/${invoice.uuid}`} 
                                                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                                                >
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
