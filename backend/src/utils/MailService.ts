import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export class MailService {
  private transporter;

  constructor() {
    const isGmail = process.env.SMTP_HOST === 'smtp.gmail.com' || (process.env.SMTP_USER && process.env.SMTP_USER.endsWith('@gmail.com'));

    if (isGmail) {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        connectionTimeout: 10000, 
      });
    } else {
      const port = Number(process.env.SMTP_PORT) || 587;
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
        connectionTimeout: 10000,
      });
    }
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
