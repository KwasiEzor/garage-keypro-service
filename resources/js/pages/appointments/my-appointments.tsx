import { Head, Link, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CalendarIcon,
    MapPinIcon,
    ClockIcon,
    XIcon,
    RefreshCwIcon,
    ActivityIcon,
    KeyRoundIcon,
    ShieldCheckIcon,
    PlusIcon,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PublicLayout from '@/layouts/public-layout';
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

export default function MyAppointments({ upcoming, past, cancelled }: Props) {
    const [activeTab, setActiveTab] = useState<TabType>('upcoming');

    const handleCancel = (id: number) => {
        if (
            confirm(
                "Voulez-vous vraiment interrompre ce protocole d'intervention ?",
            )
        ) {
            router.delete(appointments.cancel(id).url, {
                onSuccess: () =>
                    toast.success('Protocole interrompu avec succès.'),
                preserveScroll: true,
            });
        }
    };

    const handleBookAgain = () => {
        router.visit(appointments.index().url);
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'confirmed':
                return {
                    label: 'Protocole Actif',
                    color: 'bg-green-500',
                    text: 'text-green-500',
                };
            case 'pending':
                return {
                    label: 'En Analyse',
                    color: 'bg-yellow-500',
                    text: 'text-yellow-500',
                };
            case 'completed':
                return {
                    label: 'Dossier Clos',
                    color: 'bg-blue-500',
                    text: 'text-blue-500',
                };
            case 'cancelled':
                return {
                    label: 'Interrompu',
                    color: 'bg-racing-red',
                    text: 'text-racing-red',
                };
            case 'no_show':
                return {
                    label: 'Absent',
                    color: 'bg-gray-500',
                    text: 'text-gray-500',
                };
            default:
                return {
                    label: status,
                    color: 'bg-gray-500',
                    text: 'text-gray-500',
                };
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: 'easeOut' },
        },
    };

    const renderAppointment = (
        appointment: Appointment,
        showActions: 'upcoming' | 'past' | 'cancelled',
    ) => {
        const date = new Date(appointment.start_at);
        const endDate = new Date(appointment.end_at);
        const status = getStatusStyles(appointment.status);

        return (
            <motion.div key={appointment.id} variants={itemVariants}>
                <Card className="glass-panel group relative overflow-hidden border-white/5 bg-luxury-charcoal/40 transition-all hover:bg-luxury-charcoal/60">
                    <div className="absolute top-0 left-0 h-full w-[2px] -translate-y-full transform bg-racing-red transition-transform duration-500 group-hover:translate-y-0" />
                    <CardContent className="p-0">
                        <div className="flex flex-col lg:flex-row">
                            {/* Status Side */}
                            <div className="flex flex-col items-center justify-center border-b border-white/5 bg-luxury-black p-8 text-center lg:w-48 lg:border-r lg:border-b-0">
                                <div
                                    className={`mb-4 flex h-12 w-12 items-center justify-center transition-colors ${status.text}`}
                                >
                                    <ShieldCheckIcon className="h-6 w-6" />
                                </div>
                                <span
                                    className={`font-heading text-[9px] font-bold tracking-widest uppercase ${status.text}`}
                                >
                                    {status.label}
                                </span>
                            </div>

                            {/* Info Content */}
                            <div className="flex-1 space-y-6 p-8 lg:p-10">
                                <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono text-[10px] tracking-widest text-muted-foreground/60">
                                                #
                                                {appointment.id
                                                    .toString()
                                                    .padStart(6, '0')}
                                            </span>
                                            <h3 className="font-heading text-xl font-bold tracking-wider text-white uppercase">
                                                {appointment.service.name}
                                            </h3>
                                        </div>
                                        <div className="grid grid-cols-1 gap-x-8 gap-y-3 text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase md:grid-cols-2">
                                            <div className="flex items-center gap-2">
                                                <CalendarIcon className="h-3.5 w-3.5 text-racing-red" />
                                                <span>
                                                    {date.toLocaleDateString(
                                                        'fr-FR',
                                                        {
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric',
                                                        },
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <ClockIcon className="h-3.5 w-3.5 text-racing-red" />
                                                <span>
                                                    {date.toLocaleTimeString(
                                                        'fr-FR',
                                                        {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        },
                                                    )}
                                                    {' - '}
                                                    {endDate.toLocaleTimeString(
                                                        'fr-FR',
                                                        {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        },
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 md:col-span-2">
                                                <MapPinIcon className="h-3.5 w-3.5 text-racing-red" />
                                                <span>
                                                    {appointment.team.name}
                                                </span>
                                            </div>
                                        </div>
                                        {appointment.cancellation_reason && (
                                            <div className="border-t border-white/5 pt-3">
                                                <p className="mb-1 text-[9px] font-bold tracking-[0.2em] text-racing-red uppercase">
                                                    Motif d'interruption
                                                </p>
                                                <p className="text-xs leading-relaxed text-white/60 italic">
                                                    "
                                                    {
                                                        appointment.cancellation_reason
                                                    }
                                                    "
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex min-w-[180px] flex-col gap-3">
                                        <Link
                                            href={
                                                appointments.show(
                                                    appointment.id,
                                                ).url
                                            }
                                        >
                                            <Button
                                                variant="outline"
                                                className="h-11 w-full rounded-none border-white/10 text-[9px] font-bold tracking-[0.2em] uppercase hover:bg-white/5"
                                            >
                                                Dossier Technique
                                            </Button>
                                        </Link>

                                        {showActions === 'upcoming' && (
                                            <>
                                                <Link
                                                    href={
                                                        appointments.reschedule(
                                                            appointment.id,
                                                        ).url
                                                    }
                                                >
                                                    <Button
                                                        variant="secondary"
                                                        className="h-11 w-full rounded-none bg-white/5 text-[9px] font-bold tracking-[0.2em] uppercase hover:bg-white/10"
                                                    >
                                                        <RefreshCwIcon className="mr-2 h-3 w-3" />{' '}
                                                        Reprogrammer
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="destructive"
                                                    onClick={() =>
                                                        handleCancel(
                                                            appointment.id,
                                                        )
                                                    }
                                                    className="h-11 w-full rounded-none bg-racing-red/20 text-[9px] font-bold tracking-[0.2em] text-racing-red uppercase hover:bg-racing-red hover:text-white"
                                                >
                                                    <XIcon className="mr-2 h-3 w-3" />{' '}
                                                    Interrompre
                                                </Button>
                                            </>
                                        )}

                                        {showActions === 'past' && (
                                            <Button
                                                onClick={() =>
                                                    handleBookAgain()
                                                }
                                                className="h-11 w-full rounded-none bg-racing-red text-[9px] font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-luxury-black"
                                            >
                                                <RefreshCwIcon className="mr-2 h-3 w-3" />{' '}
                                                Réserver
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        );
    };

    const renderEmptyState = (type: TabType) => {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card className="glass-panel group relative overflow-hidden border-white/5 bg-luxury-charcoal/50 py-24 text-center">
                    <div className="bg-grid-pattern pointer-events-none absolute inset-0 opacity-5" />
                    <CardContent className="relative z-10">
                        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center border border-white/10 bg-white/5">
                            <KeyRoundIcon className="h-10 w-10 text-muted-foreground/40" />
                        </div>
                        <h3 className="mb-4 font-heading text-2xl font-bold tracking-wider text-white uppercase">
                            {type === 'upcoming'
                                ? 'Aucun Protocole Actif'
                                : type === 'past'
                                  ? 'Historique Vierge'
                                  : 'Aucune Interruption'}
                        </h3>
                        <p className="mx-auto mb-10 max-w-md text-sm leading-loose tracking-widest text-muted-foreground uppercase">
                            {type === 'upcoming'
                                ? "Votre journal d'intervention est vide. Nos unités sont prêtes pour votre prochain protocole."
                                : "Aucune mission n'a encore été enregistrée dans vos archives techniques."}
                        </p>
                        {type === 'upcoming' && (
                            <Link href={appointments.index().url}>
                                <Button className="skewed-btn h-16 bg-racing-red px-12 text-white transition-all hover:bg-white hover:text-luxury-black">
                                    <span>Nouvelle Intervention</span>
                                </Button>
                            </Link>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        );
    };

    const tabs = [
        {
            id: 'upcoming' as TabType,
            label: 'Missions Actives',
            count: upcoming.length,
        },
        { id: 'past' as TabType, label: 'Archives', count: past.length },
        {
            id: 'cancelled' as TabType,
            label: 'Interrompues',
            count: cancelled.length,
        },
    ];

    const currentAppointments =
        activeTab === 'upcoming'
            ? upcoming
            : activeTab === 'past'
              ? past
              : cancelled;

    return (
        <PublicLayout>
            <Head title="Console d'Intervention" />

            <div className="relative mx-auto min-h-screen max-w-5xl px-4 pt-32 pb-24 sm:px-6 lg:px-8">
                {/* Background Decor */}
                <div className="pointer-events-none absolute top-0 left-1/2 -mt-48 h-[500px] w-full -translate-x-1/2 rounded-full bg-racing-red/5 blur-[120px]" />

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16 space-y-4 text-center"
                >
                    <div className="mb-4 inline-flex items-center gap-2 border border-white/5 bg-luxury-charcoal px-4 py-1.5 font-heading text-[9px] font-bold tracking-[0.4em] text-racing-red uppercase">
                        <ActivityIcon className="h-3 w-3 animate-pulse" />
                        Statut des Opérations
                    </div>
                    <h1 className="font-heading text-5xl font-bold tracking-tighter text-chrome uppercase md:text-7xl">
                        Console <span className="text-racing-red">Client</span>
                    </h1>
                    <div className="mx-auto h-1 w-24 bg-racing-red" />
                </motion.div>

                {/* Tabs */}
                <div className="mb-12 flex flex-wrap justify-center gap-4">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative h-14 -skew-x-12 transform px-8 font-heading text-[10px] font-bold tracking-[0.3em] uppercase transition-all duration-300 ${
                                activeTab === tab.id
                                    ? 'bg-racing-red text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                                    : 'border border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            <span className="inline-block skew-x-12">
                                {tab.label}
                                {tab.count > 0 && (
                                    <span
                                        className={`ml-3 rounded-full px-2 py-0.5 text-[9px] ${activeTab === tab.id ? 'bg-white text-racing-red' : 'bg-white/10 text-white'}`}
                                    >
                                        {tab.count}
                                    </span>
                                )}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="space-y-6"
                    >
                        {currentAppointments.length === 0 ? (
                            renderEmptyState(activeTab)
                        ) : (
                            <div className="grid gap-6">
                                {currentAppointments.map((apt) =>
                                    renderAppointment(apt, activeTab),
                                )}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* New Booking CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-16 flex justify-center border-t border-white/5 pt-12"
                >
                    <Link
                        href={appointments.index().url}
                        className="group flex items-center gap-3 font-heading text-[10px] font-bold tracking-[0.4em] text-racing-red uppercase transition-colors hover:text-white"
                    >
                        <PlusIcon className="h-4 w-4 transition-transform group-hover:rotate-90" />
                        Initialiser un Nouveau Protocole
                    </Link>
                </motion.div>
            </div>
        </PublicLayout>
    );
}
