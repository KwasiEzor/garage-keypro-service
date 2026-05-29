import type { LucideIcon } from 'lucide-react';
import {
    CheckCircle,
    Loader2,
    Send,
    Phone,
    MapPin,
    Star,
    Car,
    Clock,
    ArrowRight,
    Search,
    SearchX,
    Zap,
    Award,
    ShieldCheck,
    KeyRound,
    Menu,
    X,
    Instagram,
    Facebook,
    Twitter,
    Quote,
    Check,
    AlertTriangle,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
    CheckCircle,
    Loader2,
    Send,
    Phone,
    MapPin,
    Star,
    Car,
    Clock,
    ArrowRight,
    Search,
    SearchX,
    Zap,
    Award,
    ShieldCheck,
    KeyRound,
    Menu,
    X,
    Instagram,
    Facebook,
    Twitter,
    Quote,
    Check,
    AlertTriangle,
};

interface IconProps {
    iconNode?: LucideIcon | null;
    name?: string;
    className?: string;
}

export function Icon({ iconNode, name, className }: IconProps) {
    const IconComponent = iconNode || (name ? iconMap[name] : null);

    if (!IconComponent) {
        return null;
    }

    return <IconComponent className={className} />;
}
