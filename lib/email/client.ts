import { Resend } from 'resend'

function createResendClient() {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not set')
  }

  return new Resend(apiKey)
}

export const resend = createResendClient()