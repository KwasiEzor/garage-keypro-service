import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { FileTextIcon } from 'lucide-react';

interface DetailsStepProps {
    notes: string;
    onNotesChange: (notes: string) => void;
}

export default function DetailsStep({ notes, onNotesChange }: DetailsStepProps) {
    const maxLength = 500;
    const remainingChars = maxLength - notes.length;

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-heading font-bold uppercase tracking-tighter text-white mb-3">
                    Informations <span className="text-racing-red">Complémentaires</span>
                </h2>
                <p className="text-sm text-muted-foreground uppercase tracking-[0.15em]">
                    Partagez des détails sur votre véhicule (optionnel)
                </p>
            </div>

            <Card className="bg-luxury-charcoal border-white/5 max-w-2xl mx-auto">
                <CardContent className="p-6 md:p-8 space-y-4">
                    <div className="space-y-3">
                        <Label
                            htmlFor="notes"
                            className="text-[10px] font-heading font-bold uppercase tracking-[0.2em] text-muted-foreground pl-1"
                        >
                            Spécifications Véhicule
                        </Label>

                        <div className="relative">
                            <div className="absolute top-3 left-3 pointer-events-none">
                                <FileTextIcon className="h-5 w-5 text-racing-red/50" />
                            </div>

                            <Textarea
                                id="notes"
                                placeholder="Exemple: Mercedes Classe A 2019, clé perdue, besoin d'une copie urgente..."
                                value={notes}
                                onChange={(e) => onNotesChange(e.target.value)}
                                maxLength={maxLength}
                                rows={6}
                                className="bg-luxury-black border-white/10 text-white rounded-none focus:ring-racing-red focus:border-racing-red placeholder:text-muted-foreground/30 pl-10 resize-none"
                            />
                        </div>

                        <div className="flex justify-between items-center px-1">
                            <p className="text-xs text-muted-foreground">
                                Ces informations nous aideront à mieux préparer votre intervention
                            </p>
                            <p className={`text-xs font-mono ${remainingChars < 50 ? 'text-racing-red' : 'text-muted-foreground'}`}>
                                {remainingChars} / {maxLength}
                            </p>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 space-y-3">
                        <h4 className="text-xs font-heading font-bold uppercase tracking-[0.2em] text-white">
                            Informations utiles à partager:
                        </h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <span className="text-racing-red mt-0.5">•</span>
                                <span>Marque et modèle du véhicule</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-racing-red mt-0.5">•</span>
                                <span>Type de clé (télécommande, carte, etc.)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-racing-red mt-0.5">•</span>
                                <span>Problème rencontré ou service souhaité</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-racing-red mt-0.5">•</span>
                                <span>Urgence ou délai particulier</span>
                            </li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
