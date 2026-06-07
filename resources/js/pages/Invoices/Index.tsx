import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import {
    FileTextIcon,
    DownloadIcon,
    HistoryIcon,
    SearchIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
        title: 'Console Technique',
        href: '/dashboard',
    },
    {
        title: 'Historique des Factures',
        href: '/dashboard/invoices',
    },
];

export default function Index({ invoices }: Props) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Historique des Factures" />

            <div className="flex flex-col gap-8 p-6 lg:p-10">
                {/* Header Section */}
                <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                    <div>
                        <h1 className="flex items-center gap-3 font-heading text-2xl font-bold tracking-[0.2em] text-white uppercase">
                            <div className="h-6 w-[3px] bg-racing-red" />
                            Historique Financier
                        </h1>
                        <p className="mt-2 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                            Gestion des protocoles de paiement et archives
                            techniques
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="group relative">
                            <SearchIcon className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground transition-colors group-hover:text-racing-red" />
                            <input
                                type="text"
                                placeholder="RECHERCHER UN N° DE DOSSIER..."
                                className="h-10 w-64 rounded-none border border-white/10 bg-luxury-charcoal/50 pr-4 pl-10 text-[9px] font-bold tracking-widest text-white transition-all focus:border-racing-red/50 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Invoices List */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4"
                >
                    {invoices.data.length === 0 ? (
                        <Card className="border-dashed border-white/5 bg-luxury-charcoal/20 p-16 text-center">
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-none bg-white/5">
                                <FileTextIcon className="h-8 w-8 text-muted-foreground/30" />
                            </div>
                            <p className="text-xs tracking-widest text-muted-foreground uppercase">
                                Aucune archive financière identifiée
                            </p>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {invoices.data.map((invoice) => (
                                <motion.div
                                    key={invoice.id}
                                    variants={itemVariants}
                                >
                                    <Card className="group relative overflow-hidden border-white/5 bg-luxury-black transition-all hover:border-racing-red/20">
                                        <CardContent className="p-0">
                                            <div className="flex flex-col lg:flex-row lg:items-center">
                                                {/* Technical Status Strip */}
                                                <div
                                                    className={`h-1 w-full self-stretch lg:h-auto lg:w-1 ${
                                                        invoice.status ===
                                                        'paid'
                                                            ? 'bg-green-500/50'
                                                            : 'bg-racing-red'
                                                    }`}
                                                />

                                                <div className="grid flex-1 grid-cols-1 items-center gap-6 p-6 md:grid-cols-4 lg:grid-cols-6">
                                                    {/* Invoice Info */}
                                                    <div className="lg:col-span-1">
                                                        <p className="mb-1 text-[9px] font-bold tracking-widest text-muted-foreground uppercase">
                                                            N° Dossier
                                                        </p>
                                                        <p className="font-heading font-mono text-sm font-bold tracking-tighter text-white uppercase">
                                                            {invoice.number}
                                                        </p>
                                                    </div>

                                                    {/* Origin */}
                                                    <div className="lg:col-span-1">
                                                        <p className="mb-1 text-[9px] font-bold tracking-widest text-muted-foreground uppercase">
                                                            Émetteur
                                                        </p>
                                                        <p className="truncate text-sm font-bold text-white uppercase">
                                                            {invoice.team.name}
                                                        </p>
                                                    </div>

                                                    {/* Timeline */}
                                                    <div className="text-left md:text-center lg:col-span-1">
                                                        <p className="mb-1 text-[9px] font-bold tracking-widest text-muted-foreground uppercase">
                                                            Date d'émission
                                                        </p>
                                                        <p className="text-xs font-bold text-white uppercase">
                                                            {format(
                                                                new Date(
                                                                    invoice.issue_date,
                                                                ),
                                                                'dd/MM/yyyy',
                                                            )}
                                                        </p>
                                                    </div>

                                                    {/* Amount */}
                                                    <div className="text-left md:text-center lg:col-span-1">
                                                        <p className="mb-1 text-[9px] font-bold tracking-widest text-muted-foreground uppercase">
                                                            Montant Total
                                                        </p>
                                                        <p className="font-heading text-sm font-bold tracking-tight text-racing-red uppercase">
                                                            {new Intl.NumberFormat(
                                                                'fr-FR',
                                                                {
                                                                    style: 'currency',
                                                                    currency:
                                                                        invoice.currency,
                                                                },
                                                            ).format(
                                                                invoice.total_amount,
                                                            )}
                                                        </p>
                                                    </div>

                                                    {/* Status Badge */}
                                                    <div className="text-left md:text-center lg:col-span-1">
                                                        <p className="mb-1 text-[9px] font-bold tracking-widest text-muted-foreground uppercase">
                                                            Statut Archivage
                                                        </p>
                                                        <Badge
                                                            className={`rounded-none border-none text-[8px] font-bold tracking-[0.15em] uppercase ${
                                                                invoice.status ===
                                                                'paid'
                                                                    ? 'bg-green-500/10 text-green-500'
                                                                    : 'bg-racing-red/10 text-racing-red'
                                                            }`}
                                                        >
                                                            {invoice.status ===
                                                            'paid'
                                                                ? 'Acquitté'
                                                                : 'À régler'}
                                                        </Badge>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center justify-end gap-2 lg:col-span-1">
                                                        <Link
                                                            href={`/dashboard/invoices/${invoice.uuid}`}
                                                        >
                                                            <Button className="skewed-btn h-9 bg-white px-4 text-[9px] font-bold tracking-widest text-luxury-black uppercase transition-all hover:bg-racing-red hover:text-white">
                                                                Détails
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            className="h-9 w-9 rounded-none border border-white/5 p-0 transition-colors hover:bg-white/5"
                                                        >
                                                            <DownloadIcon className="h-3.5 w-3.5 text-muted-foreground hover:text-white" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Documentation Footer */}
                <div className="mt-12 flex flex-col items-center justify-between gap-8 border border-white/5 bg-luxury-charcoal/30 p-8 md:flex-row">
                    <div className="flex items-start gap-4">
                        <HistoryIcon className="h-6 w-6 shrink-0 text-racing-red" />
                        <div>
                            <h4 className="mb-2 font-heading text-[10px] font-bold tracking-[0.2em] text-white uppercase">
                                Cycle d'Archivage Technique
                            </h4>
                            <p className="max-w-xl text-[10px] leading-relaxed tracking-wider text-muted-foreground uppercase">
                                Vos factures sont conservées pendant 10 ans
                                conformément aux protocoles de sécurité KEYPRO.
                                Chaque document inclut l'historique complet des
                                interventions techniques effectuées sur vos
                                véhicules.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <Button
                            variant="outline"
                            className="rounded-none border-white/10 text-[9px] font-bold tracking-widest uppercase hover:bg-white/5"
                        >
                            Exporter CSV
                        </Button>
                        <Button
                            variant="outline"
                            className="rounded-none border-white/10 text-[9px] font-bold tracking-widest uppercase hover:bg-white/5"
                        >
                            Rapport Annuel
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
