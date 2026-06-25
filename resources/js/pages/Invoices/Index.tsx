import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileTextIcon,
    DownloadIcon,
    SearchIcon,
    CheckCircle2Icon,
    ClockIcon,
    ArrowUpRightIcon,
    ReceiptIcon,
    TrendingUpIcon,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';

interface Invoice {
    id: number;
    uuid: string;
    number: string;
    total_amount: number;
    currency: string;
    status: string;
    issue_date: string;
    due_date: string;
    team: { name: string };
}

interface Props {
    invoices: { data: Invoice[]; links: any[] };
}

type FilterKey = 'all' | 'paid' | 'sent' | 'draft' | 'cancelled';

const STATUS_MAP: Record<
    string,
    { label: string; color: string; bg: string; dot: string }
> = {
    paid: {
        label: 'Acquitté',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10 border-emerald-500/20',
        dot: 'bg-emerald-400',
    },
    sent: {
        label: 'Envoyée',
        color: 'text-amber-400',
        bg: 'bg-amber-500/10 border-amber-500/20',
        dot: 'bg-amber-400',
    },
    draft: {
        label: 'Brouillon',
        color: 'text-white/50',
        bg: 'bg-white/5 border-white/10',
        dot: 'bg-white/30',
    },
    cancelled: {
        label: 'Annulée',
        color: 'text-racing-red',
        bg: 'bg-racing-red/10 border-racing-red/20',
        dot: 'bg-racing-red',
    },
};
const getStatus = (s: string) => STATUS_MAP[s] ?? STATUS_MAP['draft'];

const fmt = (amount: number, currency: string) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(
        amount,
    );

export default function Index({ invoices }: Props) {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<FilterKey>('all');

    const all = invoices.data;

    const stats = useMemo(() => {
        const paid = all.filter((i) => i.status === 'paid');
        const pending = all.filter((i) => i.status === 'sent');
        const total = all.reduce((s, i) => s + Number(i.total_amount), 0);
        const paidAmt = paid.reduce((s, i) => s + Number(i.total_amount), 0);

        return {
            total: all.length,
            paid: paid.length,
            pending: pending.length,
            totalAmt: total,
            paidAmt,
        };
    }, [all]);

    const filtered = useMemo(() => {
        let list = all;

        if (filter !== 'all') {
            list = list.filter((i) => i.status === filter);
        }

        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(
                (i) =>
                    i.number.toLowerCase().includes(q) ||
                    i.team.name.toLowerCase().includes(q),
            );
        }

        return list;
    }, [all, filter, search]);

    const TABS: { key: FilterKey; label: string; count: number }[] = [
        { key: 'all', label: 'Toutes', count: stats.total },
        {
            key: 'paid',
            label: 'Acquittées',
            count: all.filter((i) => i.status === 'paid').length,
        },
        {
            key: 'sent',
            label: 'Envoyées',
            count: all.filter((i) => i.status === 'sent').length,
        },
        {
            key: 'draft',
            label: 'Brouillons',
            count: all.filter((i) => i.status === 'draft').length,
        },
        {
            key: 'cancelled',
            label: 'Annulées',
            count: all.filter((i) => i.status === 'cancelled').length,
        },
    ];

    return (
        <>
            <Head title="Mes Factures" />

            <div className="flex flex-col gap-6 p-6 lg:p-8">
                {/* ── Header ── */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="flex items-center gap-3 font-heading text-xl font-bold tracking-[0.15em] text-white uppercase">
                            <span className="h-5 w-[3px] bg-racing-red" />
                            Mes Factures
                        </h1>
                        <p className="mt-1 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                            Historique & suivi de vos paiements
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-9 rounded-none border-white/10 text-[9px] font-bold tracking-widest uppercase hover:border-white/20 hover:bg-white/5"
                        >
                            <DownloadIcon className="mr-2 h-3 w-3" />
                            Exporter CSV
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-9 rounded-none border-white/10 text-[9px] font-bold tracking-widest uppercase hover:border-white/20 hover:bg-white/5"
                        >
                            <FileTextIcon className="mr-2 h-3 w-3" />
                            Rapport annuel
                        </Button>
                    </div>
                </div>

                {/* ── Stats strip ── */}
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {[
                        {
                            icon: ReceiptIcon,
                            label: 'Total factures',
                            value: stats.total.toString(),
                            sub: 'documents',
                            accent: 'text-white',
                            iconColor: 'text-white/40',
                        },
                        {
                            icon: TrendingUpIcon,
                            label: 'Montant total',
                            value:
                                stats.total > 0
                                    ? fmt(
                                          stats.totalAmt,
                                          all[0]?.currency ?? 'EUR',
                                      )
                                    : '—',
                            sub: 'toutes factures',
                            accent: 'text-white',
                            iconColor: 'text-white/40',
                        },
                        {
                            icon: CheckCircle2Icon,
                            label: 'Acquittées',
                            value: stats.paid.toString(),
                            sub:
                                stats.paid > 0
                                    ? fmt(
                                          stats.paidAmt,
                                          all[0]?.currency ?? 'EUR',
                                      )
                                    : '—',
                            accent: 'text-emerald-400',
                            iconColor: 'text-emerald-500/50',
                        },
                        {
                            icon: ClockIcon,
                            label: 'En attente',
                            value: stats.pending.toString(),
                            sub:
                                stats.pending === 0
                                    ? 'aucun impayé'
                                    : 'à régler',
                            accent:
                                stats.pending > 0
                                    ? 'text-amber-400'
                                    : 'text-white/40',
                            iconColor:
                                stats.pending > 0
                                    ? 'text-amber-500/50'
                                    : 'text-white/20',
                        },
                    ].map((s, i) => (
                        <motion.div
                            key={s.label}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className="flex items-center gap-4 border border-white/5 bg-luxury-charcoal/30 p-4"
                        >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-white/5">
                                <s.icon className={`h-4 w-4 ${s.iconColor}`} />
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-[9px] font-bold tracking-widest text-muted-foreground uppercase">
                                    {s.label}
                                </p>
                                <p
                                    className={`font-heading text-lg leading-tight font-bold ${s.accent}`}
                                >
                                    {s.value}
                                </p>
                                <p className="truncate text-[9px] tracking-wider text-muted-foreground/60 uppercase">
                                    {s.sub}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* ── Toolbar: tabs + search ── */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {/* Filter tabs */}
                    <div className="flex border border-white/5">
                        {TABS.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setFilter(tab.key)}
                                className={`relative flex items-center gap-2 px-4 py-2.5 text-[9px] font-bold tracking-widest uppercase transition-all ${
                                    filter === tab.key
                                        ? 'bg-racing-red text-white'
                                        : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                                }`}
                            >
                                {tab.label}
                                <span
                                    className={`flex h-4 min-w-4 items-center justify-center px-1 text-[8px] font-bold ${
                                        filter === tab.key
                                            ? 'bg-white/20 text-white'
                                            : 'bg-white/5 text-muted-foreground'
                                    }`}
                                >
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <SearchIcon className="absolute top-1/2 left-3 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="N° dossier ou émetteur..."
                            className="h-9 w-56 border border-white/10 bg-luxury-charcoal/40 pr-4 pl-9 text-[10px] text-white transition-colors placeholder:text-muted-foreground/50 focus:border-racing-red/40 focus:outline-none"
                        />
                    </div>
                </div>

                {/* ── Invoice list ── */}
                <AnimatePresence mode="wait">
                    {filtered.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center border border-dashed border-white/5 bg-luxury-charcoal/10 py-20"
                        >
                            <div className="mb-5 flex h-14 w-14 items-center justify-center bg-white/5">
                                <FileTextIcon className="h-6 w-6 text-muted-foreground/30" />
                            </div>
                            <p className="text-sm font-bold tracking-widest text-muted-foreground uppercase">
                                {search || filter !== 'all'
                                    ? 'Aucun résultat'
                                    : 'Aucune facture'}
                            </p>
                            <p className="mt-1 text-[10px] tracking-wider text-muted-foreground/50">
                                {search || filter !== 'all'
                                    ? 'Essayez un autre filtre ou terme de recherche'
                                    : 'Vos factures apparaîtront ici dès émission'}
                            </p>
                            {(search || filter !== 'all') && (
                                <button
                                    onClick={() => {
                                        setSearch('');
                                        setFilter('all');
                                    }}
                                    className="mt-4 text-[9px] font-bold tracking-widest text-racing-red uppercase hover:underline"
                                >
                                    Réinitialiser les filtres
                                </button>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col divide-y divide-white/5 border border-white/5"
                        >
                            {/* Table header — 12 cols: 2+3+2+2+2+1 */}
                            <div className="hidden grid-cols-12 gap-4 bg-white/[0.02] px-6 py-3 lg:grid">
                                {[
                                    { label: 'N° Dossier', span: 'col-span-2' },
                                    { label: 'Émetteur', span: 'col-span-3' },
                                    {
                                        label: 'Date émission',
                                        span: 'col-span-2',
                                    },
                                    { label: 'Montant', span: 'col-span-2' },
                                    { label: 'Statut', span: 'col-span-2' },
                                    { label: '', span: 'col-span-1' },
                                ].map(({ label, span }) => (
                                    <div
                                        key={label}
                                        className={`text-[9px] font-bold tracking-widest text-muted-foreground/60 uppercase ${span}`}
                                    >
                                        {label}
                                    </div>
                                ))}
                            </div>

                            {filtered.map((invoice, idx) => {
                                const st = getStatus(invoice.status);

                                return (
                                    <motion.div
                                        key={invoice.id}
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.04 }}
                                        className="group relative flex flex-col gap-4 bg-luxury-black px-6 py-4 transition-colors hover:bg-luxury-charcoal/40 lg:grid lg:grid-cols-12 lg:items-center lg:gap-4"
                                    >
                                        {/* Left accent bar */}
                                        <div
                                            className={`absolute top-0 bottom-0 left-0 w-[2px] opacity-0 transition-opacity group-hover:opacity-100 ${
                                                invoice.status === 'paid'
                                                    ? 'bg-emerald-500'
                                                    : 'bg-racing-red'
                                            }`}
                                        />

                                        {/* N° Dossier */}
                                        <div className="lg:col-span-2">
                                            <p className="mb-0.5 text-[8px] font-bold tracking-widest text-muted-foreground/50 uppercase lg:hidden">
                                                N° Dossier
                                            </p>
                                            <p className="font-heading font-mono text-sm font-bold tracking-tight text-white">
                                                {invoice.number}
                                            </p>
                                        </div>

                                        {/* Émetteur */}
                                        <div className="lg:col-span-3">
                                            <p className="mb-0.5 text-[8px] font-bold tracking-widest text-muted-foreground/50 uppercase lg:hidden">
                                                Émetteur
                                            </p>
                                            <p className="truncate text-sm text-white/80">
                                                {invoice.team.name}
                                            </p>
                                        </div>

                                        {/* Date émission */}
                                        <div className="lg:col-span-2">
                                            <p className="mb-0.5 text-[8px] font-bold tracking-widest text-muted-foreground/50 uppercase lg:hidden">
                                                Date d'émission
                                            </p>
                                            <p className="text-sm text-white/70">
                                                {format(
                                                    new Date(
                                                        invoice.issue_date,
                                                    ),
                                                    'dd MMM yyyy',
                                                )}
                                            </p>
                                        </div>

                                        {/* Montant */}
                                        <div className="lg:col-span-2">
                                            <p className="mb-0.5 text-[8px] font-bold tracking-widest text-muted-foreground/50 uppercase lg:hidden">
                                                Montant
                                            </p>
                                            <p className="font-heading text-sm font-bold text-white">
                                                {fmt(
                                                    Number(
                                                        invoice.total_amount,
                                                    ),
                                                    invoice.currency,
                                                )}
                                            </p>
                                        </div>

                                        {/* Statut */}
                                        <div className="lg:col-span-2">
                                            <p className="mb-0.5 text-[8px] font-bold tracking-widest text-muted-foreground/50 uppercase lg:hidden">
                                                Statut
                                            </p>
                                            <span
                                                className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-[9px] font-bold tracking-wider uppercase ${st.bg} ${st.color}`}
                                            >
                                                <span
                                                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${st.dot}`}
                                                />
                                                {st.label}
                                            </span>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center justify-end gap-2 lg:col-span-1">
                                            <Link
                                                href={`/dashboard/invoices/${invoice.uuid}`}
                                            >
                                                <Button
                                                    size="sm"
                                                    className="h-8 rounded-none bg-white px-3 text-[8px] font-bold tracking-widest text-luxury-black uppercase transition-all hover:bg-racing-red hover:text-white"
                                                >
                                                    <ArrowUpRightIcon className="h-3 w-3" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 rounded-none border border-white/5 p-0 hover:border-white/10 hover:bg-white/5"
                                            >
                                                <DownloadIcon className="h-3 w-3 text-muted-foreground" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Footer: count + retention note ── */}
                {filtered.length > 0 && (
                    <div className="flex flex-col items-start justify-between gap-3 border-t border-white/5 pt-4 sm:flex-row sm:items-center">
                        <p className="text-[9px] font-semibold tracking-widest text-muted-foreground/50 uppercase">
                            {filtered.length} document
                            {filtered.length > 1 ? 's' : ''} affiché
                            {filtered.length > 1 ? 's' : ''}
                        </p>
                        <p className="text-[9px] tracking-wider text-muted-foreground/30 uppercase">
                            Archivage 10 ans · Protocoles de sécurité KEYPRO
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}

Index.layout = () => ({
    breadcrumbs: [
        { title: 'Console Technique', href: '/dashboard' },
        { title: 'Mes Factures', href: '/dashboard/invoices' },
    ],
});
