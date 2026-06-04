import { useState, useCallback, useEffect } from 'react';

export type WizardStep = 1 | 2 | 3 | 4;

export interface BookingState {
    step: WizardStep;
    serviceId: string;
    teamId: string;
    date: Date | null;
    slot: string;
    notes: string;
}

interface ValidationErrors {
    serviceId?: string;
    teamId?: string;
    date?: string;
    slot?: string;
}

const STORAGE_KEY = 'booking_wizard_state';

const initialState: BookingState = {
    step: 1,
    serviceId: '',
    teamId: '',
    date: null,
    slot: '',
    notes: '',
};

export function useBookingWizard(initialTeamId?: string) {
    // Try to restore from localStorage on mount
    const [state, setState] = useState<BookingState>(() => {
        if (typeof window === 'undefined') return initialState;

        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Convert date string back to Date object
                if (parsed.date) {
                    parsed.date = new Date(parsed.date);
                }
                return { ...initialState, ...parsed, teamId: initialTeamId || parsed.teamId };
            }
        } catch (e) {
            console.error('Failed to restore booking state:', e);
        }

        return { ...initialState, teamId: initialTeamId || '' };
    });

    const [errors, setErrors] = useState<ValidationErrors>({});

    // Persist state to localStorage whenever it changes
    useEffect(() => {
        if (typeof window === 'undefined') return;

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            console.error('Failed to persist booking state:', e);
        }
    }, [state]);

    // Update a specific field
    const updateField = useCallback(<K extends keyof BookingState>(
        field: K,
        value: BookingState[K]
    ) => {
        setState(prev => ({ ...prev, [field]: value }));
        // Clear error for this field when user updates it
        if (errors[field as keyof ValidationErrors]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    }, [errors]);

    // Validate current step before moving forward
    const validateStep = useCallback((step: WizardStep): boolean => {
        const newErrors: ValidationErrors = {};

        switch (step) {
            case 1: // Service selection
                if (!state.serviceId) {
                    newErrors.serviceId = 'Veuillez sélectionner un service';
                }
                break;
            case 2: // Date & time selection
                if (!state.date) {
                    newErrors.date = 'Veuillez sélectionner une date';
                }
                if (!state.slot) {
                    newErrors.slot = 'Veuillez sélectionner un créneau horaire';
                }
                break;
            case 3: // Notes (optional, always valid)
                break;
            case 4: // Review (validation already done)
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [state]);

    // Navigate to next step
    const nextStep = useCallback(() => {
        if (validateStep(state.step)) {
            setState(prev => ({
                ...prev,
                step: Math.min(4, prev.step + 1) as WizardStep,
            }));
        }
    }, [state.step, validateStep]);

    // Navigate to previous step
    const prevStep = useCallback(() => {
        setState(prev => ({
            ...prev,
            step: Math.max(1, prev.step - 1) as WizardStep,
        }));
    }, []);

    // Jump to a specific step
    const goToStep = useCallback((step: WizardStep) => {
        setState(prev => ({ ...prev, step }));
    }, []);

    // Reset wizard state
    const reset = useCallback(() => {
        setState({ ...initialState, teamId: initialTeamId || '' });
        setErrors({});
        if (typeof window !== 'undefined') {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, [initialTeamId]);

    // Check if wizard can proceed to next step
    const canProceed = useCallback((): boolean => {
        return validateStep(state.step);
    }, [state.step, validateStep]);

    return {
        state,
        errors,
        updateField,
        nextStep,
        prevStep,
        goToStep,
        reset,
        canProceed,
        isFirstStep: state.step === 1,
        isLastStep: state.step === 4,
    };
}
