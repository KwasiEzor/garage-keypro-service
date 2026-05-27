import { useState } from 'react';
import PublicLayout from '@/layouts/public-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';

interface BrandsIndexProps {
  brands: any[];
}

export default function BrandsIndex({ brands }: BrandsIndexProps) {
  const [search, setSearch] = useState('');

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Marques Compatibles</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Nous intervenons sur toutes les marques automobiles
          </p>
          <div className="max-w-md mx-auto">
            <Input
              type="search"
              placeholder="Rechercher une marque..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBrands.map((brand) => (
            <Card key={brand.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{brand.name}</span>
                  {brand.is_featured && (
                    <Badge variant="secondary">Populaire</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {brand.services && brand.services.length > 0 ? (
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">
                      Services disponibles:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {brand.services.slice(0, 3).map((service: any) => (
                        <Badge key={service.id} variant="outline">
                          {service.name}
                        </Badge>
                      ))}
                      {brand.services.length > 3 && (
                        <Badge variant="outline">
                          +{brand.services.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    <Icon name="CheckCircle" className="inline h-4 w-4 mr-1" />
                    Compatible avec tous nos services
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBrands.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Aucune marque trouvée pour "{search}"
            </p>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
