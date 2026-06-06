import { format, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import AvailabilityCalendar from '@/components/AvailabilityCalendar';
import TimeSlotGrid from '@/components/TimeSlotGrid';
import TimezoneSelector from '@/components/TimezoneSelector';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

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
    const [currentMonth] = useState(format(new Date(), 'yyyy-MM'));

    // Detect and manage user timezone
    const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const [userTimezone, setUserTimezone] = useState(detectedTimezone);

    // Fetch monthly availability when team/service/month changes
    useEffect(() => {
        if (!teamId || !serviceId) {
            return;
        }

        const fetchAvailability = async () => {
            setIsLoadingAvailability(true);

            try {
                const response = await fetch(
                    `/appointments/availability?team_id=${teamId}&service_id=${serviceId}&month=${currentMonth}`,
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
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSlots([]);

            return;
        }

        const fetchSlots = async () => {
            setIsLoadingSlots(true);

            try {
                const dateStr = format(selectedDate, 'yyyy-MM-dd');
                const response = await fetch(
                    `/appointments/slots?team_id=${teamId}&service_id=${serviceId}&date=${dateStr}`,
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
            <div className="mb-8 text-center">
                <h2 className="mb-3 font-heading text-2xl font-bold tracking-tighter text-white uppercase md:text-3xl">
                    Choisissez{' '}
                    <span className="text-racing-red">Date & Heure</span>
                </h2>
                <p className="text-sm tracking-[0.15em] text-muted-foreground uppercase">
                    Sélectionnez un créneau disponible
                </p>
            </div>

            {/* Timezone Selector */}
            <div className="mx-auto mb-6 max-w-md">
                <TimezoneSelector
                    value={userTimezone}
                    onChange={setUserTimezone}
                />
                <p className="mt-2 text-center text-xs text-muted-foreground">
                    Les horaires s'afficheront dans votre fuseau horaire
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Calendar Section */}
                <Card className="border-white/5 bg-luxury-charcoal">
                    <CardContent className="p-6">
                        <AvailabilityCalendar
                            selectedDate={selectedDate}
                            onSelectDate={onSelectDate}
                            availability={availability}
                            isLoading={isLoadingAvailability}
                        />

                        {!isLoadingAvailability &&
                            Object.keys(availability).length > 0 && (
                                <div className="mt-6 border-t border-white/5 pt-6">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-racing-red" />
                                            <span className="text-xs text-muted-foreground">
                                                Disponible
                                            </span>
                                        </div>
                                        <Badge className="rounded-none border-racing-red/30 bg-racing-red/20 text-[10px] font-bold tracking-wider text-racing-red uppercase">
                                            {Object.keys(availability).length}{' '}
                                            jours disponibles
                                        </Badge>
                                    </div>
                                </div>
                            )}

                        {!isLoadingAvailability &&
                            Object.keys(availability).length === 0 && (
                                <div className="mt-6 border-t border-white/5 pt-6 text-center">
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
                        <div className="border border-white/5 bg-luxury-charcoal p-4">
                            <p className="mb-2 text-xs tracking-[0.15em] text-muted-foreground uppercase">
                                Date sélectionnée
                            </p>
                            <p className="font-bold tracking-wide text-white uppercase">
                                {format(selectedDate, 'EEEE d MMMM yyyy', {
                                    locale: fr,
                                })}
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
                        <Card className="border-white/5 bg-luxury-charcoal">
                            <CardContent className="py-12 text-center">
                                <CalendarIcon className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
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
