import sgMail from '@sendgrid/mail';
import { SENDGRID_API_KEY } from './env.js';

export function setEmailApiKey() {
   sgMail.setApiKey(SENDGRID_API_KEY);
}

export const mail = sgMail;
