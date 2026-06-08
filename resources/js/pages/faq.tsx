import { LeadForm } from '@/components/brand/lead-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible } from '@/components/ui/collapsible';
import PublicLayout from '@/layouts/public-layout';

interface FaqProps {
  faqs: Record<string, any[]>;
}

export default function Faq({ faqs }: FaqProps) {
  const faqsData = faqs && typeof faqs === 'object' && !Array.isArray(faqs) ? faqs : {};

  const categoryNames: Record<string, string> = {
    general: 'Questions Générales',
    pricing: 'Investissement & Tarification',
    technical: 'Spécifications Techniques',
    emergency: 'Réponse Prioritaire',
  };

  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center mb-24 animate-in fade-in slide-in-from-bottom duration-1000">
          <span className="text-[11px] font-heading font-bold uppercase tracking-[0.4em] text-racing-red mb-4 block">Centre d'Information Tactique</span>
          <h1 className="text-4xl md:text-7xl font-heading font-bold uppercase tracking-tighter text-white mb-8">Questions Fréquentes</h1>
          <div className="h-[2px] w-24 bg-racing-red mx-auto" />
        </div>

        <div className="space-y-24">
          {Object.entries(faqsData).map(([category, questions]) => (
            <div key={category} className="animate-in fade-in slide-in-from-bottom duration-1000">
              <h2 className="text-[11px] font-heading font-bold uppercase tracking-[0.3em] text-white mb-10 flex items-center gap-6">
                <span className="w-12 h-[2px] bg-racing-red" />
                {categoryNames[category] || category}
              </h2>
              <div className="space-y-6">
                {questions.map((faq: any) => (
                  <Card key={faq.id} className="bg-luxury-charcoal border-white/5 hover:border-racing-red/30 transition-all duration-500 rounded-none overflow-hidden relative group">
                    <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-racing-red transition-all duration-500" />
                    <Collapsible>
                      <CardHeader className="cursor-pointer group p-8">
                        <CardTitle className="text-sm font-heading font-bold uppercase tracking-widest text-white group-hover:text-racing-red transition-all flex items-center justify-between">
                          <span>{faq.question}</span>
                          <div className="w-6 h-6 border border-white/10 flex items-center justify-center text-[10px] group-hover:border-racing-red/50 transition-colors">
                            +
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-8 pb-8 pt-0">
                        <p className="text-sm leading-relaxed text-muted-foreground tracking-wide border-t border-white/5 pt-6 font-medium">
                          {faq.answer}
                        </p>
                      </CardContent>
                    </Collapsible>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div id="contact" className="mt-40 pt-32 border-t border-white/5">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold uppercase tracking-tighter text-white mb-6">Besoin d'Assistance Supplémentaire ?</h2>
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-bold">Connectez-vous avec nos consultants techniques</p>
          </div>
          <div className="max-w-2xl mx-auto bg-luxury-charcoal/50 p-10 border border-white/5">
            <LeadForm title="Demande Directe" />
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
