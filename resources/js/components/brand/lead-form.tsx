import { useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert } from '@/components/ui/alert';

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
    <Card>
      <CardHeader>
        <CardTitle>{title || 'Demander un devis'}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {wasSuccessful && (
          <Alert className="mb-4">
            Merci! Nous vous contacterons sous peu.
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nom complet *</Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              required
            />
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              required
            />
            {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
          </div>

          <div>
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              type="tel"
              value={data.phone}
              onChange={(e) => setData('phone', e.target.value)}
            />
            {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label htmlFor="vehicle_make">Marque</Label>
              <Input
                id="vehicle_make"
                value={data.vehicle_make}
                onChange={(e) => setData('vehicle_make', e.target.value)}
                placeholder="Toyota"
              />
            </div>
            <div>
              <Label htmlFor="vehicle_model">Modèle</Label>
              <Input
                id="vehicle_model"
                value={data.vehicle_model}
                onChange={(e) => setData('vehicle_model', e.target.value)}
                placeholder="Camry"
              />
            </div>
            <div>
              <Label htmlFor="vehicle_year">Année</Label>
              <Input
                id="vehicle_year"
                type="number"
                value={data.vehicle_year}
                onChange={(e) => setData('vehicle_year', e.target.value)}
                placeholder="2020"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={data.message}
              onChange={(e) => setData('message', e.target.value)}
              rows={4}
              placeholder="Décrivez votre besoin..."
            />
            {errors.message && <p className="text-sm text-destructive mt-1">{errors.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={processing}>
            {processing ? 'Envoi...' : 'Envoyer la demande'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
