import { ClockIcon, CheckIcon } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

interface Service {
    id: number;
    name: string;
    description?: string;
    estimated_duration: number;
    starting_price: number;
    is_active: boolean;
}

interface ServiceStepProps {
    services: Service[];
    selectedServiceId: string;
    onSelect: (serviceId: string) => void;
}

export default function ServiceStep({
    services,
    selectedServiceId,
    onSelect,
}: ServiceStepProps) {
    const [visibleCount, setVisibleCount] = useState(6);
    const visibleServices = services.slice(0, visibleCount);
    const hasMore = visibleCount < services.length;

    return (
        <div className="space-y-6">
            <div className="mb-8 text-center">
                <h2 className="mb-3 font-heading text-2xl font-bold tracking-tighter text-white uppercase md:text-3xl">
                    Sélectionnez votre{' '}
                    <span className="text-racing-red">Service</span>
                </h2>
                <p className="text-sm tracking-[0.15em] text-muted-foreground uppercase">
                    Choisissez l'intervention dont vous avez besoin
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {visibleServices.map((service) => {
                    const isSelected =
                        selectedServiceId === service.id.toString();

                    return (
                        <Card
                            key={service.id}
                            onClick={() => onSelect(service.id.toString())}
                            className={`relative cursor-pointer overflow-hidden transition-all duration-300 ${
                                isSelected
                                    ? 'border-2 border-racing-red bg-luxury-charcoal shadow-xl shadow-racing-red/20'
                                    : 'border-white/5 bg-luxury-charcoal hover:border-white/20 hover:shadow-lg'
                            } `}
                        >
                            {isSelected && (
                                <div className="absolute top-3 right-3 z-10">
                                    <div className="rounded-full bg-racing-red p-1">
                                        <CheckIcon className="h-4 w-4 text-white" />
                                    </div>
                                </div>
                            )}

                            <div
                                className={`absolute top-0 left-0 h-full w-1 transition-all duration-300 ${isSelected ? 'bg-racing-red' : 'bg-racing-red/50'} `}
                            />

                            <CardHeader className="pb-4">
                                <CardTitle className="pr-8 font-heading text-lg font-bold tracking-wide text-white uppercase">
                                    {service.name}
                                </CardTitle>
                                {service.description && (
                                    <CardDescription className="text-xs leading-relaxed text-muted-foreground">
                                        {service.description}
                                    </CardDescription>
                                )}
                            </CardHeader>

                            <CardContent className="space-y-3 pb-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm">
                                        <ClockIcon className="h-4 w-4 text-racing-red" />
                                        <span className="text-white/80">
                                            {service.estimated_duration} min
                                        </span>
                                    </div>

                                    <Badge className="rounded-none border-racing-red/30 bg-racing-red/20 text-[10px] font-bold tracking-wider text-racing-red uppercase">
                                        À partir de {service.starting_price}€
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {hasMore && (
                <div className="mt-8 flex justify-center">
                    <Button
                        onClick={() => setVisibleCount(services.length)}
                        variant="outline"
                        className="rounded-none border-racing-red/30 bg-transparent px-8 py-3 text-xs font-bold tracking-widest text-racing-red uppercase hover:border-racing-red hover:bg-racing-red/10"
                    >
                        Charger Plus de Services
                    </Button>
                </div>
            )}

            {services.length === 0 && (
                <Card className="border-white/5 bg-luxury-charcoal py-12">
                    <CardContent className="text-center">
                        <p className="text-muted-foreground">
                            Aucun service disponible pour le moment.
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
