export interface Pricing {
  id: number;
  planName: string;
  Price: number;
}

export interface PricingCardProps {
  plan: Pricing;
}