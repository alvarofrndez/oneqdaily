'use client';

import { useActionState } from 'react';
import { updateProfile } from '../actions';
import type { Profile } from '../types';

const initialState: { error?: string; success?: boolean } = {};

export default function ProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction, pending] = useActionState(async (_prev: typeof initialState, formData: FormData) => {
    const result = await updateProfile(formData);
    return { error: result?.error, success: !!result?.success };
  }, initialState);

  return (
    <form action={formAction} className="space-y-4 max-w-md">
      <div>
        <label htmlFor="username" className="block text-sm font-medium mb-1">Nombre de usuario</label>
        <input id="username" name="username" defaultValue={profile.username ?? ''} required
          className="block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300" />
      </div>
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium mb-1">Nombre completo</label>
        <input id="fullName" name="fullName" defaultValue={profile.full_name ?? ''}
          className="block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300" />
      </div>
      {state.error && <p className="text-sm text-red-500">{state.error}</p>}
      {state.success && <p className="text-sm text-green-600">Perfil actualizado.</p>}
      <button type="submit" disabled={pending}
        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
        {pending ? 'Guardando...' : 'Guardar cambios'}
      </button>
    </form>
  );
}