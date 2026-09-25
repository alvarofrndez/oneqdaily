export type EmailVariables = Record<string, string | number>

export type TemplateEmailInput = {
  to: string | string[]
  template: {
    id: string
    variables?: EmailVariables
  }
  from?: string
  replyTo?: string
}

export type HtmlEmailInput = {
  to: string | string[]
  subject: string
  html: string
  text?: string
  from?: string
  replyTo?: string
}

export type SendEmailInput = TemplateEmailInput | HtmlEmailInput

export type SendEmailResult =
  | {
      success: true
      id: string
    }
  | {
      success: false
      error: string
    }