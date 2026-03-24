import { fetchAPI } from '@/lib/strapi';
import FeatureCard from '@/components/features/FeatureCard';
import { Feature } from '@/app/types/feature';
import { Sparkles, ArrowRight, Zap, BarChart3, Store, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default async function Features() {
  const res = await fetchAPI<{ data: Feature[] }>('/features');
  const features = res.data;

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      {/*  HEADER */}
      <div className="mx-auto mb-16 max-w-2xl text-center">
        {/*ICON */}
        <div className="mb-4 flex justify-center">
          <div className="animate-pulse rounded-full bg-blue-100 p-3">
            <Sparkles className="text-blue-600" size={20} />
          </div>
        </div>

        <h1 className="text-4xl font-bold">Powerful Features</h1>

        <p className="mt-3 text-lg text-gray-500">
          Everything you need to manage your retail business efficiently
        </p>
      </div>

      {/* FEATURES GRID */}
      {features.length === 0 ? (
        <div className="py-20 text-center text-gray-500">No features available.</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="transition-shadow transition-transform will-change-transform hover:-translate-y-1"
            >
              <FeatureCard feature={feature} />
            </div>
          ))}
        </div>
      )}

      {/* BADGES  */}
      <div className="mt-20 flex flex-wrap justify-center gap-4">
        <div className="flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-blue-700 transition-transform hover:scale-105">
          <Zap size={16} />
          Real-time updates
        </div>

        <div className="flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-4 py-2 text-green-700 transition-transform hover:scale-105">
          <BarChart3 size={16} />
          Smart analytics
        </div>

        <div className="flex items-center gap-2 rounded-full border border-purple-100 bg-purple-50 px-4 py-2 text-purple-700 transition-transform hover:scale-105">
          <Store size={16} />
          Multi-store support
        </div>

        <div className="flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-orange-700 transition-transform hover:scale-105">
          <TrendingUp size={16} />
          Business growth
        </div>
      </div>

      {/* CTA */}
      <div className="mt-20 text-center">
        <Card className="border shadow-sm">
          <CardContent className="p-10">
            <h2 className="text-2xl font-semibold">Ready to experience it live?</h2>

            <p className="mt-2 text-gray-500">Explore how RetailPro works in real-time</p>

            <div className="mt-6 flex justify-center gap-4">
              {/* Scroll to Home Demo Section */}
              <Link href="/#demo">
                <Button className="flex items-center gap-2 transition-transform hover:scale-105">
                  Live Demo
                  <ArrowRight size={16} />
                </Button>
              </Link>

              <Button variant="outline" className="transition-transform hover:scale-105">
                Get Started
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
