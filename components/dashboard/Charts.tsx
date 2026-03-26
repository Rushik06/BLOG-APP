'use client';

import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';

// CLIENT DATA
const chartData = [
  { name: 'Mon', users: 200 },
  { name: 'Tue', users: 400 },
  { name: 'Wed', users: 350 },
  { name: 'Thu', users: 600 },
  { name: 'Fri', users: 900 },
  { name: 'Sat', users: 700 },
  { name: 'Sun', users: 1200 },
];

export default function Chart() {
  return (
    <Card className="border-none bg-white/70 backdrop-blur-xl dark:bg-gray-900/70">
      <CardHeader>
        <CardTitle>Subscriber Growth</CardTitle>
      </CardHeader>

      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>

            <XAxis dataKey="name" stroke="#888" />

            <Tooltip
              contentStyle={{
                backgroundColor: '#111',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
              }}
            />

            <Line
              type="monotone"
              dataKey="users"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={false}
            />

          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}