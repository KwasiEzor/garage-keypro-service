import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export function WhatsAppButton() {
  const { settings } = usePage().props as any;
  const [isVisible, setIsVisible] = useState(false);

  const isEnabled = settings?.whatsapp_enabled === '1';
  const phoneNumber = settings?.whatsapp_number || '+22890956935';
  const defaultMessage = settings?.whatsapp_message || "Bonjour KEYPRO, j'aimerais avoir plus d'informations.";

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!isEnabled) return null;

  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg transition-all duration-500 hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#25D366]/50 group",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
      )}
      aria-label="Contactez-nous sur WhatsApp"
    >
      <div className="absolute -top-12 right-0 bg-white text-luxury-black text-[10px] font-bold py-2 px-4 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border-b-2 border-r-2 border-racing-red pointer-events-none uppercase tracking-widest">
        Besoin d'aide ? WhatsApp
      </div>
      <svg
        viewBox="0 0 24 24"
        width="28"
        height="28"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="drop-shadow-sm"
      >
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
      <span className="absolute flex h-full w-full rounded-full bg-[#25D366] opacity-75 animate-ping -z-10" />
    </a>
  );
}
