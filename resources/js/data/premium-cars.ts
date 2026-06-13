/**
 * Premium vehicle showcase data
 * High-end vehicles serviced by KeyPro
 */

export interface PremiumCar {
    id: string;
    name: string;
    brand: string;
    year: number;
    image: string;
    category: 'sports' | 'luxury-suv' | 'luxury-sedan' | 'supercar';
    description: string;
    color: string;
}

export const premiumCars: PremiumCar[] = [
    {
        id: 'corvette-2026',
        name: 'Corvette Arctic White',
        brand: 'Chevrolet',
        year: 2026,
        image: '/images/premium-cars/2026-Corvette-Arctic-White.avif',
        category: 'sports',
        description:
            'Voiture de sport américaine iconique avec programmation de clé avancée',
        color: '#FFFFFF',
    },
    {
        id: 'bmw-x1-2026',
        name: 'X1',
        brand: 'BMW',
        year: 2026,
        image: '/images/premium-cars/BMW-X1-2026.avif',
        category: 'luxury-suv',
        description: 'SUV premium allemand avec système de clé intelligent',
        color: '#1C1C1C',
    },
    {
        id: 'audi-2026',
        name: 'Audi Premium',
        brand: 'Audi',
        year: 2026,
        image: '/images/premium-cars/audi-2026.png',
        category: 'luxury-sedan',
        description:
            'Berline de luxe avec technologie de clé électronique sophistiquée',
        color: '#2C2C2C',
    },
    {
        id: 'audi-q5-2026',
        name: 'Q5 Premium',
        brand: 'Audi',
        year: 2026,
        image: '/images/premium-cars/audi-premium-Q5-2026.png',
        category: 'luxury-suv',
        description: "SUV premium avec système d'accès sans clé avancé",
        color: '#3A3A3A',
    },
    {
        id: 'lamborghini-aventador',
        name: 'Aventador',
        brand: 'Lamborghini',
        year: 2026,
        image: '/images/premium-cars/pngtree-3d-red-lamborghini-aventado-png-image_15503537.png',
        category: 'supercar',
        description:
            'Supercar italienne avec programmation de clé ultra-sophistiquée',
        color: '#DC2626',
    },
    {
        id: 'range-rover-2026',
        name: 'Range Rover',
        brand: 'Land Rover',
        year: 2026,
        image: '/images/premium-cars/ranger-rover-2026.png',
        category: 'luxury-suv',
        description:
            'SUV de luxe britannique avec système de clé intelligente premium',
        color: '#1E293B',
    },
];

export const getPremiumCarsByCategory = (category: PremiumCar['category']) => {
    return premiumCars.filter((car) => car.category === category);
};

export const getRandomPremiumCar = () => {
    return premiumCars[Math.floor(Math.random() * premiumCars.length)];
};

export const getPremiumCarByBrand = (brand: string) => {
    return premiumCars.filter(
        (car) => car.brand.toLowerCase() === brand.toLowerCase(),
    );
};
