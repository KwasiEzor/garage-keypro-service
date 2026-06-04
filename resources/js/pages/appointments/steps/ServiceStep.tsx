import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ClockIcon, CheckIcon } from 'lucide-react';

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

export default function ServiceStep({ services, selectedServiceId, onSelect }: ServiceStepProps) {
    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-heading font-bold uppercase tracking-tighter text-white mb-3">
                    Sélectionnez votre <span className="text-racing-red">Service</span>
                </h2>
                <p className="text-sm text-muted-foreground uppercase tracking-[0.15em]">
                    Choisissez l'intervention dont vous avez besoin
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((service) => {
                    const isSelected = selectedServiceId === service.id.toString();

                    return (
                        <Card
                            key={service.id}
                            onClick={() => onSelect(service.id.toString())}
                            className={`
                                relative overflow-hidden cursor-pointer transition-all duration-300
                                ${isSelected
                                    ? 'bg-luxury-charcoal border-racing-red border-2 shadow-xl shadow-racing-red/20'
                                    : 'bg-luxury-charcoal border-white/5 hover:border-white/20 hover:shadow-lg'
                                }
                            `}
                        >
                            {isSelected && (
                                <div className="absolute top-3 right-3 z-10">
                                    <div className="bg-racing-red rounded-full p-1">
                                        <CheckIcon className="h-4 w-4 text-white" />
                                    </div>
                                </div>
                            )}

                            <div className={`
                                absolute top-0 left-0 w-1 h-full transition-all duration-300
                                ${isSelected ? 'bg-racing-red' : 'bg-racing-red/50'}
                            `} />

                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg font-heading font-bold text-white uppercase tracking-wide pr-8">
                                    {service.name}
                                </CardTitle>
                                {service.description && (
                                    <CardDescription className="text-muted-foreground text-xs leading-relaxed">
                                        {service.description}
                                    </CardDescription>
                                )}
                            </CardHeader>

                            <CardContent className="space-y-3 pb-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm">
                                        <ClockIcon className="h-4 w-4 text-racing-red" />
                                        <span className="text-white/80">{service.estimated_duration} min</span>
                                    </div>

                                    <Badge className="bg-racing-red/20 text-racing-red border-racing-red/30 uppercase text-[10px] font-bold tracking-wider rounded-none">
                                        À partir de {service.starting_price}€
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {services.length === 0 && (
                <Card className="bg-luxury-charcoal border-white/5 py-12">
                    <CardContent className="text-center">
                        <p className="text-muted-foreground">Aucun service disponible pour le moment.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
