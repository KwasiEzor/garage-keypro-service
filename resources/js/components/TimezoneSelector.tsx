import { GlobeIcon } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface TimezoneSelectorProps {
    value: string;
    onChange: (timezone: string) => void;
}

const commonTimezones = [
    { value: 'Europe/Paris', label: 'Paris (GMT+1/+2)', region: 'Europe' },
    { value: 'Europe/London', label: 'London (GMT+0/+1)', region: 'Europe' },
    { value: 'Europe/Berlin', label: 'Berlin (GMT+1/+2)', region: 'Europe' },
    { value: 'Europe/Madrid', label: 'Madrid (GMT+1/+2)', region: 'Europe' },
    { value: 'Europe/Rome', label: 'Rome (GMT+1/+2)', region: 'Europe' },
    {
        value: 'America/New_York',
        label: 'New York (GMT-5/-4)',
        region: 'Americas',
    },
    {
        value: 'America/Los_Angeles',
        label: 'Los Angeles (GMT-8/-7)',
        region: 'Americas',
    },
    {
        value: 'America/Chicago',
        label: 'Chicago (GMT-6/-5)',
        region: 'Americas',
    },
    { value: 'Asia/Tokyo', label: 'Tokyo (GMT+9)', region: 'Asia' },
    { value: 'Asia/Shanghai', label: 'Shanghai (GMT+8)', region: 'Asia' },
    { value: 'Asia/Dubai', label: 'Dubai (GMT+4)', region: 'Asia' },
    {
        value: 'Australia/Sydney',
        label: 'Sydney (GMT+10/+11)',
        region: 'Oceania',
    },
];

export default function TimezoneSelector({
    value,
    onChange,
}: TimezoneSelectorProps) {
    // Group timezones by region
    const groupedTimezones = commonTimezones.reduce(
        (acc, tz) => {
            if (!acc[tz.region]) {
                acc[tz.region] = [];
            }

            acc[tz.region].push(tz);

            return acc;
        },
        {} as Record<string, typeof commonTimezones>,
    );

    return (
        <div className="flex items-center gap-3 rounded-none border border-white/5 bg-luxury-charcoal p-4">
            <GlobeIcon className="h-5 w-5 flex-shrink-0 text-racing-red" />
            <div className="flex-1">
                <p className="mb-2 text-xs tracking-[0.15em] text-muted-foreground uppercase">
                    Fuseau Horaire
                </p>
                <Select value={value} onValueChange={onChange}>
                    <SelectTrigger className="h-10 rounded-none border-white/10 bg-luxury-black text-white focus:border-racing-red focus:ring-racing-red">
                        <SelectValue placeholder="Sélectionner un fuseau horaire" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px] rounded-none border-white/10 bg-luxury-black text-white">
                        {Object.entries(groupedTimezones).map(
                            ([region, timezones]) => (
                                <div key={region}>
                                    <div className="px-2 py-1.5 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {region}
                                    </div>
                                    {timezones.map((tz) => (
                                        <SelectItem
                                            key={tz.value}
                                            value={tz.value}
                                            className="cursor-pointer focus:bg-racing-red focus:text-white"
                                        >
                                            {tz.label}
                                        </SelectItem>
                                    ))}
                                </div>
                            ),
                        )}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
