import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PublicLayout from '@/layouts/public-layout';
import { Head, Link, router } from '@inertiajs/react';
import { appointments } from '@/routes';
import { CalendarIcon, MapPinIcon, ClockIcon, AlertCircleIcon, XIcon, DownloadIcon } from 'lucide-react';
import { toast } from 'sonner';

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
}

interface Props {
    appointments: Appointment[];
}

export default function MyAppointments({ appointments }: Props) {
    const handleCancel = (id: number) => {
        if (confirm('Voulez-vous vraiment annuler ce rendez-vous ?')) {
            router.delete(appointments.cancel(id).url, {
                onSuccess: () => toast.success('Rendez-vous annulé avec succès.'),
            });
        }
    };

    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed': return <Badge className="bg-racing-red text-white uppercase font-bold text-[10px] tracking-wider rounded-none">Confirmé</Badge>;
            case 'pending': return <Badge className="bg-yellow-500 text-luxury-black uppercase font-bold text-[10px] tracking-wider rounded-none">En attente</Badge>;
            default: return <Badge className="bg-gray-500 text-white uppercase font-bold text-[10px] tracking-wider rounded-none">{status}</Badge>;
        }
    };

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

                {appointments.length === 0 ? (
                    <Card className="bg-luxury-charcoal border-white/5 shadow-2xl text-center py-16">
                        <CardContent>
                            <CalendarIcon className="h-16 w-16 mx-auto text-muted-foreground/30 mb-6" />
                            <h3 className="text-xl font-heading font-bold text-white uppercase mb-2">Aucun rendez-vous</h3>
                            <p className="text-muted-foreground mb-8">Vous n'avez pas d'intervention planifiée actuellement.</p>
                            <Link href={route('appointments.index')}>
                                <Button className="bg-racing-red text-white hover:bg-white hover:text-luxury-black font-heading font-bold uppercase tracking-widest rounded-none">
                                    Prendre Rendez-vous
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6">
                        {appointments.map((appointment) => {
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
                                        </div>
                                        
                                        <div className="flex flex-col sm:flex-row md:flex-col gap-3 min-w-[200px]">
                                            <Link href={route('appointments.show', appointment.id)} className="w-full">
                                                <Button variant="outline" className="w-full rounded-none border-white/10 text-white hover:bg-white/5 uppercase tracking-widest text-[10px] font-bold">
                                                    Détails
                                                </Button>
                                            </Link>
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
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
