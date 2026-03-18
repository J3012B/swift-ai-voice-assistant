const POSTMARK_API_TOKEN = process.env.POSTMARK_SERVER_API_TOKEN;
const FROM_EMAIL = process.env.POSTMARK_FROM_EMAIL;
const NOTIFICATIONS_EMAIL = process.env.POSTMARK_NOTIFICATIONS_EMAIL || 'notifications@talktoyour.computer';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://talktoyour.computer';

export async function sendWelcomeEmail(toEmail: string): Promise<boolean> {
	if (!POSTMARK_API_TOKEN || !FROM_EMAIL) {
		console.error('Postmark env vars not set (POSTMARK_SERVER_API_TOKEN, POSTMARK_FROM_EMAIL)');
		return false;
	}

	const text = `Hey,

I'm Josef — I built Talk To Your Computer.

Really glad you signed up. Quick question: what are you hoping to use it for?

Just hit reply and let me know. I read every response.

Josef`;

	try {
		const res = await fetch('https://api.postmarkapp.com/email', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'X-Postmark-Server-Token': POSTMARK_API_TOKEN,
			},
			body: JSON.stringify({
				From: FROM_EMAIL,
				To: toEmail,
				Subject: 'quick question',
				TextBody: text,
				MessageStream: 'outbound',
			}),
		});

		if (!res.ok) {
			console.error('Postmark welcome email error:', await res.text());
			return false;
		}

		return true;
	} catch (err) {
		console.error('Failed to send welcome email:', err);
		return false;
	}
}

export async function sendOnboardingNotificationEmail(userEmail: string, useCase: string): Promise<boolean> {
	if (!POSTMARK_API_TOKEN || !FROM_EMAIL) {
		console.error('Postmark env vars not set');
		return false;
	}

	try {
		const res = await fetch('https://api.postmarkapp.com/email', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'X-Postmark-Server-Token': POSTMARK_API_TOKEN,
			},
			body: JSON.stringify({
				From: FROM_EMAIL,
				To: 'josef@heliconsolutions.net',
				Subject: `New use case response from ${userEmail}`,
				TextBody: `User: ${userEmail}\n\nWhat they want to use it for:\n\n${useCase}`,
				MessageStream: 'outbound',
			}),
		});

		if (!res.ok) {
			console.error('Postmark onboarding notification error:', await res.text());
			return false;
		}

		return true;
	} catch (err) {
		console.error('Failed to send onboarding notification email:', err);
		return false;
	}
}

export async function sendQuotaExceededEmail(toEmail: string, freeLimit: number): Promise<boolean> {
	if (!POSTMARK_API_TOKEN || !FROM_EMAIL) {
		console.error('Postmark env vars not set (POSTMARK_SERVER_API_TOKEN, POSTMARK_FROM_EMAIL)');
		return false;
	}

	const upgradeUrl = `${SITE_URL}/?upgrade=true`;

	const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You've used all your free sessions</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background-color:#ffffff;border-radius:16px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background-color:#000000;padding:32px 40px;text-align:center;">
              <img src="${SITE_URL}/icon.png" alt="Talk To Your Computer" width="64" height="64"
                   style="border-radius:50%;display:block;margin:0 auto;" />
              <h1 style="color:#ffffff;font-size:20px;font-weight:600;margin:16px 0 0 0;">
                Talk To Your Computer
              </h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;text-align:center;">
              <h2 style="color:#1a1a1a;font-size:22px;font-weight:600;margin:0 0 12px 0;">
                You've used all ${freeLimit} free sessions
              </h2>
              <p style="color:#525252;font-size:15px;line-height:1.6;margin:0 0 16px 0;">
                Hope you've been enjoying talking to your computer! You've reached the end of your free sessions.
              </p>
              <p style="color:#525252;font-size:15px;line-height:1.6;margin:0 0 28px 0;">
                To keep going — unlimited sessions, no interruptions — unlock full access below.
              </p>
              <a href="${upgradeUrl}"
                 style="display:inline-block;background-color:#22c55e;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:50px;">
                Unlock full access
              </a>
              <p style="color:#a3a3a3;font-size:13px;line-height:1.5;margin:28px 0 0 0;">
                Questions? Just reply to this email.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px 28px;border-top:1px solid #f0f0f0;">
              <p style="color:#a3a3a3;font-size:12px;margin:0;text-align:center;">
                Talk To Your Computer — Voice-powered AI assistant
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

	const text = `You've used all ${freeLimit} free sessions.

Hope you've been enjoying talking to your computer! To keep going — unlimited sessions, no interruptions — unlock full access here:

${upgradeUrl}

Questions? Just reply to this email.

Talk To Your Computer`;

	try {
		const res = await fetch('https://api.postmarkapp.com/email', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'X-Postmark-Server-Token': POSTMARK_API_TOKEN,
			},
			body: JSON.stringify({
				From: NOTIFICATIONS_EMAIL,
				To: toEmail,
				Subject: `You've used all ${freeLimit} free sessions`,
				HtmlBody: html,
				TextBody: text,
				MessageStream: 'outbound',
			}),
		});

		if (!res.ok) {
			console.error('Postmark quota exceeded email error:', await res.text());
			return false;
		}

		return true;
	} catch (err) {
		console.error('Failed to send quota exceeded email:', err);
		return false;
	}
}
