export type PricingCardType = {
    title: string;
    description: string;
    price: number;
    buttonText: string;
    benefits: string[];
    handleClick: () => void;
}

export type PackageType = {
    id: number,
    name: string,
    price: number,
    description: string,
    benefits: string[];
}