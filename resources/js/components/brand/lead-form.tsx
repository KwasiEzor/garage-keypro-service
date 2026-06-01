import { useForm } from '@inertiajs/react';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BrandSelect } from '@/components/brand/brand-select';
import { ServiceSelect } from '@/components/brand/service-select';
import { cn } from '@/lib/utils';
import { User, Mail, Phone, Car, Calendar, MessageSquare, Cog } from 'lucide-react';

interface LeadFormProps {
  serviceId?: number;
  title?: string;
  description?: string;
  className?: string;
}

export function LeadForm({ serviceId, title, description, className }: LeadFormProps) {
  const { data, setData, post, processing, errors, wasSuccessful, reset } = useForm({
    name: '',
    email: '',
    phone: '',
    vehicle_make: '',
    vehicle_model: '',
    vehicle_year: '',
    service_id: serviceId || '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/leads', {
      onSuccess: () => reset(),
      preserveScroll: true,
    });
  };

  return (
    <Card className={cn("shadow-2xl bg-card border-white/5 rounded-none overflow-hidden relative", className)}>
      <div className="absolute top-0 left-0 w-full h-1 bg-racing-red" />
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
      
      <CardHeader className="space-y-4 pt-16 px-10 pb-10 text-center relative">
        <CardTitle className="text-3xl font-heading font-bold uppercase tracking-tighter text-white">
          {title || 'Initialiser le Protocole'}
        </CardTitle>
        {description && (
          <CardDescription className="text-xs text-muted-foreground uppercase tracking-[0.3em] leading-loose font-bold">
            {description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="px-10 pb-16 relative">
        {wasSuccessful && (
          <div className="mb-10 p-8 border border-racing-red/20 bg-racing-red/5 animate-in fade-in zoom-in duration-500">
            <div className="flex items-center gap-5 text-racing-red">
              <Icon name="CheckCircle" className="h-7 w-7" />
              <div>
                <p className="font-heading font-bold text-xs uppercase tracking-widest">Demande Authentifiée</p>
                <p className="text-xs opacity-80 mt-1 font-bold">Notre unité technique vous contactera sous 15 minutes.</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Section: Identité */}
          <div className="space-y-8">
            <div className="flex items-center gap-3 border-b border-white/5 pb-2">
              <User className="size-4 text-racing-red" />
              <h3 className="text-[10px] font-heading font-bold uppercase tracking-[0.3em] text-white/50">Identité de l'Opérateur</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-[10px] font-heading font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">Nom Complet</Label>
                <div className="relative">
                  <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    required
                    placeholder="JEAN DUPONT"
                    className={cn(
                      "h-14 bg-luxury-charcoal border-white/5 text-white focus:border-racing-red/50 focus:ring-0 transition-all rounded-none font-medium placeholder:text-white/5 uppercase",
                      errors.name && "border-destructive/50"
                    )}
                  />
                </div>
                {errors.name && <p className="text-[9px] text-destructive uppercase tracking-widest mt-1 ml-1 font-bold">{errors.name}</p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="email" className="text-[10px] font-heading font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">Email Sécurisé</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    required
                    placeholder="OPERATEUR@DOMAINE.COM"
                    className={cn(
                      "h-14 bg-luxury-charcoal border-white/5 text-white focus:border-racing-red/50 focus:ring-0 transition-all rounded-none font-medium placeholder:text-white/5 uppercase",
                      errors.email && "border-destructive/50"
                    )}
                  />
                </div>
                {errors.email && <p className="text-[9px] text-destructive uppercase tracking-widest mt-1 ml-1 font-bold">{errors.email}</p>}
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="phone" className="text-[10px] font-heading font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">Ligne Directe</Label>
              <div className="relative">
                <Input
                  id="phone"
                  type="tel"
                  value={data.phone}
                  onChange={(e) => setData('phone', e.target.value)}
                  placeholder="+33 6 00 00 00 00"
                  className={cn(
                    "h-14 bg-luxury-charcoal border-white/5 text-white focus:border-racing-red/50 focus:ring-0 transition-all rounded-none font-medium placeholder:text-white/5",
                    errors.phone && "border-destructive/50"
                  )}
                />
              </div>
              {errors.phone && <p className="text-[9px] text-destructive uppercase tracking-widest mt-1 ml-1 font-bold">{errors.phone}</p>}
            </div>
          </div>

          {/* Section: Paramètres Véhicule */}
          <div className="space-y-8">
            <div className="flex items-center gap-3 border-b border-white/5 pb-2">
              <Car className="size-4 text-racing-red" />
              <h3 className="text-[10px] font-heading font-bold uppercase tracking-[0.3em] text-white/50">Paramètres Véhicule</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <Label className="text-[10px] font-heading font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">Marque</Label>
                <BrandSelect 
                  value={data.vehicle_make} 
                  onChange={(val) => setData('vehicle_make', val)} 
                  error={errors.vehicle_make}
                />
                {errors.vehicle_make && <p className="text-[9px] text-destructive uppercase tracking-widest mt-1 ml-1 font-bold">{errors.vehicle_make}</p>}
              </div>
              <div className="space-y-3">
                <Label htmlFor="vehicle_model" className="text-[10px] font-heading font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">Modèle</Label>
                <Input
                  id="vehicle_model"
                  value={data.vehicle_model}
                  onChange={(e) => setData('vehicle_model', e.target.value)}
                  placeholder="EX: 911 GT3"
                  className={cn(
                    "h-14 bg-luxury-charcoal border-white/5 text-white focus:border-racing-red/50 focus:ring-0 transition-all rounded-none placeholder:text-white/5 font-medium uppercase",
                    errors.vehicle_model && "border-destructive/50"
                  )}
                />
                {errors.vehicle_model && <p className="text-[9px] text-destructive uppercase tracking-widest mt-1 ml-1 font-bold">{errors.vehicle_model}</p>}
              </div>
              <div className="space-y-3">
                <Label htmlFor="vehicle_year" className="text-[10px] font-heading font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">Année</Label>
                <Input
                  id="vehicle_year"
                  type="number"
                  value={data.vehicle_year}
                  onChange={(e) => setData('vehicle_year', e.target.value)}
                  placeholder="2024"
                  className={cn(
                    "h-14 bg-luxury-charcoal border-white/5 text-white focus:border-racing-red/50 focus:ring-0 transition-all rounded-none placeholder:text-white/5 font-medium",
                    errors.vehicle_year && "border-destructive/50"
                  )}
                />
                {errors.vehicle_year && <p className="text-[9px] text-destructive uppercase tracking-widest mt-1 ml-1 font-bold">{errors.vehicle_year}</p>}
              </div>
            </div>
          </div>

          {/* Section: Mission */}
          <div className="space-y-8">
            <div className="flex items-center gap-3 border-b border-white/5 pb-2">
              <Cog className="size-4 text-racing-red" />
              <h3 className="text-[10px] font-heading font-bold uppercase tracking-[0.3em] text-white/50">Détails de la Mission</h3>
            </div>

            {!serviceId && (
              <div className="space-y-3">
                <Label className="text-[10px] font-heading font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">Service Requis</Label>
                <ServiceSelect 
                  value={data.service_id} 
                  onChange={(val) => setData('service_id', val)} 
                  error={errors.service_id}
                />
                {errors.service_id && <p className="text-[9px] text-destructive uppercase tracking-widest mt-1 ml-1 font-bold">{errors.service_id}</p>}
              </div>
            )}

            <div className="space-y-3">
              <Label htmlFor="message" className="text-[10px] font-heading font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">Instructions Spécifiques</Label>
              <Textarea
                id="message"
                value={data.message}
                onChange={(e) => setData('message', e.target.value)}
                rows={4}
                placeholder="DÉTAILLEZ LES PARAMÈTRES TECHNIQUES OU LES BESOINS PARTICULIERS..."
                className={cn(
                  "bg-luxury-charcoal border-white/5 text-white focus:border-racing-red/50 focus:ring-0 transition-all rounded-none placeholder:text-white/5 resize-none font-medium uppercase",
                  errors.message && "border-destructive/50"
                )}
              />
              {errors.message && <p className="text-[9px] text-destructive uppercase tracking-widest mt-1 ml-1 font-bold">{errors.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            className="skewed-btn w-full bg-racing-red text-white hover:bg-white hover:text-luxury-black transition-all duration-500 disabled:opacity-50 h-24 group relative overflow-hidden"
            disabled={processing}
          >
            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <span className="relative flex items-center justify-center gap-6 text-sm font-heading font-bold tracking-[0.5em] z-10">
              {processing ? (
                <>
                  <Icon name="Loader2" className="h-5 w-5 animate-spin" />
                  AUTHENTIFICATION...
                </>
              ) : (
                <>
                  TRANSMETTRE LE PROTOCOLE
                  <Icon name="ArrowRight" className="h-5 w-5 transition-transform group-hover:translate-x-3" />
                </>
              )}
            </span>
          </button>
        </form>
      </CardContent>
    </Card>
  );
}

