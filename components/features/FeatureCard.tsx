import { Card, CardContent } from '@/components/ui/Card';
import { CheckCircle } from 'lucide-react';
import { FeatureCardProps } from '@/app/types/feature';

export default function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <Card className="border border-gray-200 transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800">
      <CardContent className="p-6">
        <div className="flex items-start gap-3">
          {/* ICON */}
          <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/40">
            <CheckCircle className="text-blue-600 dark:text-blue-300" size={18} />
          </div>

          {/* TEXT */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{feature.title}</h3>

            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
