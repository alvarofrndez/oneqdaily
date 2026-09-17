import SignupForm from '@/src/features/auth/components/SignupForm';
import OAuthButtons from '@/src/features/auth/components/OAuthButtons';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-md">
        <h1 className="text-3xl font-bold mb-6">Crear cuenta</h1>
        <OAuthButtons />
        <div className="my-6 text-center text-sm text-gray-400">o con email</div>
        <SignupForm />
        <p className="mt-4 text-sm text-gray-500">
          ¿Ya tienes cuenta? <Link href="/login" className="text-indigo-600 hover:underline">Entra</Link>
        </p>
      </div>
    </main>
  );
}