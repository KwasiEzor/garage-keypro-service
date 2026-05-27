import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Icon } from '@/components/ui/icon';

interface TestimonialCardProps {
  testimonial: {
    id: number;
    customer_name: string;
    customer_location?: string;
    vehicle_info?: string;
    content: string;
    rating: number;
  };
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarFallback>
              {testimonial.customer_name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="font-semibold">{testimonial.customer_name}</div>
            <div className="text-sm text-muted-foreground">
              {testimonial.customer_location}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 mt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Icon
              key={i}
              name="Star"
              className={`h-4 w-4 ${
                i < testimonial.rating
                  ? 'text-yellow-500 fill-yellow-500'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed">{testimonial.content}</p>
        {testimonial.vehicle_info && (
          <p className="text-xs text-muted-foreground mt-3">
            <Icon name="Car" className="h-3 w-3 inline mr-1" />
            {testimonial.vehicle_info}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
