import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function PricingCard({ plan }: any) {
  return (
    <Card>
      <h2>{plan.planName}</h2>
      <p style={{ fontSize: '24px' }}>₹{plan.price}</p>

      <Button>Choose Plan</Button>
    </Card>
  );
}
