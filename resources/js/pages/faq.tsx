import PublicLayout from '@/layouts/public-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible } from '@/components/ui/collapsible';
import { LeadForm } from '@/components/brand/lead-form';

interface FaqProps {
  faqs: Record<string, any[]>;
}

export default function Faq({ faqs }: FaqProps) {
  const categoryNames: Record<string, string> = {
    general: 'Questions Générales',
    pricing: 'Tarifs',
    technical: 'Questions Techniques',
    emergency: 'Urgences',
  };

  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Questions Fréquentes</h1>
          <p className="text-lg text-muted-foreground">
            Trouvez rapidement des réponses à vos questions
          </p>
        </div>

        <div className="space-y-8">
          {Object.entries(faqs).map(([category, questions]) => (
            <div key={category}>
              <h2 className="text-2xl font-bold mb-4">
                {categoryNames[category] || category}
              </h2>
              <div className="space-y-4">
                {questions.map((faq: any) => (
                  <Card key={faq.id}>
                    <Collapsible>
                      <CardHeader className="cursor-pointer">
                        <CardTitle className="text-lg">{faq.question}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="leading-relaxed text-muted-foreground">
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

        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Vous ne trouvez pas votre réponse ?</h2>
            <p className="text-muted-foreground">Contactez-nous directement</p>
          </div>
          <LeadForm title="Poser une question" />
        </div>
      </div>
    </PublicLayout>
  );
}
