const APP_NAME = 'Task Manager';
const BRAND_COLOR = '#d97757';
const NAVY_COLOR = '#1D3557';

export function wrapEmailLayout({ title, bodyHtml, ctaLabel, ctaUrl }) {
  const ctaBlock = ctaLabel && ctaUrl
    ? `<p style="margin:28px 0 0;">
        <a href="${ctaUrl}"
           style="display:inline-block;background:${BRAND_COLOR};color:#ffffff;text-decoration:none;
                  padding:12px 24px;border-radius:10px;font-weight:700;font-size:14px;">
          ${ctaLabel}
        </a>
       </p>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:Arial,Helvetica,sans-serif;color:#334155;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f9fafb;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
               style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;
                      border:1px solid #e2e8f0;box-shadow:0 8px 24px rgba(29,53,87,0.08);">
          <tr>
            <td style="background:${NAVY_COLOR};padding:20px 28px;">
              <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:800;">${APP_NAME}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;">
              <h2 style="margin:0 0 16px;color:${NAVY_COLOR};font-size:18px;">${title}</h2>
              ${bodyHtml}
              ${ctaBlock}
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px;background:#f8fafc;border-top:1px solid #e2e8f0;">
              <p style="margin:0;font-size:12px;color:#94a3b8;">
                You received this email because you have an account on ${APP_NAME}.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function formatEmailDate(date) {
  if (!date) return 'No date';
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
