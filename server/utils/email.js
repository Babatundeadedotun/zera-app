import nodemailer from 'nodemailer';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn(
      '[ZERA XII] GMAIL_USER / GMAIL_APP_PASSWORD not set - password reset emails will fail. See server/.env.example.'
    );
  }

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  return transporter;
}

export async function sendResetCodeEmail(toEmail, code) {
  const mailer = getTransporter();

  await mailer.sendMail({
    from: `"ZERA XII" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: 'Your ZERA XII Admin Password Reset Code',
    text: `Your password reset code is: ${code}\n\nThis code expires in 10 minutes. If you did not request this, you can safely ignore this email.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background:#F3E8D9;">
        <h2 style="color:#7A0F14; letter-spacing: 1px;">ZERA <span style="color:#D4AF37;">XII</span></h2>
        <p style="color:#2B1E1A; font-size: 15px;">Hello,</p>
        <p style="color:#2B1E1A; font-size: 15px;">
          A password reset was requested for the ZERA XII admin dashboard. Use the code below to continue:
        </p>
        <div style="background:#7A0F14; color:#F3E8D9; font-size: 32px; letter-spacing: 8px; text-align:center; padding: 18px; margin: 24px 0; font-weight: bold;">
          ${code}
        </div>
        <p style="color:#7A6B63; font-size: 13px;">
          This code expires in 10 minutes. If you did not request a password reset, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}
