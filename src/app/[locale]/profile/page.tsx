import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getProfile } from '@/src/features/auth/queries';
import ProfileForm from '@/src/features/auth/components/ProfileForm';

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const profile = await getProfile(user.id);
  if (!profile) redirect('/login');

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Mi perfil</h1>
        <p className="text-sm text-gray-500 mb-6">{user.email}</p>
        <ProfileForm profile={profile} />
      </div>
    </main>
  );
}