import { BrandBadge } from './brand-badge';

interface Brand {
  id: number;
  name: string;
  slug: string;
  logo_path?: string;
}

interface BrandGridProps {
  brands: Brand[];
  title?: string;
}

export function BrandGrid({ brands, title }: BrandGridProps) {
  return (
    <div className="py-12">
      {title && (
        <h2 className="text-2xl font-bold text-center mb-8">{title}</h2>
      )}
      <div className="flex flex-wrap justify-center gap-3">
        {brands.map((brand) => (
          <BrandBadge key={brand.id} brand={brand} />
        ))}
      </div>
    </div>
  );
}
