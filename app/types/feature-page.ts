export interface FeaturesPageConfig {
  headerTitle?: string;
  headerSubtitle?: string;
  ctaTitle?: string;
  ctaSubtitle?: string;
  ctaPrimaryText?: string;
  ctaSecondaryText?: string;
}

export interface FeaturesPageResponse {
  data: FeaturesPageConfig[];
}
