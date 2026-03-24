import Link from "next/link";
import { fetchAPI } from "@/lib/strapi";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import ScrollToHeroBadge from "@/components/ui/ScrollToHeroBadge";

import {
  ArrowRight,
  BarChart3,
  Store,
  Zap,
  Star,
  TrendingUp,
} from "lucide-react";

import type { LandingPage } from "./types/landing-page";
import { testimonials } from "./constants/testimonals";

export default async function Home() {
  const res = await fetchAPI<{ data: LandingPage }>("/landing-pages");
  const data = res.data;

  return (
    <div className="flex flex-col items-center text-center">

      {/*  HERO  */}
      <section id="hero" className="py-24 max-w-3xl">
        <h1 className="text-5xl font-bold leading-tight">
          {data?.HeroTitle}
        </h1>

        <p className="text-gray-500 mt-4 text-lg">
          {data?.HeroSubtitle}
        </p>

        <div className="mt-6 flex justify-center gap-4">

          {/* PRIMARY CTA */}
          <Button
            size="lg"
            className="flex items-center gap-2 hover:scale-105 transition-transform shadow-sm hover:shadow-md"
          >
            {data?.CTAText}
            <ArrowRight size={16} />
          </Button>

          {/* LIVE DEMO BUTTON */}
          <Link href="/demo">
            <Button
              variant="outline"
              size="lg"
              className="flex items-center gap-2 hover:scale-105 transition-transform hover:shadow-md border-blue-200 hover:border-blue-400"
            >
              Live Demo
              <ArrowRight size={16} />
            </Button>
          </Link>

        </div>
      </section>

      {/*  FEATURES */}
      <section className="w-full max-w-6xl py-16">
        <h2 className="text-3xl font-bold mb-10">
          Powerful Features
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          <Card className="hover:-translate-y-2 transition-all hover:shadow-xl">
            <CardContent className="p-6 text-left">
              <Zap className="text-blue-600 mb-3" />
              <h3 className="font-semibold text-lg">
                Real-time Tracking
              </h3>
              <p className="text-gray-500 text-sm mt-2">
                Track inventory instantly with live updates.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:-translate-y-2 transition-all hover:shadow-xl">
            <CardContent className="p-6 text-left">
              <BarChart3 className="text-green-600 mb-3" />
              <h3 className="font-semibold text-lg">
                Smart Analytics
              </h3>
              <p className="text-gray-500 text-sm mt-2">
                Get insights to boost sales and efficiency.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:-translate-y-2 transition-all hover:shadow-xl">
            <CardContent className="p-6 text-left">
              <Store className="text-purple-600 mb-3" />
              <h3 className="font-semibold text-lg">
                Multi-store Support
              </h3>
              <p className="text-gray-500 text-sm mt-2">
                Manage all your stores from one dashboard.
              </p>
            </CardContent>
          </Card>

        </div>
      </section>

      {/* HOW IT WORKS  */}
      <section className="w-full max-w-6xl py-20">
        <h2 className="text-3xl font-bold mb-6">
          How RetailPro Works
        </h2>

        <p className="text-gray-500 mb-12 max-w-2xl mx-auto">
          From adding products to tracking performance — everything flows seamlessly.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8">

          {/* STEP 1 */}
          <div className="flex flex-col items-center text-center group">
            <div className="p-4 bg-blue-100 rounded-full group-hover:scale-110 transition">
              <Store className="text-blue-600" size={28} />
            </div>
            <h3 className="mt-4 font-semibold">Add Products</h3>
            <p className="text-gray-500 text-sm mt-2 max-w-[180px]">
              Easily add and manage all your inventory items.
            </p>
          </div>

          <ArrowRight className="hidden md:block text-gray-400" />

          {/* STEP 2 */}
          <div className="flex flex-col items-center text-center group">
            <div className="p-4 bg-green-100 rounded-full group-hover:scale-110 transition">
              <Zap className="text-green-600" size={28} />
            </div>
            <h3 className="mt-4 font-semibold">Track Inventory</h3>
            <p className="text-gray-500 text-sm mt-2 max-w-[180px]">
              Monitor stock levels in real-time across stores.
            </p>
          </div>

          <ArrowRight className="hidden md:block text-gray-400" />

          {/* STEP 3 */}
          <div className="flex flex-col items-center text-center group">
            <div className="p-4 bg-purple-100 rounded-full group-hover:scale-110 transition">
              <BarChart3 className="text-purple-600" size={28} />
            </div>
            <h3 className="mt-4 font-semibold">Analyze Data</h3>
            <p className="text-gray-500 text-sm mt-2 max-w-[180px]">
              Get insights with powerful analytics dashboard.
            </p>
          </div>

          <ArrowRight className="hidden md:block text-gray-400" />

          {/* STEP 4 */}
          <div className="flex flex-col items-center text-center group">
            <div className="p-4 bg-orange-100 rounded-full group-hover:scale-110 transition">
              <TrendingUp className="text-orange-600" size={28} />
            </div>
            <h3 className="mt-4 font-semibold">Grow Business</h3>
            <p className="text-gray-500 text-sm mt-2 max-w-[180px]">
              Optimize operations and increase revenue.
            </p>
          </div>

        </div>

        {/* INTERACTIVE BADGE */}
        <ScrollToHeroBadge />
      </section>

      {/* TESTIMONIALS */}
      <section className="w-full max-w-6xl py-16">
        <h2 className="text-3xl font-bold mb-10">
          What our users say
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card
              key={t.name}
              className="hover:-translate-y-2 transition-all hover:shadow-xl"
            >
              <CardContent className="p-6 text-left">
                <div className="flex gap-1 text-yellow-500 mb-3">
                  <Star size={16} />
                  <Star size={16} />
                  <Star size={16} />
                  <Star size={16} />
                  <Star size={16} />
                </div>

                <p className="text-gray-600 text-sm">
                  “{t.content}”
                </p>

                <p className="mt-4 font-medium">{t.name}</p>
                <p className="text-gray-500 text-xs">{t.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/*  FINAL CTA */}
      <section className="py-20 text-center max-w-2xl">
        <h2 className="text-3xl font-bold">
          Ready to scale your business?
        </h2>

        <p className="text-gray-500 mt-3">
          Join thousands of retailers using RetailPro.
        </p>

        <Button
          size="lg"
          className="mt-6 hover:scale-105 transition-transform shadow-sm hover:shadow-md"
        >
          Get Started Now
        </Button>
      </section>

    </div>
  );
}