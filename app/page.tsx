import Link from 'next/link';
import { getText } from '@/lib/strapi-helpers';
import { iconMap, howItWorksColors } from '@/app/constants/landing-constants';
import { getLandingData } from '@/app/hooks/uselanding-data';

import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import ScrollToHeroBadge from '@/components/ui/ScrollToHeroBadge';

import { ArrowRight, Star, Sparkles } from 'lucide-react';
import { homeMetadata } from '@/app/metadata/home';

export const metadata = homeMetadata;

export default async function Home() {
  const { data, testimonials, features } = await getLandingData();

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">

      {/* HERO */}
      <div id="hero" className="mx-auto mb-20 max-w-2xl text-center">
        <div className="mb-4 flex justify-center">
          <div className="animate-pulse rounded-full bg-blue-100 p-3 dark:bg-blue-900/40">
            <Sparkles className="text-blue-600 dark:text-blue-300" size={20} />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          {data.HeroTitle}
        </h1>

        <p className="mt-3 text-lg text-gray-700 dark:text-gray-300">
          {data.HeroSubtitle}
        </p>

        <div className="mt-6 flex justify-center gap-4">

          {/* PRIMARY CTA */}
          <Button className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-lg">
            {data.CTAText}
            <ArrowRight size={16} />
          </Button>

          {/* SECONDARY CTA  */}
          <Link href={data.secondaryCTALink || '/demo'}>
            <Button variant="outline">
              {data.secondaryCTAText || 'Live Demo'}
            </Button>
          </Link>

        </div>
      </div>

      {/* FEATURES */}
      <div className="mx-auto mb-20 max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          {data.featuresTitle}
        </h2>

        <p className="mt-3 text-gray-700 dark:text-gray-300">
          {data.featuresSubtitle}
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => {
          const Icon =
            iconMap[feature.icon as keyof typeof iconMap] || iconMap.store;

          return (
            <Card key={feature.id || index}>
              <CardContent className="p-6 text-left">
                <div
                  className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg ${feature.color}`}
                >
                  <Icon size={18} />
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* HOW IT WORKS */}
      <div className="mt-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          {data.howItWorksTitle}
        </h2>

        <p className="mx-auto mt-3 max-w-2xl text-gray-700 dark:text-gray-300">
          {data.howItWorksSubTitle}
        </p>
      </div>

      <div className="mt-12 flex flex-col items-center gap-8 md:flex-row md:justify-between">
        {data.howItWorksStep?.map((step, index) => {
          const Icon =
            iconMap[step.icon as keyof typeof iconMap] || iconMap.store;

          const isLast = index === data.howItWorksStep.length - 1;

          return (
            <div key={index} className="flex items-center">
              <div className="group flex flex-col items-center text-center">
                <div
                  className={`rounded-full p-4 ${
                    howItWorksColors[index % 4]
                  } transition group-hover:scale-110`}
                >
                  <Icon size={24} />
                </div>

                <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">
                  {step.title}
                </h3>

                <p className="mt-2 max-w-[180px] text-sm text-gray-700 dark:text-gray-300">
                  {step.description}
                </p>
              </div>

              {!isLast && (
                <ArrowRight className="mx-6 hidden text-gray-300 md:block dark:text-gray-600" />
              )}
            </div>
          );
        })}
      </div>

      {/* SCROLL BADGE */}
      <div className="mt-12 flex justify-center">
        <ScrollToHeroBadge />
      </div>

      {/* TESTIMONIALS */}
      <div className="mt-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          What our users say
        </h2>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {testimonials.map((t) => (
          <Card key={t.id}>
            <CardContent className="p-6 text-left">
              <div className="mb-3 flex gap-1 text-yellow-500">
                {Array.from({ length: t.rating ?? 5 }).map((_, i) => (
                  <Star key={i} size={16} />
                ))}
              </div>

              <p className="text-sm text-gray-700 dark:text-gray-300">
                “{getText(t.content)}”
              </p>

              <p className="mt-4 font-medium text-gray-900 dark:text-white">
                {t.name}
              </p>

              <p className="text-xs text-gray-600 dark:text-gray-400">
                {t.role}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
}