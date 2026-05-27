import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const navigation = [
    { name: 'Services', href: '/services' },
    { name: 'Marques', href: '/brands' },
    { name: 'FAQ', href: '/faq' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-background border-b">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <Icon name="KeyRound" className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">GarageKeyPro</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  {item.name}
                </Link>
              ))}
              <Button asChild>
                <Link href="#contact">Demander un devis</Link>
              </Button>
            </div>

            <button className="md:hidden">
              <Icon name="Menu" className="h-6 w-6" />
            </button>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-muted border-t mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Icon name="KeyRound" className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">GarageKeyPro</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Service professionnel de programmation de clés, duplication et assistance routière.
                Intervention rapide 24/7.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Liens rapides</h3>
              <ul className="space-y-2 text-sm">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-muted-foreground hover:text-primary">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Icon name="Phone" className="h-4 w-4" />
                  <span>+33 1 23 45 67 89</span>
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Mail" className="h-4 w-4" />
                  <span>contact@garagekeypro.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} GarageKeyPro. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
