import nodemailer from "nodemailer";
   // step # 2
export const sendVerificationEmail = (to, token) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const verifyUrl = `${process.env.FRONTEND_URL}/verify?token=${token}`;
  const message = {
  from: process.env.SMTP_USER,
  to,
  subject: "Please verify your email",
  text: `Welcome to Our App\n\nClick this link to verify your email:\n${verifyUrl}\n\nThis link will expire in 1 hour.`,
  html: `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
    </head>
    <body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td align="center" style="padding:30px 10px;">
            <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 6px 18px rgba(11,22,39,0.08);">
              <!-- Header -->
              <tr>
                <td style="padding:24px 32px;background:linear-gradient(90deg,#00b4a2,#007b7f);color:#fff;">
                  <h1 style="margin:0;font-size:20px;font-weight:600;">Welcome to Our App</h1>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:28px 32px;color:#0b1227;line-height:1.5;">
                  <p style="margin:0 0 12px;font-size:15px;">
                    Hello — thank you for registering. Please verify your email address to activate your account.
                  </p>

                  <p style="margin:0 0 18px;font-size:14px;color:#4b5563;">
                    Click the button below to confirm your email. The link will expire in 1 hour.
                  </p>

                  <!-- Button -->
                  <table cellpadding="0" cellspacing="0" role="presentation" style="margin:18px 0;">
                    <tr>
                      <td align="center" style="border-radius:6px;background:linear-gradient(180deg,#10b981,#059669);">
                        <a href="${verifyUrl}" target="_blank" style="display:inline-block;padding:12px 28px;font-size:15px;color:#ffffff;text-decoration:none;font-weight:600;border-radius:6px;">
                          Verify Email
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `,
};

  return transporter.sendMail(message);
};
