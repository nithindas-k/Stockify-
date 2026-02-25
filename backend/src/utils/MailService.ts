import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendOTP(email: string, otp: string) {
    const mailOptions = {
      from: `"Stockify" <${process.env.SMTP_USER}>`,
      to: email,
      subject: '🔐 Your Stockify Verification Code',
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Stockify Verification</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f7;font-family:'Segoe UI',Arial,sans-serif;">

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7;padding:40px 0;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table width="560" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td align="center" style="background:linear-gradient(135deg,#7000cc 0%,#9D00FF 60%,#b84fff 100%);padding:36px 40px 32px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <div style="width:48px;height:48px;background:rgba(255,255,255,0.15);border-radius:12px;display:inline-block;margin-bottom:16px;padding:10px;box-sizing:border-box;">
                      <div style="width:24px;height:24px;border:2.5px solid #ffffff;border-radius:4px;transform:rotate(12deg);"></div>
                    </div>
                    <div style="font-size:26px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;margin:0;">Stockify</div>
                    <div style="font-size:13px;color:rgba(255,255,255,0.7);margin-top:4px;letter-spacing:1px;text-transform:uppercase;">Secure Verification</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 48px 32px;">
              <h2 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#111827;">Verify your email address</h2>
              <p style="margin:0 0 28px;font-size:15px;color:#6b7280;line-height:1.7;">
                Hello! Please use the one-time verification code below to complete your Stockify account setup. 
                This code is valid for <strong style="color:#111827;">5 minutes</strong>.
              </p>

              <!-- OTP Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td align="center" style="background:linear-gradient(135deg,#f9f5ff,#faf0ff);border:2px solid #e9d5ff;border-radius:14px;padding:28px 20px;">
                    <div style="font-size:11px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:#9D00FF;margin-bottom:10px;">Your Verification Code</div>
                    <div style="font-size:52px;font-weight:900;letter-spacing:14px;color:#7000cc;font-variant-numeric:tabular-nums;padding-left:14px;">${otp}</div>
                  </td>
                </tr>
              </table>

              <!-- Steps -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="background:#f9fafb;border-radius:10px;padding:20px 24px;">
                    <div style="font-size:13px;font-weight:600;color:#374151;margin-bottom:10px;">Quick steps:</div>
                    <div style="font-size:13px;color:#6b7280;line-height:1.8;">
                      1️⃣ &nbsp;Go back to the Stockify verification page<br/>
                      2️⃣ &nbsp;Enter the 6-digit code above<br/>
                      3️⃣ &nbsp;Your account will be activated immediately
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Security notice -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-left:3px solid #9D00FF;padding:12px 16px;background:#fdf8ff;border-radius:0 8px 8px 0;">
                    <div style="font-size:12.5px;color:#7c3aed;line-height:1.6;">
                      <strong>🔒 Security tip:</strong> Stockify will never ask for this code via phone or chat. 
                      If you did not request this, please ignore this email — your account remains safe.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 48px;">
              <div style="height:1px;background:#f3f4f6;"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 48px 36px;" align="center">
              <div style="font-size:12px;color:#9ca3af;line-height:1.8;text-align:center;">
                This email was sent to <strong style="color:#6b7280;">${email}</strong><br/>
                &copy; ${new Date().getFullYear()} Stockify Financial Services. All rights reserved.<br/>
                <span style="font-size:11px;">This is an automated message, please do not reply.</span>
              </div>
            </td>
          </tr>

        </table>
        <!-- End card -->

      </td>
    </tr>
  </table>

</body>
</html>
            `,
    };

    return await this.transporter.sendMail(mailOptions);
  }

  async sendReport(email: string, subject: string, htmlContent: string) {
    const mailOptions = {
      from: `"Stockify Reports" <${process.env.SMTP_USER}>`,
      to: email,
      subject: subject,
      html: htmlContent
    };
    return await this.transporter.sendMail(mailOptions);
  }
}
