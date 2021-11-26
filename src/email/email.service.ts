import { Injectable } from '@nestjs/common'
import { mail } from '@utils/mail'
import { senders, templateIds } from './email.config'

@Injectable()
export class EmailService {

   /** Send welcome email on signup */
   public sendWelcomeEmail(name: string, email: string) {
      return mail.send({
         from: senders.milestoneEmailSender,
         to: { name, email },
         templateId: templateIds.WELCOME_EMAIL_TEMPLATE_ID,
         dynamicTemplateData: { name, email }
      })
   }
}
