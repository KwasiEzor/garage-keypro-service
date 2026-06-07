import { Link } from '@inertiajs/react';
import {
    LayoutGrid,
    Calendar,
    Receipt,
    User,
    LogOut,
    ChevronDown,
    ShieldCheck,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { dashboard } from '@/routes';

interface UserMenuProps {
    user: {
        name: string;
        email: string;
        avatar?: string;
    };
    currentTeam?: {
        slug: string;
    } | null;
}

export function UserMenu({ user, currentTeam }: UserMenuProps) {
    const dashboardUrl = currentTeam ? dashboard(currentTeam.slug) : '/';

    // Initials for avatar fallback
    const initials = user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="group flex items-center gap-3 rounded-none border border-white/5 bg-luxury-charcoal/50 p-1 transition-all outline-none hover:bg-white/5">
                    <Avatar className="h-8 w-8 rounded-none border border-racing-red/20 transition-colors group-hover:border-racing-red">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="rounded-none bg-luxury-black font-heading text-[10px] text-racing-red">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="hidden flex-col items-start pr-2 lg:flex">
                        <span className="max-w-[120px] truncate font-heading text-[10px] font-bold tracking-wider text-white uppercase">
                            {user.name}
                        </span>
                        <div className="flex items-center gap-1">
                            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-racing-red" />
                            <span className="text-[8px] font-bold tracking-widest text-muted-foreground uppercase">
                                Client Elite
                            </span>
                        </div>
                    </div>
                    <ChevronDown className="mr-1 h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-racing-red" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="z-[100] w-64 rounded-none border-white/10 bg-luxury-black p-2 text-white shadow-2xl"
                sideOffset={12}
            >
                <DropdownMenuLabel className="p-3">
                    <div className="flex flex-col space-y-1">
                        <p className="font-heading text-[10px] font-bold tracking-[0.2em] text-racing-red uppercase">
                            Console Client
                        </p>
                        <p className="truncate font-mono text-xs text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-white/5" />

                <div className="py-2">
                    <DropdownMenuItem asChild>
                        <Link
                            href={dashboardUrl}
                            className="flex cursor-pointer items-center gap-3 rounded-none p-3 font-heading text-[10px] font-bold tracking-widest uppercase transition-colors hover:bg-racing-red hover:text-white"
                        >
                            <LayoutGrid className="h-4 w-4" />
                            Tableau de bord
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                        <Link
                            href="/my-appointments"
                            className="flex cursor-pointer items-center gap-3 rounded-none p-3 font-heading text-[10px] font-bold tracking-widest uppercase transition-colors hover:bg-racing-red hover:text-white"
                        >
                            <Calendar className="h-4 w-4" />
                            Mes Rendez-vous
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                        <Link
                            href="/dashboard/invoices"
                            className="flex cursor-pointer items-center gap-3 rounded-none p-3 font-heading text-[10px] font-bold tracking-widest uppercase transition-colors hover:bg-racing-red hover:text-white"
                        >
                            <Receipt className="h-4 w-4" />
                            Mes Factures
                        </Link>
                    </DropdownMenuItem>
                </div>

                <DropdownMenuSeparator className="bg-white/5" />

                <div className="py-2">
                    <DropdownMenuItem asChild>
                        <Link
                            href="/settings/profile"
                            className="flex cursor-pointer items-center gap-3 rounded-none p-3 font-heading text-[10px] font-bold tracking-widest uppercase transition-colors hover:bg-racing-red hover:text-white"
                        >
                            <User className="h-4 w-4" />
                            Mon Profil
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                        <Link
                            href="/settings/security"
                            className="flex cursor-pointer items-center gap-3 rounded-none p-3 font-heading text-[10px] font-bold tracking-widest uppercase transition-colors hover:bg-racing-red hover:text-white"
                        >
                            <ShieldCheck className="h-4 w-4" />
                            Sécurité
                        </Link>
                    </DropdownMenuItem>
                </div>

                <DropdownMenuSeparator className="bg-white/5" />

                <DropdownMenuItem asChild>
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="flex w-full cursor-pointer items-center gap-3 rounded-none p-3 font-heading text-[10px] font-bold tracking-widest text-racing-red uppercase transition-colors hover:bg-racing-red hover:text-white"
                    >
                        <LogOut className="h-4 w-4" />
                        Déconnexion
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
