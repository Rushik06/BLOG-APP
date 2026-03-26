import { fetchAPI } from '@/lib/strapi';
import type { LandingPage } from '@/app/types/landing-page';
import type { Testimonial } from '@/app/types/testimonals';
import type { Feature } from '@/app/types/landing-page';

export async function getLandingData() {
  const [landingRes, testimonialRes, featureRes] = await Promise.all([
    fetchAPI<{ data: any[] }>('/landing-pages?populate=howItWorksStep'),
    fetchAPI<{ data: Testimonial[] }>('/testimonals'),
    fetchAPI<{ data: Feature[] }>('/landing-features'),
  ]);

  const raw = landingRes.data[0];

  const data: LandingPage = {
    HeroTitle: raw?.HeroTitle,
    HeroSubtitle: raw?.HeroSubtitle,
    CTAText: raw?.CTAText,
    featuresTitle: raw?.featuresTitle,
    featuresSubtitle: raw?.featuresSubtitle,
    howItWorksTitle: raw?.howItWorksTitle,
    howItWorksSubTitle: raw?.howItWorksSubtitle,
    howItWorksStep: raw?.howItWorksStep || [],
  };

  return {
    data,
    testimonials: testimonialRes?.data ?? [],
    features: featureRes?.data ?? [],
  };
}
