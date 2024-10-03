import { Database } from '@/lib/supabase/database.types';

export type Form = Database['public']['Tables']['forms']['Row'];

export type Option = { value: string; label: string };
export type ServerError = Record<string, string[]>;

export interface WithId {
  id: string;
}

export interface WithName {
  name: string;
}

export interface WithIdAndName extends WithId, WithName {}

export interface IsEdit {
  isEdit?: boolean;
}

export type IsEditRequired = Required<IsEdit>;

export interface IsPending {
  isPending: boolean;
}
