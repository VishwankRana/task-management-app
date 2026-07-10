/** Redact PII before writing to logs */

export function redactEmail(email) {
  if (!email || typeof email !== 'string') return '[redacted]';
  const at = email.indexOf('@');
  if (at <= 0) return '[redacted]';
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  const visible = local.length <= 1 ? '*' : `${local[0]}***`;
  return `${visible}@${domain}`;
}

export function safeErrorMessage(err) {
  if (!err) return 'Unknown error';
  return err.message || String(err);
}
