export interface Feature {
  id: number;
  title: string;
  description: string;
}

export interface FeatureCardProps {
  feature: Feature;
}