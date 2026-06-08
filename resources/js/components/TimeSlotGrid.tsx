import { Loader2, ArrowRightIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Slot {
    start_time: string;
    end_time: string;
    is_available: boolean;
}

interface TimeSlotGridProps {
    slots: Slot[];
    selectedSlot: string;
    onSelectSlot: (slot: string) => void;
    isLoading?: boolean;
    onNextDay?: () => void;
}

export default function TimeSlotGrid({
    slots,
    selectedSlot,
    onSelectSlot,
    isLoading = false,
    onNextDay,
}: TimeSlotGridProps) {
    // Group slots by time of day
    const groupSlotsByTimeOfDay = (slots: Slot[]) => {
        const morning: Slot[] = [];
        const afternoon: Slot[] = [];
        const evening: Slot[] = [];

        slots.forEach(slot => {
            const hour = parseInt(slot.start_time.split(':')[0]);

            if (hour < 12) {
                morning.push(slot);
            } else if (hour < 18) {
                afternoon.push(slot);
            } else {
                evening.push(slot);
            }
        });

        return { morning, afternoon, evening };
    };

    if (isLoading) {
        return (
            <Card className="bg-luxury-charcoal border-white/5">
                <CardContent className="py-12">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-8 w-8 animate-spin text-racing-red" />
                        <p className="text-sm text-muted-foreground uppercase tracking-widest">
                            Chargement des créneaux...
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (slots.length === 0) {
        return (
            <Card className="bg-luxury-charcoal border-white/5">
                <CardContent className="py-12 text-center space-y-4">
                    <p className="text-white font-medium">Aucun créneau disponible pour cette date</p>
                    <p className="text-sm text-muted-foreground">
                        Essayez une autre date ou contactez-nous directement
                    </p>
                    {onNextDay && (
                        <Button
                            variant="outline"
                            onClick={onNextDay}
                            className="mt-4 rounded-none border-white/10 text-white hover:bg-white/5 uppercase tracking-widest text-[10px] font-bold"
                        >
                            Jour suivant <ArrowRightIcon className="ml-2 h-3 w-3" />
                        </Button>
                    )}
                </CardContent>
            </Card>
        );
    }

    const { morning, afternoon, evening } = groupSlotsByTimeOfDay(slots);

    const renderSlotGroup = (title: string, slots: Slot[]) => {
        if (slots.length === 0) {
return null;
}

        return (
            <div className="space-y-3">
                <h4 className="text-[10px] font-heading font-bold uppercase tracking-[0.2em] text-muted-foreground pl-1">
                    {title}
                </h4>
                <div
                    className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2"
                    role="group"
                    aria-label={`Time slots for ${title}`}
                >
                    {slots.map((slot) => {
                        const isSelected = selectedSlot === slot.start_time;

                        return (
                            <Button
                                key={slot.start_time}
                                variant={isSelected ? 'default' : 'outline'}
                                onClick={() => onSelectSlot(slot.start_time)}
                                aria-label={`Book appointment at ${slot.start_time}`}
                                aria-pressed={isSelected}
                                className={`
                                    h-12 rounded-none font-bold text-sm transition-all duration-200
                                    ${isSelected
                                        ? 'bg-racing-red text-white border-racing-red hover:bg-racing-red/90'
                                        : 'bg-luxury-black border-white/10 text-white hover:bg-white/5 hover:border-racing-red/50'
                                    }
                                `}
                            >
                                {slot.start_time}
                            </Button>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {renderSlotGroup('Matin', morning)}
            {renderSlotGroup('Après-midi', afternoon)}
            {renderSlotGroup('Soir', evening)}
        </div>
    );
}
