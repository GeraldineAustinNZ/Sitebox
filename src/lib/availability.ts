import { supabase } from './supabase';

export interface AvailabilityResult {
  available: boolean;
  availableCount: number;
  totalTrailers: number;
  conflicts: string[];
}

export async function checkAvailability(
  startDate: Date,
  endDate: Date
): Promise<AvailabilityResult> {
  const startStr = startDate.toISOString().split('T')[0];
  const endStr = endDate.toISOString().split('T')[0];

  const { data: trailers, error: trailersError } = await supabase
    .from('trailers')
    .select('id')
    .eq('status', 'available');

  if (trailersError || !trailers) {
    throw new Error('Failed to fetch trailers');
  }

  const totalTrailers = trailers.length;

  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select('trailer_id, start_date, end_date, booking_reference')
    .in('status', ['pending', 'confirmed', 'active'])
    .or(`and(start_date.lte.${endStr},end_date.gte.${startStr})`);

  if (bookingsError) {
    throw new Error('Failed to check bookings');
  }

  const { data: blockedDates, error: blockedError } = await supabase
    .from('blocked_dates')
    .select('trailer_id, reason')
    .or(`and(start_date.lte.${endStr},end_date.gte.${startStr})`);

  if (blockedError) {
    throw new Error('Failed to check blocked dates');
  }

  const unavailableTrailerIds = new Set<string>();
  const conflicts: string[] = [];

  if (bookings) {
    bookings.forEach((booking) => {
      if (booking.trailer_id) {
        unavailableTrailerIds.add(booking.trailer_id);
        conflicts.push(`Booking ${booking.booking_reference}`);
      }
    });
  }

  if (blockedDates) {
    blockedDates.forEach((block) => {
      if (block.trailer_id) {
        unavailableTrailerIds.add(block.trailer_id);
        conflicts.push(`Maintenance: ${block.reason}`);
      } else {
        trailers.forEach((trailer) => {
          unavailableTrailerIds.add(trailer.id);
        });
        conflicts.push(`All trailers blocked: ${block.reason}`);
      }
    });
  }

  const availableCount = totalTrailers - unavailableTrailerIds.size;
  const available = availableCount > 0;

  return {
    available,
    availableCount,
    totalTrailers,
    conflicts: [...new Set(conflicts)],
  };
}

export async function getAvailableTrailer(
  startDate: Date,
  endDate: Date
): Promise<string | null> {
  const startStr = startDate.toISOString().split('T')[0];
  const endStr = endDate.toISOString().split('T')[0];

  const { data: trailers, error: trailersError } = await supabase
    .from('trailers')
    .select('id')
    .eq('status', 'available');

  if (trailersError || !trailers) {
    return null;
  }

  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select('trailer_id')
    .in('status', ['pending', 'confirmed', 'active'])
    .or(`and(start_date.lte.${endStr},end_date.gte.${startStr})`);

  if (bookingsError) {
    return null;
  }

  const { data: blockedDates, error: blockedError } = await supabase
    .from('blocked_dates')
    .select('trailer_id')
    .or(`and(start_date.lte.${endStr},end_date.gte.${startStr})`);

  if (blockedError) {
    return null;
  }

  const unavailableTrailerIds = new Set<string>();

  if (bookings) {
    bookings.forEach((booking) => {
      if (booking.trailer_id) {
        unavailableTrailerIds.add(booking.trailer_id);
      }
    });
  }

  if (blockedDates) {
    blockedDates.forEach((block) => {
      if (block.trailer_id) {
        unavailableTrailerIds.add(block.trailer_id);
      } else {
        trailers.forEach((trailer) => {
          unavailableTrailerIds.add(trailer.id);
        });
        return null;
      }
    });
  }

  const availableTrailer = trailers.find(
    (trailer) => !unavailableTrailerIds.has(trailer.id)
  );

  return availableTrailer?.id || null;
}

export interface DateSuggestion {
  startDate: Date;
  endDate: Date;
  durationDays: number;
  availableCount: number;
}

function calculateDurationDays(start: Date, end: Date): number {
  const diff = end.getTime() - start.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export async function findNextAvailableDates(
  requestedStart: Date,
  requestedEnd: Date,
  maxSearchDays: number = 90
): Promise<DateSuggestion[]> {
  const durationDays = calculateDurationDays(requestedStart, requestedEnd);
  const suggestions: DateSuggestion[] = [];

  let searchStart = new Date(requestedStart);
  searchStart.setDate(searchStart.getDate() + 1);

  const searchLimit = new Date(requestedStart);
  searchLimit.setDate(searchLimit.getDate() + maxSearchDays);

  let attemptsCount = 0;
  const maxAttempts = 50;

  while (suggestions.length < 5 && searchStart < searchLimit && attemptsCount < maxAttempts) {
    attemptsCount++;

    const testEnd = new Date(searchStart);
    testEnd.setDate(testEnd.getDate() + durationDays);

    const availability = await checkAvailability(searchStart, testEnd);

    if (availability.available) {
      suggestions.push({
        startDate: new Date(searchStart),
        endDate: new Date(testEnd),
        durationDays,
        availableCount: availability.availableCount,
      });

      searchStart.setDate(searchStart.getDate() + 7);
    } else {
      searchStart.setDate(searchStart.getDate() + 1);
    }
  }

  return suggestions;
}
