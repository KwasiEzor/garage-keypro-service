import { Head, Link, router } from '@inertiajs/react';
import {
    CalendarIcon,
    MapPinIcon,
    ClockIcon,
    XIcon,
    DownloadIcon,
    RefreshCwIcon,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
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
        if (confirm('Voulez-vous vraiment annuler ce rendez-vous ?')) {
            router.delete(appointments.cancel(id).url, {
                onSuccess: () =>
                    toast.success('Rendez-vous annulé avec succès.'),
                preserveScroll: true,
            });
        }
    };

    const handleBookAgain = () => {
        // Navigate to booking page with service pre-selected
        router.visit(appointments.index().url);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed':
                return (
                    <Badge className="rounded-none bg-racing-red text-[10px] font-bold tracking-wider text-white uppercase">
                        Confirmé
                    </Badge>
                );
            case 'pending':
                return (
                    <Badge className="rounded-none bg-yellow-500 text-[10px] font-bold tracking-wider text-luxury-black uppercase">
                        En attente
                    </Badge>
                );
            case 'completed':
                return (
                    <Badge className="rounded-none bg-green-600 text-[10px] font-bold tracking-wider text-white uppercase">
                        Terminé
                    </Badge>
                );
            case 'cancelled':
                return (
                    <Badge className="rounded-none bg-red-900 text-[10px] font-bold tracking-wider text-white uppercase">
                        Annulé
                    </Badge>
                );
            case 'no_show':
                return (
                    <Badge className="rounded-none bg-gray-700 text-[10px] font-bold tracking-wider text-white uppercase">
                        Absent
                    </Badge>
                );
            default:
                return (
                    <Badge className="rounded-none bg-gray-500 text-[10px] font-bold tracking-wider text-white uppercase">
                        {status}
                    </Badge>
                );
        }
    };

    const renderAppointment = (
        appointment: Appointment,
        showActions: 'upcoming' | 'past' | 'cancelled',
    ) => {
        const date = new Date(appointment.start_at);
        const endDate = new Date(appointment.end_at);

        return (
            <Card
                key={appointment.id}
                className="group relative overflow-hidden border-white/5 bg-luxury-charcoal shadow-xl"
            >
                <div className="absolute top-0 left-0 h-full w-1 bg-racing-red opacity-50 transition-opacity group-hover:opacity-100" />
                <CardContent className="flex flex-col justify-between gap-6 p-6 md:flex-row md:items-center md:p-8">
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                            {getStatusBadge(appointment.status)}
                            <h3 className="font-heading text-xl font-bold text-white uppercase">
                                {appointment.service.name}
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 gap-4 text-sm text-muted-foreground md:grid-cols-2">
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4 text-racing-red" />
                                <span>
                                    {date.toLocaleDateString('fr-FR', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ClockIcon className="h-4 w-4 text-racing-red" />
                                <span>
                                    {date.toLocaleTimeString('fr-FR', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}{' '}
                                    -{' '}
                                    {endDate.toLocaleTimeString('fr-FR', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 md:col-span-2">
                                <MapPinIcon className="h-4 w-4 text-racing-red" />
                                <span>{appointment.team.name}</span>
                            </div>
                        </div>

                        {appointment.cancellation_reason && (
                            <div className="border-t border-white/5 pt-3">
                                <p className="mb-1 text-xs tracking-widest text-muted-foreground uppercase">
                                    Raison d'annulation
                                </p>
                                <p className="text-sm text-white/80">
                                    {appointment.cancellation_reason}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex min-w-[200px] flex-col gap-3 sm:flex-row md:flex-col">
                        <Link
                            href={appointments.show(appointment.id).url}
                            className="w-full"
                        >
                            <Button
                                variant="outline"
                                className="w-full rounded-none border-white/10 text-[10px] font-bold tracking-widest text-white uppercase hover:bg-white/5"
                            >
                                Détails
                            </Button>
                        </Link>

                        {showActions === 'upcoming' && (
                            <>
                                <a
                                    href={
                                        appointments.reschedule(appointment.id)
                                            .url
                                    }
                                    className="w-full"
                                >
                                    <Button
                                        variant="secondary"
                                        className="w-full rounded-none bg-white/5 text-[10px] font-bold tracking-widest text-white uppercase hover:bg-white/10"
                                    >
                                        <RefreshCwIcon className="mr-2 h-3 w-3" />{' '}
                                        Reprogrammer
                                    </Button>
                                </a>
                                <a
                                    href={
                                        appointments.calendar(appointment.id)
                                            .url
                                    }
                                    className="w-full"
                                >
                                    <Button
                                        variant="secondary"
                                        className="w-full rounded-none bg-white/5 text-[10px] font-bold tracking-widest text-white uppercase hover:bg-white/10"
                                    >
                                        <DownloadIcon className="mr-2 h-3 w-3" />{' '}
                                        .ics
                                    </Button>
                                </a>
                                <Button
                                    variant="destructive"
                                    onClick={() => handleCancel(appointment.id)}
                                    className="w-full rounded-none bg-red-900/50 text-[10px] font-bold tracking-widest text-white uppercase hover:bg-red-900"
                                >
                                    <XIcon className="mr-2 h-3 w-3" /> Annuler
                                </Button>
                            </>
                        )}

                        {showActions === 'past' && (
                            <Button
                                onClick={() => handleBookAgain(appointment)}
                                className="w-full rounded-none bg-racing-red text-[10px] font-bold tracking-widest text-white uppercase hover:bg-white hover:text-luxury-black"
                            >
                                <RefreshCwIcon className="mr-2 h-3 w-3" />{' '}
                                Réserver à nouveau
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    };

    const renderEmptyState = (type: TabType) => {
        const messages = {
            upcoming: {
                title: 'Aucun rendez-vous à venir',
                description:
                    "Vous n'avez pas d'intervention planifiée actuellement.",
                showButton: true,
            },
            past: {
                title: 'Aucun rendez-vous passé',
                description: "Votre historique d'interventions apparaîtra ici.",
                showButton: false,
            },
            cancelled: {
                title: 'Aucune annulation',
                description: "Vous n'avez pas de rendez-vous annulé.",
                showButton: false,
            },
        };

        const message = messages[type];

        return (
            <Card className="border-white/5 bg-luxury-charcoal py-16 text-center shadow-2xl">
                <CardContent>
                    <CalendarIcon className="mx-auto mb-6 h-16 w-16 text-muted-foreground/30" />
                    <h3 className="mb-2 font-heading text-xl font-bold text-white uppercase">
                        {message.title}
                    </h3>
                    <p className="mb-8 text-muted-foreground">
                        {message.description}
                    </p>
                    {message.showButton && (
                        <Link href={appointments.index().url}>
                            <Button className="rounded-none bg-racing-red font-heading font-bold tracking-widest text-white uppercase hover:bg-white hover:text-luxury-black">
                                Prendre Rendez-vous
                            </Button>
                        </Link>
                    )}
                </CardContent>
            </Card>
        );
    };

    const tabs = [
        { id: 'upcoming' as TabType, label: 'À venir', count: upcoming.length },
        { id: 'past' as TabType, label: 'Passés', count: past.length },
        {
            id: 'cancelled' as TabType,
            label: 'Annulés',
            count: cancelled.length,
        },
    ];

    const getCurrentAppointments = () => {
        switch (activeTab) {
            case 'upcoming':
                return upcoming;
            case 'past':
                return past;
            case 'cancelled':
                return cancelled;
        }
    };

    const currentAppointments = getCurrentAppointments();

    return (
        <PublicLayout>
            <Head title="Mes Rendez-vous" />

            <div className="relative z-10 mx-auto max-w-4xl px-4 py-24">
                <div className="mb-12 text-center">
                    <h1 className="mb-6 font-heading text-4xl font-bold tracking-tighter text-white uppercase md:text-5xl">
                        Mes <span className="text-racing-red">Rendez-vous</span>
                    </h1>
                    <div className="mx-auto mb-6 h-[2px] w-24 bg-racing-red" />
                </div>

                {/* Tabs */}
                <div className="mb-8">
                    <div className="flex flex-wrap justify-center gap-2 border-b border-white/10 pb-4">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative rounded-none px-6 py-3 font-heading text-xs font-bold tracking-widest uppercase transition-all duration-200 ${
                                    activeTab === tab.id
                                        ? 'bg-racing-red text-white'
                                        : 'border border-white/10 bg-luxury-black text-muted-foreground hover:bg-white/5 hover:text-white'
                                } `}
                            >
                                {tab.label}
                                {tab.count > 0 && (
                                    <span
                                        className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${activeTab === tab.id ? 'bg-white text-racing-red' : 'bg-white/10 text-white'} `}
                                    >
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                {currentAppointments.length === 0 ? (
                    renderEmptyState(activeTab)
                ) : (
                    <div className="grid gap-6">
                        {currentAppointments.map((appointment) =>
                            renderAppointment(appointment, activeTab),
                        )}
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
