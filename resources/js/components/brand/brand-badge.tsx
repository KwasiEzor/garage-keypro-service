import { Badge } from '@/components/ui/badge';

interface BrandBadgeProps {
  brand: {
    id: number;
    name: string;
    slug: string;
    logo_path?: string;
  };
}

export function BrandBadge({ brand }: BrandBadgeProps) {
  return (
    <Badge variant="outline" className="px-4 py-2 rounded-none border-racing-red/30 text-white font-heading font-bold uppercase text-[10px] tracking-widest bg-racing-red/5">
      {brand.name}
    </Badge>
  );
}
