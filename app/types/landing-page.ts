export interface HowItWorksStep {
  title: string;
  description?: string;
  icon: string;
}

export interface LandingPage {
  HeroTitle: string;
  HeroSubtitle: string;
  CTAText: string;

  featuresTitle?: string;
  featuresSubtitle?: string;

  howItWorksTitle?: string;
  howItWorksSubTitle?: string;

  howItWorksStep: HowItWorksStep[];
}

export type Feature = {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
};

export type FeatureResponse = {
  data: Feature[];
};