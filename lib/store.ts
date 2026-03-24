const globalForSubscribers = globalThis as unknown as {
  subscribers: string[] | undefined;
};

export const subscribers =
  globalForSubscribers.subscribers ?? [];

if (!globalForSubscribers.subscribers) {
  globalForSubscribers.subscribers = subscribers;
}