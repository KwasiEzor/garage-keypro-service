import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, ClockIcon, MapPinIcon, FileTextIcon, EditIcon, AlertCircleIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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

export default function ReviewStep({ service, team, date, slot, notes, onEdit }: ReviewStepProps) {
    if (!service || !team || !date || !slot) {
        return (
            <div className="text-center py-12">
                <AlertCircleIcon className="h-12 w-12 mx-auto text-racing-red mb-4" />
                <p className="text-white font-medium mb-2">Informations incomplètes</p>
                <p className="text-sm text-muted-foreground">
                    Veuillez compléter toutes les étapes précédentes
                </p>
            </div>
        );
    }

    // Calculate end time based on slot and duration
    const [slotHour, slotMinute] = slot.split(':').map(Number);
    const endHour = Math.floor((slotHour * 60 + slotMinute + service.estimated_duration) / 60);
    const endMinute = (slotHour * 60 + slotMinute + service.estimated_duration) % 60;
    const endTime = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-heading font-bold uppercase tracking-tighter text-white mb-3">
                    Confirmez votre <span className="text-racing-red">Rendez-vous</span>
                </h2>
                <p className="text-sm text-muted-foreground uppercase tracking-[0.15em]">
                    Vérifiez les détails avant de confirmer
                </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
                {/* Service Card */}
                <Card className="bg-luxury-charcoal border-white/5 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-racing-red opacity-50 group-hover:opacity-100 transition-opacity" />
                    <CardHeader className="border-b border-white/5 pb-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-xl font-heading font-bold text-white uppercase tracking-wider mb-2">
                                    {service.name}
                                </CardTitle>
                                <p className="text-muted-foreground font-medium uppercase tracking-[0.1em] text-[10px]">
                                    Durée estimée: {service.estimated_duration} minutes
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onEdit(1)}
                                className="text-racing-red hover:text-white hover:bg-racing-red/20 rounded-none uppercase text-[10px] tracking-widest font-bold"
                            >
                                <EditIcon className="h-3 w-3 mr-2" /> Modifier
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <Badge className="bg-racing-red/20 text-racing-red border-racing-red/30 uppercase text-[10px] font-bold tracking-wider rounded-none">
                            À partir de {service.starting_price}€
                        </Badge>
                    </CardContent>
                </Card>

                {/* Date & Time Card */}
                <Card className="bg-luxury-charcoal border-white/5 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-racing-red opacity-50 group-hover:opacity-100 transition-opacity" />
                    <CardHeader className="border-b border-white/5 pb-6">
                        <div className="flex justify-between items-start">
                            <CardTitle className="text-lg font-heading font-bold text-white uppercase tracking-wider">
                                Date & Heure
                            </CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onEdit(2)}
                                className="text-racing-red hover:text-white hover:bg-racing-red/20 rounded-none uppercase text-[10px] tracking-widest font-bold"
                            >
                                <EditIcon className="h-3 w-3 mr-2" /> Modifier
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <div className="flex items-start gap-3">
                            <CalendarIcon className="h-5 w-5 text-racing-red mt-0.5" />
                            <div>
                                <p className="text-white font-medium capitalize">
                                    {format(date, 'EEEE d MMMM yyyy', { locale: fr })}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <ClockIcon className="h-5 w-5 text-racing-red mt-0.5" />
                            <div>
                                <p className="text-white font-medium">
                                    {slot} - {endTime}
                                </p>
                                <p className="text-muted-foreground text-sm">
                                    ({service.estimated_duration} minutes)
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Location Card */}
                <Card className="bg-luxury-charcoal border-white/5 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-racing-red opacity-50 group-hover:opacity-100 transition-opacity" />
                    <CardHeader className="border-b border-white/5 pb-6">
                        <CardTitle className="text-lg font-heading font-bold text-white uppercase tracking-wider">
                            Lieu d'Intervention
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="flex items-start gap-3">
                            <MapPinIcon className="h-5 w-5 text-racing-red mt-0.5" />
                            <div>
                                <p className="text-white font-medium">{team.name}</p>
                                <p className="text-muted-foreground text-sm">Garage Partenaire</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Notes Card (if provided) */}
                {notes && (
                    <Card className="bg-luxury-charcoal border-white/5 shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-racing-red opacity-50 group-hover:opacity-100 transition-opacity" />
                        <CardHeader className="border-b border-white/5 pb-6">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg font-heading font-bold text-white uppercase tracking-wider">
                                    Spécifications Véhicule
                                </CardTitle>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onEdit(3)}
                                    className="text-racing-red hover:text-white hover:bg-racing-red/20 rounded-none uppercase text-[10px] tracking-widest font-bold"
                                >
                                    <EditIcon className="h-3 w-3 mr-2" /> Modifier
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="flex items-start gap-3">
                                <FileTextIcon className="h-5 w-5 text-racing-red mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-white/80 whitespace-pre-wrap text-sm leading-relaxed">
                                        {notes}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Cancellation Policy */}
                <Card className="bg-racing-red/10 border-racing-red/30 shadow-xl">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-3">
                            <AlertCircleIcon className="h-5 w-5 text-racing-red mt-0.5 flex-shrink-0" />
                            <div className="space-y-2">
                                <p className="text-xs font-heading font-bold uppercase tracking-[0.2em] text-racing-red">
                                    Politique d'Annulation
                                </p>
                                <p className="text-sm text-white/90 leading-relaxed">
                                    Vous pouvez annuler gratuitement votre rendez-vous jusqu'à <strong>24 heures</strong> avant l'heure prévue.
                                    Après ce délai, des frais peuvent s'appliquer.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
