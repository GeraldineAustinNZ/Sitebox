import { supabase } from './supabase';

export interface KPIMetrics {
  utilisationPercentage: number;
  paidTrailerWeeks: number;
  paidTrailerWeeksPercentage: number;
  totalAvailableWeeks: number;
  revenue: number;
  revenuePerWeek: number;
  revenuePerBooking: number;
  averageHireLength: number;
  repeatCustomerPercentage: number;
  enquiriesInPeriod: number;
  idleDays: number;
  totalBookings: number;
  dateRange: {
    start: string;
    end: string;
  };
}

export interface Customer {
  email: string;
  name: string;
  phone: string;
  totalBookings: number;
  lifetimeValue: number;
  isRepeat: boolean;
  lastBookingDate: string;
}

export interface Booking {
  id: string;
  booking_reference: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  start_date: string;
  end_date: string;
  duration_weeks: number;
  booking_type: string;
  total_price: number;
  status: string;
  payment_status: string;
  created_at: string;
  trailer_id: string;
  special_requirements: string;
}

export interface ScheduleItem {
  id: string;
  type: 'delivery' | 'pickup';
  date: string;
  customer_name: string;
  customer_phone: string;
  address: string;
  booking_reference: string;
  trailer_id: string;
  special_requirements: string;
}

export interface Enquiry {
  id: string;
  type: 'quote' | 'trade';
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
  business_name?: string;
  delivery_address?: string;
  start_date?: string;
  estimated_duration?: string;
  estimated_weekly_needs?: string;
}

export async function getKPIMetrics(
  startDate?: string,
  endDate?: string
): Promise<KPIMetrics> {
  const today = new Date().toISOString().split('T')[0];
  const start = startDate || '2020-01-01';
  const end = endDate || today;

  let bookingsQuery = supabase
    .from('bookings')
    .select('*')
    .in('status', ['confirmed', 'active', 'completed']);

  if (startDate && endDate) {
    bookingsQuery = bookingsQuery.or(`and(start_date.gte.${start},start_date.lte.${end}),and(end_date.gte.${start},end_date.lte.${end}),and(start_date.lte.${start},end_date.gte.${end})`);
  }

  const { data: bookings } = await bookingsQuery;

  const { data: trailers } = await supabase
    .from('trailers')
    .select('*')
    .eq('status', 'available');

  let quoteEnquiriesQuery = supabase
    .from('quote_enquiries')
    .select('*')
    .gte('created_at', start)
    .lte('created_at', end);

  let tradeEnquiriesQuery = supabase
    .from('trade_enquiries')
    .select('*')
    .gte('created_at', start)
    .lte('created_at', end);

  const { data: quoteEnquiries } = await quoteEnquiriesQuery;
  const { data: tradeEnquiries } = await tradeEnquiriesQuery;

  const validBookings = (bookings || []).filter(
    (booking) => booking.status !== 'cancelled'
  );

  const paidTrailerWeeks = validBookings.reduce(
    (sum, booking) => sum + (booking.duration_weeks || 0),
    0
  );

  const revenue = validBookings
    .filter((booking) => booking.payment_status === 'succeeded')
    .reduce((sum, booking) => sum + parseFloat(booking.total_price || '0'), 0);

  const averageHireLength =
    validBookings.length > 0
      ? validBookings.reduce((sum, booking) => sum + (booking.duration_weeks || 0), 0) /
        validBookings.length
      : 0;

  const customerBookingCounts = new Map<string, number>();
  validBookings.forEach((booking) => {
    const count = customerBookingCounts.get(booking.customer_email) || 0;
    customerBookingCounts.set(booking.customer_email, count + 1);
  });

  const repeatCustomers = Array.from(customerBookingCounts.values()).filter((count) => count > 1).length;
  const repeatCustomerPercentage =
    customerBookingCounts.size > 0 ? (repeatCustomers / customerBookingCounts.size) * 100 : 0;

  const enquiriesInPeriod = (quoteEnquiries?.length || 0) + (tradeEnquiries?.length || 0);

  const trailerCount = trailers?.length || 3;
  const daysInPeriod = Math.ceil(
    (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;
  const totalAvailableDays = trailerCount * daysInPeriod;
  const bookedDays = validBookings.reduce((sum, booking) => {
    const bookingStart = new Date(booking.start_date);
    const bookingEnd = new Date(booking.end_date);
    const periodStart = new Date(start);
    const periodEnd = new Date(end);

    const overlapStart = bookingStart > periodStart ? bookingStart : periodStart;
    const overlapEnd = bookingEnd < periodEnd ? bookingEnd : periodEnd;

    const days = Math.ceil((overlapEnd.getTime() - overlapStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return sum + Math.max(0, days);
  }, 0);
  const idleDays = totalAvailableDays - bookedDays;
  const utilisationPercentage = totalAvailableDays > 0 ? (bookedDays / totalAvailableDays) * 100 : 0;

  const weeksInPeriod = daysInPeriod / 7;
  const totalAvailableWeeks = trailerCount * weeksInPeriod;
  const paidTrailerWeeksPercentage = totalAvailableWeeks > 0 ? (paidTrailerWeeks / totalAvailableWeeks) * 100 : 0;

  const revenuePerWeek = paidTrailerWeeks > 0 ? revenue / paidTrailerWeeks : 0;
  const revenuePerBooking = validBookings.length > 0 ? revenue / validBookings.length : 0;

  return {
    utilisationPercentage,
    paidTrailerWeeks,
    paidTrailerWeeksPercentage,
    totalAvailableWeeks,
    revenue,
    revenuePerWeek,
    revenuePerBooking,
    averageHireLength,
    repeatCustomerPercentage,
    enquiriesInPeriod,
    idleDays,
    totalBookings: validBookings.length,
    dateRange: {
      start,
      end,
    },
  };
}

export async function getCustomerList(
  search?: string,
  limit: number = 50,
  offset: number = 0
): Promise<{ customers: Customer[]; total: number }> {
  let query = supabase
    .from('bookings')
    .select('customer_email, customer_name, customer_phone, total_price, created_at, status, payment_status', { count: 'exact' })
    .in('status', ['confirmed', 'active', 'completed']);

  if (search) {
    query = query.or(
      `customer_name.ilike.%${search}%,customer_email.ilike.%${search}%,customer_phone.ilike.%${search}%`
    );
  }

  const { data, count } = await query;

  const customerMap = new Map<string, Customer>();

  (data || []).forEach((booking) => {
    const existing = customerMap.get(booking.customer_email);
    const bookingValue = booking.payment_status === 'succeeded' ? parseFloat(booking.total_price || '0') : 0;

    if (existing) {
      existing.totalBookings += 1;
      existing.lifetimeValue += bookingValue;
      if (new Date(booking.created_at) > new Date(existing.lastBookingDate)) {
        existing.lastBookingDate = booking.created_at;
      }
    } else {
      customerMap.set(booking.customer_email, {
        email: booking.customer_email,
        name: booking.customer_name,
        phone: booking.customer_phone,
        totalBookings: 1,
        lifetimeValue: bookingValue,
        isRepeat: false,
        lastBookingDate: booking.created_at,
      });
    }
  });

  const customers = Array.from(customerMap.values())
    .map((customer) => ({
      ...customer,
      isRepeat: customer.totalBookings > 1,
    }))
    .sort((a, b) => new Date(b.lastBookingDate).getTime() - new Date(a.lastBookingDate).getTime())
    .slice(offset, offset + limit);

  return {
    customers,
    total: customerMap.size,
  };
}

export async function getCustomerBookingHistory(email: string): Promise<Booking[]> {
  const { data } = await supabase
    .from('bookings')
    .select('*')
    .eq('customer_email', email)
    .order('created_at', { ascending: false });

  return data || [];
}

export async function getBookingsList(
  filters?: {
    status?: string;
    paymentStatus?: string;
    bookingType?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  },
  limit: number = 50,
  offset: number = 0
): Promise<{ bookings: Booking[]; total: number }> {
  let query = supabase.from('bookings').select('*', { count: 'exact' });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.paymentStatus) {
    query = query.eq('payment_status', filters.paymentStatus);
  }

  if (filters?.bookingType) {
    query = query.eq('booking_type', filters.bookingType);
  }

  if (filters?.startDate) {
    query = query.gte('start_date', filters.startDate);
  }

  if (filters?.endDate) {
    query = query.lte('end_date', filters.endDate);
  }

  if (filters?.search) {
    query = query.or(
      `booking_reference.ilike.%${filters.search}%,customer_name.ilike.%${filters.search}%,customer_email.ilike.%${filters.search}%`
    );
  }

  const { data, count } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  return {
    bookings: data || [],
    total: count || 0,
  };
}

export async function getScheduleData(
  startDate?: string,
  endDate?: string
): Promise<ScheduleItem[]> {
  const start = startDate || new Date().toISOString().split('T')[0];
  const end = endDate || new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0];

  const { data } = await supabase
    .from('bookings')
    .select('*')
    .in('status', ['confirmed', 'active'])
    .or(`start_date.gte.${start},end_date.gte.${start}`)
    .lte('start_date', end)
    .order('start_date', { ascending: true });

  const scheduleItems: ScheduleItem[] = [];

  (data || []).forEach((booking) => {
    scheduleItems.push({
      id: `${booking.id}-delivery`,
      type: 'delivery',
      date: booking.start_date,
      customer_name: booking.customer_name,
      customer_phone: booking.customer_phone,
      address: booking.delivery_address,
      booking_reference: booking.booking_reference,
      trailer_id: booking.trailer_id,
      special_requirements: booking.special_requirements,
    });

    scheduleItems.push({
      id: `${booking.id}-pickup`,
      type: 'pickup',
      date: booking.end_date,
      customer_name: booking.customer_name,
      customer_phone: booking.customer_phone,
      address: booking.delivery_address,
      booking_reference: booking.booking_reference,
      trailer_id: booking.trailer_id,
      special_requirements: booking.special_requirements,
    });
  });

  return scheduleItems.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export async function getEnquiriesList(
  filters?: {
    type?: 'quote' | 'trade';
    startDate?: string;
    endDate?: string;
    search?: string;
  },
  limit: number = 50,
  offset: number = 0
): Promise<{ enquiries: Enquiry[]; total: number }> {
  const enquiries: Enquiry[] = [];
  let total = 0;

  if (!filters?.type || filters.type === 'quote') {
    let quoteQuery = supabase.from('quote_enquiries').select('*', { count: 'exact' });

    if (filters?.startDate) {
      quoteQuery = quoteQuery.gte('created_at', filters.startDate);
    }

    if (filters?.endDate) {
      quoteQuery = quoteQuery.lte('created_at', filters.endDate);
    }

    if (filters?.search) {
      quoteQuery = quoteQuery.or(
        `name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`
      );
    }

    const { data: quoteData, count: quoteCount } = await quoteQuery
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (quoteData) {
      enquiries.push(
        ...quoteData.map((q) => ({
          id: q.id,
          type: 'quote' as const,
          name: q.name,
          email: q.email,
          phone: q.phone,
          message: q.message || '',
          created_at: q.created_at,
          delivery_address: q.delivery_address,
          start_date: q.start_date,
          estimated_duration: q.estimated_duration,
        }))
      );
      total += quoteCount || 0;
    }
  }

  if (!filters?.type || filters.type === 'trade') {
    let tradeQuery = supabase.from('trade_enquiries').select('*', { count: 'exact' });

    if (filters?.startDate) {
      tradeQuery = tradeQuery.gte('created_at', filters.startDate);
    }

    if (filters?.endDate) {
      tradeQuery = tradeQuery.lte('created_at', filters.endDate);
    }

    if (filters?.search) {
      tradeQuery = tradeQuery.or(
        `contact_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%,business_name.ilike.%${filters.search}%`
      );
    }

    const { data: tradeData, count: tradeCount } = await tradeQuery
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (tradeData) {
      enquiries.push(
        ...tradeData.map((t) => ({
          id: t.id,
          type: 'trade' as const,
          name: t.contact_name,
          email: t.email,
          phone: t.phone,
          message: t.message || '',
          created_at: t.created_at,
          business_name: t.business_name,
          estimated_weekly_needs: t.estimated_weekly_needs,
        }))
      );
      total += tradeCount || 0;
    }
  }

  return {
    enquiries: enquiries.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    total,
  };
}

export async function updateBookingStatus(bookingId: string, status: string): Promise<void> {
  await supabase
    .from('bookings')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', bookingId);
}

export async function updateBookingPaymentStatus(
  bookingId: string,
  paymentStatus: string
): Promise<void> {
  await supabase
    .from('bookings')
    .update({ payment_status: paymentStatus, updated_at: new Date().toISOString() })
    .eq('id', bookingId);
}

export async function getAvailableTrailers(startDate: string, endDate: string) {
  const { data: allTrailers } = await supabase
    .from('trailers')
    .select('*')
    .eq('status', 'available');

  const { data: bookings } = await supabase
    .from('bookings')
    .select('trailer_id')
    .in('status', ['confirmed', 'active'])
    .or(`start_date.lte.${endDate},end_date.gte.${startDate}`);

  const bookedTrailerIds = new Set((bookings || []).map((b) => b.trailer_id));

  return (allTrailers || []).filter((trailer) => !bookedTrailerIds.has(trailer.id));
}
