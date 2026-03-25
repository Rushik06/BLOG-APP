import {
  Store,
  Zap,
  BarChart3,
  TrendingUp,
} from "lucide-react";

/* ICON MAP  */
export const iconMap = {
  store: Store,
  zap: Zap,
  chart: BarChart3,
  growth: TrendingUp,
};

/* FEATURES */
export const features = [
  {
    title: "Real-time Tracking",
    description: "Track inventory instantly with live updates.",
    icon: Zap,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Smart Analytics",
    description: "Get insights to boost sales and efficiency.",
    icon: BarChart3,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Multi-store Support",
    description: "Manage all your stores from one dashboard.",
    icon: Store,
    color: "bg-purple-100 text-purple-600",
  },
];