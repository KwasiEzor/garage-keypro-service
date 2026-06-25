export interface PremiumCar {
    id: string;
    name: string;
    brand: string;
    year: number;
    image: string;
    category: 'sports' | 'luxury-suv' | 'luxury-sedan' | 'supercar';
    description: string;
    color: string;
    tagline: string;
}

export const premiumCars: PremiumCar[] = [
    {
        id: 'porsche-911',
        name: '911 GT3',
        brand: 'Porsche',
        year: 2025,
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&q=90&auto=format&fit=crop',
        category: 'sports',
        description: 'Programmation de clé électronique pour la référence absolue du sport automobile.',
        tagline: 'Icône de performance',
        color: '#E8D5A3',
    },
    {
        id: 'lamborghini-huracan',
        name: 'Huracán EVO',
        brand: 'Lamborghini',
        year: 2025,
        image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1600&q=90&auto=format&fit=crop',
        category: 'supercar',
        description: "Expertise certifiée sur les systèmes d'accès sans clé les plus sophistiqués au monde.",
        tagline: 'Supercars italiennes',
        color: '#F59E0B',
    },
    {
        id: 'bmw-m4',
        name: 'M4 Competition',
        brand: 'BMW',
        year: 2025,
        image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1600&q=90&auto=format&fit=crop',
        category: 'sports',
        description: 'Diagnostic embarqué et duplication de clé pour le summum de la performance bavaroise.',
        tagline: 'Performance bavaroise',
        color: '#93C5FD',
    },
    {
        id: 'mercedes-amg',
        name: 'AMG GT',
        brand: 'Mercedes',
        year: 2025,
        image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1600&q=90&auto=format&fit=crop',
        category: 'luxury-sedan',
        description: "Remplacement et codage de clé sur l'élégance sportive à l'état pur.",
        tagline: 'Élégance allemande',
        color: '#D1D5DB',
    },
    {
        id: 'audi-rs7',
        name: 'RS 7 Sportback',
        brand: 'Audi',
        year: 2025,
        image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1600&q=90&auto=format&fit=crop',
        category: 'luxury-sedan',
        description: "Service mobile prioritaire pour la berline sportive la plus polyvalente d'Ingolstadt.",
        tagline: 'Sportback de prestige',
        color: '#A78BFA',
    },
    {
        id: 'range-rover',
        name: 'Range Rover SV',
        brand: 'Land Rover',
        year: 2025,
        image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1600&q=90&auto=format&fit=crop',
        category: 'luxury-suv',
        description: 'Programmation et diagnostic du SUV de luxe britannique par excellence.',
        tagline: 'SUV de luxe britannique',
        color: '#6EE7B7',
    },
];

export const getPremiumCarsByCategory = (category: PremiumCar['category']) => {
    return premiumCars.filter((car) => car.category === category);
};

export const getPremiumCarByBrand = (brand: string) => {
    return premiumCars.filter((car) => car.brand.toLowerCase() === brand.toLowerCase());
};
