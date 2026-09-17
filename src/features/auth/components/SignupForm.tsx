'use client';

import { useActionState } from 'react';
import { signUpWithEmail } from '../actions';

const initialState: { error?: string; success?: boolean } = {};

export default function SignupForm() {
    const [state, formAction, pending] = useActionState(async (_prev: typeof initialState, formData: FormData) => {
        const result = await signUpWithEmail(formData);
        return { error: result?.error, success: !!result?.success };
    }, initialState);

    if (state.success) {
        return <p className="text-sm text-gray-600">Cuenta creada. Revisa tu correo para confirmarla.</p>;
    }

    return (
        <form action={formAction} className="space-y-4">
        <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1">Nombre de usuario</label>
            <input id="username" name="username" required
            className="block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300" />
        </div>
        <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <input id="email" name="email" type="email" required
            className="block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300" />
        </div>
        <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">Contraseña</label>
            <input id="password" name="password" type="password" required minLength={6}
            className="block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300" />
        </div>
        {state.error && <p className="text-sm text-red-500">{state.error}</p>}
        <button type="submit" disabled={pending}
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            {pending ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
        </form>
    );
}