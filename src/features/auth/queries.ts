'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Profile } from './types'

export async function getCurrentUser() {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user
}

export async function getProfile(userId: string): Promise<Profile | null> {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

    if (error) {
        console.error('Error fetching profile:', error)
        return null
    }

    return data as Profile
}