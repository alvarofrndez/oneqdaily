import LoginForm from '@/src/features/auth/components/LoginForm';
import OAuthButtons from '@/src/features/auth/components/OAuthButtons';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-md">
        <h1 className="text-3xl font-bold mb-6">Entrar</h1>
        <OAuthButtons />
        <div className="my-6 text-center text-sm text-gray-400">o con email</div>
        <LoginForm />
        <p className="mt-4 text-sm text-gray-500">
          ¿No tienes cuenta? <Link href="/signup" className="text-indigo-600 hover:underline">Regístrate</Link>
        </p>
      </div>
    </main>
  );
}