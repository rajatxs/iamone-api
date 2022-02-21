import { mail } from '../utils/mail.js';
import { senders, templateIds } from '../config/email.js';
import logger from '../utils/logger.js';

export class EmailService {
   name = 'EmailService';

   /**
    * Send welcome email on signup
    * @param {string} name
    * @param {string} email
    */
   async sendWelcomeEmail(name, email) {
      let result;

      try {
         result = await mail.send({
            from: senders.milestoneEmailSender,
            to: { name, email },
            templateId: templateIds.WELCOME_EMAIL_TEMPLATE_ID,
            dynamicTemplateData: { name, email },
         });

         logger.info(`${this.name}:sendWelcomeEmail`, `Email sent on ${email}`);
      } catch (error) {
         logger.error(`${this.name}:sendWelcomeEmail`, `Couldn't send email on ${email}`, error);
      }

      return result;
   }

   /**
    * Send given email verification code to recipient
    * @param {string} name
    * @param {string} email
    * @param {string} code
    */
   async sendEmailVerificationCode(name, email, code) {
      let result;

      try {
         result = await mail.send({
            from: senders.milestoneEmailSender,
            to: { name, email },
            templateId: templateIds.EMAIL_VERIFICATION_CODE_TEMPLATE_ID,
            dynamicTemplateData: {
               name,
               email,
               code,
            },
         });

         logger.info(`${this.name}:sendEmailVerificationCode`, `Email sent on ${email}`);
      } catch (error) {
         logger.error(`${this.name}:sendEmailVerificationCode`, `Couldn't send email on ${email}`, error);
      }
      
      return result;
   }

   /**
    * Send verification code for password rest
    * @param {string} name
    * @param {string} email
    * @param {string} code
    */
   async sendPasswordResetCode(name, email, code) {
      let result;

      try {
         result = await mail.send({
            from: senders.milestoneEmailSender,
            to: { name, email },
            templateId: templateIds.PASSWORD_RESET_CODE_TEMPLATE_ID,
            dynamicTemplateData: {
               name,
               email,
               code,
            },
         });

         logger.info(`${this.name}:sendPasswordResetCode`, `Email sent on ${email}`);
      } catch (error) {
         logger.error(`${this.name}:sendPasswordResetCode`, `Couldn't send email on ${email}`, error);
      }

      return result;
   }
}
