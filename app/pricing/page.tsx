import { fetchAPI } from '@/lib/strapi';
import PricingCard from '@/components/pricing/PricingCard';
import { Pricing } from '@/app/types/pricing';
import { PRICING_DEFAULTS } from '@/app/constants/pricing-constants';

import { BadgeCheck, Check, Sparkles, Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { pricingMetadata } from '@/app/metadata/pricing';

export const metadata = pricingMetadata;

export default async function PricingPage() {
  const res = await fetchAPI<{ data: Pricing[] }>('/pricings');

  const plans = res.data.map((plan) => ({
    ...plan,
    price: Number(plan.Price),
  }));

  // Ensure PRO plan
  const proIndex = plans.findIndex((p) => p.planName === 'Pro');

  if (proIndex !== -1) {
    const [proPlanItem] = plans.splice(proIndex, 1);
    plans.splice(1, 0, proPlanItem); // insert at middle
  }

  const proPlan = plans.find((p) => p.planName === 'Pro');

  // Backend and constants fallback
  const ctaTitle = proPlan?.ctaTitle || PRICING_DEFAULTS.ctaTitle;

  const ctaSubtitle = proPlan?.ctaSubtitle || PRICING_DEFAULTS.ctaSubtitle;

  const contactNumber = proPlan?.contactNumber || PRICING_DEFAULTS.contactNumber;

  const highlightTitle = proPlan?.highlightTitle || PRICING_DEFAULTS.highlightTitle;

  const highlightPoints = proPlan?.highlightPoints || PRICING_DEFAULTS.highlightPoints;

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* HEADER  */}
      <div className="mx-auto mb-16 max-w-2xl text-center">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-blue-100 p-3 transition hover:scale-110">
            <BadgeCheck className="text-blue-600" />
          </div>
        </div>

        <h1 className="text-4xl font-bold tracking-tight">Simple, Transparent Pricing</h1>

        <p className="mt-3 text-lg text-gray-500">Choose a plan that fits your business needs</p>
      </div>

      {/*  PRICING GRID  */}
      {plans.length === 0 ? (
        <div className="py-20 text-center text-gray-500">No pricing plans available.</div>
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

                <PricingCard
                  plan={{
                    ...plan,
                    Price: plan.price,
                  }}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* HIGHLIGHT  */}
      <div className="mt-20">
        <Card className="rounded-2xl border-blue-100 transition-all hover:shadow-lg">
          <CardContent className="p-10 text-center">
            <h2 className="text-2xl font-semibold">{highlightTitle}</h2>

            <div className="mt-6 flex flex-col justify-center gap-6 text-sm text-gray-600 md:flex-row">
              {highlightPoints.map((point: string, i: number) => (
                <div
                  key={i}
                  className="flex items-center gap-2 transition hover:scale-105 hover:text-black"
                >
                  <Check className="text-green-500" size={16} />
                  {point}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/*  CTA  */}
      <div className="mt-16 text-center">
        <h3 className="text-xl font-semibold">{ctaTitle}</h3>

        <p className="mt-2 text-gray-500">{ctaSubtitle}</p>

        <div className="mt-6 flex justify-center">
          <a
            href={`tel:${contactNumber}`}
            className="flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-white shadow-md transition hover:scale-105 hover:bg-blue-700 active:scale-95"
          >
            <Phone size={16} />
            {contactNumber}
          </a>
        </div>
      </div>
    </div>
  );
}
