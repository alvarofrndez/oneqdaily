'use server'

import { getTranslations } from 'next-intl/server'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function joinWaitlist(formData: FormData) {
  const email = (formData.get('email') as string)?.trim().toLowerCase()

  const t = await getTranslations('Launch.waitlist.errors')

  if (!email || !EMAIL_RE.test(email)) {
    return { error: t('invalidEmail') }
  }

  const { createSupabaseServerClient } =
    await import('@/lib/supabase/server')

  const supabase = await createSupabaseServerClient()

  const { error } = await supabase
    .from('waitlist')
    .insert({ email })

  if (error) {
    if (error.code === '23505') {
      return { success: true }
    }
    
    console.error('Error joining waitlist:', error)
    return { error: t('generic') }
  }

  return { success: true }
}