import { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AvailabilityCalendar from '@/components/AvailabilityCalendar';
import TimeSlotGrid from '@/components/TimeSlotGrid';
import TimezoneSelector from '@/components/TimezoneSelector';
import { CalendarIcon } from 'lucide-react';

interface Slot {
    start_time: string;
    end_time: string;
    is_available: boolean;
}

interface AvailabilityData {
    [date: string]: {
        slots: number;
        first: string;
    };
}

interface DateTimeStepProps {
    teamId: string;
    serviceId: string;
    selectedDate: Date | null;
    selectedSlot: string;
    onSelectDate: (date: Date) => void;
    onSelectSlot: (slot: string) => void;
}

export default function DateTimeStep({
    teamId,
    serviceId,
    selectedDate,
    selectedSlot,
    onSelectDate,
    onSelectSlot,
}: DateTimeStepProps) {
    const [availability, setAvailability] = useState<AvailabilityData>({});
    const [slots, setSlots] = useState<Slot[]>([]);
    const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(format(new Date(), 'yyyy-MM'));

    // Detect and manage user timezone
    const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const [userTimezone, setUserTimezone] = useState(detectedTimezone);

    // Fetch monthly availability when team/service/month changes
    useEffect(() => {
        if (!teamId || !serviceId) return;

        const fetchAvailability = async () => {
            setIsLoadingAvailability(true);

            try {
                const response = await fetch(
                    `/appointments/availability?team_id=${teamId}&service_id=${serviceId}&month=${currentMonth}`
                );

                if (response.ok) {
                    const data = await response.json();
                    setAvailability(data.availability || {});
                }
            } catch (error) {
                console.error('Failed to fetch availability:', error);
                setAvailability({});
            } finally {
                setIsLoadingAvailability(false);
            }
        };

        fetchAvailability();
    }, [teamId, serviceId, currentMonth]);

    // Fetch slots when a date is selected
    useEffect(() => {
        if (!teamId || !serviceId || !selectedDate) {
            setSlots([]);
            return;
        }

        const fetchSlots = async () => {
            setIsLoadingSlots(true);

            try {
                const dateStr = format(selectedDate, 'yyyy-MM-dd');
                const response = await fetch(
                    `/appointments/slots?team_id=${teamId}&service_id=${serviceId}&date=${dateStr}`
                );

                if (response.ok) {
                    const data = await response.json();
                    setSlots(data.slots || []);
                }
            } catch (error) {
                console.error('Failed to fetch slots:', error);
                setSlots([]);
            } finally {
                setIsLoadingSlots(false);
            }
        };

        fetchSlots();
    }, [teamId, serviceId, selectedDate]);

    const handleNextDay = () => {
        if (selectedDate) {
            const nextDay = addDays(selectedDate, 1);
            onSelectDate(nextDay);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-heading font-bold uppercase tracking-tighter text-white mb-3">
                    Choisissez <span className="text-racing-red">Date & Heure</span>
                </h2>
                <p className="text-sm text-muted-foreground uppercase tracking-[0.15em]">
                    Sélectionnez un créneau disponible
                </p>
            </div>

            {/* Timezone Selector */}
            <div className="max-w-md mx-auto mb-6">
                <TimezoneSelector value={userTimezone} onChange={setUserTimezone} />
                <p className="text-xs text-muted-foreground text-center mt-2">
                    Les horaires s'afficheront dans votre fuseau horaire
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Calendar Section */}
                <Card className="bg-luxury-charcoal border-white/5">
                    <CardContent className="p-6">
                        <AvailabilityCalendar
                            selectedDate={selectedDate}
                            onSelectDate={onSelectDate}
                            availability={availability}
                            isLoading={isLoadingAvailability}
                        />

                        {!isLoadingAvailability && Object.keys(availability).length > 0 && (
                            <div className="mt-6 pt-6 border-t border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-racing-red rounded-full" />
                                        <span className="text-xs text-muted-foreground">Disponible</span>
                                    </div>
                                    <Badge className="bg-racing-red/20 text-racing-red border-racing-red/30 uppercase text-[10px] font-bold tracking-wider rounded-none">
                                        {Object.keys(availability).length} jours disponibles
                                    </Badge>
                                </div>
                            </div>
                        )}

                        {!isLoadingAvailability && Object.keys(availability).length === 0 && (
                            <div className="mt-6 pt-6 border-t border-white/5 text-center">
                                <p className="text-sm text-muted-foreground">
                                    Aucune disponibilité ce mois-ci
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Time Slots Section */}
                <div className="space-y-4">
                    {selectedDate && (
                        <div className="bg-luxury-charcoal border border-white/5 p-4">
                            <p className="text-xs text-muted-foreground uppercase tracking-[0.15em] mb-2">
                                Date sélectionnée
                            </p>
                            <p className="text-white font-bold uppercase tracking-wide">
                                {format(selectedDate, 'EEEE d MMMM yyyy', { locale: require('date-fns/locale/fr').default })}
                            </p>
                        </div>
                    )}

                    {selectedDate ? (
                        <TimeSlotGrid
                            slots={slots}
                            selectedSlot={selectedSlot}
                            onSelectSlot={onSelectSlot}
                            isLoading={isLoadingSlots}
                            onNextDay={handleNextDay}
                        />
                    ) : (
                        <Card className="bg-luxury-charcoal border-white/5">
                            <CardContent className="py-12 text-center">
                                <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                                <p className="text-sm text-muted-foreground">
                                    Sélectionnez une date dans le calendrier
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
