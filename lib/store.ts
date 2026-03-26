import { Subscriber } from '@/app/types/store';

export const subscribers: Subscriber[] = Array.from({ length: 1243 }, (_, i) => ({
  id: i + 1,
  email: `user${i + 1}@gmail.com`,
}));
