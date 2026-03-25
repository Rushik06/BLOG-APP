import { fetchAPI } from '@/lib/strapi';
import FeatureCard from '@/components/features/FeatureCard';
import { Feature } from '@/app/types/feature';
import { Sparkles, ArrowRight, Zap, BarChart3, Store, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { featuresMetadata } from '@/app/metadata/features';

export const metadata = featuresMetadata;

export default async function Features() {
  const res = await fetchAPI<{ data: Feature[] }>('/features');
  const features = res.data;

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">

      {/*  HEADER */}
      <div className="mx-auto mb-16 max-w-2xl text-center">

        <div className="mb-4 flex justify-center">
          <div className="animate-pulse rounded-full bg-blue-100 dark:bg-blue-900/40 p-3">
            <Sparkles
              className="text-blue-600 dark:text-blue-300"
              size={20}
              aria-label="Retail features highlight"
            />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Powerful Features
        </h1>

        <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
          Everything you need to manage your retail business efficiently
        </p>
      </div>

      {/*  FEATURES GRID  */}
      {features.length === 0 ? (
        <div className="py-20 text-center text-gray-500 dark:text-gray-400">
          No features available.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="transition-all duration-300 hover:-translate-y-1"
            >
              <FeatureCard feature={feature} />
            </div>
          ))}
        </div>
      )}

      {/*  BADGES */}
      <div className="mt-20 flex flex-wrap justify-center gap-4">

        <div className="flex items-center gap-2 rounded-full border border-blue-100 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 text-blue-700 dark:text-blue-300 transition hover:scale-105">
          <Zap size={16} />
          Real-time updates
        </div>

        <div className="flex items-center gap-2 rounded-full border border-green-100 dark:border-green-800 bg-green-50 dark:bg-green-900/30 px-4 py-2 text-green-700 dark:text-green-300 transition hover:scale-105">
          <BarChart3 size={16} />
          Smart analytics
        </div>

        <div className="flex items-center gap-2 rounded-full border border-purple-100 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/30 px-4 py-2 text-purple-700 dark:text-purple-300 transition hover:scale-105">
          <Store size={16} />
          Multi-store support
        </div>

        <div className="flex items-center gap-2 rounded-full border border-orange-100 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/30 px-4 py-2 text-orange-700 dark:text-orange-300 transition hover:scale-105">
          <TrendingUp size={16} />
          Business growth
        </div>

      </div>

      {/* CTA */}
      <div className="mt-20 text-center">
        <Card className="border border-gray-200 dark:border-gray-800 rounded-2xl transition hover:shadow-lg">
          <CardContent className="p-10">

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Ready to experience it live?
            </h2>

            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Explore how RetailPro works in real-time
            </p>

            <div className="mt-6 flex justify-center gap-4">

              <Link href="/#demo" aria-label="View live demo of RetailPro">
                <Button className="flex items-center gap-2 transition hover:scale-105">
                  Live Demo
                  <ArrowRight size={16} />
                </Button>
              </Link>

              <Button
                variant="outline"
                className="transition hover:scale-105 dark:border-gray-700 dark:text-gray-200"
              >
                Get Started
              </Button>

            </div>

          </CardContent>
        </Card>
      </div>

    </div>
  );
}