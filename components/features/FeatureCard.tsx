import { Card, CardContent } from '@/components/ui/Card';
import { CheckCircle } from 'lucide-react';
import { Feature } from '@/app/types/feature';

interface FeatureCardProps {
  feature: Feature;
}

export default function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <Card className="transition duration-300 hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-start gap-3">
          <CheckCircle className="mt-1 text-blue-600" size={20} />

          <div>
            <h3 className="text-lg font-semibold">{feature.title}</h3>

            <p className="mt-1 text-sm text-gray-500">{feature.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
