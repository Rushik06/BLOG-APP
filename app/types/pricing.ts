export interface Pricing {
  id: number;
  planName: string;
  Price: number;

  ctaTitle?: string | null;
  ctaSubtitle?: string | null;
  contactNumber?: string | null;

  highlightTitle?: string | null;
  highlightPoints?: string[] | null;

  extraFeatures: string[];
}

export interface PricingCardProps {
  plan: Pricing;
}
