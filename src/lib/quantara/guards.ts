const buckets = new Map<string, { count: number; resetAt: number }>();

export function assertRateLimit(key: string, limit = 80, windowMs = 60_000) {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }
  bucket.count += 1;
  if (bucket.count > limit) throw new Error("RATE_LIMITED");
}

export function parsePositiveAmount(value: unknown) {
  const amount = Math.round(Number(value) * 100) / 100;
  if (!Number.isFinite(amount) || amount <= 0) throw new Error("INVALID_AMOUNT");
  return amount;
}

export function parseOrderSide(value: unknown) {
  if (value !== "buy" && value !== "sell") throw new Error("INVALID_SIDE");
  return value;
}

export function requireString(value: unknown, error = "INVALID_INPUT") {
  if (typeof value !== "string" || !value.trim()) throw new Error(error);
  return value.trim();
}
