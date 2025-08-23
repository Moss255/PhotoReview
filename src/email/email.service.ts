// src/email/email.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class EmailService {
  private transporter: Transporter<
    SMTPTransport.SentMessageInfo,
    SMTPTransport.Options
  >;

  constructor(private configService: ConfigService) {
    this.transporter = createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get('GMAIL_USERNAME'), // Your Gmail address
        pass: this.configService.get('GMAIL_PASSWORD'), // The App Password you generated
      },
    });
  }

  async requestCursedReview(photoId: string) {
    const url = `${this.configService.get('APP_URL')}/review/${photoId}`;
    const personName = `${this.configService.get('PERSON_NAME')}`;

    const mailOptions = {
      from: process.env.GMAIL_USERNAME,
      to: 'jackhmoss@gmail.com', // The email address you want to send the notification to
      subject: 'New Cursed Image for review',
      html: `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Review Request</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td style="padding: 20px 0 30px 0;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; border: 1px solid #dddddd; border-radius: 8px; background-color: #f9f9f9;">
                    <tr>
                        <td align="center" style="padding: 20px 0 20px 0; border-bottom: 1px solid #dddddd;">
                            <h2 style="margin: 0; font-size: 24px; color: #333333;">New Cursed Image for review</h2>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 20px;">
                            <p style="margin: 0 0 15px 0;">Hello ${personName},</p>
                            <p style="margin: 0 0 15px 0;">A new photo has been submitted and is awaiting your review. Please click the button below to review it.</p>
                            
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <a href="${url}" style="display: inline-block; padding: 10px 20px; color: #ffffff; background-color: #007bff; border-radius: 5px; text-decoration: none;">Review Item</a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 0 0 15px 0;">If the button doesn't work, you can copy and paste the following URL into your browser:</p>
                            <p style="margin: 0;">${url}</p>

                            <p style="margin: 15px 0 0 0;">Thank you.</p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 20px 0; border-top: 1px solid #dddddd; font-size: 0.8em; color: #999999;">
                            <p style="margin: 0;">This is an automated email. Please do not reply.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
