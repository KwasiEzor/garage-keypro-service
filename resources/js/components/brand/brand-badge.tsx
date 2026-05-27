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
    <Badge variant="outline" className="px-4 py-2">
      {brand.name}
    </Badge>
  );
}
