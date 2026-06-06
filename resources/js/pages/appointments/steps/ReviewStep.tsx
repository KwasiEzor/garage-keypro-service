import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
    CalendarIcon,
    ClockIcon,
    MapPinIcon,
    FileTextIcon,
    EditIcon,
    AlertCircleIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Service {
    id: number;
    name: string;
    estimated_duration: number;
    starting_price: number;
}

interface Team {
    id: number;
    name: string;
}

interface ReviewStepProps {
    service: Service | null;
    team: Team | null;
    date: Date | null;
    slot: string;
    notes: string;
    onEdit: (step: number) => void;
}

export default function ReviewStep({
    service,
    team,
    date,
    slot,
    notes,
    onEdit,
}: ReviewStepProps) {
    if (!service || !team || !date || !slot) {
        return (
            <div className="py-12 text-center">
                <AlertCircleIcon className="mx-auto mb-4 h-12 w-12 text-racing-red" />
                <p className="mb-2 font-medium text-white">
                    Informations incomplètes
                </p>
                <p className="text-sm text-muted-foreground">
                    Veuillez compléter toutes les étapes précédentes
                </p>
            </div>
        );
    }

    // Calculate end time based on slot and duration
    const [slotHour, slotMinute] = slot.split(':').map(Number);
    const endHour = Math.floor(
        (slotHour * 60 + slotMinute + service.estimated_duration) / 60,
    );
    const endMinute =
        (slotHour * 60 + slotMinute + service.estimated_duration) % 60;
    const endTime = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;

    return (
        <div className="space-y-6">
            <div className="mb-8 text-center">
                <h2 className="mb-3 font-heading text-2xl font-bold tracking-tighter text-white uppercase md:text-3xl">
                    Confirmez votre{' '}
                    <span className="text-racing-red">Rendez-vous</span>
                </h2>
                <p className="text-sm tracking-[0.15em] text-muted-foreground uppercase">
                    Vérifiez les détails avant de confirmer
                </p>
            </div>

            <div className="mx-auto max-w-3xl space-y-6">
                {/* Service Card */}
                <Card className="group relative overflow-hidden border-white/5 bg-luxury-charcoal shadow-xl">
                    <div className="absolute top-0 left-0 h-full w-1 bg-racing-red opacity-50 transition-opacity group-hover:opacity-100" />
                    <CardHeader className="border-b border-white/5 pb-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <CardTitle className="mb-2 font-heading text-xl font-bold tracking-wider text-white uppercase">
                                    {service.name}
                                </CardTitle>
                                <p className="text-[10px] font-medium tracking-[0.1em] text-muted-foreground uppercase">
                                    Durée estimée: {service.estimated_duration}{' '}
                                    minutes
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onEdit(1)}
                                className="rounded-none text-[10px] font-bold tracking-widest text-racing-red uppercase hover:bg-racing-red/20 hover:text-white"
                            >
                                <EditIcon className="mr-2 h-3 w-3" /> Modifier
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <Badge className="rounded-none border-racing-red/30 bg-racing-red/20 text-[10px] font-bold tracking-wider text-racing-red uppercase">
                            À partir de {service.starting_price}€
                        </Badge>
                    </CardContent>
                </Card>

                {/* Date & Time Card */}
                <Card className="group relative overflow-hidden border-white/5 bg-luxury-charcoal shadow-xl">
                    <div className="absolute top-0 left-0 h-full w-1 bg-racing-red opacity-50 transition-opacity group-hover:opacity-100" />
                    <CardHeader className="border-b border-white/5 pb-6">
                        <div className="flex items-start justify-between">
                            <CardTitle className="font-heading text-lg font-bold tracking-wider text-white uppercase">
                                Date & Heure
                            </CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onEdit(2)}
                                className="rounded-none text-[10px] font-bold tracking-widest text-racing-red uppercase hover:bg-racing-red/20 hover:text-white"
                            >
                                <EditIcon className="mr-2 h-3 w-3" /> Modifier
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4 p-6">
                        <div className="flex items-start gap-3">
                            <CalendarIcon className="mt-0.5 h-5 w-5 text-racing-red" />
                            <div>
                                <p className="font-medium text-white capitalize">
                                    {format(date, 'EEEE d MMMM yyyy', {
                                        locale: fr,
                                    })}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <ClockIcon className="mt-0.5 h-5 w-5 text-racing-red" />
                            <div>
                                <p className="font-medium text-white">
                                    {slot} - {endTime}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    ({service.estimated_duration} minutes)
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Location Card */}
                <Card className="group relative overflow-hidden border-white/5 bg-luxury-charcoal shadow-xl">
                    <div className="absolute top-0 left-0 h-full w-1 bg-racing-red opacity-50 transition-opacity group-hover:opacity-100" />
                    <CardHeader className="border-b border-white/5 pb-6">
                        <CardTitle className="font-heading text-lg font-bold tracking-wider text-white uppercase">
                            Lieu d'Intervention
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="flex items-start gap-3">
                            <MapPinIcon className="mt-0.5 h-5 w-5 text-racing-red" />
                            <div>
                                <p className="font-medium text-white">
                                    {team.name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Garage Partenaire
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Notes Card (if provided) */}
                {notes && (
                    <Card className="group relative overflow-hidden border-white/5 bg-luxury-charcoal shadow-xl">
                        <div className="absolute top-0 left-0 h-full w-1 bg-racing-red opacity-50 transition-opacity group-hover:opacity-100" />
                        <CardHeader className="border-b border-white/5 pb-6">
                            <div className="flex items-start justify-between">
                                <CardTitle className="font-heading text-lg font-bold tracking-wider text-white uppercase">
                                    Spécifications Véhicule
                                </CardTitle>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onEdit(3)}
                                    className="rounded-none text-[10px] font-bold tracking-widest text-racing-red uppercase hover:bg-racing-red/20 hover:text-white"
                                >
                                    <EditIcon className="mr-2 h-3 w-3" />{' '}
                                    Modifier
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="flex items-start gap-3">
                                <FileTextIcon className="mt-0.5 h-5 w-5 text-racing-red" />
                                <div className="flex-1">
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap text-white/80">
                                        {notes}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Cancellation Policy */}
                <Card className="border-racing-red/30 bg-racing-red/10 shadow-xl">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-3">
                            <AlertCircleIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-racing-red" />
                            <div className="space-y-2">
                                <p className="font-heading text-xs font-bold tracking-[0.2em] text-racing-red uppercase">
                                    Politique d'Annulation
                                </p>
                                <p className="text-sm leading-relaxed text-white/90">
                                    Vous pouvez annuler gratuitement votre
                                    rendez-vous jusqu'à{' '}
                                    <strong>24 heures</strong> avant l'heure
                                    prévue. Après ce délai, des frais peuvent
                                    s'appliquer.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
