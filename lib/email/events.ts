import { sendEmail } from './send-email'
import { EMAIL_TEMPLATES } from './templates'

export async function sendWaitlistWelcomeEmail(email: string) {
  return sendEmail({
    to: email,

    template: {
      id: EMAIL_TEMPLATES.welcomeToWaitlist,

      variables: {
        EMAIL: email,
      },
    },
  })
}