export interface Testimonial {
  name: string;
  role: string;
  content: string;
}

export const testimonials: Testimonial[] = [
  {
    name: "Rahul Sharma",
    role: "Retail Owner",
    content:
      "This platform transformed how we manage inventory. Super easy and powerful.",
  },
  {
    name: "Priya Patel",
    role: "Store Manager",
    content:
      "Analytics and tracking features are amazing. Helped us reduce stock loss.",
  },
  {
    name: "Amit Verma",
    role: "Business Owner",
    content:
      "Highly recommended for anyone running multiple stores.",
  },
];