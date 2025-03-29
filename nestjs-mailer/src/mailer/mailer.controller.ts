import { Body, Controller, Post } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { SendEmailDto } from './interfaces/mail.interface';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post('send-mail')
  async sendMail(@Body() body: Record<string, string>) {
    const dto: SendEmailDto = {
      // from: {name: 'lucy', address: 'lucy@example.com'},
      recipients: [
        { name: 'Anderson Woe', address: 'anderson@example.com' },
      ],
      subject: 'Lucky winner',
      html: '<p><strong>Hi %name%</strong>, your lucky number %number% won you $1,000,000</p><p>Cheers!</p>',
      placeholderReplacements: body,
    };

    console.log('am working fine')
    return await this.mailerService.sendEmail(dto);
  }
}
