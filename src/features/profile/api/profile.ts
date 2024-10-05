import { supabase } from '@/lib/supabase/supabase';
import type { ProfileFormValues } from '@/features/profile/types/profile.types';

export async function updateProfile(values: ProfileFormValues) {
  const { error } = await supabase.auth.updateUser({
    email: values.email,
    data: {
      name: values.name,
      contact: values.contact,
    },
  });

  if (error) throw new Error(error.message);
}
