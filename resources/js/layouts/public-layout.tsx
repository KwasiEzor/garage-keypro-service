import { Link, Head } from '@inertiajs/react';
import * as Inertia from '@inertiajs/react';
import { LayoutGrid, Calendar, Receipt, User, LogOut } from 'lucide-react';
import { lazy, Suspense, useState } from 'react';
import { CookieConsent } from '@/components/cookie-consent';

// Lazy load GSAP-dependent components for better performance
const BackgroundSpotlight = lazy(
    () => import('@/components/background-spotlight'),
);
import { FlashMessages } from '@/components/flash-messages';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icon } from '@/components/ui/icon';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { WhatsAppButton } from '@/components/ui/whatsapp-button';
import { UserMenu } from '@/components/user-menu';
import { dashboard } from '@/routes';

interface PublicLayoutProps {
    children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { settings, auth } = Inertia.usePage().props as any;

    const siteName = settings?.site_name || 'KEYPRO';
    const contactPhone = settings?.contact_phone || '+228 72 11 44 44';
    const openingHours = settings?.opening_hours || 'Lun - Sam : 08:00 - 19:00';
    const footerText =
        settings?.footer_text ||
        `&copy; ${new Date().getFullYear()} KEYPRO. Ingénierie de Performance.`;

    const seoTitle = settings?.seo_title || siteName;
    const seoDescription =
        settings?.seo_description ||
        "Serrurerie automobile d'élite et diagnostics techniques de pointe.";
    const seoKeywords =
        settings?.seo_keywords ||
        'serrurerie, automobile, diagnostic, clé voiture, KEYPRO';
    const seoRobots = settings?.seo_robots || 'index, follow';

    const navigation = [
        { name: 'Services', href: '/services' },
        { name: 'Marques', href: '/brands' },
        { name: 'Galerie', href: '/gallery' },
        { name: 'Rendez-vous', href: '/appointments' },
        { name: 'FAQ', href: '/faq' },
    ];

    return (
        <div className="bg-grid-pattern relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground">
            <FlashMessages />
            <Suspense fallback={null}>
                <BackgroundSpotlight />
            </Suspense>
            <Head>
                <title>{seoTitle}</title>
                <meta name="description" content={seoDescription} />
                <meta name="keywords" content={seoKeywords} />
                <meta name="robots" content={seoRobots} />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content={seoTitle} />
                <meta property="og:description" content={seoDescription} />
                <meta property="og:site_name" content={siteName} />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={seoTitle} />
                <meta name="twitter:description" content={seoDescription} />

                {/* Analytics & Tracking */}
                {settings?.google_analytics_id && (
                    <script
                        async
                        src={`https://www.googletagmanager.com/gtag/js?id=${settings.google_analytics_id}`}
                    />
                )}
                {settings?.google_analytics_id && (
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${settings.google_analytics_id}');
            `,
                        }}
                    />
                )}

                {settings?.facebook_pixel_id && (
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${settings.facebook_pixel_id}');
              fbq('track', 'PageView');
            `,
                        }}
                    />
                )}
            </Head>
            {/* Top Info Bar */}
            <div className="hidden w-full border-b border-white/5 bg-luxury-black py-3 lg:block">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex gap-8">
                        <div className="flex items-center gap-2 font-heading text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
                            <Icon
                                name="Phone"
                                className="h-3 w-3 text-racing-red"
                            />
                            <span>{contactPhone}</span>
                        </div>
                        <div className="flex items-center gap-2 font-heading text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
                            <Icon
                                name="Clock"
                                className="h-3 w-3 text-racing-red"
                            />
                            <span>{openingHours}</span>
                        </div>
                    </div>
                    <div className="flex gap-6">
                        {['Instagram', 'Facebook', 'Twitter'].map((social) => (
                            <a
                                key={social}
                                href="#"
                                className="text-muted-foreground transition-colors hover:text-racing-red"
                                aria-label={`Suivez-nous sur ${social}`}
                            >
                                <Icon
                                    name={social as any}
                                    className="h-3.5 w-3.5"
                                />
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-luxury-black/95 backdrop-blur-md">
                <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-24 items-center justify-between">
                        <Link
                            href="/"
                            className="group flex items-center gap-3"
                        >
                            <div className="relative">
                                <Icon
                                    name="KeyRound"
                                    className="h-9 w-9 text-racing-red transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 rounded-none bg-racing-red/20 opacity-0 blur-xl transition-opacity group-hover:opacity-100" />
                            </div>
                            <span className="font-heading text-2xl font-bold tracking-[0.3em] text-chrome uppercase">
                                Key<span className="text-racing-red">Pro</span>
                            </span>
                        </Link>

                        <div className="hidden items-center gap-12 md:flex">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="group relative font-heading text-[11px] font-bold tracking-[0.25em] text-muted-foreground uppercase transition-all duration-300 hover:text-white"
                                >
                                    {item.name}
                                    <span className="absolute -bottom-2 left-0 h-[2px] w-0 bg-racing-red transition-all duration-500 group-hover:w-full" />
                                </Link>
                            ))}

                            {auth?.user ? (
                                <UserMenu
                                    user={auth.user}
                                    currentTeam={auth.user.current_team}
                                />
                            ) : (
                                <Link
                                    href="/login"
                                    className="skewed-btn group bg-racing-red text-white transition-colors hover:bg-white hover:text-luxury-black"
                                >
                                    <span className="flex items-center gap-2">
                                        <Icon
                                            name="LogIn"
                                            className="h-4 w-4 transition-transform group-hover:translate-x-1"
                                        />
                                        Connexion
                                    </span>
                                </Link>
                            )}
                        </div>

                        <div className="md:hidden">
                            <Sheet
                                open={isMenuOpen}
                                onOpenChange={setIsMenuOpen}
                            >
                                <SheetTrigger asChild>
                                    <button
                                        className="p-2 text-racing-red"
                                        aria-label="Ouvrir le menu"
                                    >
                                        <Icon name="Menu" className="h-6 w-6" />
                                    </button>
                                </SheetTrigger>
                                <SheetContent
                                    side="right"
                                    className="overflow-hidden border-white/10 bg-luxury-black p-0"
                                >
                                    <div className="bg-grid-pattern pointer-events-none absolute inset-0 opacity-5" />

                                    <SheetHeader className="border-b border-white/5 p-8">
                                        <SheetTitle>
                                            <Link
                                                href="/"
                                                className="flex items-center gap-3"
                                                onClick={() =>
                                                    setIsMenuOpen(false)
                                                }
                                            >
                                                <Icon
                                                    name="KeyRound"
                                                    className="h-7 w-7 text-racing-red"
                                                />
                                                <span className="font-heading text-xl font-bold tracking-[0.2em] text-chrome uppercase">
                                                    Key
                                                    <span className="text-racing-red">
                                                        Pro
                                                    </span>
                                                </span>
                                            </Link>
                                        </SheetTitle>
                                        <SheetDescription className="sr-only">
                                            Menu de navigation principal
                                        </SheetDescription>
                                    </SheetHeader>

                                    <div className="flex flex-col gap-8 p-8">
                                        {navigation.map((item) => (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                onClick={() =>
                                                    setIsMenuOpen(false)
                                                }
                                                className="font-heading text-xl font-bold tracking-[0.3em] text-muted-foreground uppercase transition-all hover:text-racing-red"
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                        {auth?.user ? (
                                            <div className="flex flex-col gap-6">
                                                {/* Mobile User Identity */}
                                                <div className="flex items-center gap-4 border border-white/5 bg-luxury-charcoal/50 p-4">
                                                    <Avatar className="h-12 w-12 rounded-none border border-racing-red/20">
                                                        <AvatarImage
                                                            src={
                                                                auth.user.avatar
                                                            }
                                                            alt={auth.user.name}
                                                        />
                                                        <AvatarFallback className="rounded-none bg-luxury-black font-heading text-xs text-racing-red uppercase">
                                                            {auth.user.name
                                                                .split(' ')
                                                                .map(
                                                                    (
                                                                        n: string,
                                                                    ) => n[0],
                                                                )
                                                                .join('')
                                                                .toUpperCase()
                                                                .substring(
                                                                    0,
                                                                    2,
                                                                )}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="font-heading text-sm font-bold tracking-wider text-white uppercase">
                                                            {auth.user.name}
                                                        </span>
                                                        <div className="flex items-center gap-1.5">
                                                            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-racing-red" />
                                                            <span className="text-[9px] font-bold tracking-widest text-muted-foreground uppercase">
                                                                Client Elite
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Technical Console Links */}
                                                <div className="grid grid-cols-1 gap-2">
                                                    <Link
                                                        href={
                                                            auth.user
                                                                .current_team
                                                                ? dashboard(
                                                                      auth.user
                                                                          .current_team
                                                                          .slug,
                                                                  )
                                                                : '/'
                                                        }
                                                        onClick={() =>
                                                            setIsMenuOpen(false)
                                                        }
                                                        className="flex items-center gap-4 border border-white/5 bg-luxury-charcoal/30 p-4 font-heading text-[10px] font-bold tracking-widest text-white uppercase transition-colors hover:bg-racing-red"
                                                    >
                                                        <LayoutGrid className="h-4 w-4 text-racing-red" />
                                                        Tableau de bord
                                                    </Link>

                                                    <Link
                                                        href="/my-appointments"
                                                        onClick={() =>
                                                            setIsMenuOpen(false)
                                                        }
                                                        className="flex items-center gap-4 border border-white/5 bg-luxury-charcoal/30 p-4 font-heading text-[10px] font-bold tracking-widest text-white uppercase transition-colors hover:bg-racing-red"
                                                    >
                                                        <Calendar className="h-4 w-4 text-racing-red" />
                                                        Mes Rendez-vous
                                                    </Link>

                                                    <Link
                                                        href="/dashboard/invoices"
                                                        onClick={() =>
                                                            setIsMenuOpen(false)
                                                        }
                                                        className="flex items-center gap-4 border border-white/5 bg-luxury-charcoal/30 p-4 font-heading text-[10px] font-bold tracking-widest text-white uppercase transition-colors hover:bg-racing-red"
                                                    >
                                                        <Receipt className="h-4 w-4 text-racing-red" />
                                                        Mes Factures
                                                    </Link>

                                                    <Link
                                                        href="/settings/profile"
                                                        onClick={() =>
                                                            setIsMenuOpen(false)
                                                        }
                                                        className="flex items-center gap-4 border border-white/5 bg-luxury-charcoal/30 p-4 font-heading text-[10px] font-bold tracking-widest text-white uppercase transition-colors hover:bg-racing-red"
                                                    >
                                                        <User className="h-4 w-4 text-racing-red" />
                                                        Mon Profil
                                                    </Link>
                                                </div>

                                                <Link
                                                    href="/logout"
                                                    method="post"
                                                    as="button"
                                                    onClick={() =>
                                                        setIsMenuOpen(false)
                                                    }
                                                    className="flex items-center justify-center gap-2 border border-racing-red/20 p-4 font-heading text-[10px] font-bold tracking-[0.2em] text-racing-red uppercase transition-all hover:bg-racing-red hover:text-white"
                                                >
                                                    <LogOut className="h-4 w-4" />
                                                    Déconnexion
                                                </Link>
                                            </div>
                                        ) : (
                                            <Link
                                                href="/login"
                                                onClick={() =>
                                                    setIsMenuOpen(false)
                                                }
                                                className="skewed-btn group mt-12 bg-racing-red py-4 text-center font-bold tracking-[0.2em] text-white uppercase"
                                            >
                                                <span className="flex items-center justify-center gap-2">
                                                    <Icon
                                                        name="LogIn"
                                                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                                                    />
                                                    Connexion
                                                </span>
                                            </Link>
                                        )}

                                        <div className="mt-12 flex gap-6 border-t border-white/5 pt-12">
                                            {[
                                                'Instagram',
                                                'Facebook',
                                                'Twitter',
                                            ].map((social) => (
                                                <a
                                                    key={social}
                                                    href="#"
                                                    className="flex h-10 w-10 -skew-x-12 transform items-center justify-center border border-white/10 text-muted-foreground transition-all hover:border-racing-red hover:bg-racing-red hover:text-white"
                                                    aria-label={`Suivez-nous sur ${social}`}
                                                >
                                                    <Icon
                                                        name={social as any}
                                                        className="h-4 w-4 skew-x-12"
                                                    />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </nav>
            </header>

            <main className="relative flex-1">{children}</main>

            {/* Footer */}
            <footer className="relative overflow-hidden border-t-4 border-racing-red bg-luxury-black pt-24 pb-12">
                <div className="bg-grid-pattern pointer-events-none absolute top-0 left-0 h-full w-full opacity-[0.02]" />
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-24 grid grid-cols-1 gap-16 md:grid-cols-12">
                        <div className="md:col-span-5">
                            <div className="mb-8 flex items-center gap-3">
                                <Icon
                                    name="KeyRound"
                                    className="h-7 w-7 text-racing-red"
                                />
                                <span className="font-heading text-xl font-bold tracking-[0.2em] text-chrome uppercase">
                                    Key
                                    <span className="text-racing-red">Pro</span>
                                </span>
                            </div>
                            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                                Serrurerie automobile d'élite et diagnostics
                                techniques de pointe. Ingénierie de précision
                                pour marques de prestige et protocoles de
                                sécurité avancés.
                            </p>

                            <div className="mt-10 flex gap-4">
                                {['Instagram', 'Twitter', 'Facebook'].map(
                                    (social) => (
                                        <a
                                            key={social}
                                            href="#"
                                            className="flex h-12 w-12 -skew-x-12 transform items-center justify-center border border-white/5 text-muted-foreground transition-all hover:border-racing-red hover:bg-racing-red hover:text-white"
                                            aria-label={`Suivez-nous sur ${social}`}
                                        >
                                            <Icon
                                                name={social as any}
                                                className="h-4 w-4 skew-x-12"
                                            />
                                        </a>
                                    ),
                                )}
                            </div>
                        </div>

                        <div className="md:col-span-3">
                            <h3 className="mb-8 border-l-2 border-racing-red pl-4 font-heading text-[11px] font-bold tracking-[0.2em] text-white uppercase">
                                Entreprise
                            </h3>
                            <ul className="space-y-4">
                                {navigation.map((item) => (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            className="inline-block text-sm tracking-wider text-muted-foreground uppercase transition-all hover:text-racing-red"
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                                <li>
                                    <Link
                                        href="#contact"
                                        className="inline-block text-sm tracking-wider text-muted-foreground uppercase transition-all hover:text-racing-red"
                                    >
                                        Protocoles
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div className="md:col-span-4">
                            <h3 className="mb-8 border-l-2 border-racing-red pl-4 font-heading text-[11px] font-bold tracking-[0.2em] text-white uppercase">
                                Intervention 24/7
                            </h3>
                            <div className="group relative border border-white/5 bg-luxury-charcoal p-8">
                                <div className="absolute top-0 left-0 h-0 w-1 bg-racing-red transition-all duration-500 group-hover:h-full" />
                                <p className="mb-3 text-[10px] tracking-widest text-muted-foreground uppercase">
                                    Ligne Technique Prioritaire
                                </p>
                                <a
                                    href={`tel:${contactPhone.replace(/\s+/g, '')}`}
                                    className="font-heading text-2xl font-bold text-chrome transition-all hover:text-racing-red"
                                >
                                    {contactPhone}
                                </a>
                                <div className="mt-6 flex items-center gap-3 border-t border-white/5 pt-6 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                    <div className="h-2.5 w-2.5 animate-pulse bg-racing-red shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                                    Unités d'intervention actives
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-between gap-6 border-t border-white/5 pt-12 md:flex-row">
                        <p className="font-heading text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
                            {footerText}
                        </p>
                        <div className="flex gap-8">
                            <Link
                                href={
                                    settings?.privacy_policy_url ||
                                    '/privacy-policy'
                                }
                                className="font-heading text-[10px] tracking-[0.3em] text-muted-foreground uppercase transition-all hover:text-racing-red"
                            >
                                Confidentialité
                            </Link>
                            <Link
                                href={
                                    settings?.terms_of_service_url ||
                                    '/terms-of-service'
                                }
                                className="font-heading text-[10px] tracking-[0.3em] text-muted-foreground uppercase transition-all hover:text-racing-red"
                            >
                                Conditions
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
            <WhatsAppButton />
            <CookieConsent
                enabled={
                    settings?.cookie_consent_enabled === '1' ||
                    settings?.cookie_consent_enabled === true
                }
                message={
                    settings?.cookie_consent_message ||
                    'Nous utilisons des cookies pour améliorer votre expérience sur notre site.'
                }
                privacyPolicyUrl={
                    settings?.privacy_policy_url || '/privacy-policy'
                }
            />
        </div>
    );
}
