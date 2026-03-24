import { Card, CardContent } from "@/components/ui/Card";
import { CheckCircle } from "lucide-react";
import { Feature } from "@/app/types/feature";

interface FeatureCardProps {
  feature: Feature;
}

export default function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <Card className="hover:shadow-lg transition duration-300">
      <CardContent className="p-6">
        <div className="flex items-start gap-3">
          <CheckCircle className="text-blue-600 mt-1" size={20} />

          <div>
            <h3 className="font-semibold text-lg">
              {feature.title}
            </h3>

            <p className="text-gray-500 text-sm mt-1">
              {feature.description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}