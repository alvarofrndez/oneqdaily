'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { getTranslations } from 'next-intl/server'

export async function signUpWithEmail(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const username = formData.get('username') as string

    const t = await getTranslations('Auth.errors')

    if (!email || !password) return { error: t('missingCredentials') }
    if (password.length < 6) return { error: t('passwordTooShort') }

    const supabase = await createSupabaseServerClient()
    const origin = (await headers()).get('origin')

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
        data: { username },
        emailRedirectTo: `${origin}/auth/callback`,
        },
    })

    if (error) return { error: error.message }
    return { success: true }
}

export async function signInWithEmail(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const t = await getTranslations('Auth.errors')

    if (!email || !password) return { error: t('missingCredentials') }

    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) return { error: t('invalidCredentials') }
    redirect('/')
}

async function signInWithOAuth(provider: 'google' | 'github') {
    const supabase = await createSupabaseServerClient()
    const origin = (await headers()).get('origin')

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${origin}/auth/callback` },
    })

    if (error || !data.url) return
    redirect(data.url)
}

export async function signInWithGoogle() {
    await signInWithOAuth('google')
}

export async function signInWithGithub() {
    await signInWithOAuth('github')
}

export async function signOut() {
    const supabase = await createSupabaseServerClient()
    await supabase.auth.signOut()
    redirect('/')
}

export async function updateProfile(formData: FormData) {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    const t = await getTranslations('Auth.errors')
    if (!user) return { error: t('notAuthenticated') }

    const username = (formData.get('username') as string)?.trim()
    const fullName = (formData.get('fullName') as string)?.trim()

    if (!username) return { error: t('usernameRequired') }

    const { error } = await supabase
        .from('profiles')
        .update({ username, full_name: fullName || null, updated_at: new Date().toISOString() })
        .eq('id', user.id)

    if (error) return { error: error.message }

    revalidatePath('/profile')
    return { success: true }
}