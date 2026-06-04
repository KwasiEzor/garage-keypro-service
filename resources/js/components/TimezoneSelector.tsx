import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GlobeIcon } from 'lucide-react';

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
    { value: 'America/New_York', label: 'New York (GMT-5/-4)', region: 'Americas' },
    { value: 'America/Los_Angeles', label: 'Los Angeles (GMT-8/-7)', region: 'Americas' },
    { value: 'America/Chicago', label: 'Chicago (GMT-6/-5)', region: 'Americas' },
    { value: 'Asia/Tokyo', label: 'Tokyo (GMT+9)', region: 'Asia' },
    { value: 'Asia/Shanghai', label: 'Shanghai (GMT+8)', region: 'Asia' },
    { value: 'Asia/Dubai', label: 'Dubai (GMT+4)', region: 'Asia' },
    { value: 'Australia/Sydney', label: 'Sydney (GMT+10/+11)', region: 'Oceania' },
];

export default function TimezoneSelector({ value, onChange }: TimezoneSelectorProps) {
    // Group timezones by region
    const groupedTimezones = commonTimezones.reduce((acc, tz) => {
        if (!acc[tz.region]) {
            acc[tz.region] = [];
        }
        acc[tz.region].push(tz);
        return acc;
    }, {} as Record<string, typeof commonTimezones>);

    return (
        <div className="flex items-center gap-3 bg-luxury-charcoal border border-white/5 p-4 rounded-none">
            <GlobeIcon className="h-5 w-5 text-racing-red flex-shrink-0" />
            <div className="flex-1">
                <p className="text-xs text-muted-foreground uppercase tracking-[0.15em] mb-2">
                    Fuseau Horaire
                </p>
                <Select value={value} onValueChange={onChange}>
                    <SelectTrigger className="bg-luxury-black border-white/10 text-white h-10 rounded-none focus:ring-racing-red focus:border-racing-red">
                        <SelectValue placeholder="Sélectionner un fuseau horaire" />
                    </SelectTrigger>
                    <SelectContent className="bg-luxury-black border-white/10 text-white rounded-none max-h-[300px]">
                        {Object.entries(groupedTimezones).map(([region, timezones]) => (
                            <div key={region}>
                                <div className="px-2 py-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                    {region}
                                </div>
                                {timezones.map((tz) => (
                                    <SelectItem
                                        key={tz.value}
                                        value={tz.value}
                                        className="focus:bg-racing-red focus:text-white cursor-pointer"
                                    >
                                        {tz.label}
                                    </SelectItem>
                                ))}
                            </div>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
