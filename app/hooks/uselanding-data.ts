import { fetchAPI } from '@/lib/strapi';
import { logger } from '@/lib/logger';
import { LOG_MESSAGES } from '@/lib/logger-messages';

import type {
  LandingPage,
  Feature,
  FeatureResponse,
} from '@/app/types/landing-page';
import type { Testimonial } from '@/app/types/testimonals';

type LandingResponse = {
  data: LandingPage[];
};

type TestimonialResponse = {
  data: Testimonial[];
};

export async function getLandingData(): Promise<{
  data: LandingPage;
  testimonials: Testimonial[];
  features: Feature[];
}> {
  try {
    const [landingRes, testimonialRes, featureRes] = await Promise.all([
      fetchAPI<LandingResponse>('/landing-pages?populate=howItWorksStep'),
      fetchAPI<TestimonialResponse>('/testimonals'),
      fetchAPI<FeatureResponse>('/landing-features'),
    ]);

    const raw = landingRes.data?.[0];

    const data: LandingPage = {
      HeroTitle: raw?.HeroTitle ?? '',
      HeroSubtitle: raw?.HeroSubtitle ?? '',
      CTAText: raw?.CTAText ?? '',
      secondaryCTAText: raw?.secondaryCTAText,
      secondaryCTALink: raw?.secondaryCTALink,

      featuresTitle: raw?.featuresTitle,
      featuresSubtitle: raw?.featuresSubtitle,

      howItWorksTitle: raw?.howItWorksTitle,
      howItWorksSubTitle: raw?.howItWorksSubTitle,

      howItWorksStep: raw?.howItWorksStep ?? [],
    };

    return {
      data,
      testimonials: testimonialRes?.data ?? [],
      features: featureRes?.data ?? [],
    };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Unknown error';

    logger.error({
      msg: LOG_MESSAGES.landing.error,
      error: message,
    });

    return {
      data: {
        HeroTitle: '',
        HeroSubtitle: '',
        CTAText: '',
        howItWorksStep: [],
      },
      testimonials: [],
      features: [],
    };
  }
}