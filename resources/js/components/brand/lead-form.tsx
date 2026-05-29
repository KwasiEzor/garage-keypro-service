import { useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert } from '@/components/ui/alert';
import { Icon } from '@/components/ui/icon';

interface LeadFormProps {
  serviceId?: number;
  title?: string;
  description?: string;
}

export function LeadForm({ serviceId, title, description }: LeadFormProps) {
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
    });
  };

  return (
    <Card className="shadow-2xl bg-card border-white/5 rounded-none overflow-hidden relative">
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

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-[11px] font-heading font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">Nom Complet / Opérateur</Label>
              <Input
                id="name"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                required
                className="h-14 bg-luxury-charcoal border-white/5 text-white focus:border-racing-red/50 focus:ring-0 transition-all rounded-none font-medium"
              />
              {errors.name && <p className="text-[10px] text-destructive uppercase tracking-widest mt-1 ml-1 font-bold">{errors.name}</p>}
            </div>

            <div className="space-y-3">
              <Label htmlFor="email" className="text-[11px] font-heading font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">Adresse Email Sécurisée</Label>
              <Input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                required
                className="h-14 bg-luxury-charcoal border-white/5 text-white focus:border-racing-red/50 focus:ring-0 transition-all rounded-none font-medium"
              />
              {errors.email && <p className="text-[10px] text-destructive uppercase tracking-widest mt-1 ml-1 font-bold">{errors.email}</p>}
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="phone" className="text-[11px] font-heading font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">Ligne Tactique (Téléphone)</Label>
            <Input
              id="phone"
              type="tel"
              value={data.phone}
              onChange={(e) => setData('phone', e.target.value)}
              className="h-14 bg-luxury-charcoal border-white/5 text-white focus:border-racing-red/50 focus:ring-0 transition-all rounded-none font-medium"
            />
            {errors.phone && <p className="text-[10px] text-destructive uppercase tracking-widest mt-1 ml-1 font-bold">{errors.phone}</p>}
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-3">
              <Label htmlFor="vehicle_make" className="text-[11px] font-heading font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">Marque</Label>
              <Input
                id="vehicle_make"
                value={data.vehicle_make}
                onChange={(e) => setData('vehicle_make', e.target.value)}
                placeholder="Ex: PORSCHE"
                className="h-14 bg-luxury-charcoal border-white/5 text-white focus:border-racing-red/50 focus:ring-0 transition-all rounded-none placeholder:text-white/5 font-medium"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="vehicle_model" className="text-[11px] font-heading font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">Modèle</Label>
              <Input
                id="vehicle_model"
                value={data.vehicle_model}
                onChange={(e) => setData('vehicle_model', e.target.value)}
                placeholder="Ex: 911 GT3"
                className="h-14 bg-luxury-charcoal border-white/5 text-white focus:border-racing-red/50 focus:ring-0 transition-all rounded-none placeholder:text-white/5 font-medium"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="vehicle_year" className="text-[11px] font-heading font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">Année</Label>
              <Input
                id="vehicle_year"
                type="number"
                value={data.vehicle_year}
                onChange={(e) => setData('vehicle_year', e.target.value)}
                placeholder="2024"
                className="h-14 bg-luxury-charcoal border-white/5 text-white focus:border-racing-red/50 focus:ring-0 transition-all rounded-none placeholder:text-white/5 font-medium"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="message" className="text-[11px] font-heading font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">Besoins Opérationnels</Label>
            <Textarea
              id="message"
              value={data.message}
              onChange={(e) => setData('message', e.target.value)}
              rows={4}
              placeholder="Détaillez les paramètres techniques..."
              className="bg-luxury-charcoal border-white/5 text-white focus:border-racing-red/50 focus:ring-0 transition-all rounded-none placeholder:text-white/5 resize-none font-medium"
            />
            {errors.message && <p className="text-[10px] text-destructive uppercase tracking-widest mt-1 ml-1 font-bold">{errors.message}</p>}
          </div>

          <button
            type="submit"
            className="skewed-btn w-full bg-racing-red text-white hover:bg-white hover:text-luxury-black transition-all duration-500 disabled:opacity-50 h-20"
            disabled={processing}
          >
            <span className="flex items-center gap-4 text-sm tracking-[0.4em]">
              {processing ? (
                <>
                  <Icon name="Loader2" className="h-5 w-5 animate-spin" />
                  AUTHENTIFICATION...
                </>
              ) : (
                <>
                  TRANSMETTRE LE PROTOCOLE
                  <Icon name="ArrowRight" className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                </>
              )}
            </span>
          </button>
        </form>
      </CardContent>
    </Card>
  );
}

