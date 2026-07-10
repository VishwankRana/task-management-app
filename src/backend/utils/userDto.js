/** PII-safe user shapes for API responses */

export function publicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    calendarEnabled: user.role === 'Admin' ? true : (user.calendarEnabled ?? true),
    analyticsEnabled: user.role === 'Admin' ? true : (user.analyticsEnabled ?? true),
  };
}

export function memberUser(user) {
  if (!user) return null;
  return { id: user.id, name: user.name, role: user.role };
}

export function adminUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    calendarEnabled: user.calendarEnabled ?? true,
    analyticsEnabled: user.analyticsEnabled ?? true,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export function searchUser(user) {
  if (!user) return null;
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}
