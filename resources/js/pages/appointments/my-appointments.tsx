import { Head, Link, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CalendarIcon,
    ClockIcon,
    MapPinIcon,
    XIcon,
    RefreshCwIcon,
    PlusIcon,
    ArrowUpRightIcon,
    CheckCircle2Icon,
    CalendarCheckIcon,
    CalendarXIcon,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import appointments from '@/routes/appointments';

interface Service {
    name: string;
}

interface Team {
    name: string;
}

interface Appointment {
    id: number;
    start_at: string;
    end_at: string;
    status: string;
    notes: string | null;
    service: Service;
    team: Team;
    cancellation_reason: string | null;
}

interface Props {
    upcoming: Appointment[];
    past: Appointment[];
    cancelled: Appointment[];
}

type TabType = 'upcoming' | 'past' | 'cancelled';

const STATUS_MAP: Record<
    string,
    { label: string; color: string; bg: string; dot: string }
> = {
    confirmed: {
        label: 'Confirmé',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10 border-emerald-500/20',
        dot: 'bg-emerald-400',
    },
    pending: {
        label: 'En attente',
        color: 'text-amber-400',
        bg: 'bg-amber-500/10 border-amber-500/20',
        dot: 'bg-amber-400',
    },
    completed: {
        label: 'Terminé',
        color: 'text-blue-400',
        bg: 'bg-blue-500/10 border-blue-500/20',
        dot: 'bg-blue-400',
    },
    cancelled: {
        label: 'Annulé',
        color: 'text-racing-red',
        bg: 'bg-racing-red/10 border-racing-red/20',
        dot: 'bg-racing-red',
    },
    no_show: {
        label: 'Absent',
        color: 'text-white/40',
        bg: 'bg-white/5 border-white/10',
        dot: 'bg-white/30',
    },
};

const getStatus = (s: string) => STATUS_MAP[s] ?? STATUS_MAP['pending'];

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function MyAppointments({ upcoming, past, cancelled }: Props) {
    const [activeTab, setActiveTab] = useState<TabType>('upcoming');

    const handleCancel = (id: number) => {
        if (confirm('Voulez-vous vraiment annuler ce rendez-vous ?')) {
            router.delete(appointments.cancel(id).url, {
                onSuccess: () => toast.success('Rendez-vous annulé.'),
                preserveScroll: true,
            });
        }
    };

    const stats = useMemo(() => {
        const all = [...upcoming, ...past, ...cancelled];

        return {
            total: all.length,
            upcoming: upcoming.length,
            completed: past.filter((a) => a.status === 'completed').length,
            cancelled: cancelled.length,
        };
    }, [upcoming, past, cancelled]);

    const TABS: { id: TabType; label: string; count: number }[] = [
        { id: 'upcoming', label: 'À venir', count: upcoming.length },
        { id: 'past', label: 'Historique', count: past.length },
        { id: 'cancelled', label: 'Annulés', count: cancelled.length },
    ];

    const current =
        activeTab === 'upcoming'
            ? upcoming
            : activeTab === 'past'
              ? past
              : cancelled;

    return (
        <>
            <Head title="Mes Rendez-vous" />

            <div className="flex flex-col gap-6 p-6 lg:p-8">
                {/* ── Header ── */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="flex items-center gap-3 font-heading text-xl font-bold tracking-[0.15em] text-white uppercase">
                            <span className="h-5 w-[3px] bg-racing-red" />
                            Mes Rendez-vous
                        </h1>
                        <p className="mt-1 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                            Suivi et gestion de vos interventions
                        </p>
                    </div>

                    <Link href={appointments.index().url}>
                        <Button
                            size="sm"
                            className="h-9 rounded-none bg-racing-red text-[9px] font-bold tracking-widest text-white uppercase hover:bg-white hover:text-luxury-black"
                        >
                            <PlusIcon className="mr-2 h-3 w-3" />
                            Nouveau rendez-vous
                        </Button>
                    </Link>
                </div>

                {/* ── Stats strip ── */}
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {[
                        {
                            icon: CalendarIcon,
                            label: 'Total',
                            value: stats.total.toString(),
                            sub: 'interventions',
                            accent: 'text-white',
                            iconColor: 'text-white/40',
                        },
                        {
                            icon: CalendarCheckIcon,
                            label: 'À venir',
                            value: stats.upcoming.toString(),
                            sub:
                                stats.upcoming === 0
                                    ? 'aucun planifié'
                                    : 'planifiés',
                            accent:
                                stats.upcoming > 0
                                    ? 'text-emerald-400'
                                    : 'text-white/40',
                            iconColor:
                                stats.upcoming > 0
                                    ? 'text-emerald-500/50'
                                    : 'text-white/20',
                        },
                        {
                            icon: CheckCircle2Icon,
                            label: 'Terminés',
                            value: stats.completed.toString(),
                            sub: 'complétés',
                            accent: 'text-blue-400',
                            iconColor: 'text-blue-500/50',
                        },
                        {
                            icon: CalendarXIcon,
                            label: 'Annulés',
                            value: stats.cancelled.toString(),
                            sub:
                                stats.cancelled === 0
                                    ? 'aucune annulation'
                                    : 'annulations',
                            accent:
                                stats.cancelled > 0
                                    ? 'text-racing-red'
                                    : 'text-white/40',
                            iconColor:
                                stats.cancelled > 0
                                    ? 'text-racing-red/50'
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

                {/* ── Tabs ── */}
                <div className="flex border border-white/5">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 text-[9px] font-bold tracking-widest uppercase transition-all ${
                                activeTab === tab.id
                                    ? 'bg-racing-red text-white'
                                    : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            {tab.label}
                            <span
                                className={`flex h-4 min-w-4 items-center justify-center px-1 text-[8px] font-bold ${
                                    activeTab === tab.id
                                        ? 'bg-white/20 text-white'
                                        : 'bg-white/5 text-muted-foreground'
                                }`}
                            >
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* ── List ── */}
                <AnimatePresence mode="wait">
                    {current.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center border border-dashed border-white/5 bg-luxury-charcoal/10 py-20"
                        >
                            <div className="mb-5 flex h-14 w-14 items-center justify-center bg-white/5">
                                <CalendarIcon className="h-6 w-6 text-muted-foreground/30" />
                            </div>
                            <p className="text-sm font-bold tracking-widest text-muted-foreground uppercase">
                                {activeTab === 'upcoming'
                                    ? 'Aucun rendez-vous à venir'
                                    : activeTab === 'past'
                                      ? 'Aucun historique'
                                      : 'Aucune annulation'}
                            </p>
                            <p className="mt-1 text-[10px] tracking-wider text-muted-foreground/50">
                                {activeTab === 'upcoming'
                                    ? 'Planifiez votre première intervention'
                                    : 'Vos rendez-vous apparaîtront ici'}
                            </p>
                            {activeTab === 'upcoming' && (
                                <Link href={appointments.index().url}>
                                    <Button
                                        size="sm"
                                        className="mt-6 h-9 rounded-none bg-racing-red text-[9px] font-bold tracking-widest text-white uppercase hover:bg-white hover:text-luxury-black"
                                    >
                                        <PlusIcon className="mr-2 h-3 w-3" />
                                        Prendre rendez-vous
                                    </Button>
                                </Link>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col divide-y divide-white/5 border border-white/5"
                        >
                            {/* Table header */}
                            <div className="hidden grid-cols-12 gap-4 bg-white/[0.02] px-6 py-3 lg:grid">
                                {[
                                    { label: 'Référence', span: 'col-span-2' },
                                    { label: 'Service', span: 'col-span-3' },
                                    { label: 'Date', span: 'col-span-2' },
                                    { label: 'Horaire', span: 'col-span-2' },
                                    { label: 'Lieu', span: 'col-span-2' },
                                    { label: 'Statut', span: 'col-span-1' },
                                ].map(({ label, span }) => (
                                    <div
                                        key={label}
                                        className={`text-[9px] font-bold tracking-widest text-muted-foreground/60 uppercase ${span}`}
                                    >
                                        {label}
                                    </div>
                                ))}
                            </div>

                            {current.map((apt, idx) => {
                                const st = getStatus(apt.status);

                                return (
                                    <motion.div
                                        key={apt.id}
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.04 }}
                                        className="group relative flex flex-col gap-4 bg-luxury-black px-6 py-4 transition-colors hover:bg-luxury-charcoal/40 lg:grid lg:grid-cols-12 lg:items-center lg:gap-4"
                                    >
                                        {/* Left accent bar */}
                                        <div
                                            className={`absolute top-0 bottom-0 left-0 w-[2px] opacity-0 transition-opacity group-hover:opacity-100 ${
                                                apt.status === 'confirmed' ||
                                                apt.status === 'completed'
                                                    ? 'bg-emerald-500'
                                                    : apt.status === 'cancelled'
                                                      ? 'bg-racing-red'
                                                      : 'bg-amber-500'
                                            }`}
                                        />

                                        {/* Référence */}
                                        <div className="lg:col-span-2">
                                            <p className="mb-0.5 text-[8px] font-bold tracking-widest text-muted-foreground/50 uppercase lg:hidden">
                                                Référence
                                            </p>
                                            <p className="font-mono text-sm font-bold tracking-tight text-white">
                                                #
                                                {apt.id
                                                    .toString()
                                                    .padStart(6, '0')}
                                            </p>
                                        </div>

                                        {/* Service */}
                                        <div className="lg:col-span-3">
                                            <p className="mb-0.5 text-[8px] font-bold tracking-widest text-muted-foreground/50 uppercase lg:hidden">
                                                Service
                                            </p>
                                            <p className="truncate text-sm font-medium text-white/80">
                                                {apt.service.name}
                                            </p>
                                            {apt.cancellation_reason && (
                                                <p className="mt-0.5 truncate text-[9px] text-racing-red/70 italic">
                                                    {apt.cancellation_reason}
                                                </p>
                                            )}
                                        </div>

                                        {/* Date */}
                                        <div className="lg:col-span-2">
                                            <p className="mb-0.5 text-[8px] font-bold tracking-widest text-muted-foreground/50 uppercase lg:hidden">
                                                Date
                                            </p>
                                            <div className="flex items-center gap-1.5 text-sm text-white/70">
                                                <CalendarIcon className="h-3 w-3 shrink-0 text-racing-red" />
                                                {formatDate(apt.start_at)}
                                            </div>
                                        </div>

                                        {/* Horaire */}
                                        <div className="lg:col-span-2">
                                            <p className="mb-0.5 text-[8px] font-bold tracking-widest text-muted-foreground/50 uppercase lg:hidden">
                                                Horaire
                                            </p>
                                            <div className="flex items-center gap-1.5 text-sm text-white/70">
                                                <ClockIcon className="h-3 w-3 shrink-0 text-racing-red" />
                                                {formatTime(apt.start_at)} –{' '}
                                                {formatTime(apt.end_at)}
                                            </div>
                                        </div>

                                        {/* Lieu */}
                                        <div className="lg:col-span-2">
                                            <p className="mb-0.5 text-[8px] font-bold tracking-widest text-muted-foreground/50 uppercase lg:hidden">
                                                Lieu
                                            </p>
                                            <div className="flex items-center gap-1.5 text-sm text-white/70">
                                                <MapPinIcon className="h-3 w-3 shrink-0 text-racing-red" />
                                                <span className="truncate">
                                                    {apt.team.name}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Statut */}
                                        <div className="lg:col-span-1">
                                            <p className="mb-0.5 text-[8px] font-bold tracking-widest text-muted-foreground/50 uppercase lg:hidden">
                                                Statut
                                            </p>
                                            <span
                                                className={`inline-flex items-center gap-1.5 border px-2 py-1 text-[9px] font-bold tracking-wider uppercase ${st.bg} ${st.color}`}
                                            >
                                                <span
                                                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${st.dot}`}
                                                />
                                                {st.label}
                                            </span>
                                        </div>

                                        {/* Actions — visible on hover on desktop, always on mobile */}
                                        <div className="flex flex-wrap items-center gap-2 lg:absolute lg:right-4 lg:col-span-12 lg:flex-nowrap lg:opacity-0 lg:transition-opacity lg:group-hover:opacity-100">
                                            <Link
                                                href={
                                                    appointments.show(apt.id)
                                                        .url
                                                }
                                            >
                                                <Button
                                                    size="sm"
                                                    className="h-8 rounded-none bg-white px-3 text-[8px] font-bold tracking-widest text-luxury-black uppercase transition-all hover:bg-racing-red hover:text-white"
                                                >
                                                    <ArrowUpRightIcon className="h-3 w-3" />
                                                </Button>
                                            </Link>

                                            {activeTab === 'upcoming' && (
                                                <>
                                                    <Link
                                                        href={
                                                            appointments.reschedule(
                                                                apt.id,
                                                            ).url
                                                        }
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 rounded-none border border-white/5 px-3 text-[8px] font-bold tracking-widest text-muted-foreground uppercase hover:border-white/10 hover:bg-white/5 hover:text-white"
                                                        >
                                                            <RefreshCwIcon className="mr-1.5 h-3 w-3" />
                                                            Reprogrammer
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleCancel(apt.id)
                                                        }
                                                        className="h-8 rounded-none border border-racing-red/20 px-3 text-[8px] font-bold tracking-widest text-racing-red uppercase hover:border-racing-red/40 hover:bg-racing-red/10"
                                                    >
                                                        <XIcon className="mr-1.5 h-3 w-3" />
                                                        Annuler
                                                    </Button>
                                                </>
                                            )}

                                            {activeTab === 'past' && (
                                                <Button
                                                    size="sm"
                                                    onClick={() =>
                                                        router.visit(
                                                            appointments.index()
                                                                .url,
                                                        )
                                                    }
                                                    className="h-8 rounded-none bg-racing-red px-3 text-[8px] font-bold tracking-widest text-white uppercase hover:bg-white hover:text-luxury-black"
                                                >
                                                    <RefreshCwIcon className="mr-1.5 h-3 w-3" />
                                                    Réserver
                                                </Button>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Footer ── */}
                {current.length > 0 && (
                    <div className="flex items-center justify-between border-t border-white/5 pt-4">
                        <p className="text-[9px] font-semibold tracking-widest text-muted-foreground/50 uppercase">
                            {current.length} rendez-vous affiché
                            {current.length > 1 ? 's' : ''}
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}

MyAppointments.layout = () => ({
    breadcrumbs: [
        { title: 'Console Technique', href: '/dashboard' },
        { title: 'Mes Rendez-vous', href: '/my-appointments' },
    ],
});
