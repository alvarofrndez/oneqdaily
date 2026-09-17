'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function signUpWithEmail(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const username = formData.get('username') as string

    if (!email || !password) return { error: 'Email y contraseña son obligatorios' }
    if (password.length < 6) return { error: 'La contraseña debe tener al menos 6 caracteres' }

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

    if (!email || !password) return { error: 'Email y contraseña son obligatorios' }

    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) return { error: 'Email o contraseña incorrectos' }
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
    if (!user) return { error: 'No has iniciado sesión' }

    const username = (formData.get('username') as string)?.trim()
    const fullName = (formData.get('fullName') as string)?.trim()

    if (!username) return { error: 'El nombre de usuario no puede estar vacío' }

    const { error } = await supabase
        .from('profiles')
        .update({ username, full_name: fullName || null, updated_at: new Date().toISOString() })
        .eq('id', user.id)

    if (error) return { error: error.message }

    revalidatePath('/profile')
    return { success: true }
}