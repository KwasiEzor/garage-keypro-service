import { FileTextIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface DetailsStepProps {
    notes: string;
    onNotesChange: (notes: string) => void;
}

export default function DetailsStep({
    notes,
    onNotesChange,
}: DetailsStepProps) {
    const maxLength = 500;
    const remainingChars = maxLength - notes.length;

    return (
        <div className="space-y-6">
            <div className="mb-8 text-center">
                <h2 className="mb-3 font-heading text-2xl font-bold tracking-tighter text-white uppercase md:text-3xl">
                    Informations{' '}
                    <span className="text-racing-red">Complémentaires</span>
                </h2>
                <p className="text-sm tracking-[0.15em] text-muted-foreground uppercase">
                    Partagez des détails sur votre véhicule (optionnel)
                </p>
            </div>

            <Card className="mx-auto max-w-2xl border-white/5 bg-luxury-charcoal">
                <CardContent className="space-y-4 p-6 md:p-8">
                    <div className="space-y-3">
                        <Label
                            htmlFor="notes"
                            className="pl-1 font-heading text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase"
                        >
                            Spécifications Véhicule
                        </Label>

                        <div className="relative">
                            <div className="pointer-events-none absolute top-3 left-3">
                                <FileTextIcon className="h-5 w-5 text-racing-red/50" />
                            </div>

                            <Textarea
                                id="notes"
                                placeholder="Exemple: Mercedes Classe A 2019, clé perdue, besoin d'une copie urgente..."
                                value={notes}
                                onChange={(e) => onNotesChange(e.target.value)}
                                maxLength={maxLength}
                                rows={6}
                                className="resize-none rounded-none border-white/10 bg-luxury-black pl-10 text-white placeholder:text-muted-foreground/30 focus:border-racing-red focus:ring-racing-red"
                            />
                        </div>

                        <div className="flex items-center justify-between px-1">
                            <p className="text-xs text-muted-foreground">
                                Ces informations nous aideront à mieux préparer
                                votre intervention
                            </p>
                            <p
                                className={`font-mono text-xs ${remainingChars < 50 ? 'text-racing-red' : 'text-muted-foreground'}`}
                            >
                                {remainingChars} / {maxLength}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3 border-t border-white/5 pt-4">
                        <h4 className="font-heading text-xs font-bold tracking-[0.2em] text-white uppercase">
                            Informations utiles à partager:
                        </h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <span className="mt-0.5 text-racing-red">
                                    •
                                </span>
                                <span>Marque et modèle du véhicule</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-0.5 text-racing-red">
                                    •
                                </span>
                                <span>
                                    Type de clé (télécommande, carte, etc.)
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-0.5 text-racing-red">
                                    •
                                </span>
                                <span>
                                    Problème rencontré ou service souhaité
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-0.5 text-racing-red">
                                    •
                                </span>
                                <span>Urgence ou délai particulier</span>
                            </li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
