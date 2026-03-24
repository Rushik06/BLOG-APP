import { fetchAPI } from "@/lib/strapi";
import FeatureCard from "@/components/features/FeatureCard";
import { Feature } from "@/app/types/feature";
import {
  Sparkles,
  ArrowRight,
  Zap,
  BarChart3,
  Store,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default async function Features() {
  const res = await fetchAPI<{ data: Feature[] }>("/features");
  const features = res.data;

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">

      {/* ================= HEADER ================= */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        
        <div className="flex justify-center mb-4">
          <div className="bg-black text-white p-3 rounded-full">
            <Sparkles size={20} />
          </div>
        </div>

        <h1 className="text-4xl font-bold">
          Powerful Features
        </h1>

        <p className="text-gray-500 mt-3 text-lg">
          Everything you need to manage your retail business efficiently
        </p>
      </div>

      {/* ================= FEATURES GRID ================= */}
      {features.length === 0 ? (
        <div className="text-center text-gray-500 py-20">
          No features available.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="hover:-translate-y-1 transition-transform transition-shadow will-change-transform"
            >
              <FeatureCard feature={feature} />
            </div>
          ))}
        </div>
      )}

      {/* ================= COLORFUL BADGES ================= */}
      <div className="mt-20 flex flex-wrap justify-center gap-4">

        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 border border-blue-100 hover:scale-105 transition-transform">
          <Zap size={16} />
          Real-time updates
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-700 border border-green-100 hover:scale-105 transition-transform">
          <BarChart3 size={16} />
          Smart analytics
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 text-purple-700 border border-purple-100 hover:scale-105 transition-transform">
          <Store size={16} />
          Multi-store support
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-orange-700 border border-orange-100 hover:scale-105 transition-transform">
          <TrendingUp size={16} />
          Business growth
        </div>

      </div>

      {/* ================= CTA ================= */}
      <div className="mt-20 text-center">
        
        <Card className="border shadow-sm">
          <CardContent className="p-10">

            <h2 className="text-2xl font-semibold">
              Ready to experience it live?
            </h2>

            <p className="text-gray-500 mt-2">
              Explore how RetailPro works in real-time
            </p>

            <div className="mt-6 flex justify-center gap-4">

              {/* ✅ Scroll to Home Demo Section */}
              <Link href="/#demo">
                <Button className="flex items-center gap-2 hover:scale-105 transition-transform">
                  Live Demo
                  <ArrowRight size={16} />
                </Button>
              </Link>

              <Button
                variant="outline"
                className="hover:scale-105 transition-transform"
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