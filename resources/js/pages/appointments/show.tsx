import { Head, Link, router } from '@inertiajs/react';
import { 
    CalendarIcon, 
    MapPinIcon, 
    XIcon, 
    DownloadIcon, 
    ArrowLeftIcon, 
    UserIcon,
    ShieldCheckIcon,
    ClockIcon,
    KeyRoundIcon,
    WrenchIcon,
    ChevronRightIcon,
    FileTextIcon,
    PhoneIcon,
    MailIcon,
    ExternalLinkIcon,
    InfoIcon,
    AlertCircleIcon,
    CheckCircle2Icon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
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
    { key: 'pending', label: 'En attente', icon: ClockIcon, description: 'Analyse technique' },
    { key: 'confirmed', label: 'Confirmé', icon: ShieldCheckIcon, description: 'Protocole activé' },
    { key: 'completed', label: 'Terminé', icon: CheckCircle2Icon, description: 'Succès total' },
];

export default function AppointmentShow({ appointment }: Props) {
    const handleCancel = () => {
        if (confirm('Voulez-vous vraiment interrompre ce protocole d\'intervention ?')) {
            router.delete(appointments.cancel(appointment.id).url, {
                onSuccess: () => toast.success('Protocole interrompu avec succès.'),
            });
        }
    };

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'confirmed': return { label: 'Protocole Confirmé', color: 'bg-green-500', text: 'text-green-500', icon: ShieldCheckIcon };
            case 'pending': return { label: 'Analyse Technique', color: 'bg-yellow-500', text: 'text-yellow-500', icon: ClockIcon };
            case 'completed': return { label: 'Opération Terminée', color: 'bg-blue-500', text: 'text-blue-500', icon: CheckCircle2Icon };
            case 'cancelled': return { label: 'Protocole Interrompu', color: 'bg-racing-red', text: 'text-racing-red', icon: XIcon };
            case 'no_show': return { label: 'Client Absent', color: 'bg-gray-500', text: 'text-gray-500', icon: AlertCircleIcon };
            default: return { label: status, color: 'bg-gray-500', text: 'text-gray-500', icon: InfoIcon };
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
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
    };

    return (
        <PublicLayout>
            <Head title={`Protocole #${appointment.id} - ${appointment.service.name}`} />
            
            <div className="relative min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-racing-red/5 blur-[150px] rounded-full pointer-events-none -mr-96 -mt-96 animate-pulse" />
                
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-12"
                >
                    <div className="space-y-6">
                        <Link 
                            href={appointments.my().url} 
                            className="inline-flex items-center text-[10px] font-heading font-bold uppercase tracking-[0.4em] text-muted-foreground hover:text-racing-red transition-all group"
                        >
                            <ArrowLeftIcon className="h-3.5 w-3.5 mr-3 transition-transform group-hover:-translate-x-1" />
                            Accès Console
                        </Link>
                        <div className="space-y-2">
                            <h1 className="text-5xl md:text-7xl font-heading font-bold uppercase tracking-tighter text-chrome leading-none">
                                Mission <span className="text-racing-red">#{appointment.id}</span>
                            </h1>
                            <p className="text-[11px] font-heading font-bold uppercase tracking-[0.5em] text-muted-foreground flex items-center gap-3">
                                <span className="w-12 h-[1px] bg-racing-red" />
                                {appointment.service.name}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col items-start md:items-end gap-4">
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${statusInfo.color} animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]`} />
                            <span className={`text-[12px] font-heading font-bold uppercase tracking-[0.2em] ${statusInfo.text}`}>
                                {statusInfo.label}
                            </span>
                        </div>
                        <div className="bg-luxury-charcoal border border-white/5 px-6 py-3 flex items-center gap-4">
                            <span className="text-[9px] font-heading font-bold uppercase tracking-[0.3em] text-muted-foreground">Auth Token</span>
                            <span className="text-[11px] font-mono font-bold text-white tracking-widest">
                                KP-{appointment.id.toString().padStart(6, '0')}-{new Date(appointment.created_at || '').getTime().toString().slice(-4)}
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Main Dashboard Grid */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 lg:grid-cols-12 gap-10"
                >
                    {/* Left Column: Mission Details */}
                    <div className="lg:col-span-8 space-y-10">
                        {/* Timeline Status */}
                        <motion.div variants={itemVariants} className="bg-luxury-black/40 border border-white/5 p-10 glass-panel relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-[0.03] pointer-events-none" />
                            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
                                {statusSteps.map((step, index) => {
                                    const isPast = ['pending', 'confirmed', 'completed', 'cancelled'].indexOf(appointment.status) >= ['pending', 'confirmed', 'completed'].indexOf(step.key);
                                    const isActive = appointment.status === step.key;
                                    const isCancelled = appointment.status === 'cancelled' && index === 1;

                                    return (
                                        <div key={step.key} className="relative flex flex-col items-center md:items-start text-center md:text-left gap-4 group">
                                            <div className={`w-14 h-14 flex items-center justify-center transition-all duration-700 ${
                                                isCancelled ? 'bg-racing-red text-white' : 
                                                isActive ? 'bg-racing-red text-white shadow-[0_0_30px_rgba(239,68,68,0.3)] scale-110' : 
                                                isPast ? 'bg-white text-luxury-black' : 'bg-white/5 text-muted-foreground border border-white/10'
                                            }`}>
                                                <step.icon className="h-6 w-6" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className={`text-[10px] font-heading font-bold uppercase tracking-[0.2em] ${isActive || isCancelled ? 'text-white' : 'text-muted-foreground'}`}>
                                                    {step.label}
                                                </p>
                                                <p className="text-[9px] font-medium text-muted-foreground/60 uppercase tracking-widest">{step.description}</p>
                                            </div>
                                            
                                            {index < statusSteps.length - 1 && (
                                                <div className="hidden md:block absolute top-7 left-14 w-full h-[1px] bg-white/5 -z-10">
                                                    <div className={`h-full bg-racing-red/50 transition-all duration-1000 origin-left ${isPast && !isActive ? 'w-full' : 'w-0'}`} />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>

                        {/* Mission Specs Card */}
                        <motion.div variants={itemVariants}>
                            <Card className="bg-luxury-charcoal border-white/5 overflow-hidden glass-panel group border-l-4 border-l-racing-red">
                                <CardContent className="p-0">
                                    <div className="grid grid-cols-1 md:grid-cols-2">
                                        <div className="p-10 space-y-8 border-r border-white/5">
                                            <div className="space-y-2">
                                                <h3 className="text-[10px] font-heading font-bold uppercase tracking-[0.4em] text-racing-red flex items-center gap-2">
                                                    <WrenchIcon className="h-3 w-3" /> Paramètres d'Intervention
                                                </h3>
                                                <p className="text-2xl font-heading font-bold text-white uppercase tracking-wider">{appointment.service.name}</p>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 gap-6">
                                                <div className="flex items-start gap-4 p-4 bg-luxury-black/50 border border-white/5">
                                                    <CalendarIcon className="h-5 w-5 text-racing-red mt-1" />
                                                    <div>
                                                        <p className="text-[9px] font-heading font-bold uppercase tracking-[0.3em] text-muted-foreground mb-1">Date d'Opération</p>
                                                        <p className="text-sm font-bold text-white uppercase">{date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-4 p-4 bg-luxury-black/50 border border-white/5">
                                                    <ClockIcon className="h-5 w-5 text-racing-red mt-1" />
                                                    <div>
                                                        <p className="text-[9px] font-heading font-bold uppercase tracking-[0.3em] text-muted-foreground mb-1">Fenêtre Temporelle</p>
                                                        <p className="text-sm font-bold text-white uppercase">
                                                            {date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - {endDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-10 space-y-8 bg-luxury-black/30">
                                            <div className="space-y-6">
                                                <div className="space-y-2">
                                                    <h3 className="text-[10px] font-heading font-bold uppercase tracking-[0.4em] text-muted-foreground">Localisation</h3>
                                                    <div className="flex items-center gap-3">
                                                        <MapPinIcon className="h-5 w-5 text-racing-red" />
                                                        <p className="text-lg font-bold text-white uppercase tracking-wider">{appointment.team.name}</p>
                                                    </div>
                                                    <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest pl-8">Garage Partenaire Certifié KeyPro</p>
                                                </div>

                                                <Separator className="bg-white/5" />

                                                <div className="space-y-2">
                                                    <h3 className="text-[10px] font-heading font-bold uppercase tracking-[0.4em] text-muted-foreground">Durée de Mission</h3>
                                                    <div className="flex items-center gap-3">
                                                        <ClockIcon className="h-5 w-5 text-racing-red" />
                                                        <p className="text-lg font-bold text-white uppercase tracking-wider">{appointment.service.estimated_duration} Minutes</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Technical Log */}
                        {appointment.notes && (
                            <motion.div variants={itemVariants} className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h4 className="flex items-center gap-3 text-[11px] font-heading font-bold uppercase tracking-[0.5em] text-white">
                                        <FileTextIcon className="h-4 w-4 text-racing-red" />
                                        Spécifications Véhicule
                                    </h4>
                                    <Badge variant="outline" className="border-racing-red/20 text-racing-red text-[8px] uppercase tracking-[0.3em] font-bold">Secret Technique</Badge>
                                </div>
                                <div className="bg-luxury-black border border-white/5 p-10 relative group overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                                        <KeyRoundIcon className="h-32 w-32" />
                                    </div>
                                    <div className="relative z-10">
                                        <div className="font-mono text-sm text-white/70 leading-relaxed whitespace-pre-wrap border-l-4 border-racing-red pl-8 py-4 bg-white/[0.02]">
                                            {appointment.notes}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Incident Report */}
                        <AnimatePresence>
                            {appointment.status === 'cancelled' && appointment.cancellation_reason && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-6"
                                >
                                    <h4 className="flex items-center gap-3 text-[11px] font-heading font-bold uppercase tracking-[0.5em] text-racing-red">
                                        <AlertCircleIcon className="h-4 w-4" /> 
                                        Rapport d'Interruption
                                    </h4>
                                    <div className="bg-red-900/5 border border-red-900/20 p-10 relative overflow-hidden group">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-red-600/50" />
                                        <p className="text-[10px] font-heading font-bold uppercase tracking-[0.3em] text-red-600 mb-4">Motif de l'arrêt du protocole</p>
                                        <p className="text-white/80 text-sm leading-relaxed font-medium italic">"{appointment.cancellation_reason}"</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right Column: Profile & Actions */}
                    <div className="lg:col-span-4 space-y-10">
                        {/* Client Card */}
                        <motion.div variants={itemVariants}>
                            <div className="bg-luxury-charcoal border border-white/5 glass-panel relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-racing-red/5 rounded-full -mr-24 -mt-24 group-hover:scale-125 transition-transform duration-1000" />
                                <div className="p-10 space-y-8">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-[10px] font-heading font-bold uppercase tracking-[0.4em] text-muted-foreground">Passport Client</h4>
                                        <UserIcon className="h-3.5 w-3.5 text-racing-red" />
                                    </div>
                                    
                                    <div className="flex flex-col items-center text-center space-y-4">
                                        <div className="w-24 h-24 bg-white relative group">
                                            <div className="absolute inset-0 bg-racing-red/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <span className="absolute inset-0 flex items-center justify-center text-luxury-black text-4xl font-heading font-bold">
                                                {appointment.user.name.charAt(0)}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-xl font-heading font-bold text-white uppercase tracking-wider leading-tight">{appointment.user.name}</p>
                                            <p className="text-[9px] font-bold text-racing-red uppercase tracking-[0.4em] mt-2">Accréditation Elite</p>
                                        </div>
                                    </div>

                                    <div className="space-y-5 pt-4">
                                        <div className="flex items-center gap-4 text-sm group/item cursor-pointer">
                                            <div className="w-10 h-10 border border-white/5 flex items-center justify-center group-hover/item:border-racing-red transition-colors">
                                                <MailIcon className="h-4 w-4 text-racing-red" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[8px] font-heading font-bold uppercase tracking-[0.3em] text-muted-foreground">Email</span>
                                                <span className="text-white font-medium">{appointment.user.email}</span>
                                            </div>
                                        </div>
                                        {appointment.user.phone && (
                                            <div className="flex items-center gap-4 text-sm group/item cursor-pointer">
                                                <div className="w-10 h-10 border border-white/5 flex items-center justify-center group-hover/item:border-racing-red transition-colors">
                                                    <PhoneIcon className="h-4 w-4 text-racing-red" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[8px] font-heading font-bold uppercase tracking-[0.3em] text-muted-foreground">Communication</span>
                                                    <span className="text-white font-medium">{appointment.user.phone}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <Link href="/settings/profile" className="block w-full">
                                        <Button variant="outline" className="w-full rounded-none border-white/10 hover:border-racing-red hover:bg-racing-red/5 text-[10px] font-bold uppercase tracking-[0.3em] h-14 transition-all group">
                                            Dossier Client <ChevronRightIcon className="h-3 w-3 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>

                        {/* Protocol Actions */}
                        <motion.div variants={itemVariants} className="space-y-6">
                            <h4 className="text-[11px] font-heading font-bold uppercase tracking-[0.5em] text-white pl-2 border-l-2 border-racing-red">Console d'Actions</h4>
                            <div className="space-y-4">
                                {appointment.status === 'confirmed' && (
                                    <>
                                        <motion.a 
                                            whileHover={{ scale: 1.02 }}
                                            href={appointments.calendar(appointment.id).url} 
                                            className="block group"
                                        >
                                            <div className="flex items-center justify-between p-6 bg-luxury-black border border-white/5 hover:border-racing-red transition-all shadow-md">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-12 h-12 bg-white/5 flex items-center justify-center group-hover:bg-racing-red/10 transition-colors">
                                                        <DownloadIcon className="h-5 w-5 text-racing-red" />
                                                    </div>
                                                    <div>
                                                        <span className="block text-[10px] font-heading font-bold uppercase tracking-[0.2em] text-white">Sync Calendrier</span>
                                                        <span className="text-[8px] text-muted-foreground uppercase tracking-widest mt-1">Format Universel .ics</span>
                                                    </div>
                                                </div>
                                                <ChevronRightIcon className="h-4 w-4 text-muted-foreground group-hover:text-racing-red" />
                                            </div>
                                        </motion.a>

                                        <motion.a 
                                            whileHover={{ scale: 1.02 }}
                                            href={appointments.reschedule(appointment.id).url} 
                                            className="block group"
                                        >
                                            <div className="flex items-center justify-between p-6 bg-luxury-black border border-white/5 hover:border-racing-red transition-all shadow-md">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-12 h-12 bg-white/5 flex items-center justify-center group-hover:bg-racing-red/10 transition-colors">
                                                        <CalendarIcon className="h-5 w-5 text-racing-red" />
                                                    </div>
                                                    <div>
                                                        <span className="block text-[10px] font-heading font-bold uppercase tracking-[0.2em] text-white">Reprogrammer</span>
                                                        <span className="text-[8px] text-muted-foreground uppercase tracking-widest mt-1">Modifier l'horaire</span>
                                                    </div>
                                                </div>
                                                <ChevronRightIcon className="h-4 w-4 text-muted-foreground group-hover:text-racing-red" />
                                            </div>
                                        </motion.a>

                                        <motion.button 
                                            whileHover={{ scale: 1.02 }}
                                            onClick={handleCancel}
                                            className="w-full text-left group"
                                        >
                                            <div className="flex items-center justify-between p-6 bg-red-900/10 border border-red-900/20 hover:border-red-600 transition-all shadow-md">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-12 h-12 bg-red-600/10 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all">
                                                        <XIcon className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <span className="block text-[10px] font-heading font-bold uppercase tracking-[0.2em] text-red-600">Interrompre</span>
                                                        <span className="text-[8px] text-red-600/60 uppercase tracking-widest mt-1">Annulation Irréversible</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.button>
                                    </>
                                )}

                                {appointment.status === 'completed' && (
                                    <div className="p-10 bg-green-900/5 border border-green-900/20 text-center space-y-6">
                                        <div className="relative inline-block">
                                            <ShieldCheckIcon className="h-16 w-16 text-green-500 mx-auto" />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[12px] font-heading font-bold uppercase tracking-[0.3em] text-white">Opération Terminée</p>
                                            <p className="text-[9px] text-muted-foreground uppercase tracking-widest leading-relaxed">Le protocole technique a été exécuté avec succès.</p>
                                        </div>
                                        <Link href="/dashboard/invoices" className="block w-full">
                                            <Button className="w-full bg-green-600 hover:bg-green-500 rounded-none h-14 text-[10px] font-bold uppercase tracking-[0.4em] transition-all">
                                                Consulter les Factures
                                            </Button>
                                        </Link>
                                    </div>
                                )}

                                {(appointment.status === 'cancelled' || appointment.status === 'pending') && (
                                    <div className="p-10 bg-luxury-charcoal/50 border border-white/5 text-center space-y-8 glass-panel">
                                        <div className="space-y-3">
                                            <p className="text-[11px] font-heading font-bold uppercase tracking-[0.3em] text-white">
                                                {appointment.status === 'cancelled' ? 'Dossier Archive' : 'Analyse en cours'}
                                            </p>
                                            <p className="text-[9px] text-muted-foreground uppercase tracking-widest leading-relaxed">
                                                {appointment.status === 'cancelled' 
                                                    ? 'Cette mission a été classée suite à son interruption.' 
                                                    : 'Nos ingénieurs valident actuellement les spécifications techniques.'}
                                            </p>
                                        </div>
                                        <Link 
                                            href="/services" 
                                            className="w-full flex items-center justify-center bg-racing-red py-4 text-[10px] font-bold text-white uppercase tracking-[0.4em] hover:bg-white hover:text-luxury-black transition-all"
                                        >
                                            Nouvelle Mission <ExternalLinkIcon className="h-3 w-3 ml-3" />
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Support Note */}
                        <motion.div variants={itemVariants} className="p-8 border border-white/5 bg-luxury-black/30">
                            <p className="text-[9px] text-muted-foreground uppercase tracking-[0.3em] leading-relaxed text-center">
                                Pour toute assistance technique prioritaire, contactez notre centre opérationnel 24/7.
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </PublicLayout>
    );
}
