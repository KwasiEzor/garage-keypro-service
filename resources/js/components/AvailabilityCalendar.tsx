import { DayPicker } from 'react-day-picker';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import 'react-day-picker/style.css';

interface AvailabilityData {
    [date: string]: {
        slots: number;
        first: string;
    };
}

interface AvailabilityCalendarProps {
    selectedDate: Date | null;
    onSelectDate: (date: Date) => void;
    availability: AvailabilityData;
    isLoading?: boolean;
}

export default function AvailabilityCalendar({
    selectedDate,
    onSelectDate,
    availability,
    isLoading = false,
}: AvailabilityCalendarProps) {
    const today = new Date();

    // Get dates that have availability
    const availableDates = Object.keys(availability).map(dateStr => new Date(dateStr));

    // Disable dates that are in the past or have no availability
    const disabledDates = (date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        return date < today || !availability[dateStr];
    };

    // Custom day content to show slot count
    const renderDayContent = (date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const dayAvailability = availability[dateStr];

        return (
            <div className="relative w-full h-full flex items-center justify-center">
                <span>{format(date, 'd')}</span>
                {dayAvailability && dayAvailability.slots > 0 && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-racing-red rounded-full" />
                )}
            </div>
        );
    };

    return (
        <div className={`availability-calendar ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
            <style>{`
                .availability-calendar .rdp {
                    --rdp-accent-color: #DC2626;
                    --rdp-accent-color-dark: #B91C1C;
                    --rdp-background-color: rgba(220, 38, 38, 0.1);
                    margin: 0;
                }

                .availability-calendar .rdp-month {
                    width: 100%;
                }

                .availability-calendar .rdp-caption {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 1rem 0;
                    color: white;
                }

                .availability-calendar .rdp-caption_label {
                    font-size: 1rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: white;
                }

                .availability-calendar .rdp-nav {
                    position: absolute;
                    top: 0.75rem;
                    display: flex;
                    gap: 0.5rem;
                }

                .availability-calendar .rdp-nav_button {
                    width: 2rem;
                    height: 2rem;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    background: transparent;
                    color: white;
                    border-radius: 0;
                    transition: all 0.2s;
                }

                .availability-calendar .rdp-nav_button:hover:not(:disabled) {
                    background: rgba(220, 38, 38, 0.2);
                    border-color: #DC2626;
                }

                .availability-calendar .rdp-nav_button:disabled {
                    opacity: 0.3;
                    cursor: not-allowed;
                }

                .availability-calendar .rdp-head_cell {
                    color: rgba(255, 255, 255, 0.5);
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    padding: 0.5rem;
                }

                .availability-calendar .rdp-cell {
                    padding: 0.25rem;
                }

                .availability-calendar .rdp-day {
                    width: 2.5rem;
                    height: 2.5rem;
                    border-radius: 0;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    background: rgba(30, 30, 30, 0.5);
                    color: white;
                    font-size: 0.875rem;
                    transition: all 0.2s;
                }

                .availability-calendar .rdp-day:hover:not(.rdp-day_disabled) {
                    background: rgba(220, 38, 38, 0.2);
                    border-color: #DC2626;
                }

                .availability-calendar .rdp-day_selected {
                    background: #DC2626 !important;
                    border-color: #DC2626 !important;
                    color: white;
                    font-weight: 700;
                }

                .availability-calendar .rdp-day_disabled {
                    opacity: 0.3;
                    cursor: not-allowed;
                    background: rgba(30, 30, 30, 0.3);
                }

                .availability-calendar .rdp-day_today:not(.rdp-day_selected) {
                    border-color: rgba(220, 38, 38, 0.5);
                }

                @media (max-width: 640px) {
                    .availability-calendar .rdp-day {
                        width: 2rem;
                        height: 2rem;
                        font-size: 0.75rem;
                    }
                }
            `}</style>

            <DayPicker
                mode="single"
                selected={selectedDate || undefined}
                onSelect={(date) => date && onSelectDate(date)}
                disabled={disabledDates}
                locale={fr}
                fromDate={today}
                toDate={new Date(today.getFullYear(), today.getMonth() + 3, 0)}
                modifiers={{
                    available: availableDates,
                }}
                components={{
                    Day: ({ date }) => renderDayContent(date),
                }}
            />

            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-luxury-black/50">
                    <div className="text-white text-sm uppercase tracking-widest">
                        Chargement...
                    </div>
                </div>
            )}
        </div>
    );
}
