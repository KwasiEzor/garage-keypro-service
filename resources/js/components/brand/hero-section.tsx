import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  ctaPrimary?: { text: string; href: string };
  ctaSecondary?: { text: string; href: string };
}

export function HeroSection({ title, subtitle, ctaPrimary, ctaSecondary }: HeroSectionProps) {
  return (
    <div className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-20 px-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJWMzRoLTJ6bTAtNGgydjJoLTJ2LTJ6bTAtNGgydjJoLTJ2LTJ6bTAtNGgydjJoLTJ2LTJ6bTQgMTJoMnYyaC0ydi0yem00LTR2Mmgydi0yaC0yem00LTR2Mmgydi0yaC0yem00LTR2Mmgydi0yaC0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-10" />
      <div className="relative max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90">
            {subtitle}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-4">
          {ctaPrimary && (
            <Button asChild size="lg" variant="secondary">
              <a href={ctaPrimary.href}>{ctaPrimary.text}</a>
            </Button>
          )}
          {ctaSecondary && (
            <Button asChild size="lg" variant="outline" className="bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20">
              <a href={ctaSecondary.href}>
                <Icon name="Phone" className="mr-2 h-5 w-5" />
                {ctaSecondary.text}
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
