/**
 * Simple in-memory sliding-window rate limiter.
 * NOTE: On serverless hosts (e.g. Vercel) memory is per-instance, so this is a
 * best-effort guard. For stronger protection use a shared store such as Upstash Redis.
 */
const hits = new Map<string, number[]>()

export function isRateLimited(key: string, limit = 5, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter(t => now - t < windowMs)

  if (recent.length >= limit) {
    hits.set(key, recent)
    return true
  }

  recent.push(now)
  hits.set(key, recent)

  // Prevent unbounded growth
  if (hits.size > 5000) {
    hits.forEach((times, k) => {
      if (times.every(t => now - t >= windowMs)) hits.delete(k)
    })
  }
  return false
}
