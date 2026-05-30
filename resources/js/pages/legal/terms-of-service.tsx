import PublicLayout from '@/layouts/public-layout';
import { Head } from '@inertiajs/react';

interface TermsOfServiceProps {
  content: string;
}

export default function TermsOfService({ content }: TermsOfServiceProps) {
  return (
    <PublicLayout>
      <Head title="Conditions Générales d'Utilisation" />
      
      <div className="py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] bg-grid-pattern pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="mb-16 border-l-4 border-racing-red pl-8">
            <h1 className="text-4xl md:text-5xl font-heading font-bold uppercase tracking-widest text-chrome mb-4">
              Conditions <span className="text-racing-red">Générales</span>
            </h1>
            <p className="text-muted-foreground uppercase tracking-[0.2em] text-sm">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>
          </div>

          <div 
            className="prose prose-invert prose-red max-w-none text-muted-foreground leading-relaxed
              prose-headings:font-heading prose-headings:uppercase prose-headings:tracking-wider prose-headings:text-white
              prose-a:text-racing-red prose-a:no-underline hover:prose-a:underline
              prose-strong:text-white prose-strong:font-bold"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </PublicLayout>
  );
}
