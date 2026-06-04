import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import PublicLayout from '@/layouts/public-layout';
import { Head, useForm, router } from '@inertiajs/react';
import { appointments } from '@/routes';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

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

interface Slot {
    start_time: string;
    end_time: string;
    is_available: boolean;
    buffer_minutes: number;
}

interface Props {
    services: Service[];
    teams: Team[];
    availableSlots?: Slot[];
}

export default function AppointmentIndex({ services, teams, availableSlots = [] }: Props) {
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        team_id: teams[0]?.id.toString() || '',
        service_id: '',
        date: new Date().toISOString().split('T')[0],
        slot: '',
        notes: '',
    });

    useEffect(() => {
        if (data.team_id && data.service_id && data.date) {
            setIsLoadingSlots(true);
            router.reload({
                only: ['availableSlots'],
                data: {
                    team_id: data.team_id,
                    service_id: data.service_id,
                    date: data.date,
                },
                onFinish: () => setIsLoadingSlots(false),
                preserveState: true,
                preserveScroll: true,
            });
        }
    }, [data.team_id, data.service_id, data.date]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(appointments.store().url, {
            onSuccess: () => toast.success('Appointment booked successfully!'),
            onError: () => toast.error('Please fix the errors in the form.'),
        });
    };

    return (
        <PublicLayout>
            <Head title="Réserver un Rendez-vous" />

            <div className="mx-auto max-w-2xl px-4 py-24 relative z-10">
                <div className="mb-12 text-center">
                    <span className="text-[11px] font-heading font-bold uppercase tracking-[0.4em] text-racing-red mb-4 block">Protocoles de Service</span>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold uppercase tracking-tighter text-white mb-6">
                        Planifier une <span className="text-racing-red">Intervention</span>
                    </h1>
                    <div className="h-[2px] w-24 bg-racing-red mx-auto mb-6" />
                    <p className="text-sm text-muted-foreground uppercase tracking-[0.2em] font-medium leading-loose">
                        Sélectionnez un service et choisissez un créneau opérationnel.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card className="bg-luxury-charcoal border-white/5 shadow-2xl overflow-hidden relative group">
                        <div className="absolute top-0 left-0 w-1 h-0 bg-racing-red transition-all duration-500 group-hover:h-full" />
                        
                        <CardHeader className="border-b border-white/5 pb-8">
                            <CardTitle className="text-2xl font-heading font-bold text-white uppercase tracking-wider">Détails du Rendez-vous</CardTitle>
                            <CardDescription className="text-muted-foreground font-medium uppercase tracking-[0.1em] text-[10px]">Confirmation envoyée par protocole sécurisé.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8 pt-8">
                            {/* Team Selection */}
                            <div className="space-y-3">
                                <Label htmlFor="team_id" className="text-[10px] font-heading font-bold uppercase tracking-[0.2em] text-muted-foreground pl-1">Sélection du Garage</Label>
                                <Select 
                                    value={data.team_id} 
                                    onValueChange={(value) => setData('team_id', value)}
                                >
                                    <SelectTrigger id="team_id" className="bg-luxury-black border-white/10 text-white h-12 rounded-none focus:ring-racing-red focus:border-racing-red">
                                        <SelectValue placeholder="Choisir un garage" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-luxury-black border-white/10 text-white rounded-none">
                                        {teams.map((team) => (
                                            <SelectItem key={team.id} value={team.id.toString()} className="focus:bg-racing-red focus:text-white cursor-pointer">
                                                {team.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.team_id && <p className="text-[10px] text-racing-red uppercase font-bold tracking-widest">{errors.team_id}</p>}
                            </div>

                            {/* Service Selection */}
                            <div className="space-y-3">
                                <Label htmlFor="service_id" className="text-[10px] font-heading font-bold uppercase tracking-[0.2em] text-muted-foreground pl-1">Service Requis</Label>
                                <Select 
                                    value={data.service_id} 
                                    onValueChange={(value) => setData('service_id', value)}
                                >
                                    <SelectTrigger id="service_id" className="bg-luxury-black border-white/10 text-white h-12 rounded-none focus:ring-racing-red focus:border-racing-red">
                                        <SelectValue placeholder="Choisir un service" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-luxury-black border-white/10 text-white rounded-none">
                                        {services.map((service) => (
                                            <SelectItem key={service.id} value={service.id.toString()} className="focus:bg-racing-red focus:text-white cursor-pointer">
                                                {service.name} ({service.estimated_duration} min)
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.service_id && <p className="text-[10px] text-racing-red uppercase font-bold tracking-widest">{errors.service_id}</p>}
                            </div>

                            <div className="grid gap-8 sm:grid-cols-2">
                                {/* Date Selection */}
                                <div className="space-y-3">
                                    <Label htmlFor="date" className="text-[10px] font-heading font-bold uppercase tracking-[0.2em] text-muted-foreground pl-1">Date d'Intervention</Label>
                                    <div className="relative">
                                        <Input
                                            id="date"
                                            type="date"
                                            min={new Date().toISOString().split('T')[0]}
                                            value={data.date}
                                            onChange={(e) => setData('date', e.target.value)}
                                            className="bg-luxury-black border-white/10 text-white h-12 pl-10 rounded-none focus:ring-racing-red focus:border-racing-red appearance-none [color-scheme:dark]"
                                        />
                                        <CalendarIcon className="absolute left-3 top-3.5 h-5 w-5 text-racing-red" />
                                    </div>
                                    {errors.date && <p className="text-[10px] text-racing-red uppercase font-bold tracking-widest">{errors.date}</p>}
                                </div>

                                {/* Time Slot Selection */}
                                <div className="space-y-3">
                                    <Label htmlFor="slot" className="text-[10px] font-heading font-bold uppercase tracking-[0.2em] text-muted-foreground pl-1">Créneau Horaire</Label>
                                    <Select 
                                        value={data.slot} 
                                        onValueChange={(value) => setData('slot', value)}
                                        disabled={isLoadingSlots || availableSlots.length === 0}
                                    >
                                        <SelectTrigger id="slot" className="bg-luxury-black border-white/10 text-white h-12 rounded-none focus:ring-racing-red focus:border-racing-red">
                                            {isLoadingSlots ? (
                                                <div className="flex items-center gap-2">
                                                    <Loader2 className="h-4 w-4 animate-spin text-racing-red" />
                                                    <span>Chargement...</span>
                                                </div>
                                            ) : (
                                                <SelectValue placeholder={availableSlots.length > 0 ? "Choisir une heure" : "Aucun créneau"} />
                                            )}
                                        </SelectTrigger>
                                        <SelectContent className="bg-luxury-black border-white/10 text-white rounded-none max-h-[250px]">
                                            {availableSlots.map((slot) => (
                                                <SelectItem key={slot.start_time} value={slot.start_time} className="focus:bg-racing-red focus:text-white cursor-pointer">
                                                    {slot.start_time} - {slot.end_time}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.slot && <p className="text-[10px] text-racing-red uppercase font-bold tracking-widest">{errors.slot}</p>}
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="space-y-3">
                                <Label htmlFor="notes" className="text-[10px] font-heading font-bold uppercase tracking-[0.2em] text-muted-foreground pl-1">Spécifications Véhicule (Optionnel)</Label>
                                <Textarea
                                    id="notes"
                                    placeholder="Modèle du véhicule, type de clé, ou problème technique particulier..."
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    rows={4}
                                    className="bg-luxury-black border-white/10 text-white rounded-none focus:ring-racing-red focus:border-racing-red placeholder:text-muted-foreground/30"
                                />
                                {errors.notes && <p className="text-[10px] text-racing-red uppercase font-bold tracking-widest">{errors.notes}</p>}
                            </div>
                        </CardContent>
                        <CardFooter className="pt-8 pb-12">
                            <Button 
                                type="submit" 
                                className="w-full h-14 bg-racing-red text-white hover:bg-white hover:text-luxury-black font-heading font-bold uppercase tracking-[0.25em] transition-all duration-500 rounded-none disabled:bg-luxury-black disabled:text-muted-foreground" 
                                disabled={processing || !data.slot}
                            >
                                {processing ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Confirmation...</span>
                                    </div>
                                ) : (
                                    'Confirmer le Rendez-vous'
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
            
            {/* Background decoration */}
            <div className="absolute top-1/2 left-0 w-64 h-[1px] bg-gradient-to-r from-racing-red/20 to-transparent" />
            <div className="absolute top-1/2 right-0 w-64 h-[1px] bg-gradient-to-l from-racing-red/20 to-transparent" />
        </PublicLayout>
    );
}

