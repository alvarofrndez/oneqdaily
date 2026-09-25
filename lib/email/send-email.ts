import { resend } from './client'
import type {
  HtmlEmailInput,
  SendEmailInput,
  SendEmailResult,
  TemplateEmailInput,
} from './types'

const DEFAULT_FROM = process.env.EMAIL_FROM

function isTemplateEmail(
  input: SendEmailInput
): input is TemplateEmailInput {
  return 'template' in input
}

export async function sendEmail(
  input: SendEmailInput
): Promise<SendEmailResult> {
  const from = input.from ?? DEFAULT_FROM

  if (!from) {
    console.error(
      'sendEmail: missing "from" address (set EMAIL_FROM)'
    )

    return {
      success: false,
      error: 'missing_from_address',
    }
  }

  const payload = isTemplateEmail(input)
    ? {
        from,
        to: input.to,
        template: {
          id: input.template.id,
          variables: input.template.variables,
        },
        replyTo: input.replyTo,
      }
    : {
        from,
        to: input.to,
        subject: input.subject,
        html: input.html,
        text: input.text,
        replyTo: input.replyTo,
      }

  const { data, error } = await resend.emails.send(payload)

  if (error) {
    console.error('sendEmail: Resend error', error)

    return {
      success: false,
      error: error.message,
    }
  }

  return {
    success: true,
    id: data!.id,
  }
}