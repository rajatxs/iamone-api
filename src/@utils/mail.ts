import * as sgMail from '@sendgrid/mail'
import env from './env'

export function setEmailApiKey() {
   sgMail.setApiKey(env.sendgridApiKey)
}

export const mail = sgMail
