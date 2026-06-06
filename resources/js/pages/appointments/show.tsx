import { Head, Link, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CalendarIcon,
    MapPinIcon,
    XIcon,
    DownloadIcon,
    ArrowLeftIcon,
    UserIcon,
    ShieldCheckIcon,
    ClockIcon,
    WrenchIcon,
    ChevronRightIcon,
    FileTextIcon,
    PhoneIcon,
    MailIcon,
    ExternalLinkIcon,
    InfoIcon,
    AlertCircleIcon,
    CheckCircle2Icon,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import PublicLayout from '@/layouts/public-layout';
import appointments from '@/routes/appointments';

interface Service {
    id: number;
    name: string;
    description: string;
    estimated_duration: number;
}

interface Team {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
}

interface Appointment {
    id: number;
    start_at: string;
    end_at: string;
    status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
    notes: string | null;
    vehicle_make: string | null;
    vehicle_model: string | null;
    vehicle_year: string | null;
    vehicle_vin: string | null;
    vehicle_license_plate: string | null;
    vehicle_color: string | null;
    vehicle_notes: string | null;
    service: Service;
    team: Team;
    user: User;
    cancellation_reason: string | null;
    created_at?: string;
}

interface Props {
    appointment: Appointment;
}

const statusSteps = [
    {
        key: 'pending',
        label: 'En attente',
        icon: ClockIcon,
        description: 'Analyse technique',
    },
    {
        key: 'confirmed',
        label: 'Confirmé',
        icon: ShieldCheckIcon,
        description: 'Protocole activé',
    },
    {
        key: 'completed',
        label: 'Terminé',
        icon: CheckCircle2Icon,
        description: 'Succès total',
    },
];

export default function AppointmentShow({ appointment }: Props) {
    const handleCancel = () => {
        if (
            confirm(
                "Voulez-vous vraiment interrompre ce protocole d'intervention ?",
            )
        ) {
            router.delete(appointments.cancel(appointment.id).url, {
                onSuccess: () =>
                    toast.success('Protocole interrompu avec succès.'),
            });
        }
    };

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'confirmed':
                return {
                    label: 'Protocole Confirmé',
                    color: 'bg-green-500',
                    text: 'text-green-500',
                    icon: ShieldCheckIcon,
                };
            case 'pending':
                return {
                    label: 'Analyse Technique',
                    color: 'bg-yellow-500',
                    text: 'text-yellow-500',
                    icon: ClockIcon,
                };
            case 'completed':
                return {
                    label: 'Opération Terminée',
                    color: 'bg-blue-500',
                    text: 'text-blue-500',
                    icon: CheckCircle2Icon,
                };
            case 'cancelled':
                return {
                    label: 'Protocole Interrompu',
                    color: 'bg-racing-red',
                    text: 'text-racing-red',
                    icon: XIcon,
                };
            case 'no_show':
                return {
                    label: 'Client Absent',
                    color: 'bg-gray-500',
                    text: 'text-gray-500',
                    icon: AlertCircleIcon,
                };
            default:
                return {
                    label: status,
                    color: 'bg-gray-500',
                    text: 'text-gray-500',
                    icon: InfoIcon,
                };
        }
    };

    const date = new Date(appointment.start_at);
    const endDate = new Date(appointment.end_at);
    const statusInfo = getStatusInfo(appointment.status);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        },
    };

    return (
        <PublicLayout>
            <Head
                title={`Protocole #${appointment.id} - ${appointment.service.name}`}
            />

            <div className="relative mx-auto min-h-screen max-w-7xl px-4 pt-32 pb-24 sm:px-6 lg:px-8">
                {/* Visual Accent */}
                <div className="pointer-events-none absolute top-0 right-0 -mt-96 -mr-96 h-[800px] w-[800px] animate-pulse rounded-full bg-racing-red/5 blur-[150px]" />

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16 flex flex-col justify-between gap-8 border-b border-white/5 pb-12 md:flex-row md:items-end"
                >
                    <div className="space-y-6">
                        <Link
                            href={appointments.my().url}
                            className="group inline-flex items-center font-heading text-[10px] font-bold tracking-wider text-white/70 uppercase transition-all hover:text-racing-red"
                        >
                            <ArrowLeftIcon className="mr-3 h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                            Accès Console
                        </Link>
                        <div className="space-y-2">
                            <h1 className="font-heading text-5xl leading-none font-bold tracking-tighter text-chrome uppercase md:text-7xl">
                                Mission{' '}
                                <span className="text-racing-red">
                                    #{appointment.id}
                                </span>
                            </h1>
                            <p className="flex items-center gap-3 font-heading text-xs font-bold tracking-wider text-white/70 uppercase">
                                <span className="h-[1px] w-12 bg-racing-red" />
                                {appointment.service.name}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col items-start gap-4 md:items-end">
                        <div className="flex items-center gap-3">
                            <div
                                className={`h-2 w-2 rounded-full ${statusInfo.color} animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]`}
                            />
                            <span
                                className={`font-heading text-[12px] font-bold tracking-[0.2em] uppercase ${statusInfo.text}`}
                            >
                                {statusInfo.label}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 border border-white/5 bg-luxury-charcoal px-6 py-3">
                            <span className="font-heading text-[10px] font-bold tracking-wide text-white/70 uppercase">
                                Auth Token
                            </span>
                            <span className="font-mono text-[11px] font-bold tracking-widest text-white">
                                KP-{appointment.id.toString().padStart(6, '0')}-
                                {new Date(appointment.created_at || '')
                                    .getTime()
                                    .toString()
                                    .slice(-4)}
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Main Dashboard Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 gap-6 lg:grid-cols-12"
                >
                    {/* Left Column: Mission Details */}
                    <div className="space-y-6 lg:col-span-8">
                        {/* Timeline Status */}
                        <motion.div
                            variants={itemVariants}
                            className="glass-panel relative overflow-hidden border border-white/5 bg-luxury-black/40 p-6"
                        >
                            <div className="bg-grid-pattern pointer-events-none absolute top-0 left-0 h-full w-full opacity-[0.03]" />
                            <div className="relative grid grid-cols-1 gap-12 md:grid-cols-3">
                                {statusSteps.map((step, index) => {
                                    const isPast =
                                        [
                                            'pending',
                                            'confirmed',
                                            'completed',
                                            'cancelled',
                                        ].indexOf(appointment.status) >=
                                        [
                                            'pending',
                                            'confirmed',
                                            'completed',
                                        ].indexOf(step.key);
                                    const isActive =
                                        appointment.status === step.key;
                                    const isCancelled =
                                        appointment.status === 'cancelled' &&
                                        index === 1;

                                    return (
                                        <div
                                            key={step.key}
                                            className="group relative flex flex-col items-center gap-4 text-center md:items-start md:text-left"
                                        >
                                            <div
                                                className={`flex h-14 w-14 items-center justify-center transition-all duration-700 ${
                                                    isCancelled
                                                        ? 'bg-racing-red text-white'
                                                        : isActive
                                                          ? 'scale-110 bg-racing-red text-white shadow-[0_0_30px_rgba(239,68,68,0.3)]'
                                                          : isPast
                                                            ? 'bg-white text-luxury-black'
                                                            : 'border border-white/10 bg-white/5 text-muted-foreground'
                                                }`}
                                            >
                                                <step.icon className="h-6 w-6" />
                                            </div>
                                            <div className="space-y-1">
                                                <p
                                                    className={`font-heading text-[10px] font-bold tracking-wide uppercase ${isActive || isCancelled ? 'text-white' : 'text-white/70'}`}
                                                >
                                                    {step.label}
                                                </p>
                                                <p className="text-[9px] font-medium tracking-wide text-white/60 uppercase">
                                                    {step.description}
                                                </p>
                                            </div>

                                            {index < statusSteps.length - 1 && (
                                                <div className="absolute top-7 left-14 -z-10 hidden h-[1px] w-full bg-white/5 md:block">
                                                    <div
                                                        className={`h-full origin-left bg-racing-red/50 transition-all duration-1000 ${isPast && !isActive ? 'w-full' : 'w-0'}`}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>

                        {/* Mission Specs Card */}
                        <motion.div variants={itemVariants}>
                            <Card className="glass-panel group overflow-hidden border-l-4 border-white/5 border-l-racing-red bg-luxury-charcoal">
                                <CardContent className="p-0">
                                    <div className="grid grid-cols-1 md:grid-cols-2">
                                        <div className="space-y-6 border-r border-white/5 p-6">
                                            <div className="space-y-2">
                                                <h3 className="flex items-center gap-2 font-heading text-xs font-bold tracking-wider text-racing-red uppercase">
                                                    <WrenchIcon className="h-3 w-3" />{' '}
                                                    Paramètres d'Intervention
                                                </h3>
                                                <p className="font-heading text-2xl font-bold tracking-wider text-white uppercase">
                                                    {appointment.service.name}
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-1 gap-6">
                                                <div className="flex items-start gap-4 border border-white/5 bg-luxury-black/50 p-4">
                                                    <CalendarIcon className="mt-1 h-5 w-5 text-racing-red" />
                                                    <div>
                                                        <p className="mb-1 font-heading text-[10px] font-bold tracking-wide text-white/70 uppercase">
                                                            Date d'Opération
                                                        </p>
                                                        <p className="text-sm font-bold text-white uppercase">
                                                            {date.toLocaleDateString(
                                                                'fr-FR',
                                                                {
                                                                    weekday:
                                                                        'long',
                                                                    day: 'numeric',
                                                                    month: 'long',
                                                                    year: 'numeric',
                                                                },
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-4 border border-white/5 bg-luxury-black/50 p-4">
                                                    <ClockIcon className="mt-1 h-5 w-5 text-racing-red" />
                                                    <div>
                                                        <p className="mb-1 font-heading text-[10px] font-bold tracking-wide text-white/70 uppercase">
                                                            Fenêtre Temporelle
                                                        </p>
                                                        <p className="text-sm font-bold text-white uppercase">
                                                            {date.toLocaleTimeString(
                                                                'fr-FR',
                                                                {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                },
                                                            )}{' '}
                                                            -{' '}
                                                            {endDate.toLocaleTimeString(
                                                                'fr-FR',
                                                                {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                },
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6 bg-luxury-black/30 p-6">
                                            <div className="space-y-6">
                                                <div className="space-y-2">
                                                    <h3 className="font-heading text-xs font-bold tracking-wider text-white/80 uppercase">
                                                        Localisation
                                                    </h3>
                                                    <div className="flex items-center gap-3">
                                                        <MapPinIcon className="h-5 w-5 text-racing-red" />
                                                        <p className="text-lg font-bold tracking-wider text-white uppercase">
                                                            {
                                                                appointment.team
                                                                    .name
                                                            }
                                                        </p>
                                                    </div>
                                                    <p className="pl-8 text-[10px] tracking-wide text-white/60 uppercase">
                                                        Garage Partenaire
                                                        Certifié KeyPro
                                                    </p>
                                                </div>

                                                <Separator className="bg-white/5" />

                                                <div className="space-y-2">
                                                    <h3 className="font-heading text-xs font-bold tracking-wider text-white/80 uppercase">
                                                        Durée de Mission
                                                    </h3>
                                                    <div className="flex items-center gap-3">
                                                        <ClockIcon className="h-5 w-5 text-racing-red" />
                                                        <p className="text-lg font-bold tracking-wider text-white uppercase">
                                                            {
                                                                appointment
                                                                    .service
                                                                    .estimated_duration
                                                            }{' '}
                                                            Minutes
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Vehicle Specifications */}
                        {(appointment.vehicle_make ||
                            appointment.vehicle_model) && (
                            <motion.div
                                variants={itemVariants}
                                className="space-y-4"
                            >
                                <h4 className="flex items-center gap-3 border-b border-white/10 pb-3 font-heading text-sm font-bold tracking-wider text-white uppercase">
                                    <WrenchIcon className="h-5 w-5 text-racing-red" />
                                    Spécifications Véhicule
                                </h4>
                                <div className="group relative overflow-hidden border border-white/5 bg-luxury-black p-6">
                                    <div className="absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-full bg-racing-red/5 opacity-50" />
                                    <div className="relative z-10 grid grid-cols-2 gap-x-6 gap-y-4">
                                        {appointment.vehicle_make && (
                                            <div className="space-y-1">
                                                <p className="font-heading text-[10px] font-bold tracking-wide text-white/70 uppercase">
                                                    Marque
                                                </p>
                                                <p className="text-base font-medium text-white">
                                                    {appointment.vehicle_make}
                                                </p>
                                            </div>
                                        )}
                                        {appointment.vehicle_model && (
                                            <div className="space-y-1">
                                                <p className="font-heading text-[10px] font-bold tracking-wide text-white/70 uppercase">
                                                    Modèle
                                                </p>
                                                <p className="text-base font-medium text-white">
                                                    {appointment.vehicle_model}
                                                </p>
                                            </div>
                                        )}
                                        {appointment.vehicle_year && (
                                            <div className="space-y-1">
                                                <p className="font-heading text-[10px] font-bold tracking-wide text-white/70 uppercase">
                                                    Année
                                                </p>
                                                <p className="text-base font-medium text-white">
                                                    {appointment.vehicle_year}
                                                </p>
                                            </div>
                                        )}
                                        {appointment.vehicle_color && (
                                            <div className="space-y-1">
                                                <p className="font-heading text-[10px] font-bold tracking-wide text-white/70 uppercase">
                                                    Couleur
                                                </p>
                                                <p className="text-base font-medium text-white">
                                                    {appointment.vehicle_color}
                                                </p>
                                            </div>
                                        )}
                                        {appointment.vehicle_license_plate && (
                                            <div className="space-y-1">
                                                <p className="font-heading text-[10px] font-bold tracking-wide text-white/70 uppercase">
                                                    Plaque
                                                </p>
                                                <p className="font-mono text-base font-bold tracking-wider text-white">
                                                    {
                                                        appointment.vehicle_license_plate
                                                    }
                                                </p>
                                            </div>
                                        )}
                                        {appointment.vehicle_vin && (
                                            <div className="space-y-1">
                                                <p className="font-heading text-[10px] font-bold tracking-wide text-white/70 uppercase">
                                                    VIN
                                                </p>
                                                <p className="font-mono text-xs font-medium tracking-wide text-white/80">
                                                    {appointment.vehicle_vin}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    {appointment.vehicle_notes && (
                                        <div className="mt-4 border-t border-white/10 pt-4">
                                            <p className="mb-2 font-heading text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Notes
                                            </p>
                                            <p className="text-sm leading-relaxed text-white/70">
                                                {appointment.vehicle_notes}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* Service Notes */}
                        {appointment.notes && (
                            <motion.div
                                variants={itemVariants}
                                className="space-y-4"
                            >
                                <h4 className="flex items-center gap-3 border-b border-white/10 pb-3 font-heading text-sm font-bold tracking-wider text-white uppercase">
                                    <FileTextIcon className="h-5 w-5 text-racing-red" />
                                    Notes de Service
                                </h4>
                                <div className="group relative overflow-hidden border border-white/5 bg-luxury-black p-6">
                                    <div className="relative z-10">
                                        <p className="text-sm leading-relaxed text-white/80">
                                            {appointment.notes}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Incident Report */}
                        <AnimatePresence>
                            {appointment.status === 'cancelled' &&
                                appointment.cancellation_reason && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-6"
                                    >
                                        <h4 className="flex items-center gap-3 font-heading text-[11px] font-bold tracking-[0.5em] text-racing-red uppercase">
                                            <AlertCircleIcon className="h-4 w-4" />
                                            Rapport d'Interruption
                                        </h4>
                                        <div className="group relative overflow-hidden border border-red-900/20 bg-red-900/5 p-10">
                                            <div className="absolute top-0 left-0 h-full w-1 bg-red-600/50" />
                                            <p className="mb-4 font-heading text-[10px] font-bold tracking-[0.3em] text-red-600 uppercase">
                                                Motif de l'arrêt du protocole
                                            </p>
                                            <p className="text-sm leading-relaxed font-medium text-white/80 italic">
                                                "
                                                {
                                                    appointment.cancellation_reason
                                                }
                                                "
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                        </AnimatePresence>
                    </div>

                    {/* Right Column: Profile & Actions */}
                    <div className="space-y-6 lg:col-span-4">
                        {/* Client Card */}
                        <motion.div variants={itemVariants}>
                            <div className="glass-panel group relative overflow-hidden border border-white/5 bg-luxury-charcoal">
                                <div className="absolute top-0 right-0 -mt-24 -mr-24 h-48 w-48 rounded-full bg-racing-red/5 transition-transform duration-1000 group-hover:scale-125" />
                                <div className="space-y-6 p-6">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-heading text-xs font-bold tracking-wider text-white/80 uppercase">
                                            Passport Client
                                        </h4>
                                        <UserIcon className="h-3.5 w-3.5 text-racing-red" />
                                    </div>

                                    <div className="flex flex-col items-center space-y-4 text-center">
                                        <div className="group relative h-24 w-24 bg-white">
                                            <div className="absolute inset-0 bg-racing-red/20 opacity-0 transition-opacity group-hover:opacity-100" />
                                            <span className="absolute inset-0 flex items-center justify-center font-heading text-4xl font-bold text-luxury-black">
                                                {appointment.user.name.charAt(
                                                    0,
                                                )}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-heading text-xl leading-tight font-bold tracking-wider text-white uppercase">
                                                {appointment.user.name}
                                            </p>
                                            <p className="mt-2 text-[9px] font-bold tracking-[0.4em] text-racing-red uppercase">
                                                Accréditation Elite
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-5 pt-4">
                                        <div className="group/item flex cursor-pointer items-center gap-4 text-sm">
                                            <div className="flex h-10 w-10 items-center justify-center border border-white/5 transition-colors group-hover/item:border-racing-red">
                                                <MailIcon className="h-4 w-4 text-racing-red" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-heading text-[9px] font-bold tracking-wide text-white/70 uppercase">
                                                    Email
                                                </span>
                                                <span className="font-medium text-white">
                                                    {appointment.user.email}
                                                </span>
                                            </div>
                                        </div>
                                        {appointment.user.phone && (
                                            <div className="group/item flex cursor-pointer items-center gap-4 text-sm">
                                                <div className="flex h-10 w-10 items-center justify-center border border-white/5 transition-colors group-hover/item:border-racing-red">
                                                    <PhoneIcon className="h-4 w-4 text-racing-red" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-heading text-[9px] font-bold tracking-wide text-white/70 uppercase">
                                                        Communication
                                                    </span>
                                                    <span className="font-medium text-white">
                                                        {appointment.user.phone}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <Link
                                        href="/settings/profile"
                                        className="block w-full"
                                    >
                                        <Button
                                            variant="outline"
                                            className="group h-14 w-full rounded-none border-white/10 text-[10px] font-bold tracking-[0.3em] uppercase transition-all hover:border-racing-red hover:bg-racing-red/5"
                                        >
                                            Dossier Client{' '}
                                            <ChevronRightIcon className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>

                        {/* Protocol Actions */}
                        <motion.div
                            variants={itemVariants}
                            className="space-y-4"
                        >
                            <h4 className="border-l-4 border-racing-red pl-3 font-heading text-sm font-bold tracking-wider text-white uppercase">
                                Console d'Actions
                            </h4>
                            <div className="space-y-4">
                                {appointment.status === 'confirmed' && (
                                    <>
                                        <motion.a
                                            whileHover={{ scale: 1.02 }}
                                            href={
                                                appointments.calendar(
                                                    appointment.id,
                                                ).url
                                            }
                                            className="group block"
                                        >
                                            <div className="flex items-center justify-between border-2 border-white/10 bg-luxury-black p-5 transition-all duration-300 hover:border-racing-red hover:bg-luxury-black/80 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                                                <div className="flex items-center gap-5">
                                                    <div className="flex h-12 w-12 items-center justify-center border border-white/10 bg-white/5 transition-all duration-300 group-hover:border-racing-red group-hover:bg-racing-red/20">
                                                        <DownloadIcon className="h-5 w-5 text-racing-red" />
                                                    </div>
                                                    <div>
                                                        <span className="block font-heading text-xs font-bold tracking-wider text-white uppercase transition-colors group-hover:text-chrome">
                                                            Sync Calendrier
                                                        </span>
                                                        <span className="mt-1 text-[9px] tracking-wide text-white/60 uppercase transition-colors group-hover:text-white/80">
                                                            Format Universel
                                                            .ics
                                                        </span>
                                                    </div>
                                                </div>
                                                <ChevronRightIcon className="h-5 w-5 text-white/40 transition-all group-hover:translate-x-1 group-hover:text-racing-red" />
                                            </div>
                                        </motion.a>

                                        <motion.a
                                            whileHover={{ scale: 1.02 }}
                                            href={
                                                appointments.reschedule(
                                                    appointment.id,
                                                ).url
                                            }
                                            className="group block"
                                        >
                                            <div className="flex items-center justify-between border-2 border-white/10 bg-luxury-black p-5 transition-all duration-300 hover:border-racing-red hover:bg-luxury-black/80 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                                                <div className="flex items-center gap-5">
                                                    <div className="flex h-12 w-12 items-center justify-center border border-white/10 bg-white/5 transition-all duration-300 group-hover:border-racing-red group-hover:bg-racing-red/20">
                                                        <CalendarIcon className="h-5 w-5 text-racing-red" />
                                                    </div>
                                                    <div>
                                                        <span className="block font-heading text-xs font-bold tracking-wider text-white uppercase transition-colors group-hover:text-chrome">
                                                            Reprogrammer
                                                        </span>
                                                        <span className="mt-1 text-[9px] tracking-wide text-white/60 uppercase transition-colors group-hover:text-white/80">
                                                            Modifier l'horaire
                                                        </span>
                                                    </div>
                                                </div>
                                                <ChevronRightIcon className="h-5 w-5 text-white/40 transition-all group-hover:translate-x-1 group-hover:text-racing-red" />
                                            </div>
                                        </motion.a>

                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            onClick={handleCancel}
                                            className="group w-full text-left"
                                        >
                                            <div className="flex items-center justify-between border-2 border-red-900/30 bg-red-900/10 p-5 transition-all duration-300 hover:border-red-600 hover:bg-red-900/20 hover:shadow-[0_0_20px_rgba(220,38,38,0.3)]">
                                                <div className="flex items-center gap-5">
                                                    <div className="flex h-12 w-12 items-center justify-center border border-red-900/30 bg-red-600/10 transition-all duration-300 group-hover:border-red-600 group-hover:bg-red-600 group-hover:text-white">
                                                        <XIcon className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <span className="block font-heading text-xs font-bold tracking-wider text-red-600 uppercase transition-colors group-hover:text-red-500">
                                                            Interrompre
                                                        </span>
                                                        <span className="mt-1 text-[9px] tracking-wide text-red-600/70 uppercase transition-colors group-hover:text-red-500/80">
                                                            Annulation
                                                            Irréversible
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.button>
                                    </>
                                )}

                                {appointment.status === 'completed' && (
                                    <div className="space-y-4 border border-green-900/20 bg-green-900/5 p-6 text-center">
                                        <div className="relative inline-block">
                                            <ShieldCheckIcon className="mx-auto h-16 w-16 text-green-500" />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="font-heading text-[12px] font-bold tracking-[0.3em] text-white uppercase">
                                                Opération Terminée
                                            </p>
                                            <p className="text-[9px] leading-relaxed tracking-widest text-muted-foreground uppercase">
                                                Le protocole technique a été
                                                exécuté avec succès.
                                            </p>
                                        </div>
                                        <Link
                                            href="/dashboard/invoices"
                                            className="block w-full"
                                        >
                                            <Button className="h-14 w-full rounded-none bg-green-600 text-[10px] font-bold tracking-[0.4em] uppercase transition-all hover:bg-green-500">
                                                Consulter les Factures
                                            </Button>
                                        </Link>
                                    </div>
                                )}

                                {(appointment.status === 'cancelled' ||
                                    appointment.status === 'pending') && (
                                    <div className="glass-panel space-y-8 border border-white/5 bg-luxury-charcoal/50 p-10 text-center">
                                        <div className="space-y-3">
                                            <p className="font-heading text-[11px] font-bold tracking-[0.3em] text-white uppercase">
                                                {appointment.status ===
                                                'cancelled'
                                                    ? 'Dossier Archive'
                                                    : 'Analyse en cours'}
                                            </p>
                                            <p className="text-[9px] leading-relaxed tracking-widest text-muted-foreground uppercase">
                                                {appointment.status ===
                                                'cancelled'
                                                    ? 'Cette mission a été classée suite à son interruption.'
                                                    : 'Nos ingénieurs valident actuellement les spécifications techniques.'}
                                            </p>
                                        </div>
                                        <Link
                                            href="/services"
                                            className="flex w-full items-center justify-center bg-racing-red py-4 text-[10px] font-bold tracking-[0.4em] text-white uppercase transition-all hover:bg-white hover:text-luxury-black"
                                        >
                                            Nouvelle Mission{' '}
                                            <ExternalLinkIcon className="ml-3 h-3 w-3" />
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Support Note */}
                        <motion.div
                            variants={itemVariants}
                            className="border border-white/5 bg-luxury-black/30 p-8"
                        >
                            <p className="text-center text-[9px] leading-relaxed tracking-[0.3em] text-muted-foreground uppercase">
                                Pour toute assistance technique prioritaire,
                                contactez notre centre opérationnel 24/7.
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </PublicLayout>
    );
}
