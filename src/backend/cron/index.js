import cron from 'node-cron';
import { runDueReminderJob } from './reminderJob.js';
import { runOverdueJob } from './overdueJob.js';
import { runWeeklySummaryJob } from './weeklySummaryJob.js';
import { isEmailConfigured } from '../services/email.service.js';

export function startCronJobs() {
  if (!isEmailConfigured()) {
    console.warn('Cron jobs skipped: email is not configured (RESEND_API_KEY / EMAIL_FROM)');
    return;
  }

  // Daily at 9:00 AM — tasks due within 24 hours
  cron.schedule('0 9 * * *', async () => {
    try {
      await runDueReminderJob();
    } catch (err) {
      console.error('[cron] Due reminder job failed:', err);
    }
  });

  // Daily at 9:15 AM — overdue tasks
  cron.schedule('15 9 * * *', async () => {
    try {
      await runOverdueJob();
    } catch (err) {
      console.error('[cron] Overdue job failed:', err);
    }
  });

  // Weekly on Monday at 9:30 AM — pending task summary
  cron.schedule('30 9 * * 1', async () => {
    try {
      await runWeeklySummaryJob();
    } catch (err) {
      console.error('[cron] Weekly summary job failed:', err);
    }
  });

  console.log('Email cron jobs scheduled');
}
