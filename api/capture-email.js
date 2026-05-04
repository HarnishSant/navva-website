import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body || {};
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: '"Navva AI" <hsant@navva.ai>',
      to: email,
      bcc: 'hsant@navva.ai',
      replyTo: 'hsant@navva.ai',
      subject: 'Thanks for your interest in Navva AI',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; color: #1A3A5C; line-height: 1.6;">
          <div style="background: #1A3A5C; padding: 32px 24px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">Navva AI</h1>
          </div>
          <div style="padding: 32px 24px;">
            <p style="font-size: 16px; margin-top: 0;">Thanks for your interest in Navva AI.</p>
            <p style="font-size: 16px;">
              We received your request for early access. Someone from our team
              will reach out within 48 hours to learn more about your organization
              and walk you through how Navva AI fits into your Medicaid compliance
              workflow ahead of the January 2027 H.R. 1 deadline.
            </p>
            <p style="font-size: 16px;">
              In the meantime, if you have any immediate questions, feel free to
              reply to this email directly.
            </p>
            <p style="font-size: 16px;">
              Talk soon,<br>
              <strong>Harnish Sant</strong><br>
              Co-Founder, Navva AI
            </p>
            <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 32px 0 16px;">
            <p style="font-size: 13px; color: #94A3B8; margin: 0;">
              Navva AI · navva.ai · hsant@navva.ai
            </p>
          </div>
        </div>
      `,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Capture email error:', err);
    return res.status(500).json({ error: 'Failed to send' });
  }
}
