import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ENV } from '../../interfaces/env.interface';
import { SendEmailDto } from './interfaces/mail.interface';
import Mail from 'nodemailer/lib/mailer';
export const ENV_VARIABLES = process.env as any as ENV;

@Injectable()
export class MailerService {
  constructor() {}

  mailTransport() {
    const transporter = nodemailer.createTransport({
      host: ENV_VARIABLES.MAIL_HOST,
      port: ENV_VARIABLES.MAIL_PORT,
      secure: false, // use TLS
      auth: {
        user: ENV_VARIABLES.MAIL_USER,
        pass: ENV_VARIABLES.MAIL_PASSWORD,
      },
    } as nodemailer.SendMailOptions);

    return transporter;
  }

  template(html: string, replacements: Record<string, string>) {
    return html.replace(/%(\w*)%/g, function (m, key) {
      return replacements.hasOwnProperty(key) ? replacements[key] : '';
    });
  }

  async sendEmail(dto: SendEmailDto) {
    const { from, recipients, subject, placeholderReplacements } = dto;

    const html = placeholderReplacements
      ? this.template(dto.html, placeholderReplacements)
      : dto.html;

    const transport = this.mailTransport();

    const options: Mail.Options = {
      from: from ?? {
        name: ENV_VARIABLES.APP_NAME,
        address: ENV_VARIABLES.DEFAULT_EMAIL_FROM,
      },
      to: recipients,
      subject,
      html,
      placeholderReplacements: ``,
    };

    try {
      const result = await transport.sendMail(options);

      return {
        message: 'mail sent successfully',
        data: result,
      };

    } catch (error) {
      console.log('Error ', error);
    }
  }
}

    // const dto: SendEmailDto = {
    //   from: {
    //     name: 'admin',
    //     address: `no_reply${admin.organization.company_email}`,
    //   },
    //   recipients: emailsAndOtp.recipientEmails,
    //   subject: 'Your organization OTP',
    //   html: `<p><strong>Hi,</strong></p>
    //     <p>Your otp to register on moriafund is <strong>${emailsAndOtp.otp}</strong>, do not share with anyone else.</p>
    //     <p>This email is sent by your company admin. If this is not meant for you, kindly contact your company admin.</p>

    //     <p>Cheers!</p>`,
    // };
