import { Subscriber } from '@/app/types/store';

export const subscribers: Subscriber[] = Array.from({ length: 1243 }, (_, i) => ({
  id: i + 1,
  email: `user${i + 1}@gmail.com`,
}));

export const users = Array.from({ length: 320 }, (_, i) => ({
  id: i + 1,
}));

export const orders = Array.from({ length: 89 }, (_, i) => ({
  id: i + 1,
}));

export const revenue = 45230;
