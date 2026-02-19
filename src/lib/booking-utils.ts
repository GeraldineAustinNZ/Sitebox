import { supabase } from './supabase';

export async function generateBookingReference(): Promise<string> {
  const year = new Date().getFullYear();
  const { count, error } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true });

  if (error) {
    const randomNum = Math.floor(Math.random() * 10000);
    return `SBW-${year}-${randomNum.toString().padStart(4, '0')}`;
  }

  const nextNumber = (count || 0) + 1;
  return `SBW-${year}-${nextNumber.toString().padStart(4, '0')}`;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-NZ', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateShort(date: Date): string {
  return date.toLocaleDateString('en-NZ', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
