'use client';

import { signInWithGoogle, signInWithGithub } from '../actions';

export default function OAuthButtons() {
  return (
    <div className="space-y-3">
      <form action={signInWithGoogle}>
        <button type="submit"
          className="w-full rounded-md border py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800">
          Continuar con Google
        </button>
      </form>
      <form action={signInWithGithub}>
        <button type="submit"
          className="w-full rounded-md border py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800">
          Continuar con GitHub
        </button>
      </form>
    </div>
  );
}