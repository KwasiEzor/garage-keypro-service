import { usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    const { settings } = usePage().props as any;
    const siteName = settings?.site_name || 'KEYPRO';

    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-none bg-racing-red text-white">
                <AppLogoIcon className="size-5 fill-none" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    {siteName}
                </span>
            </div>
        </>
    );
}
