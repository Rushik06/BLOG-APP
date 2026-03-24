import Link from 'next/link';
import { fetchAPI } from '@/lib/strapi';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import ScrollToHeroBadge from '@/components/ui/ScrollToHeroBadge';

import { ArrowRight, BarChart3, Store, Zap, Star, TrendingUp } from 'lucide-react';

import type { LandingPage } from './types/landing-page';
import { testimonials } from './constants/testimonals';

export default async function Home() {
  const res = await fetchAPI<{ data: LandingPage }>('/landing-pages');
  const data = res.data;

  return (
    <div className="flex flex-col items-center text-center">
      {/*  HERO  */}
      <section id="hero" className="max-w-3xl py-24">
        <h1 className="text-5xl leading-tight font-bold">{data?.HeroTitle}</h1>

        <p className="mt-4 text-lg text-gray-500">{data?.HeroSubtitle}</p>

        <div className="mt-6 flex justify-center gap-4">
          {/* PRIMARY CTA */}
          <Button
            size="lg"
            className="flex items-center gap-2 shadow-sm transition-transform hover:scale-105 hover:shadow-md"
          >
            {data?.CTAText}
            <ArrowRight size={16} />
          </Button>

          {/* LIVE DEMO BUTTON */}
          <Link href="/demo">
            <Button
              variant="outline"
              size="lg"
              className="flex items-center gap-2 border-blue-200 transition-transform hover:scale-105 hover:border-blue-400 hover:shadow-md"
            >
              Live Demo
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </section>

      {/*  FEATURES */}
      <section className="w-full max-w-6xl py-16">
        <h2 className="mb-10 text-3xl font-bold">Powerful Features</h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="transition-all hover:-translate-y-2 hover:shadow-xl">
            <CardContent className="p-6 text-left">
              <Zap className="mb-3 text-blue-600" />
              <h3 className="text-lg font-semibold">Real-time Tracking</h3>
              <p className="mt-2 text-sm text-gray-500">
                Track inventory instantly with live updates.
              </p>
            </CardContent>
          </Card>

          <Card className="transition-all hover:-translate-y-2 hover:shadow-xl">
            <CardContent className="p-6 text-left">
              <BarChart3 className="mb-3 text-green-600" />
              <h3 className="text-lg font-semibold">Smart Analytics</h3>
              <p className="mt-2 text-sm text-gray-500">
                Get insights to boost sales and efficiency.
              </p>
            </CardContent>
          </Card>

          <Card className="transition-all hover:-translate-y-2 hover:shadow-xl">
            <CardContent className="p-6 text-left">
              <Store className="mb-3 text-purple-600" />
              <h3 className="text-lg font-semibold">Multi-store Support</h3>
              <p className="mt-2 text-sm text-gray-500">
                Manage all your stores from one dashboard.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* HOW IT WORKS  */}
      <section className="w-full max-w-6xl py-20">
        <h2 className="mb-6 text-3xl font-bold">How RetailPro Works</h2>

        <p className="mx-auto mb-12 max-w-2xl text-gray-500">
          From adding products to tracking performance — everything flows seamlessly.
        </p>

        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          {/* STEP 1 */}
          <div className="group flex flex-col items-center text-center">
            <div className="rounded-full bg-blue-100 p-4 transition group-hover:scale-110">
              <Store className="text-blue-600" size={28} />
            </div>
            <h3 className="mt-4 font-semibold">Add Products</h3>
            <p className="mt-2 max-w-[180px] text-sm text-gray-500">
              Easily add and manage all your inventory items.
            </p>
          </div>

          <ArrowRight className="hidden text-gray-400 md:block" />

          {/* STEP 2 */}
          <div className="group flex flex-col items-center text-center">
            <div className="rounded-full bg-green-100 p-4 transition group-hover:scale-110">
              <Zap className="text-green-600" size={28} />
            </div>
            <h3 className="mt-4 font-semibold">Track Inventory</h3>
            <p className="mt-2 max-w-[180px] text-sm text-gray-500">
              Monitor stock levels in real-time across stores.
            </p>
          </div>

          <ArrowRight className="hidden text-gray-400 md:block" />

          {/* STEP 3 */}
          <div className="group flex flex-col items-center text-center">
            <div className="rounded-full bg-purple-100 p-4 transition group-hover:scale-110">
              <BarChart3 className="text-purple-600" size={28} />
            </div>
            <h3 className="mt-4 font-semibold">Analyze Data</h3>
            <p className="mt-2 max-w-[180px] text-sm text-gray-500">
              Get insights with powerful analytics dashboard.
            </p>
          </div>

          <ArrowRight className="hidden text-gray-400 md:block" />

          {/* STEP 4 */}
          <div className="group flex flex-col items-center text-center">
            <div className="rounded-full bg-orange-100 p-4 transition group-hover:scale-110">
              <TrendingUp className="text-orange-600" size={28} />
            </div>
            <h3 className="mt-4 font-semibold">Grow Business</h3>
            <p className="mt-2 max-w-[180px] text-sm text-gray-500">
              Optimize operations and increase revenue.
            </p>
          </div>
        </div>

        {/* INTERACTIVE BADGE */}
        <ScrollToHeroBadge />
      </section>

      {/* TESTIMONIALS */}
      <section className="w-full max-w-6xl py-16">
        <h2 className="mb-10 text-3xl font-bold">What our users say</h2>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name} className="transition-all hover:-translate-y-2 hover:shadow-xl">
              <CardContent className="p-6 text-left">
                <div className="mb-3 flex gap-1 text-yellow-500">
                  <Star size={16} />
                  <Star size={16} />
                  <Star size={16} />
                  <Star size={16} />
                  <Star size={16} />
                </div>

                <p className="text-sm text-gray-600">“{t.content}”</p>

                <p className="mt-4 font-medium">{t.name}</p>
                <p className="text-xs text-gray-500">{t.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/*  FINAL CTA */}
      <section className="max-w-2xl py-20 text-center">
        <h2 className="text-3xl font-bold">Ready to scale your business?</h2>

        <p className="mt-3 text-gray-500">Join thousands of retailers using RetailPro.</p>

        <Button
          size="lg"
          className="mt-6 shadow-sm transition-transform hover:scale-105 hover:shadow-md"
        >
          Get Started Now
        </Button>
      </section>
    </div>
  );
}
