import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const dummyArray = (length: number) => {
  return Array.from({ length: length || 5 });
};

export function getInitials(fullName: string | null): string {
  if (!fullName) return 'U';

  const names = fullName.trim().split(/\s+/);
  if (names.length === 1) {
    return names[0][0].toUpperCase();
  } else if (names.length === 2) {
    return names.map(name => name[0].toUpperCase()).join('');
  } else {
    return `${names[0][0].toUpperCase()}${names[
      names.length - 1
    ][0].toUpperCase()}`;
  }
}

export function generateUniqueId(length: number = 10): string {
  const array = new Uint8Array(Math.ceil(length * 0.75));
  crypto.getRandomValues(array);

  return Array.from(array, byte => byte.toString(36))
    .join('')
    .slice(0, length);
}
