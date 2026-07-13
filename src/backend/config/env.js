const INSECURE_SECRETS = new Set([
  'your-jwt-secret-change-in-production',
  'change-me',
  'secret',
]);

function parseOrigins(value, fallback) {
  const raw = value || fallback;
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function isAllowedOrigin(origin, allowedOrigins) {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;

  if (process.env.CORS_ALLOW_VERCEL === 'true') {
    try {
      const { hostname, protocol } = new URL(origin);
      if (protocol === 'https:' && hostname.endsWith('.vercel.app')) {
        return true;
      }
    } catch {
      return false;
    }
  }

  return false;
}

let validated = false;

function validateEnv() {
  if (validated) return;
  validated = true;

  const errors = [];
  const isProd = process.env.NODE_ENV === 'production';

  if (!process.env.DATABASE_URL) {
    errors.push('DATABASE_URL is required');
  }

  const secret = process.env.JWT_SECRET?.trim();
  if (!secret) {
    errors.push('JWT_SECRET is required');
  } else if (secret.length < 32) {
    errors.push('JWT_SECRET must be at least 32 characters');
  } else if (isProd && INSECURE_SECRETS.has(secret)) {
    errors.push('JWT_SECRET must be a strong random value in production');
  }

  if (isProd && !process.env.APP_URL) {
    errors.push('APP_URL is required in production (Vercel frontend URL for CORS and email links)');
  }

  if (errors.length > 0) {
    console.error('Environment validation failed:');
    errors.forEach((e) => console.error(`  - ${e}`));
    process.exit(1);
  }
}

validateEnv();

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isProd: process.env.NODE_ENV === 'production',
  port: Number(process.env.PORT) || 3000,
  appUrl: process.env.APP_URL || 'http://localhost:5173',
  corsOrigins: parseOrigins(
    process.env.CORS_ORIGINS,
    process.env.APP_URL || 'http://localhost:5173'
  ),
  isAllowedOrigin,
  cookieCrossSite: process.env.COOKIE_CROSS_SITE === 'true' || process.env.NODE_ENV === 'production',
  jwtSecret: process.env.JWT_SECRET,
};
