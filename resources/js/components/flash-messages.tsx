import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

export function FlashMessages() {
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash.success) {
            if (flash.calendar_url) {
                toast.success(flash.success, {
                    description: 'Keep track of your booking.',
                    action: {
                        label: 'Add to Calendar',
                        onClick: () =>
                            window.open(flash.calendar_url, '_blank'),
                    },
                });
            } else {
                toast.success(flash.success);
            }
        }

        if (flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    return null;
}
