import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PublicLayout from '@/layouts/public-layout';
import { Head, Link, router } from '@inertiajs/react';
import { appointments } from '@/routes';
import { CalendarIcon, MapPinIcon, ClockIcon, AlertCircleIcon, XIcon, DownloadIcon, ArrowLeftIcon, FileTextIcon, UserIcon } from 'lucide-react';
import { toast } from 'sonner';

interface Service {
    name: string;
    estimated_duration: number;
}

interface Team {
    name: string;
}

interface User {
    name: string;
    email: string;
}

interface Appointment {
    id: number;
    start_at: string;
    end_at: string;
    status: string;
    notes: string | null;
    service: Service;
    team: Team;
    user: User;
    cancellation_reason: string | null;
}

interface Props {
    appointment: Appointment;
}

export default function AppointmentShow({ appointment }: Props) {
    const handleCancel = () => {
        if (confirm('Voulez-vous vraiment annuler ce rendez-vous ?')) {
            router.delete(appointments.cancel(appointment.id).url, {
                onSuccess: () => toast.success('Rendez-vous annulé avec succès.'),
            });
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed': return <Badge className="bg-racing-red text-white uppercase font-bold text-[10px] tracking-wider rounded-none">Confirmé</Badge>;
            case 'pending': return <Badge className="bg-yellow-500 text-luxury-black uppercase font-bold text-[10px] tracking-wider rounded-none">En attente</Badge>;
            case 'completed': return <Badge className="bg-green-600 text-white uppercase font-bold text-[10px] tracking-wider rounded-none">Terminé</Badge>;
            case 'cancelled': return <Badge className="bg-red-900 text-white uppercase font-bold text-[10px] tracking-wider rounded-none">Annulé</Badge>;
            default: return <Badge className="bg-gray-500 text-white uppercase font-bold text-[10px] tracking-wider rounded-none">{status}</Badge>;
        }
    };

    const date = new Date(appointment.start_at);
    const endDate = new Date(appointment.end_at);

    return (
        <PublicLayout>
            <Head title={`Rendez-vous - ${appointment.service.name}`} />
            
            <div className="mx-auto max-w-4xl px-4 py-24 relative z-10">
                <Link href={appointments.my().url} className="inline-flex items-center text-muted-foreground hover:text-white mb-8 transition-colors text-sm uppercase tracking-widest font-bold">
                    <ArrowLeftIcon className="h-4 w-4 mr-2" /> Retour à mes rendez-vous
                </Link>

                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold uppercase tracking-tighter text-white mb-6">
                        Détails de <span className="text-racing-red">l'Intervention</span>
                    </h1>
                    <div className="h-[2px] w-24 bg-racing-red mb-6" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="bg-luxury-charcoal border-white/5 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-racing-red opacity-50 group-hover:opacity-100 transition-opacity" />
                            <CardHeader className="border-b border-white/5 pb-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-2xl font-heading font-bold text-white uppercase tracking-wider mb-2">{appointment.service.name}</CardTitle>
                                        <CardDescription className="text-muted-foreground font-medium uppercase tracking-[0.1em] text-[10px]">
                                            Durée estimée: {appointment.service.estimated_duration} minutes
                                        </CardDescription>
                                    </div>
                                    {getStatusBadge(appointment.status)}
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 md:p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-heading font-bold uppercase tracking-[0.2em] text-muted-foreground">Date & Heure</h4>
                                        <div className="flex items-start gap-3">
                                            <CalendarIcon className="h-5 w-5 text-racing-red mt-0.5" />
                                            <div>
                                                <p className="text-white font-medium">{date.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                                <p className="text-muted-foreground text-sm">{date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - {endDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-heading font-bold uppercase tracking-[0.2em] text-muted-foreground">Lieu d'Intervention</h4>
                                        <div className="flex items-start gap-3">
                                            <MapPinIcon className="h-5 w-5 text-racing-red mt-0.5" />
                                            <div>
                                                <p className="text-white font-medium">{appointment.team.name}</p>
                                                <p className="text-muted-foreground text-sm">Garage Partenaire</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-heading font-bold uppercase tracking-[0.2em] text-muted-foreground">Client</h4>
                                        <div className="flex items-start gap-3">
                                            <UserIcon className="h-5 w-5 text-racing-red mt-0.5" />
                                            <div>
                                                <p className="text-white font-medium">{appointment.user.name}</p>
                                                <p className="text-muted-foreground text-sm">{appointment.user.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {appointment.notes && (
                                    <div className="pt-6 border-t border-white/5 space-y-4">
                                        <h4 className="text-[10px] font-heading font-bold uppercase tracking-[0.2em] text-muted-foreground">Spécifications Véhicule</h4>
                                        <div className="bg-luxury-black p-4 rounded-sm border border-white/5">
                                            <p className="text-white/80 whitespace-pre-wrap text-sm">{appointment.notes}</p>
                                        </div>
                                    </div>
                                )}

                                {appointment.status === 'cancelled' && appointment.cancellation_reason && (
                                    <div className="pt-6 border-t border-white/5 space-y-4">
                                        <h4 className="text-[10px] font-heading font-bold uppercase tracking-[0.2em] text-racing-red">Raison de l'Annulation</h4>
                                        <div className="bg-red-900/10 border border-red-900/30 p-4 rounded-sm">
                                            <p className="text-white/80 whitespace-pre-wrap text-sm">{appointment.cancellation_reason}</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="bg-luxury-charcoal border-white/5 shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-sm font-heading font-bold text-white uppercase tracking-widest">Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {appointment.status === 'confirmed' && (
                                    <>
                                        <a href={appointments.calendar(appointment.id).url} className="block w-full">
                                            <Button variant="outline" className="w-full rounded-none border-white/10 text-white hover:bg-white/5 uppercase tracking-widest text-[10px] font-bold justify-start">
                                                <DownloadIcon className="h-4 w-4 mr-3 text-racing-red" /> Ajouter au Calendrier (.ics)
                                            </Button>
                                        </a>
                                        <a href={appointments.reschedule(appointment.id).url} className="block w-full">
                                            <Button variant="outline" className="w-full rounded-none border-racing-red/30 text-racing-red hover:bg-racing-red/10 uppercase tracking-widest text-[10px] font-bold justify-start">
                                                <CalendarIcon className="h-4 w-4 mr-3" /> Reprogrammer
                                            </Button>
                                        </a>
                                        <Button
                                            variant="destructive"
                                            onClick={handleCancel}
                                            className="w-full rounded-none bg-red-900/50 hover:bg-red-900 text-white uppercase tracking-widest text-[10px] font-bold justify-start"
                                        >
                                            <XIcon className="h-4 w-4 mr-3" /> Annuler l'Intervention
                                        </Button>
                                    </>
                                )}

                                {appointment.status !== 'confirmed' && (
                                    <p className="text-muted-foreground text-sm">Aucune action disponible pour ce statut.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
