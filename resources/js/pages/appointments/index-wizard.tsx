import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PublicLayout from '@/layouts/public-layout';
import { Head, router } from '@inertiajs/react';
import { appointments } from '@/routes';
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useBookingWizard } from '@/hooks/useBookingWizard';
import ServiceStep from './steps/ServiceStep';
import DateTimeStep from './steps/DateTimeStep';
import DetailsStep from './steps/DetailsStep';
import ReviewStep from './steps/ReviewStep';
import { useState } from 'react';

interface Service {
    id: number;
    name: string;
    description?: string;
    estimated_duration: number;
    starting_price: number;
    is_active: boolean;
}

interface Team {
    id: number;
    name: string;
}

interface Appointment {
    id: number;
    team_id: number;
    service_id: number;
    start_at: string;
    notes: string | null;
}

interface Props {
    services: Service[];
    teams: Team[];
    rescheduleAppointment?: Appointment;
}

export default function AppointmentWizard({ services, teams, rescheduleAppointment }: Props) {
    const { state, errors, updateField, nextStep, prevStep, goToStep, reset, isFirstStep, isLastStep, canProceed } =
        useBookingWizard(teams[0]?.id.toString());

    const [isSubmitting, setIsSubmitting] = useState(false);
    const isRescheduling = !!rescheduleAppointment;

    // Pre-fill wizard if rescheduling
    useState(() => {
        if (rescheduleAppointment && state.step === 1 && !state.serviceId) {
            updateField('teamId', rescheduleAppointment.team_id.toString());
            updateField('serviceId', rescheduleAppointment.service_id.toString());
            updateField('notes', rescheduleAppointment.notes || '');
            // Date will be selected by user in step 2
        }
    });

    const selectedService = services.find(s => s.id.toString() === state.serviceId);
    const selectedTeam = teams.find(t => t.id.toString() === state.teamId);

    const handleSubmit = async () => {
        if (!canProceed()) {
            toast.error('Veuillez compléter toutes les informations requises');
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = {
                team_id: state.teamId,
                service_id: state.serviceId,
                date: state.date ? state.date.toISOString().split('T')[0] : '',
                slot: state.slot,
                notes: state.notes,
            };

            // Use appropriate route based on whether we're rescheduling
            const submitRoute = isRescheduling && rescheduleAppointment
                ? appointments.reschedule.process(rescheduleAppointment.id).url
                : appointments.store().url;

            const successMessage = isRescheduling
                ? 'Rendez-vous reprogrammé avec succès!'
                : 'Rendez-vous confirmé avec succès!';

            // Use Inertia to submit
            router.post(submitRoute, formData, {
                onSuccess: () => {
                    toast.success(successMessage);
                    if (!isRescheduling) {
                        reset();
                    }
                },
                onError: (errors) => {
                    toast.error('Une erreur est survenue. Veuillez réessayer.');
                    console.error('Booking error:', errors);
                },
                onFinish: () => setIsSubmitting(false),
            });
        } catch (error) {
            console.error('Booking error:', error);
            toast.error('Une erreur est survenue. Veuillez réessayer.');
            setIsSubmitting(false);
        }
    };

    const getStepTitle = (stepNumber: number) => {
        switch (stepNumber) {
            case 1: return 'Service';
            case 2: return 'Date & Heure';
            case 3: return 'Détails';
            case 4: return 'Confirmation';
            default: return '';
        }
    };

    return (
        <PublicLayout>
            <Head title="Réserver un Rendez-vous" />

            <div className="mx-auto max-w-6xl px-4 py-24 relative z-10">
                <div className="mb-12 text-center">
                    <span className="text-[11px] font-heading font-bold uppercase tracking-[0.4em] text-racing-red mb-4 block">
                        {isRescheduling ? 'Reprogrammation' : 'Protocoles de Service'}
                    </span>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold uppercase tracking-tighter text-white mb-6">
                        {isRescheduling ? 'Reprogrammer votre' : 'Planifier une'} <span className="text-racing-red">Intervention</span>
                    </h1>
                    <div className="h-[2px] w-24 bg-racing-red mx-auto mb-6" />
                    {isRescheduling && (
                        <p className="text-sm text-muted-foreground">
                            Sélectionnez une nouvelle date pour votre rendez-vous
                        </p>
                    )}
                </div>

                {/* Step Indicator */}
                <div className="mb-12">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        {[1, 2, 3, 4].map((stepNum) => {
                            const isActive = state.step === stepNum;
                            const isCompleted = state.step > stepNum;

                            return (
                                <div key={stepNum} className="flex items-center">
                                    <button
                                        onClick={() => isCompleted ? goToStep(stepNum as any) : null}
                                        disabled={!isCompleted}
                                        className={`
                                            flex items-center justify-center w-10 h-10 rounded-none font-bold text-sm transition-all duration-200
                                            ${isActive
                                                ? 'bg-racing-red text-white border-2 border-racing-red scale-110'
                                                : isCompleted
                                                    ? 'bg-racing-red/20 text-racing-red border border-racing-red/30 cursor-pointer hover:bg-racing-red/30'
                                                    : 'bg-luxury-black text-muted-foreground border border-white/10'
                                            }
                                        `}
                                    >
                                        {isCompleted ? <CheckIcon className="h-5 w-5" /> : stepNum}
                                    </button>

                                    {stepNum < 4 && (
                                        <div className={`
                                            w-8 md:w-16 h-[2px] transition-colors duration-200
                                            ${isCompleted ? 'bg-racing-red' : 'bg-white/10'}
                                        `} />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="text-center">
                        <p className="text-sm font-heading font-bold uppercase tracking-[0.2em] text-white">
                            Étape {state.step}/4: {getStepTitle(state.step)}
                        </p>
                    </div>
                </div>

                {/* Step Content */}
                <div className="mb-12">
                    {state.step === 1 && (
                        <ServiceStep
                            services={services}
                            selectedServiceId={state.serviceId}
                            onSelect={(id) => updateField('serviceId', id)}
                        />
                    )}

                    {state.step === 2 && (
                        <DateTimeStep
                            teamId={state.teamId}
                            serviceId={state.serviceId}
                            selectedDate={state.date}
                            selectedSlot={state.slot}
                            onSelectDate={(date) => updateField('date', date)}
                            onSelectSlot={(slot) => updateField('slot', slot)}
                        />
                    )}

                    {state.step === 3 && (
                        <DetailsStep
                            notes={state.notes}
                            onNotesChange={(notes) => updateField('notes', notes)}
                        />
                    )}

                    {state.step === 4 && (
                        <ReviewStep
                            service={selectedService || null}
                            team={selectedTeam || null}
                            date={state.date}
                            slot={state.slot}
                            notes={state.notes}
                            onEdit={goToStep}
                        />
                    )}
                </div>

                {/* Navigation Buttons */}
                <Card className="bg-luxury-charcoal border-white/5 shadow-2xl max-w-3xl mx-auto">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between gap-4">
                            <Button
                                variant="outline"
                                onClick={prevStep}
                                disabled={isFirstStep || isSubmitting}
                                className="rounded-none border-white/10 text-white hover:bg-white/5 uppercase tracking-widest text-[10px] font-bold disabled:opacity-50"
                            >
                                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                                Précédent
                            </Button>

                            <div className="flex-1 text-center">
                                {errors.serviceId && <p className="text-xs text-racing-red mb-1">{errors.serviceId}</p>}
                                {errors.date && <p className="text-xs text-racing-red mb-1">{errors.date}</p>}
                                {errors.slot && <p className="text-xs text-racing-red mb-1">{errors.slot}</p>}
                            </div>

                            {!isLastStep ? (
                                <Button
                                    onClick={nextStep}
                                    disabled={isSubmitting}
                                    className="bg-racing-red text-white hover:bg-white hover:text-luxury-black font-heading font-bold uppercase tracking-[0.25em] transition-all duration-300 rounded-none"
                                >
                                    Suivant
                                    <ArrowRightIcon className="h-4 w-4 ml-2" />
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || !canProceed()}
                                    className="bg-racing-red text-white hover:bg-white hover:text-luxury-black font-heading font-bold uppercase tracking-[0.25em] transition-all duration-300 rounded-none disabled:opacity-50 min-w-[200px]"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Confirmation...
                                        </>
                                    ) : (
                                        <>
                                            <CheckIcon className="h-4 w-4 mr-2" />
                                            Confirmer le Rendez-vous
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Progress Helper */}
                <div className="mt-8 text-center">
                    <button
                        onClick={reset}
                        className="text-xs text-muted-foreground hover:text-racing-red uppercase tracking-widest transition-colors"
                    >
                        Recommencer
                    </button>
                </div>
            </div>

            {/* Background decoration */}
            <div className="absolute top-1/2 left-0 w-64 h-[1px] bg-gradient-to-r from-racing-red/20 to-transparent" />
            <div className="absolute top-1/2 right-0 w-64 h-[1px] bg-gradient-to-l from-racing-red/20 to-transparent" />
        </PublicLayout>
    );
}
