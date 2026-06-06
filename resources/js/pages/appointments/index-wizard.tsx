import { Head, router } from '@inertiajs/react';
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    CheckIcon,
    Loader2,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useBookingWizard } from '@/hooks/useBookingWizard';
import PublicLayout from '@/layouts/public-layout';
import appointments from '@/routes/appointments';
import DateTimeStep from './steps/DateTimeStep';
import DetailsStep from './steps/DetailsStep';
import ReviewStep from './steps/ReviewStep';
import ServiceStep from './steps/ServiceStep';

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

export default function AppointmentWizard({
    services,
    teams,
    rescheduleAppointment,
}: Props) {
    const {
        state,
        errors,
        updateField,
        nextStep,
        prevStep,
        goToStep,
        reset,
        isFirstStep,
        isLastStep,
        canProceed,
    } = useBookingWizard(teams[0]?.id.toString());

    const [isSubmitting, setIsSubmitting] = useState(false);
    const isRescheduling = !!rescheduleAppointment;

    // Pre-fill wizard if rescheduling
    useState(() => {
        if (rescheduleAppointment && state.step === 1 && !state.serviceId) {
            updateField('teamId', rescheduleAppointment.team_id.toString());
            updateField(
                'serviceId',
                rescheduleAppointment.service_id.toString(),
            );
            updateField('notes', rescheduleAppointment.notes || '');
            // Date will be selected by user in step 2
        }
    });

    const selectedService = services.find(
        (s) => s.id.toString() === state.serviceId,
    );
    const selectedTeam = teams.find((t) => t.id.toString() === state.teamId);

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
            const submitRoute =
                isRescheduling && rescheduleAppointment
                    ? appointments.reschedule.process(rescheduleAppointment.id)
                          .url
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
            case 1:
                return 'Service';
            case 2:
                return 'Date & Heure';
            case 3:
                return 'Détails';
            case 4:
                return 'Confirmation';
            default:
                return '';
        }
    };

    return (
        <PublicLayout>
            <Head title="Réserver un Rendez-vous" />

            <div className="relative z-10 mx-auto max-w-6xl px-4 py-24">
                <div className="mb-12 text-center">
                    <span className="mb-4 block font-heading text-[11px] font-bold tracking-[0.4em] text-racing-red uppercase">
                        {isRescheduling
                            ? 'Reprogrammation'
                            : 'Protocoles de Service'}
                    </span>
                    <h1 className="mb-6 font-heading text-4xl font-bold tracking-tighter text-white uppercase md:text-5xl">
                        {isRescheduling
                            ? 'Reprogrammer votre'
                            : 'Planifier une'}{' '}
                        <span className="text-racing-red">Intervention</span>
                    </h1>
                    <div className="mx-auto mb-6 h-[2px] w-24 bg-racing-red" />
                    {isRescheduling && (
                        <p className="text-sm text-muted-foreground">
                            Sélectionnez une nouvelle date pour votre
                            rendez-vous
                        </p>
                    )}
                </div>

                {/* Step Indicator */}
                <div className="mb-12">
                    <div className="mb-6 flex items-center justify-center gap-2">
                        {[1, 2, 3, 4].map((stepNum) => {
                            const isActive = state.step === stepNum;
                            const isCompleted = state.step > stepNum;

                            return (
                                <div
                                    key={stepNum}
                                    className="flex items-center"
                                >
                                    <button
                                        onClick={() =>
                                            isCompleted
                                                ? goToStep(stepNum as any)
                                                : null
                                        }
                                        disabled={!isCompleted}
                                        className={`flex h-10 w-10 items-center justify-center rounded-none text-sm font-bold transition-all duration-200 ${
                                            isActive
                                                ? 'scale-110 border-2 border-racing-red bg-racing-red text-white'
                                                : isCompleted
                                                  ? 'cursor-pointer border border-racing-red/30 bg-racing-red/20 text-racing-red hover:bg-racing-red/30'
                                                  : 'border border-white/10 bg-luxury-black text-muted-foreground'
                                        } `}
                                    >
                                        {isCompleted ? (
                                            <CheckIcon className="h-5 w-5" />
                                        ) : (
                                            stepNum
                                        )}
                                    </button>

                                    {stepNum < 4 && (
                                        <div
                                            className={`h-[2px] w-8 transition-colors duration-200 md:w-16 ${isCompleted ? 'bg-racing-red' : 'bg-white/10'} `}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="text-center">
                        <p className="font-heading text-sm font-bold tracking-[0.2em] text-white uppercase">
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
                            onNotesChange={(notes) =>
                                updateField('notes', notes)
                            }
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
                <Card className="mx-auto max-w-3xl border-white/5 bg-luxury-charcoal shadow-2xl">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between gap-4">
                            <Button
                                variant="outline"
                                onClick={prevStep}
                                disabled={isFirstStep || isSubmitting}
                                className="rounded-none border-white/10 text-[10px] font-bold tracking-widest text-white uppercase hover:bg-white/5 disabled:opacity-50"
                            >
                                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                                Précédent
                            </Button>

                            <div className="flex-1 text-center">
                                {errors.serviceId && (
                                    <p className="mb-1 text-xs text-racing-red">
                                        {errors.serviceId}
                                    </p>
                                )}
                                {errors.date && (
                                    <p className="mb-1 text-xs text-racing-red">
                                        {errors.date}
                                    </p>
                                )}
                                {errors.slot && (
                                    <p className="mb-1 text-xs text-racing-red">
                                        {errors.slot}
                                    </p>
                                )}
                            </div>

                            {!isLastStep ? (
                                <Button
                                    onClick={nextStep}
                                    disabled={isSubmitting}
                                    className="rounded-none bg-racing-red font-heading font-bold tracking-[0.25em] text-white uppercase transition-all duration-300 hover:bg-white hover:text-luxury-black"
                                >
                                    Suivant
                                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || !canProceed()}
                                    className="min-w-[200px] rounded-none bg-racing-red font-heading font-bold tracking-[0.25em] text-white uppercase transition-all duration-300 hover:bg-white hover:text-luxury-black disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Confirmation...
                                        </>
                                    ) : (
                                        <>
                                            <CheckIcon className="mr-2 h-4 w-4" />
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
                        className="text-xs tracking-widest text-muted-foreground uppercase transition-colors hover:text-racing-red"
                    >
                        Recommencer
                    </button>
                </div>
            </div>

            {/* Background decoration */}
            <div className="absolute top-1/2 left-0 h-[1px] w-64 bg-gradient-to-r from-racing-red/20 to-transparent" />
            <div className="absolute top-1/2 right-0 h-[1px] w-64 bg-gradient-to-l from-racing-red/20 to-transparent" />
        </PublicLayout>
    );
}
