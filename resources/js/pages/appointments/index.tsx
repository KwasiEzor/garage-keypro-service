import { Head, useForm, router } from '@inertiajs/react';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import PublicLayout from '@/layouts/public-layout';
import appointments from '@/routes/appointments';

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

export default function AppointmentIndex({
    services,
    teams,
    availableSlots = [],
}: Props) {
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
            // eslint-disable-next-line react-hooks/set-state-in-effect
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

            <div className="relative z-10 mx-auto max-w-2xl px-4 py-24">
                <div className="mb-12 text-center">
                    <span className="mb-4 block font-heading text-[11px] font-bold tracking-[0.4em] text-racing-red uppercase">
                        Protocoles de Service
                    </span>
                    <h1 className="mb-6 font-heading text-4xl font-bold tracking-tighter text-white uppercase md:text-5xl">
                        Planifier une{' '}
                        <span className="text-racing-red">Intervention</span>
                    </h1>
                    <div className="mx-auto mb-6 h-[2px] w-24 bg-racing-red" />
                    <p className="text-sm leading-loose font-medium tracking-[0.2em] text-muted-foreground uppercase">
                        Sélectionnez un service et choisissez un créneau
                        opérationnel.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card className="group relative overflow-hidden border-white/5 bg-luxury-charcoal shadow-2xl">
                        <div className="absolute top-0 left-0 h-0 w-1 bg-racing-red transition-all duration-500 group-hover:h-full" />

                        <CardHeader className="border-b border-white/5 pb-8">
                            <CardTitle className="font-heading text-2xl font-bold tracking-wider text-white uppercase">
                                Détails du Rendez-vous
                            </CardTitle>
                            <CardDescription className="text-[10px] font-medium tracking-[0.1em] text-muted-foreground uppercase">
                                Confirmation envoyée par protocole sécurisé.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8 pt-8">
                            {/* Team Selection */}
                            <div className="space-y-3">
                                <Label
                                    htmlFor="team_id"
                                    className="pl-1 font-heading text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase"
                                >
                                    Sélection du Garage
                                </Label>
                                <Select
                                    value={data.team_id}
                                    onValueChange={(value) =>
                                        setData('team_id', value)
                                    }
                                >
                                    <SelectTrigger
                                        id="team_id"
                                        className="h-12 rounded-none border-white/10 bg-luxury-black text-white focus:border-racing-red focus:ring-racing-red"
                                    >
                                        <SelectValue placeholder="Choisir un garage" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-none border-white/10 bg-luxury-black text-white">
                                        {teams.map((team) => (
                                            <SelectItem
                                                key={team.id}
                                                value={team.id.toString()}
                                                className="cursor-pointer focus:bg-racing-red focus:text-white"
                                            >
                                                {team.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.team_id && (
                                    <p className="text-[10px] font-bold tracking-widest text-racing-red uppercase">
                                        {errors.team_id}
                                    </p>
                                )}
                            </div>

                            {/* Service Selection */}
                            <div className="space-y-3">
                                <Label
                                    htmlFor="service_id"
                                    className="pl-1 font-heading text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase"
                                >
                                    Service Requis
                                </Label>
                                <Select
                                    value={data.service_id}
                                    onValueChange={(value) =>
                                        setData('service_id', value)
                                    }
                                >
                                    <SelectTrigger
                                        id="service_id"
                                        className="h-12 rounded-none border-white/10 bg-luxury-black text-white focus:border-racing-red focus:ring-racing-red"
                                    >
                                        <SelectValue placeholder="Choisir un service" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-none border-white/10 bg-luxury-black text-white">
                                        {services.map((service) => (
                                            <SelectItem
                                                key={service.id}
                                                value={service.id.toString()}
                                                className="cursor-pointer focus:bg-racing-red focus:text-white"
                                            >
                                                {service.name} (
                                                {service.estimated_duration}{' '}
                                                min)
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.service_id && (
                                    <p className="text-[10px] font-bold tracking-widest text-racing-red uppercase">
                                        {errors.service_id}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-8 sm:grid-cols-2">
                                {/* Date Selection */}
                                <div className="space-y-3">
                                    <Label
                                        htmlFor="date"
                                        className="pl-1 font-heading text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase"
                                    >
                                        Date d'Intervention
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="date"
                                            type="date"
                                            min={
                                                new Date()
                                                    .toISOString()
                                                    .split('T')[0]
                                            }
                                            value={data.date}
                                            onChange={(e) =>
                                                setData('date', e.target.value)
                                            }
                                            className="h-12 appearance-none rounded-none border-white/10 bg-luxury-black pl-10 text-white [color-scheme:dark] focus:border-racing-red focus:ring-racing-red"
                                        />
                                        <CalendarIcon className="absolute top-3.5 left-3 h-5 w-5 text-racing-red" />
                                    </div>
                                    {errors.date && (
                                        <p className="text-[10px] font-bold tracking-widest text-racing-red uppercase">
                                            {errors.date}
                                        </p>
                                    )}
                                </div>

                                {/* Time Slot Selection */}
                                <div className="space-y-3">
                                    <Label
                                        htmlFor="slot"
                                        className="pl-1 font-heading text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase"
                                    >
                                        Créneau Horaire
                                    </Label>
                                    <Select
                                        value={data.slot}
                                        onValueChange={(value) =>
                                            setData('slot', value)
                                        }
                                        disabled={
                                            isLoadingSlots ||
                                            availableSlots.length === 0
                                        }
                                    >
                                        <SelectTrigger
                                            id="slot"
                                            className="h-12 rounded-none border-white/10 bg-luxury-black text-white focus:border-racing-red focus:ring-racing-red"
                                        >
                                            {isLoadingSlots ? (
                                                <div className="flex items-center gap-2">
                                                    <Loader2 className="h-4 w-4 animate-spin text-racing-red" />
                                                    <span>Chargement...</span>
                                                </div>
                                            ) : (
                                                <SelectValue
                                                    placeholder={
                                                        availableSlots.length >
                                                        0
                                                            ? 'Choisir une heure'
                                                            : 'Aucun créneau'
                                                    }
                                                />
                                            )}
                                        </SelectTrigger>
                                        <SelectContent className="max-h-[250px] rounded-none border-white/10 bg-luxury-black text-white">
                                            {availableSlots.map((slot) => (
                                                <SelectItem
                                                    key={slot.start_time}
                                                    value={slot.start_time}
                                                    className="cursor-pointer focus:bg-racing-red focus:text-white"
                                                >
                                                    {slot.start_time} -{' '}
                                                    {slot.end_time}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.slot && (
                                        <p className="text-[10px] font-bold tracking-widest text-racing-red uppercase">
                                            {errors.slot}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="space-y-3">
                                <Label
                                    htmlFor="notes"
                                    className="pl-1 font-heading text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase"
                                >
                                    Spécifications Véhicule (Optionnel)
                                </Label>
                                <Textarea
                                    id="notes"
                                    placeholder="Modèle du véhicule, type de clé, ou problème technique particulier..."
                                    value={data.notes}
                                    onChange={(e) =>
                                        setData('notes', e.target.value)
                                    }
                                    rows={4}
                                    className="rounded-none border-white/10 bg-luxury-black text-white placeholder:text-muted-foreground/30 focus:border-racing-red focus:ring-racing-red"
                                />
                                {errors.notes && (
                                    <p className="text-[10px] font-bold tracking-widest text-racing-red uppercase">
                                        {errors.notes}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="pt-8 pb-12">
                            <Button
                                type="submit"
                                className="h-14 w-full rounded-none bg-racing-red font-heading font-bold tracking-[0.25em] text-white uppercase transition-all duration-500 hover:bg-white hover:text-luxury-black disabled:bg-luxury-black disabled:text-muted-foreground"
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
            <div className="absolute top-1/2 left-0 h-[1px] w-64 bg-gradient-to-r from-racing-red/20 to-transparent" />
            <div className="absolute top-1/2 right-0 h-[1px] w-64 bg-gradient-to-l from-racing-red/20 to-transparent" />
        </PublicLayout>
    );
}
