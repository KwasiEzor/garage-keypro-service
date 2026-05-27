import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Icon } from '@/components/ui/icon';

interface ServiceCardProps {
  service: {
    id: number;
    name: string;
    slug: string;
    description: string;
    icon?: string;
    starting_price?: number;
    estimated_duration?: number;
    is_featured: boolean;
  };
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="bg-primary/10 p-3 rounded-lg">
            {service.icon && <Icon name={service.icon as any} className="h-6 w-6 text-primary" />}
          </div>
          {service.is_featured && (
            <Badge variant="secondary">Populaire</Badge>
          )}
        </div>
        <CardTitle className="mt-4">{service.name}</CardTitle>
        <CardDescription>{service.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {service.starting_price && (
            <div>
              <span className="text-lg font-semibold text-foreground">
                {service.starting_price}€
              </span>
              <span className="ml-1">dès</span>
            </div>
          )}
          {service.estimated_duration && (
            <div className="flex items-center gap-1">
              <Icon name="Clock" className="h-4 w-4" />
              <span>{service.estimated_duration} min</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/services/${service.slug}`}>
            En savoir plus
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
