export interface Pricing {
  id: number;
  planName: string;
  Price: number;

  ctaTitle?: string;
  ctaSubtitle?: string;
  contactNumber?: string;

  highlightTitle?: string;
  highlightPoints?: string[];
}

export interface PricingCardProps {
  plan: Pricing;
}