import { Card, CardContent } from '@/components/ui/card';
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
    <div className="group h-full">
      <Card className="accent-border-top h-full bg-card border-white/5 hover:border-white/10 transition-all duration-500 rounded-none overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
          <Icon name="Quote" className="h-16 w-16 text-racing-red" />
        </div>
        
        <CardContent className="pt-12 px-10 pb-12 flex flex-col h-full">
          {/* Stars */}
          <div className="flex items-center gap-2 mb-10">
            {Array.from({ length: 5 }).map((_, i) => (
              <Icon
                key={i}
                name="Star"
                className={`h-4 w-4 transition-all duration-500 ${
                  i < testimonial.rating
                    ? 'text-racing-red fill-racing-red group-hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                    : 'text-white/10'
                }`}
              />
            ))}
          </div>

          {/* Testimonial text */}
          <blockquote className="text-sm leading-relaxed mb-12 text-muted-foreground tracking-wide flex-1 italic font-medium">
            "{testimonial.content}"
          </blockquote>

          {/* Customer info */}
          <div className="flex items-center gap-5 pt-10 border-t border-white/5">
            <div className="relative">
              <Avatar className="h-14 w-14 border border-white/5 group-hover:border-racing-red/50 transition-all duration-500 rounded-none transform -skew-x-12">
                <AvatarFallback className="bg-luxury-charcoal text-racing-red font-heading font-bold text-xs uppercase tracking-widest skew-x-12">
                  {testimonial.customer_name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-racing-red flex items-center justify-center border-2 border-card">
                <Icon name="Check" className="h-2.5 w-2.5 text-white" />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="text-[11px] font-heading font-bold uppercase tracking-[0.2em] text-white mb-1">
                {testimonial.customer_name}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground flex flex-col gap-1 font-bold">
                <span>{testimonial.customer_location}</span>
                {testimonial.vehicle_info && (
                  <div className="flex items-center gap-2 text-racing-red/80">
                    <Icon name="Car" className="h-3.5 w-3.5" />
                    <span>{testimonial.vehicle_info}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

