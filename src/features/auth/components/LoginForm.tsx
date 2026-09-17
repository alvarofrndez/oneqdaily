'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { signInWithEmail } from '../actions';

const initialState: { error?: string } = {};

export default function LoginForm() {
    const t = useTranslations('Auth.Login');
    const [state, formAction, pending] = useActionState(async (_prev: typeof initialState, formData: FormData) => {
        const result = await signInWithEmail(formData);
        return { error: result?.error };
    }, initialState);

    return (
        <form action={formAction} className="space-y-4">
            <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">{t('email')}</label>
                <input id="email" name="email" type="email" required
                className="block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300" />
            </div>
            <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">{t('password')}</label>
                <input id="password" name="password" type="password" required
                className="block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300" />
            </div>
            {state.error && <p className="text-sm text-red-500">{state.error}</p>}
            <button type="submit" disabled={pending}
                className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                {pending ? t('submitting') : t('submit')}
            </button>
        </form>
    );
}