const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 5;

const ipHits = new Map();

function pruneOldEntries(map, now) {
  for (const [key, timestamps] of map.entries()) {
    const fresh = timestamps.filter((t) => now - t < WINDOW_MS);
    if (fresh.length === 0) map.delete(key);
    else map.set(key, fresh);
  }
}

export function rateLimitForgotPassword(req, res, next) {
  const now = Date.now();
  pruneOldEntries(ipHits, now);

  const ip = req.ip || req.socket?.remoteAddress || 'unknown';
  const email = req.body?.email?.trim().toLowerCase() || '';
  const key = `${ip}:${email}`;

  const hits = ipHits.get(key) || [];
  if (hits.length >= MAX_REQUESTS) {
    return res.status(429).json({
      error: 'Too many password reset requests. Please try again later.',
    });
  }

  hits.push(now);
  ipHits.set(key, hits);
  next();
}
