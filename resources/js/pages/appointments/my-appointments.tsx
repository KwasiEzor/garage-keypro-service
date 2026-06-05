import { Head, Link, router } from '@inertiajs/react';
import { 
    CalendarIcon, 
    MapPinIcon, 
    ClockIcon, 
    XIcon, 
    DownloadIcon, 
    ChevronRightIcon, 
    ActivityIcon,
    KeyRoundIcon,
    ShieldCheckIcon,
    PlusIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PublicLayout from '@/layouts/public-layout';
import appointmentsRoute from '@/routes/appointments';

interface Service {
    name: string;
}

interface Team {
    name: string;
}

interface Appointment {
    id: number;
    start_at: string;
    end_at: string;
    status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
    notes: string | null;
    service: Service;
    team: Team;
}

interface Props {
    appointments: Appointment[];
}

export default function MyAppointments({ appointments }: Props) {
    const handleCancel = (id: number) => {
        if (confirm('Voulez-vous vraiment interrompre ce protocole d\'intervention ?')) {
            router.delete(appointmentsRoute.cancel(id).url, {
                onSuccess: () => toast.success('Protocole interrompu avec succès.'),
            });
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'confirmed': return { label: 'Protocole Actif', color: 'bg-green-500', text: 'text-green-500' };
            case 'pending': return { label: 'En Analyse', color: 'bg-yellow-500', text: 'text-yellow-500' };
            case 'completed': return { label: 'Dossier Clos', color: 'bg-blue-500', text: 'text-blue-500' };
            case 'cancelled': return { label: 'Interrompu', color: 'bg-racing-red', text: 'text-racing-red' };
            case 'no_show': return { label: 'Absent', color: 'bg-gray-500', text: 'text-gray-500' };
            default: return { label: status, color: 'bg-gray-500', text: 'text-gray-500' };
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    return (
        <PublicLayout>
            <Head title="Console d'Intervention" />
            
            <div className="relative min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
                {/* Background Decor */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-racing-red/5 blur-[120px] rounded-full pointer-events-none -mt-48" />

                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16 text-center space-y-4"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-luxury-charcoal border border-white/5 text-[9px] font-heading font-bold uppercase tracking-[0.4em] text-racing-red mb-4">
                        <ActivityIcon className="h-3 w-3 animate-pulse" />
                        Statut des Opérations
                    </div>
                    <h1 className="text-5xl md:text-7xl font-heading font-bold uppercase tracking-tighter text-chrome">
                        Console <span className="text-racing-red">Client</span>
                    </h1>
                    <div className="h-1 w-24 bg-racing-red mx-auto" />
                </motion.div>

                {appointments.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <Card className="bg-luxury-charcoal/50 border-white/5 glass-panel text-center py-24 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
                            <CardContent className="relative z-10">
                                <div className="w-20 h-20 bg-white/5 flex items-center justify-center mx-auto mb-8 border border-white/10 group-hover:border-racing-red/30 transition-colors">
                                    <KeyRoundIcon className="h-10 w-10 text-muted-foreground/40 group-hover:text-racing-red transition-colors" />
                                </div>
                                <h3 className="text-2xl font-heading font-bold text-white uppercase tracking-wider mb-4">Aucune Mission Active</h3>
                                <p className="text-muted-foreground max-w-md mx-auto mb-10 text-sm uppercase tracking-widest leading-loose">
                                    Votre journal d'intervention est vide. Nos unités sont prêtes pour votre prochain protocole de sécurité.
                                </p>
                                <Link href={appointmentsRoute.index().url}>
                                    <Button className="skewed-btn bg-racing-red text-white hover:bg-white hover:text-luxury-black h-16 px-12 transition-all">
                                        <span>Nouvelle Intervention</span>
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </motion.div>
                ) : (
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-6"
                    >
                        <div className="flex justify-between items-center mb-8 px-2">
                            <h2 className="text-[10px] font-heading font-bold uppercase tracking-[0.4em] text-muted-foreground">
                                Missions Récentes ({appointments.length})
                            </h2>
                            <Link href={appointmentsRoute.index().url} className="text-[10px] font-heading font-bold uppercase tracking-[0.4em] text-racing-red hover:text-white transition-colors flex items-center gap-2">
                                <PlusIcon className="h-3 w-3" /> Nouveau Protocole
                            </Link>
                        </div>

                        {appointments.map((appointment) => {
                            const date = new Date(appointment.start_at);
                            const endDate = new Date(appointment.end_at);
                            const status = getStatusStyles(appointment.status);
                            
                            return (
                                <motion.div key={appointment.id} variants={itemVariants}>
                                    <Card className="bg-luxury-charcoal/40 border-white/5 glass-panel relative overflow-hidden group hover:bg-luxury-charcoal/60 transition-all">
                                        <div className="absolute top-0 left-0 w-[2px] h-full bg-racing-red transform -translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                        <CardContent className="p-0">
                                            <div className="flex flex-col lg:flex-row">
                                                {/* Status Side */}
                                                <div className="lg:w-48 bg-luxury-black p-8 flex flex-col justify-center items-center border-b lg:border-b-0 lg:border-r border-white/5 text-center">
                                                    <div className={`w-12 h-12 flex items-center justify-center mb-4 transition-colors ${status.text}`}>
                                                        <ShieldCheckIcon className="h-6 w-6" />
                                                    </div>
                                                    <span className={`text-[9px] font-heading font-bold uppercase tracking-widest ${status.text}`}>
                                                        {status.label}
                                                    </span>
                                                </div>

                                                {/* Info Content */}
                                                <div className="flex-1 p-8 lg:p-10 space-y-6">
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-[10px] font-mono text-muted-foreground/60 tracking-widest">#{appointment.id.toString().padStart(6, '0')}</span>
                                                                <h3 className="text-xl font-heading font-bold text-white uppercase tracking-wider">{appointment.service.name}</h3>
                                                            </div>
                                                            <div className="flex flex-wrap gap-x-8 gap-y-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                                                                <div className="flex items-center gap-2">
                                                                    <CalendarIcon className="h-3.5 w-3.5 text-racing-red" />
                                                                    <span>{date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <ClockIcon className="h-3.5 w-3.5 text-racing-red" />
                                                                    <span>{date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <MapPinIcon className="h-3.5 w-3.5 text-racing-red" />
                                                                    <span>{appointment.team.name}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="flex items-center gap-3 self-end md:self-center">
                                                            <Link 
                                                                href={appointmentsRoute.show(appointment.id).url}
                                                                className="h-12 w-12 border border-white/5 flex items-center justify-center text-white hover:bg-racing-red hover:border-racing-red transition-all group/btn"
                                                            >
                                                                <ChevronRightIcon className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </div>
        </PublicLayout>
    );
}
