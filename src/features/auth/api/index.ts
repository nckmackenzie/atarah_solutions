import { supabase } from '@/lib/supabase/supabase';
import type { LoginFormValues } from '@/features/auth/types/index.types';

export async function login(values: LoginFormValues) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: values.email,
    password: values.password,
  });

  if (error) throw new Error(error.message);

  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('active')
    .eq('id', data.user.id)
    .single();

  if (profileError) throw new Error(profileError.message);

  if (!profileData) throw new Error('Profile not found');

  if (profileData.active === 'not_activated')
    throw new Error('Your account has not been activated. Contact admin.');

  if (profileData.active === 'inactive')
    throw new Error('Your account has been deactivated. Contact admin.');

  return data;
}

export async function getCurrentUser() {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return null;

  const { data, error } = await supabase.auth.getUser();

  if (error) throw new Error(error.message);
  return data?.user;
}
