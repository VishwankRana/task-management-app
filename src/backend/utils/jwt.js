import jwt from 'jsonwebtoken';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export { COOKIE_OPTIONS };

export function signAuthToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
      sessionVersion: user.sessionVersion ?? 0,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function setAuthCookie(res, user) {
  const token = signAuthToken(user);
  res.cookie('token', token, COOKIE_OPTIONS);
  return token;
}

export function clearAuthCookie(res) {
  res.clearCookie('token', { ...COOKIE_OPTIONS, maxAge: 0 });
}
