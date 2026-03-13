import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export class MailService {
  private transporter;

  constructor() {
    const isGmail = process.env.SMTP_HOST === 'smtp.gmail.com' || (process.env.SMTP_USER && process.env.SMTP_USER.endsWith('@gmail.com'));
    
    console.log(`[MailService] Initializing. Host: ${process.env.SMTP_HOST}, IsGmail: ${isGmail}`);
    
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('[MailService] CRITICAL: SMTP_USER or SMTP_PASS is missing in environment variables');
    }

    if (isGmail) {
      console.log('[MailService] Using Gmail service configuration');
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        connectionTimeout: 15000, // 15 seconds
      });
    } else {
      const port = Number(process.env.SMTP_PORT) || 587;
      console.log(`[MailService] Using Custom SMTP: ${process.env.SMTP_HOST}:${port}`);
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: port,
        secure: port === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        tls: {
          rejectUnauthorized: false
        },
        connectionTimeout: 15000,
      });
    }
  }


  async sendReport(email: string, subject: string, htmlContent: string) {
    try {
      console.log(`[MailService] Attempting to verify connection...`);
      await this.transporter.verify();
      console.log(`[MailService] Connection verified successfully.`);

      const mailOptions = {
        from: `"Stockify Reports" <${process.env.SMTP_USER}>`,
        to: email,
        subject: subject,
        html: htmlContent
      };
      
      console.log(`[MailService] Sending email to: ${email}`);
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`[MailService] Email sent successfully: ${info.messageId}`);
      return info;
    } catch (error) {
      console.error(`[MailService] Error in findReport/sendMail:`, error);
      throw error;
    }
  }
}
