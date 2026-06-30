import { Resend } from 'resend';

let resendClient = null;

function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

export async function sendEmail({ to, subject, html }) {
  if (!to || !subject || !html) {
    throw new Error('Email requires to, subject, and html');
  }

  const client = getResendClient();
  if (!client) {
    console.warn('Email skipped: RESEND_API_KEY is not configured');
    return null;
  }

  const from = process.env.EMAIL_FROM;
  if (!from) {
    console.warn('Email skipped: EMAIL_FROM is not configured');
    return null;
  }

  const { data, error } = await client.emails.send({
    from,
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
  });

  if (error) {
    throw new Error(error.message || 'Failed to send email');
  }

  return data;
}

export function getAppUrl() {
  return process.env.APP_URL || 'http://localhost:5173';
}
