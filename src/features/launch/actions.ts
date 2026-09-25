'use server'

import { getTranslations } from 'next-intl/server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/email/send-email'
import { EMAIL_TEMPLATES } from '@/lib/email/templates'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function joinWaitlist(formData: FormData) {
  const email = (formData.get('email') as string)
    ?.trim()
    .toLowerCase()

  const t = await getTranslations('Launch.waitlist.errors')

  if (!email || !EMAIL_RE.test(email)) {
    return {
      error: t('invalidEmail'),
    }
  }

  const supabase = await createSupabaseServerClient()

  const { error } = await supabase
    .from('waitlist')
    .insert({ email })

  if (error) {
    if (error.code === '23505') {
      // Ya estaba apuntado.
      // No mandamos otro welcome email.
      return {
        success: true,
      }
    }

    console.error('Error joining waitlist:', error)

    return {
      error: t('generic'),
    }
  }

  const emailResult = await sendEmail({
    to: email,

    template: {
      id: EMAIL_TEMPLATES.welcomeToWaitlist,

      variables: {
        EMAIL: email,
      },
    },
  })

  if (!emailResult.success) {
    console.error(
      'Failed to send waitlist welcome email:',
      emailResult.error
    )
  }

  return {
    success: true,
  }
}