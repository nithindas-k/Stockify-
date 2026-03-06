import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
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
