'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { getTranslations } from 'next-intl/server'
import { validatePassword } from './password-validation'

export async function signUpWithEmail(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const username = formData.get('username') as string

    const t = await getTranslations('Auth.errors')

    if (!email || !password) return { error: t('missingCredentials') }

    const passwordError = validatePassword(password)
    if (passwordError) return { error: t(passwordError) }

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

    if (error) {
        if (error.code === 'email_not_confirmed') {
            return { error: t('emailNotConfirmed'), unconfirmedEmail: email }
        }
        return { error: t('invalidCredentials') }
    }

    redirect('/')
}

export async function resendConfirmationEmail(email: string) {
    const t = await getTranslations('Auth.errors')

    if (!email) return { error: t('missingCredentials') }

    const supabase = await createSupabaseServerClient()
    const origin = (await headers()).get('origin')

    const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: { emailRedirectTo: `${origin}/auth/callback` },
    })

    console.log(error)
    if (error) return { error: error.message }
    return { success: true }
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

export async function requestPasswordReset(formData: FormData) {
    const email = (formData.get('email') as string)?.trim()

    const t = await getTranslations('Auth.errors')

    if (!email) return { error: t('missingCredentials') }

    const supabase = await createSupabaseServerClient()
    const origin = (await headers()).get('origin')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/callback?next=/reset-password`,
    })

    if (error) {
        console.error('Error requesting password reset:', error)
    }

    return { success: true }
}

export async function updatePassword(formData: FormData) {
    const password = formData.get('password')
    const confirmPassword = formData.get('confirmPassword')
    const currentPassword = formData.get('currentPassword')
    const isProfileFlow = formData.get('profile') === '1'

    const t = await getTranslations('Auth.errors')

    const supabase = await createSupabaseServerClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: t('notAuthenticated') }
    }

    if (isProfileFlow) {
        if (typeof currentPassword !== 'string' || !currentPassword) {
            return { error: t('currentPasswordRequired') }
        }

        const { error: reauthError } = await supabase.auth.signInWithPassword({
            email: user.email!,
            password: currentPassword,
        })

        if (reauthError) {
            return { error: t('currentPasswordIncorrect') }
        }
    }

    const passwordError = validatePassword(password, confirmPassword)
    if (passwordError) {
        return { error: t(passwordError) }
    }

    const { error } = await supabase.auth.updateUser({
        password: password as string,
    })

    if (error) {
        return { error: error.message }
    }

    if (isProfileFlow) {
        return { success: true }
    }

    redirect('/login?passwordUpdated=1')
}