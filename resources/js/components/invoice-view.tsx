import { format } from 'date-fns';
import {
    FileTextIcon,
    DownloadIcon,
    PrinterIcon,
    ShieldCheckIcon,
    UserIcon,
    WalletIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface InvoiceItem {
    id: number;
    description: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    service?: {
        name: string;
    };
}

interface Invoice {
    id: number;
    uuid: string;
    number: string;
    issue_date: string;
    due_date: string;
    status: string;
    subtotal: number;
    tax_total: number;
    total_amount: number;
    currency: string;
    notes: string | null;
    team: {
        name: string;
    };
    client: {
        name: string;
        email: string;
    };
    items: InvoiceItem[];
}

export default function InvoiceView({ invoice }: { invoice: Invoice }) {
    return (
        <div className="mx-auto max-w-5xl space-y-10 px-4 py-6 md:px-0">
            {/* Header Technical Banner */}
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                <div>
                    <div className="mb-2 flex items-center gap-3">
                        <div className="h-6 w-[3px] bg-racing-red" />
                        <h1 className="font-heading text-xl font-bold tracking-[0.3em] text-white uppercase">
                            Protocole de Facturation
                        </h1>
                    </div>
                    <p className="font-mono text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                        ID: {invoice.uuid}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Badge
                        className={`rounded-none border-none px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] uppercase ${
                            invoice.status === 'paid'
                                ? 'bg-green-500/10 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.1)]'
                                : 'bg-racing-red/10 text-racing-red shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                        }`}
                    >
                        {invoice.status === 'paid'
                            ? 'Acquitté'
                            : 'Action Requise'}
                    </Badge>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-10 w-10 rounded-none border-white/10 p-0 hover:bg-white/5"
                        >
                            <PrinterIcon className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-10 w-10 rounded-none border-white/10 p-0 hover:bg-white/5"
                        >
                            <DownloadIcon className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Core Data Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Technical Info */}
                <div className="space-y-6 lg:col-span-2">
                    <Card className="relative overflow-hidden rounded-none border-white/5 bg-luxury-charcoal/30">
                        <div className="absolute top-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-racing-red/30 to-transparent" />
                        <CardContent className="p-8">
                            <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
                                {/* From */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-racing-red">
                                        <ShieldCheckIcon className="h-3.5 w-3.5" />
                                        <span className="text-[9px] font-bold tracking-[0.2em] uppercase">
                                            Unité d'Intervention
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="font-heading text-lg font-bold tracking-tight text-white uppercase">
                                            {invoice.team.name}
                                        </h3>
                                        <p className="mt-1 text-[10px] tracking-widest text-muted-foreground uppercase">
                                            Centre Technique Agréé KEYPRO
                                        </p>
                                    </div>
                                </div>

                                {/* To */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-racing-red">
                                        <UserIcon className="h-3.5 w-3.5" />
                                        <span className="text-[9px] font-bold tracking-[0.2em] uppercase">
                                            Destinataire du Rapport
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="font-heading text-lg font-bold tracking-tight text-white uppercase">
                                            {invoice.client.name}
                                        </h3>
                                        <p className="mt-1 font-mono text-[10px] text-muted-foreground lowercase">
                                            {invoice.client.email}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Timeline Data */}
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        <div className="space-y-1 border border-white/5 bg-luxury-black p-4">
                            <p className="text-[8px] font-bold tracking-widest text-muted-foreground uppercase">
                                N° Facture
                            </p>
                            <p className="font-mono text-xs font-bold text-white">
                                {invoice.number}
                            </p>
                        </div>
                        <div className="space-y-1 border border-white/5 bg-luxury-black p-4">
                            <p className="text-[8px] font-bold tracking-widest text-muted-foreground uppercase">
                                Date d'Émission
                            </p>
                            <p className="text-xs font-bold text-white uppercase">
                                {format(
                                    new Date(invoice.issue_date),
                                    'dd MMM yyyy',
                                )}
                            </p>
                        </div>
                        <div className="space-y-1 border border-white/5 bg-luxury-black p-4">
                            <p className="text-[8px] font-bold tracking-widest text-muted-foreground uppercase">
                                Échéance
                            </p>
                            <p className="text-xs font-bold text-white uppercase">
                                {format(
                                    new Date(invoice.due_date),
                                    'dd MMM yyyy',
                                )}
                            </p>
                        </div>
                        <div className="space-y-1 border border-white/5 bg-luxury-black p-4">
                            <p className="text-[8px] font-bold tracking-widest text-muted-foreground uppercase">
                                Devise
                            </p>
                            <p className="text-xs font-bold text-racing-red uppercase">
                                {invoice.currency}
                            </p>
                        </div>
                    </div>

                    {/* Technical Specification Table */}
                    <Card className="overflow-hidden rounded-none border-white/5 bg-luxury-black">
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse text-left">
                                    <thead>
                                        <tr className="border-b border-white/5 bg-luxury-charcoal">
                                            <th className="p-6 font-heading text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Désignation Technique
                                            </th>
                                            <th className="p-6 text-center font-heading text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Quantité
                                            </th>
                                            <th className="p-6 text-right font-heading text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Unit. H.T.
                                            </th>
                                            <th className="p-6 text-right font-heading text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Total H.T.
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoice.items.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="group border-b border-white/5 transition-colors hover:bg-white/5"
                                            >
                                                <td className="p-6">
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-bold text-white uppercase transition-colors group-hover:text-racing-red">
                                                            {item.description}
                                                        </p>
                                                        {item.service && (
                                                            <p className="text-[10px] tracking-wider text-muted-foreground uppercase italic">
                                                                {
                                                                    item.service
                                                                        .name
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-6 text-center font-mono text-sm text-white/80">
                                                    {item.quantity}
                                                </td>
                                                <td className="p-6 text-right font-mono text-sm text-white/80">
                                                    {new Intl.NumberFormat(
                                                        'fr-FR',
                                                        {
                                                            style: 'currency',
                                                            currency:
                                                                invoice.currency,
                                                        },
                                                    ).format(item.unit_price)}
                                                </td>
                                                <td className="p-6 text-right font-mono text-sm font-bold text-white">
                                                    {new Intl.NumberFormat(
                                                        'fr-FR',
                                                        {
                                                            style: 'currency',
                                                            currency:
                                                                invoice.currency,
                                                        },
                                                    ).format(item.total_price)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Technical Notes */}
                    {invoice.notes && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <FileTextIcon className="h-3.5 w-3.5" />
                                <span className="text-[9px] font-bold tracking-[0.2em] uppercase">
                                    Observations Techniques
                                </span>
                            </div>
                            <div className="rounded-none border border-white/5 bg-luxury-charcoal/20 p-6">
                                <p className="text-sm leading-relaxed text-white/70 italic">
                                    "{invoice.notes}"
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Financial Summary */}
                <div className="space-y-6">
                    <Card className="sticky top-32 overflow-hidden rounded-none border-white/10 bg-luxury-black">
                        <div className="flex items-center justify-between bg-racing-red p-4">
                            <h3 className="font-heading text-[10px] font-bold tracking-[0.2em] text-white uppercase">
                                Récapitulatif Financier
                            </h3>
                            <WalletIcon className="h-4 w-4 text-white/50" />
                        </div>
                        <CardContent className="space-y-6 p-8">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                                    <span>Total Hors Taxes</span>
                                    <span className="font-mono text-white">
                                        {new Intl.NumberFormat('fr-FR', {
                                            style: 'currency',
                                            currency: invoice.currency,
                                        }).format(invoice.subtotal)}
                                    </span>
                                </div>
                                {parseFloat(invoice.tax_total.toString()) >
                                    0 && (
                                    <div className="flex items-center justify-between text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                                        <span>Taxes (TVA)</span>
                                        <span className="font-mono text-white">
                                            {new Intl.NumberFormat('fr-FR', {
                                                style: 'currency',
                                                currency: invoice.currency,
                                            }).format(invoice.tax_total)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <Separator className="bg-white/10" />

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-heading text-[10px] font-bold tracking-[0.2em] text-white uppercase">
                                        Montant T.T.C.
                                    </span>
                                    <span className="font-heading text-3xl font-bold tracking-tighter text-racing-red">
                                        {new Intl.NumberFormat('fr-FR', {
                                            style: 'currency',
                                            currency: invoice.currency,
                                        }).format(invoice.total_amount)}
                                    </span>
                                </div>
                                <p className="text-right text-[8px] tracking-widest text-muted-foreground uppercase">
                                    Payable via protocoles sécurisés uniquement
                                </p>
                            </div>

                            {invoice.status !== 'paid' && (
                                <Button className="mt-6 h-14 w-full rounded-none bg-white font-heading font-bold tracking-[0.2em] text-luxury-black uppercase shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all hover:bg-racing-red hover:text-white">
                                    Régler le Dossier
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    {/* Security Badge */}
                    <div className="flex items-start gap-4 border border-white/5 bg-luxury-charcoal/30 p-6">
                        <ShieldCheckIcon className="h-5 w-5 shrink-0 text-racing-red" />
                        <p className="text-[9px] leading-relaxed tracking-wider text-muted-foreground uppercase">
                            Ce document technique fait office de preuve
                            d'intervention certifiée par KEYPRO. Conservez-le
                            précieusement pour votre garantie constructeur.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
