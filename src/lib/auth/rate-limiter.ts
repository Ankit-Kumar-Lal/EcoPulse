interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up stale entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt <= now) {
      store.delete(key);
    }
  }
}, 60 * 1000);

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
}

/**
 * Basic in-memory rate limiter for server actions and API routes.
 */
export function checkRateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(identifier);

  if (!entry || entry.resetAt <= now) {
    store.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      success: true,
      limit,
      remaining: limit - 1,
      resetSeconds: Math.ceil(windowMs / 1000),
    };
  }

  if (entry.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      resetSeconds: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  entry.count += 1;
  return {
    success: true,
    limit,
    remaining: limit - entry.count,
    resetSeconds: Math.ceil((entry.resetAt - now) / 1000),
  };
}
