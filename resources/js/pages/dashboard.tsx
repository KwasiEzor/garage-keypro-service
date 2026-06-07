import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    CalendarIcon,
    ReceiptIcon,
    CarIcon,
    TrendingUpIcon,
    ClockIcon,
    BellIcon,
    ArrowRightIcon,
    ShieldCheckIcon,
    PlusIcon,
    ChevronRightIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { dashboard } from '@/routes';
import appointments from '@/routes/appointments';

interface Appointment {
    id: number;
    start_at: string;
    end_at: string;
    status: string;
    team: { name: string };
    service: { name: string };
    vehicle_make?: string;
    vehicle_model?: string;
}

interface Invoice {
    id: number;
    number: string;
    total_amount: number;
    status: string;
    issue_date: string;
}

interface Notification {
    id: string;
    data: {
        message: string;
        type?: string;
    };
    created_at: string;
}

interface Vehicle {
    vehicle_make: string;
    vehicle_model: string;
    vehicle_year: string;
    vehicle_license_plate: string;
}

interface Props {
    upcomingAppointments: Appointment[];
    recentInvoices: Invoice[];
    notifications: Notification[];
    vehicles: Vehicle[];
    stats: {
        totalAppointments: number;
        pendingInvoices: number;
        totalSpent: number;
    };
    currentTeam?: { slug: string };
}

export default function Dashboard({
    upcomingAppointments,
    recentInvoices,
    notifications,
    vehicles,
    stats,
}: Props) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: 'easeOut' },
        },
    };

    return (
        <>
            <Head title="Console Technique" />

            <div className="flex flex-col gap-8 p-6 lg:p-10">
                {/* Header Stats */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 gap-6 md:grid-cols-3"
                >
                    <motion.div variants={itemVariants}>
                        <Card className="glass-panel group relative overflow-hidden border-white/5 bg-luxury-charcoal/40">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <TrendingUpIcon className="h-12 w-12 text-racing-red" />
                            </div>
                            <CardContent className="p-6">
                                <p className="mb-1 font-heading text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
                                    Dépense Totale
                                </p>
                                <h3 className="font-heading text-3xl font-bold tracking-tighter text-white uppercase">
                                    {new Intl.NumberFormat('fr-FR', {
                                        style: 'currency',
                                        currency: 'EUR',
                                    }).format(stats.totalSpent)}
                                </h3>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Card className="glass-panel group relative overflow-hidden border-white/5 bg-luxury-charcoal/40">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <ReceiptIcon className="h-12 w-12 text-racing-red" />
                            </div>
                            <CardContent className="p-6">
                                <p className="mb-1 font-heading text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
                                    Factures en Attente
                                </p>
                                <h3 className="font-heading text-3xl font-bold tracking-tighter text-white uppercase">
                                    {stats.pendingInvoices}
                                </h3>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Card className="glass-panel group relative overflow-hidden border-white/5 bg-luxury-charcoal/40">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <CalendarIcon className="h-12 w-12 text-racing-red" />
                            </div>
                            <CardContent className="p-6">
                                <p className="mb-1 font-heading text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
                                    Total Interventions
                                </p>
                                <h3 className="font-heading text-3xl font-bold tracking-tighter text-white uppercase">
                                    {stats.totalAppointments}
                                </h3>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Left & Middle Column (Main Content) */}
                    <div className="space-y-8 lg:col-span-2">
                        {/* Notifications Feedback */}
                        {notifications.length > 0 && (
                            <motion.div
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                <div className="flex items-start gap-4 rounded-none border border-racing-red/20 bg-racing-red/10 p-4">
                                    <BellIcon className="mt-0.5 h-5 w-5 animate-pulse text-racing-red" />
                                    <div>
                                        <p className="mb-1 text-xs font-bold tracking-widest text-racing-red uppercase">
                                            Mises à jour du système
                                        </p>
                                        <p className="text-sm text-white/80">
                                            {notifications[0].data.message}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Next Appointment Hero */}
                        <motion.section
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-4"
                        >
                            <div className="flex items-center justify-between">
                                <h2 className="flex items-center gap-2 font-heading text-sm font-bold tracking-[0.3em] text-white uppercase">
                                    <div className="h-4 w-[2px] bg-racing-red" />
                                    Prochaine Intervention
                                </h2>
                                {upcomingAppointments.length > 0 && (
                                    <Link
                                        href="/my-appointments"
                                        className="flex items-center gap-1 text-[10px] font-bold tracking-widest text-muted-foreground uppercase transition-colors hover:text-racing-red"
                                    >
                                        Tout voir{' '}
                                        <ChevronRightIcon className="h-3 w-3" />
                                    </Link>
                                )}
                            </div>

                            {upcomingAppointments.length > 0 ? (
                                <Card className="group relative overflow-hidden border-white/5 bg-luxury-black">
                                    <div className="absolute top-0 left-0 h-full w-1 bg-racing-red" />
                                    <CardContent className="p-0">
                                        <div className="flex flex-col md:flex-row">
                                            <div className="flex flex-col items-center justify-center border-b border-white/5 bg-luxury-charcoal/50 p-8 md:w-1/3 md:border-r md:border-b-0">
                                                <CalendarIcon className="mb-4 h-8 w-8 text-racing-red" />
                                                <span className="font-heading text-lg font-bold tracking-wider text-white uppercase">
                                                    {new Date(
                                                        upcomingAppointments[0]
                                                            .start_at,
                                                    ).toLocaleDateString(
                                                        'fr-FR',
                                                        {
                                                            day: 'numeric',
                                                            month: 'short',
                                                        },
                                                    )}
                                                </span>
                                                <span className="mt-1 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                    {new Date(
                                                        upcomingAppointments[0]
                                                            .start_at,
                                                    ).toLocaleTimeString(
                                                        'fr-FR',
                                                        {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        },
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex flex-1 flex-col justify-center p-8">
                                                <div className="mb-4 flex items-start justify-between">
                                                    <div>
                                                        <Badge className="mb-2 rounded-none border-racing-red/30 bg-racing-red/20 text-[9px] font-bold tracking-widest text-racing-red uppercase">
                                                            Confirmé
                                                        </Badge>
                                                        <h4 className="font-heading text-xl font-bold tracking-tight text-white uppercase">
                                                            {
                                                                upcomingAppointments[0]
                                                                    .service
                                                                    .name
                                                            }
                                                        </h4>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                            Localisation
                                                        </p>
                                                        <p className="text-sm font-bold text-white">
                                                            {
                                                                upcomingAppointments[0]
                                                                    .team.name
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <Link
                                                        href={
                                                            appointments.show(
                                                                upcomingAppointments[0]
                                                                    .id,
                                                            ).url
                                                        }
                                                    >
                                                        <Button className="skewed-btn h-10 bg-white px-6 text-luxury-black transition-all hover:bg-racing-red hover:text-white">
                                                            <span>
                                                                Détails
                                                                Techniques
                                                            </span>
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Card className="border-dashed border-white/5 bg-luxury-charcoal/20 p-12 text-center">
                                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-none bg-white/5">
                                        <CalendarIcon className="h-8 w-8 text-muted-foreground/30" />
                                    </div>
                                    <p className="mb-6 text-xs tracking-widest text-muted-foreground uppercase">
                                        Aucun protocole planifié
                                    </p>
                                    <Link href={appointments.index().url}>
                                        <Button className="skewed-btn h-12 bg-racing-red px-8 text-white hover:bg-white hover:text-luxury-black">
                                            <span>Nouvelle Intervention</span>
                                        </Button>
                                    </Link>
                                </Card>
                            )}
                        </motion.section>

                        {/* Recent Invoices */}
                        <motion.section
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-4"
                        >
                            <h2 className="flex items-center gap-2 font-heading text-sm font-bold tracking-[0.3em] text-white uppercase">
                                <div className="h-4 w-[2px] bg-racing-red" />
                                Dernières Factures
                            </h2>

                            <Card className="overflow-hidden rounded-none border-white/5 bg-luxury-black">
                                <CardContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse text-left">
                                            <thead>
                                                <tr className="border-b border-white/5 bg-luxury-charcoal/30">
                                                    <th className="p-4 font-heading text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                        N° Facture
                                                    </th>
                                                    <th className="p-4 font-heading text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                        Date
                                                    </th>
                                                    <th className="p-4 font-heading text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                        Montant
                                                    </th>
                                                    <th className="p-4 font-heading text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                        Statut
                                                    </th>
                                                    <th className="p-4 text-right font-heading text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {recentInvoices.length > 0 ? (
                                                    recentInvoices.map(
                                                        (invoice) => (
                                                            <tr
                                                                key={invoice.id}
                                                                className="border-b border-white/5 transition-colors hover:bg-white/5"
                                                            >
                                                                <td className="p-4">
                                                                    <span className="font-mono text-sm font-bold text-white">
                                                                        {
                                                                            invoice.number
                                                                        }
                                                                    </span>
                                                                </td>
                                                                <td className="p-4 text-xs text-muted-foreground">
                                                                    {new Date(
                                                                        invoice.issue_date,
                                                                    ).toLocaleDateString(
                                                                        'fr-FR',
                                                                    )}
                                                                </td>
                                                                <td className="p-4">
                                                                    <span className="text-sm font-bold text-white">
                                                                        {new Intl.NumberFormat(
                                                                            'fr-FR',
                                                                            {
                                                                                style: 'currency',
                                                                                currency:
                                                                                    'EUR',
                                                                            },
                                                                        ).format(
                                                                            invoice.total_amount,
                                                                        )}
                                                                    </span>
                                                                </td>
                                                                <td className="p-4">
                                                                    <Badge
                                                                        className={`rounded-none text-[9px] font-bold tracking-widest uppercase ${
                                                                            invoice.status ===
                                                                            'paid'
                                                                                ? 'border-green-500/30 bg-green-500/20 text-green-500'
                                                                                : 'border-yellow-500/30 bg-yellow-500/20 text-yellow-500'
                                                                        }`}
                                                                    >
                                                                        {invoice.status ===
                                                                        'paid'
                                                                            ? 'Payé'
                                                                            : 'En attente'}
                                                                    </Badge>
                                                                </td>
                                                                <td className="p-4 text-right">
                                                                    <Link
                                                                        href={`/dashboard/invoices/${invoice.id}`}
                                                                    >
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="h-8 px-2 transition-all hover:bg-racing-red hover:text-white"
                                                                        >
                                                                            <ArrowRightIcon className="h-4 w-4" />
                                                                        </Button>
                                                                    </Link>
                                                                </td>
                                                            </tr>
                                                        ),
                                                    )
                                                ) : (
                                                    <tr>
                                                        <td
                                                            colSpan={5}
                                                            className="p-8 text-center text-xs tracking-widest text-muted-foreground uppercase"
                                                        >
                                                            Aucune facture
                                                            enregistrée
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.section>
                    </div>

                    {/* Right Column (Side Data) */}
                    <div className="space-y-8">
                        {/* Quick Actions */}
                        <motion.section
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-4"
                        >
                            <h2 className="flex items-center gap-2 font-heading text-sm font-bold tracking-[0.3em] text-white uppercase">
                                <div className="h-4 w-[2px] bg-racing-red" />
                                Actions Rapides
                            </h2>
                            <div className="grid grid-cols-1 gap-4">
                                <Link href={appointments.index().url}>
                                    <Button className="flex h-14 w-full items-center justify-between rounded-none bg-racing-red px-6 font-heading font-bold tracking-[0.1em] text-white uppercase transition-all hover:bg-white hover:text-luxury-black">
                                        <span>Nouvelle Intervention</span>
                                        <PlusIcon className="h-5 w-5" />
                                    </Button>
                                </Link>
                                <Link href="/settings/profile">
                                    <Button
                                        variant="outline"
                                        className="flex h-14 w-full items-center justify-between rounded-none border-white/10 bg-luxury-charcoal/30 px-6 font-heading font-bold tracking-[0.1em] text-white uppercase transition-all hover:bg-white/5"
                                    >
                                        <span>Gérer mes Données</span>
                                        <ShieldCheckIcon className="h-5 w-5" />
                                    </Button>
                                </Link>
                            </div>
                        </motion.section>

                        {/* Registered Vehicles */}
                        <motion.section
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-4"
                        >
                            <h2 className="flex items-center gap-2 font-heading text-sm font-bold tracking-[0.3em] text-white uppercase">
                                <div className="h-4 w-[2px] bg-racing-red" />
                                Mes Véhicules
                            </h2>
                            <div className="space-y-4">
                                {vehicles.length > 0 ? (
                                    vehicles.map((vehicle, idx) => (
                                        <Card
                                            key={idx}
                                            className="group rounded-none border-white/5 bg-luxury-black transition-all hover:border-racing-red/30"
                                        >
                                            <CardContent className="flex items-center gap-4 p-4">
                                                <div className="flex h-12 w-12 items-center justify-center border border-white/5 bg-luxury-charcoal">
                                                    <CarIcon className="h-6 w-6 text-racing-red" />
                                                </div>
                                                <div>
                                                    <h5 className="font-heading text-sm font-bold tracking-wider text-white uppercase">
                                                        {vehicle.vehicle_make}{' '}
                                                        {vehicle.vehicle_model}
                                                    </h5>
                                                    <div className="mt-1 flex items-center gap-2 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                        <span>
                                                            {
                                                                vehicle.vehicle_year
                                                            }
                                                        </span>
                                                        <div className="h-1 w-1 rounded-full bg-white/20" />
                                                        <span className="text-racing-red">
                                                            {
                                                                vehicle.vehicle_license_plate
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="border border-dashed border-white/5 bg-luxury-charcoal/10 p-6 text-center">
                                        <p className="text-[10px] tracking-widest text-muted-foreground uppercase">
                                            Aucun véhicule identifié
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.section>

                        {/* Service Status */}
                        <Card className="relative overflow-hidden rounded-none border border-racing-red/20 bg-gradient-to-br from-racing-red/20 to-luxury-black p-6">
                            <div className="relative z-10">
                                <p className="mb-4 font-heading text-[10px] font-bold tracking-[0.3em] text-racing-red uppercase">
                                    Ligne Prioritaire
                                </p>
                                <p className="mb-6 text-sm leading-relaxed text-white/80">
                                    Un technicien est toujours disponible pour
                                    vos questions techniques urgentes.
                                </p>
                                <a
                                    href="tel:+22872114444"
                                    className="font-heading text-xl font-bold tracking-widest text-white transition-colors hover:text-racing-red"
                                >
                                    +228 72 11 44 44
                                </a>
                            </div>
                            <div className="absolute -right-6 -bottom-6 opacity-10">
                                <ClockIcon className="h-32 w-32 text-white" />
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        {
            title: 'Console Technique',
            href: props.currentTeam ? dashboard(props.currentTeam.slug) : '/',
        },
    ],
});
