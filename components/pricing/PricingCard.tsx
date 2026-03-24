import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Check } from 'lucide-react';
import { Pricing } from '@/app/types/pricing';

interface PricingCardProps {
  plan: Pricing;
}

export default function PricingCard({ plan }: PricingCardProps) {
  return (
    <Card className="border transition duration-300 hover:shadow-xl">
      <CardContent className="p-6 text-center">
        <h2 className="text-xl font-semibold">{plan.planName}</h2>

        <p className="mt-4 text-3xl font-bold text-blue-600">₹{plan.Price}</p>

        <div className="mt-4 space-y-2 text-sm text-gray-600">
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

        <Button className="mt-6 w-full">Get Started</Button>
      </CardContent>
    </Card>
  );
}
