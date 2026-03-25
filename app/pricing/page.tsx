import { fetchAPI } from '@/lib/strapi';
import PricingCard from '@/components/pricing/PricingCard';
import { Pricing } from '@/app/types/pricing';
import { PRICING_DEFAULTS } from '@/app/constants/pricing-constants';

import { BadgeCheck, Check, Sparkles, Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { pricingMetadata } from '@/app/metadata/pricing';

export const metadata = pricingMetadata;

export default async function PricingPage() {
  const res = await fetchAPI<{ data: any[] }>('/pricings');

  const plans: Pricing[] = (res.data || []).map((plan) => ({
    ...plan,
    Price: Number(plan.Price),

    extraFeatures: plan.extraFeatures?.extraFeatures || [],
  }));

  const proIndex = plans.findIndex((p) => p.planName === 'Pro');

  if (proIndex !== -1) {
    const [proPlanItem] = plans.splice(proIndex, 1);
    plans.splice(1, 0, proPlanItem);
  }

  const proPlan = plans.find((p) => p.planName === 'Pro');

  const ctaTitle = proPlan?.ctaTitle || PRICING_DEFAULTS.ctaTitle;
  const ctaSubtitle = proPlan?.ctaSubtitle || PRICING_DEFAULTS.ctaSubtitle;
  const contactNumber = proPlan?.contactNumber || PRICING_DEFAULTS.contactNumber;
  const highlightTitle = proPlan?.highlightTitle || PRICING_DEFAULTS.highlightTitle;
  const highlightPoints = proPlan?.highlightPoints || PRICING_DEFAULTS.highlightPoints;

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* HEADER */}
      <div className="mx-auto mb-16 max-w-2xl text-center">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-blue-100 p-3 transition hover:scale-110 dark:bg-blue-900/40">
            <BadgeCheck className="text-blue-600 dark:text-blue-300" />
          </div>
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          Simple, Transparent Pricing
        </h1>

        <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
          Choose a plan that fits your business needs
        </p>
      </div>

      {/* PRICING GRID */}
      {plans.length === 0 ? (
        <div className="py-20 text-center text-gray-500 dark:text-gray-400">
          No pricing plans available.
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => {
            const isPopular = plan.planName === 'Pro';

            return (
              <div
                key={plan.id}
                className="relative rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
                    <span className="flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1 text-xs text-white shadow-md">
                      <Sparkles size={12} />
                      Most Popular
                    </span>
                  </div>
                )}

                <PricingCard plan={plan} />
              </div>
            );
          })}
        </div>
      )}

      {/* HIGHLIGHT */}
      <div className="mt-20">
        <Card className="rounded-2xl border border-gray-200 transition-all hover:shadow-lg dark:border-gray-800">
          <CardContent className="p-10 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {highlightTitle}
            </h2>

            <div className="mt-6 flex flex-col justify-center gap-6 text-sm text-gray-700 md:flex-row dark:text-gray-300">
              {highlightPoints.map((point, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 transition hover:scale-105 hover:text-black dark:hover:text-white"
                >
                  <Check className="text-green-500" size={16} />
                  {point}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CTA */}
      <div className="mt-16 text-center">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{ctaTitle}</h3>

        <p className="mt-2 text-gray-700 dark:text-gray-300">{ctaSubtitle}</p>

        <div className="mt-6 flex justify-center">
          <a
            href={`tel:${contactNumber}`}
            aria-label="Call support"
            className="flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-blue-700 active:scale-95"
          >
            <Phone size={16} />
            {contactNumber}
          </a>
        </div>
      </div>
    </div>
  );
}
