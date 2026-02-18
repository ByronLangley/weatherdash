import { RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX_REQUESTS } from "./constants";

const requestLog = new Map<string, number[]>();

export function checkRateLimit(
  ip: string,
  windowMs: number = RATE_LIMIT_WINDOW_MS,
  maxRequests: number = RATE_LIMIT_MAX_REQUESTS
): boolean {
  const now = Date.now();
  const timestamps = requestLog.get(ip) ?? [];
  const windowStart = now - windowMs;
  const recent = timestamps.filter((t) => t > windowStart);

  if (recent.length >= maxRequests) {
    requestLog.set(ip, recent);
    return false;
  }

  recent.push(now);
  requestLog.set(ip, recent);
  return true;
}

/** Reset all rate limit data (for testing) */
export function resetRateLimiter(): void {
  requestLog.clear();
}
