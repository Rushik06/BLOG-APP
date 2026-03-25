import Link from 'next/link';
import { fetchAPI } from '@/lib/strapi';
import { getText } from '@/lib/strapi-helpers';
import { iconMap, features } from '@/app/constants/landing-constants';

import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import ScrollToHeroBadge from '@/components/ui/ScrollToHeroBadge';

import {
  ArrowRight,
  Star,
  Sparkles,
} from 'lucide-react';

import type { LandingPage } from './types/landing-page';
import type { Testimonial } from './types/testimonals';
import { homeMetadata } from '@/app/metadata/home';

export const metadata = homeMetadata;

export default async function Home() {
  const [landingRes, testimonialRes] = await Promise.all([
    fetchAPI<{ data: any[] }>('/landing-pages?populate=howItWorksStep'),
    fetchAPI<{ data: Testimonial[] }>('/testimonals'),
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

  const testimonials = testimonialRes?.data ?? [];

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">

      {/* HERO  */}

      <div id="hero" className="mx-auto mb-20 max-w-2xl text-center">

        {/*ICON*/}
        <div className="mb-4 flex justify-center">
          <div className="animate-pulse rounded-full bg-blue-100 p-3">
            <Sparkles className="text-blue-600" size={20} aria-label="Retail features highlight" />
          </div>
        </div>

        <h1 className="text-4xl font-bold">
          {data.HeroTitle}
        </h1>

        <p className="mt-3 text-lg text-gray-600">
          {data.HeroSubtitle}
        </p>

        <div className="mt-6 flex justify-center gap-4">

          {/* CTA with hover */}
          <Button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow-md transition-all duration-300 hover:bg-blue-700 hover:scale-105 hover:shadow-lg">
            {data.CTAText}
            <ArrowRight size={16} />
          </Button>

          <Link href="/demo" aria-label="View live demo of RetailPro">
            <Button
              variant="outline"
              className="hover:bg-gray-100 transition"
            >
              Live Demo
            </Button>
          </Link>

        </div>
      </div>

      {/* FEATURES  */}
      <div className="mx-auto mb-20 max-w-2xl text-center">
        <h2 className="text-3xl font-bold">
          {data.featuresTitle}
        </h2>

        <p className="mt-3 text-gray-600">
          {data.featuresSubtitle}
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <Card
              key={index}
              className="border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 rounded-xl"
            >
              <CardContent className="p-6 text-left">


                <div
                  className={`mb-4 w-10 h-10 flex items-center justify-center rounded-lg ${feature.color}`}
                >
                  <Icon size={18} />
                </div>

                <h3 className="text-lg font-semibold">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm text-gray-600">
                  {feature.description}
                </p>

              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* HOW IT WORKS */}
      <div className="mt-20 text-center">
        <h2 className="text-3xl font-bold">
          {data.howItWorksTitle}
        </h2>

        <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
          {data.howItWorksSubTitle}
        </p>
      </div>

      <div className="mt-12 flex flex-col items-center gap-8 md:flex-row md:justify-between">

        {data.howItWorksStep?.map((step, index) => {
          const Icon =
            iconMap[step.icon as keyof typeof iconMap] || iconMap.store;

          const colors = [
            'bg-blue-100 text-blue-600',
            'bg-green-100 text-green-600',
            'bg-purple-100 text-purple-600',
            'bg-orange-100 text-orange-600',
          ];

          const isLast =
            index === data.howItWorksStep!.length - 1;

          return (
            <div key={index} className="flex items-center">

              <div className="flex flex-col items-center text-center group">

                <div className={`rounded-full p-4 ${colors[index % 4]} group-hover:scale-110 transition`}>
                  <Icon size={24} />
                </div>

                <h3 className="mt-4 font-semibold">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm text-gray-600 max-w-[180px]">
                  {step.description}
                </p>

              </div>

              {!isLast && (
                <ArrowRight className="mx-6 hidden text-gray-300 md:block" />
              )}

            </div>
          );
        })}

      </div>

      <div className="mt-10 flex justify-center">
        <ScrollToHeroBadge />
      </div>

      {/* TESTIMONIALS*/}
      <div className="mt-20 text-center">
        <h2 className="text-3xl font-bold">
          What our users say
        </h2>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {testimonials.map((t) => (
          <Card
            key={t.id}
            className="hover:shadow-lg transition hover:-translate-y-1"
          >
            <CardContent className="p-6 text-left">

              <div className="mb-3 flex gap-1 text-yellow-500">
                {Array.from({ length: t.rating ?? 5 }).map((_, i) => (
                  <Star key={i} size={16} />
                ))}
              </div>

              <p className="text-sm text-gray-600">
                “{getText(t.content)}”
              </p>

              <p className="mt-4 font-medium">{t.name}</p>
              <p className="text-xs text-gray-600">{t.role}</p>

            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
}