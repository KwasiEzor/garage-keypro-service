import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PublicLayout from '@/layouts/public-layout';
import { Head, Link, router } from '@inertiajs/react';
import { CalendarIcon, MapPinIcon, ClockIcon, XIcon, DownloadIcon, RefreshCwIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

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
            router.delete(route('appointments.cancel', id), {
                onSuccess: () => toast.success('Rendez-vous annulé avec succès.'),
                preserveScroll: true,
            });
        }
    };

    const handleBookAgain = (appointment: Appointment) => {
        // Navigate to booking page with service pre-selected
        router.visit(route('appointments.index'));
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed': return <Badge className="bg-racing-red text-white uppercase font-bold text-[10px] tracking-wider rounded-none">Confirmé</Badge>;
            case 'pending': return <Badge className="bg-yellow-500 text-luxury-black uppercase font-bold text-[10px] tracking-wider rounded-none">En attente</Badge>;
            case 'completed': return <Badge className="bg-green-600 text-white uppercase font-bold text-[10px] tracking-wider rounded-none">Terminé</Badge>;
            case 'cancelled': return <Badge className="bg-red-900 text-white uppercase font-bold text-[10px] tracking-wider rounded-none">Annulé</Badge>;
            case 'no_show': return <Badge className="bg-gray-700 text-white uppercase font-bold text-[10px] tracking-wider rounded-none">Absent</Badge>;
            default: return <Badge className="bg-gray-500 text-white uppercase font-bold text-[10px] tracking-wider rounded-none">{status}</Badge>;
        }
    };

    const renderAppointment = (appointment: Appointment, showActions: 'upcoming' | 'past' | 'cancelled') => {
        const date = new Date(appointment.start_at);
        const endDate = new Date(appointment.end_at);

        return (
            <Card key={appointment.id} className="bg-luxury-charcoal border-white/5 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-racing-red opacity-50 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center justify-between">
                    <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-3">
                            {getStatusBadge(appointment.status)}
                            <h3 className="text-xl font-heading font-bold text-white uppercase">{appointment.service.name}</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4 text-racing-red" />
                                <span>{date.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ClockIcon className="h-4 w-4 text-racing-red" />
                                <span>{date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - {endDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className="flex items-center gap-2 md:col-span-2">
                                <MapPinIcon className="h-4 w-4 text-racing-red" />
                                <span>{appointment.team.name}</span>
                            </div>
                        </div>

                        {appointment.cancellation_reason && (
                            <div className="pt-3 border-t border-white/5">
                                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Raison d'annulation</p>
                                <p className="text-sm text-white/80">{appointment.cancellation_reason}</p>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row md:flex-col gap-3 min-w-[200px]">
                        <Link href={route('appointments.show', appointment.id)} className="w-full">
                            <Button variant="outline" className="w-full rounded-none border-white/10 text-white hover:bg-white/5 uppercase tracking-widest text-[10px] font-bold">
                                Détails
                            </Button>
                        </Link>

                        {showActions === 'upcoming' && (
                            <>
                                <a href={route('appointments.reschedule', appointment.id)} className="w-full">
                                    <Button variant="secondary" className="w-full rounded-none bg-white/5 text-white hover:bg-white/10 uppercase tracking-widest text-[10px] font-bold">
                                        <RefreshCwIcon className="h-3 w-3 mr-2" /> Reprogrammer
                                    </Button>
                                </a>
                                <a href={route('appointments.calendar', appointment.id)} className="w-full">
                                    <Button variant="secondary" className="w-full rounded-none bg-white/5 text-white hover:bg-white/10 uppercase tracking-widest text-[10px] font-bold">
                                        <DownloadIcon className="h-3 w-3 mr-2" /> .ics
                                    </Button>
                                </a>
                                <Button
                                    variant="destructive"
                                    onClick={() => handleCancel(appointment.id)}
                                    className="w-full rounded-none bg-red-900/50 hover:bg-red-900 text-white uppercase tracking-widest text-[10px] font-bold"
                                >
                                    <XIcon className="h-3 w-3 mr-2" /> Annuler
                                </Button>
                            </>
                        )}

                        {showActions === 'past' && (
                            <Button
                                onClick={() => handleBookAgain(appointment)}
                                className="w-full rounded-none bg-racing-red text-white hover:bg-white hover:text-luxury-black uppercase tracking-widest text-[10px] font-bold"
                            >
                                <RefreshCwIcon className="h-3 w-3 mr-2" /> Réserver à nouveau
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
                description: 'Vous n\'avez pas d\'intervention planifiée actuellement.',
                showButton: true,
            },
            past: {
                title: 'Aucun rendez-vous passé',
                description: 'Votre historique d\'interventions apparaîtra ici.',
                showButton: false,
            },
            cancelled: {
                title: 'Aucune annulation',
                description: 'Vous n\'avez pas de rendez-vous annulé.',
                showButton: false,
            },
        };

        const message = messages[type];

        return (
            <Card className="bg-luxury-charcoal border-white/5 shadow-2xl text-center py-16">
                <CardContent>
                    <CalendarIcon className="h-16 w-16 mx-auto text-muted-foreground/30 mb-6" />
                    <h3 className="text-xl font-heading font-bold text-white uppercase mb-2">{message.title}</h3>
                    <p className="text-muted-foreground mb-8">{message.description}</p>
                    {message.showButton && (
                        <Link href={route('appointments.index')}>
                            <Button className="bg-racing-red text-white hover:bg-white hover:text-luxury-black font-heading font-bold uppercase tracking-widest rounded-none">
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
        { id: 'cancelled' as TabType, label: 'Annulés', count: cancelled.length },
    ];

    const getCurrentAppointments = () => {
        switch (activeTab) {
            case 'upcoming': return upcoming;
            case 'past': return past;
            case 'cancelled': return cancelled;
        }
    };

    const currentAppointments = getCurrentAppointments();

    return (
        <PublicLayout>
            <Head title="Mes Rendez-vous" />

            <div className="mx-auto max-w-4xl px-4 py-24 relative z-10">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold uppercase tracking-tighter text-white mb-6">
                        Mes <span className="text-racing-red">Rendez-vous</span>
                    </h1>
                    <div className="h-[2px] w-24 bg-racing-red mx-auto mb-6" />
                </div>

                {/* Tabs */}
                <div className="mb-8">
                    <div className="flex flex-wrap justify-center gap-2 border-b border-white/10 pb-4">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    px-6 py-3 font-heading font-bold uppercase tracking-widest text-xs transition-all duration-200 rounded-none relative
                                    ${activeTab === tab.id
                                        ? 'bg-racing-red text-white'
                                        : 'bg-luxury-black text-muted-foreground hover:text-white hover:bg-white/5 border border-white/10'
                                    }
                                `}
                            >
                                {tab.label}
                                {tab.count > 0 && (
                                    <span className={`
                                        ml-2 px-2 py-0.5 text-[10px] font-bold rounded-full
                                        ${activeTab === tab.id ? 'bg-white text-racing-red' : 'bg-white/10 text-white'}
                                    `}>
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
                        {currentAppointments.map((appointment) => renderAppointment(appointment, activeTab))}
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
