// Only validated navigation data is retained; failed reads never populate the cache.
const entries = new Map<string, { value: unknown; expires: number }>();
const pending = new Map<string, Promise<unknown>>();
const TTL = 10 * 60 * 1000;

export async function cachedMenuData<T>(key: string, load: () => Promise<T>): Promise<T> {
  const cached = entries.get(key);
  if (cached && cached.expires > Date.now()) return cached.value as T;
  const existing = pending.get(key);
  if (existing) return existing as Promise<T>;

  const request = load().then((value) => {
    entries.delete(key);
    entries.set(key, { value, expires: Date.now() + TTL });
    if (entries.size > 128) entries.delete(entries.keys().next().value!);
    return value;
  }).finally(() => pending.delete(key));
  pending.set(key, request);
  return request;
}
