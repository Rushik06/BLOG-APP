import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Check } from 'lucide-react';
import { PricingCardProps } from '@/app/types/pricing';

export default function PricingCard({ plan }: PricingCardProps) {
  return (
    <Card className="h-full rounded-2xl border border-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800">
      <CardContent className="flex h-full flex-col p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{plan.planName}</h2>

        <p className="mt-4 text-3xl font-bold text-blue-600">₹{plan.Price}</p>

        {/* FEATURES */}
        <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center justify-center gap-2">
            <Check size={16} className="text-green-500" />
            Real-time tracking
          </div>

          <div className="flex items-center justify-center gap-2">
            <Check size={16} className="text-green-500" />
            Smart analytics
          </div>

          <div className="flex items-center justify-center gap-2">
            <Check size={16} className="text-green-500" />
            Multi-store support
          </div>
        </div>

        {/* EXTRA FEATURES */}
        {plan.extraFeatures && plan.extraFeatures.length > 0 && (
          <div className="mt-4 space-y-2 border-t border-gray-200 pt-4 dark:border-gray-700">
            {plan.extraFeatures.map((feature, i) => (
              <div
                key={i}
                className="flex items-center justify-center gap-2 text-sm text-gray-700 dark:text-gray-300"
              >
                <Check size={14} className="text-blue-500" />
                {feature}
              </div>
            ))}
          </div>
        )}

        {/* THIS MAKES HEIGHT EQUAL */}
        <div className="flex-grow" />

        <Button className="mt-6 w-full transition hover:scale-105">Get Started</Button>
      </CardContent>
    </Card>
  );
}
