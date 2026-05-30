import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
        <div className="max-w-4xl mx-auto space-y-8 p-4 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Invoice</h1>
                    <p className="text-muted-foreground mt-1">#{invoice.number}</p>
                </div>
                <div className="text-right">
                    <Badge variant={invoice.status === 'paid' ? 'default' : 'outline'} className="text-sm px-3 py-1">
                        {invoice.status.toUpperCase()}
                    </Badge>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase">From</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="font-bold text-lg">{invoice.team.name}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Bill To</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="font-bold text-lg">{invoice.client.name}</p>
                        <p className="text-muted-foreground">{invoice.client.email}</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                    <p className="text-sm text-muted-foreground uppercase font-medium">Issue Date</p>
                    <p className="font-medium">{format(new Date(invoice.issue_date), 'MMM d, yyyy')}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground uppercase font-medium">Due Date</p>
                    <p className="font-medium">{format(new Date(invoice.due_date), 'MMM d, yyyy')}</p>
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-muted/50 border-b">
                                <th className="px-6 py-4 text-left font-medium">Description</th>
                                <th className="px-6 py-4 text-center font-medium w-24">Qty</th>
                                <th className="px-6 py-4 text-right font-medium w-32">Price</th>
                                <th className="px-6 py-4 text-right font-medium w-32">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.items.map((item) => (
                                <tr key={item.id} className="border-b last:border-0">
                                    <td className="px-6 py-4">
                                        <p className="font-medium">{item.description}</p>
                                        {item.service && (
                                            <p className="text-xs text-muted-foreground">{item.service.name}</p>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm">{item.quantity}</td>
                                    <td className="px-6 py-4 text-right text-sm">
                                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: invoice.currency }).format(item.unit_price)}
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium">
                                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: invoice.currency }).format(item.total_price)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            <div className="flex flex-col md:flex-row justify-between gap-8">
                <div className="flex-1 max-w-md">
                    {invoice.notes && (
                        <>
                            <p className="text-sm font-medium text-muted-foreground uppercase mb-2">Notes</p>
                            <p className="text-sm whitespace-pre-wrap text-muted-foreground border p-4 rounded-lg bg-muted/30 italic">
                                "{invoice.notes}"
                            </p>
                        </>
                    )}
                </div>
                <div className="w-full md:w-64 space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: invoice.currency }).format(invoice.subtotal)}</span>
                    </div>
                    {parseFloat(invoice.tax_total.toString()) > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Tax</span>
                            <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: invoice.currency }).format(invoice.tax_total)}</span>
                        </div>
                    )}
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: invoice.currency }).format(invoice.total_amount)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
