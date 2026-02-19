import { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/admin/DashboardLayout';
import { getBookingsList, updateBookingStatus, updateBookingPaymentStatus, getAvailableTrailers, Booking } from '../lib/admin-queries';
import { Search, Filter, Loader2, Edit, Plus, X, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { generateBookingReference } from '../lib/booking-utils';
import { getWeeklyRate } from '../lib/pricing';

export function BookingsManagementPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadBookings();
  }, [search, statusFilter, paymentFilter]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const filters: any = {};
      if (statusFilter) filters.status = statusFilter;
      if (paymentFilter) filters.paymentStatus = paymentFilter;
      if (search) filters.search = search;

      const data = await getBookingsList(filters);
      setBookings(data.bookings);
      setTotal(data.total);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      loadBookings();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handlePaymentStatusUpdate = async (bookingId: string, newPaymentStatus: string) => {
    try {
      await updateBookingPaymentStatus(bookingId, newPaymentStatus);
      loadBookings();
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-charcoal-900">Bookings Management</h1>
            <p className="text-charcoal-600 mt-1">View and manage all trailer bookings</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Booking
          </button>
        </div>

        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-charcoal-200 space-y-4">
            <div className="flex gap-4">
              <div className="flex-grow relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by reference, name, or email..."
                  className="w-full pl-10 pr-4 py-3 border border-charcoal-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 border border-charcoal-300 rounded-lg hover:bg-charcoal-50 transition-colors"
              >
                <Filter className="w-5 h-5" />
                Filters
              </button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-charcoal-200">
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">
                    Booking Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-charcoal-300 rounded-lg focus:ring-2 focus:ring-ocean-500"
                  >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">
                    Payment Status
                  </label>
                  <select
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-charcoal-300 rounded-lg focus:ring-2 focus:ring-ocean-500"
                  >
                    <option value="">All Payment Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="succeeded">Succeeded</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-ocean-600 animate-spin" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-charcoal-600">No bookings found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-charcoal-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-600 uppercase tracking-wider">
                      Reference
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-600 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-600 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-600 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-600 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-600 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-charcoal-200">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-charcoal-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-charcoal-900">
                          {booking.booking_reference}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-charcoal-900">{booking.customer_name}</div>
                        <div className="text-sm text-charcoal-600">{booking.customer_email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-charcoal-900">
                          {new Date(booking.start_date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-charcoal-600">
                          to {new Date(booking.end_date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-charcoal-900">{booking.duration_weeks} weeks</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={booking.status}
                          onChange={(e) => handleStatusUpdate(booking.id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-ocean-500 ${
                            booking.status === 'completed' ? 'bg-sage-100 text-sage-700' :
                            booking.status === 'active' ? 'bg-ocean-100 text-ocean-700' :
                            booking.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                            booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-charcoal-100 text-charcoal-700'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="active">Active</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={booking.payment_status}
                          onChange={(e) => handlePaymentStatusUpdate(booking.id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-ocean-500 ${
                            booking.payment_status === 'succeeded' ? 'bg-sage-100 text-sage-700' :
                            booking.payment_status === 'processing' ? 'bg-blue-100 text-blue-700' :
                            booking.payment_status === 'failed' ? 'bg-red-100 text-red-700' :
                            'bg-charcoal-100 text-charcoal-700'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="succeeded">Succeeded</option>
                          <option value="failed">Failed</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-charcoal-900">
                          ${booking.total_price.toLocaleString('en-NZ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="text-sm text-ocean-600 hover:text-ocean-700 font-medium flex items-center gap-1"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && total > 0 && (
            <div className="px-6 py-4 border-t border-charcoal-200 bg-charcoal-50">
              <p className="text-sm text-charcoal-600">
                Showing {bookings.length} of {total} bookings
              </p>
            </div>
          )}
        </div>
      </div>

      {(selectedBooking || showCreateModal) && (
        <BookingModal
          booking={selectedBooking}
          onClose={() => {
            setSelectedBooking(null);
            setShowCreateModal(false);
          }}
          onSave={() => {
            loadBookings();
            setSelectedBooking(null);
            setShowCreateModal(false);
          }}
        />
      )}
    </DashboardLayout>
  );
}

interface BookingModalProps {
  booking: Booking | null;
  onClose: () => void;
  onSave: () => void;
}

function BookingModal({ booking, onClose, onSave }: BookingModalProps) {
  const [formData, setFormData] = useState({
    customer_name: booking?.customer_name || '',
    customer_email: booking?.customer_email || '',
    customer_phone: booking?.customer_phone || '',
    delivery_address: booking?.delivery_address || '',
    start_date: booking?.start_date || '',
    end_date: booking?.end_date || '',
    duration_weeks: booking?.duration_weeks || 1,
    special_requirements: booking?.special_requirements || '',
    booking_type: booking?.booking_type || 'standard',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const weeklyRate = getWeeklyRate(formData.duration_weeks, formData.booking_type as 'standard' | 'trade');
      const rentalPrice = weeklyRate * formData.duration_weeks;
      const deliveryFee = 0;
      const pickupFee = 90;
      const totalPrice = rentalPrice + deliveryFee + pickupFee;

      const availableTrailers = await getAvailableTrailers(formData.start_date, formData.end_date);
      if (availableTrailers.length === 0 && !booking) {
        throw new Error('No trailers available for selected dates');
      }

      const bookingData = {
        ...formData,
        booking_reference: booking?.booking_reference || generateBookingReference(),
        trailer_id: booking?.trailer_id || availableTrailers[0]?.id,
        rental_price: rentalPrice,
        delivery_fee: deliveryFee,
        pickup_fee: pickupFee,
        total_price: totalPrice,
        weekly_rate: weeklyRate,
        status: booking?.status || 'confirmed',
        payment_status: booking?.payment_status || 'pending',
      };

      if (booking) {
        await supabase
          .from('bookings')
          .update({ ...bookingData, updated_at: new Date().toISOString() })
          .eq('id', booking.id);
      } else {
        await supabase.from('bookings').insert([bookingData]);
      }

      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save booking');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-charcoal-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-charcoal-900">
            {booking ? 'Edit Booking' : 'Create New Booking'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-charcoal-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-charcoal-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-2">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-charcoal-300 rounded-lg focus:ring-2 focus:ring-ocean-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.customer_email}
                  onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-charcoal-300 rounded-lg focus:ring-2 focus:ring-ocean-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.customer_phone}
                  onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-charcoal-300 rounded-lg focus:ring-2 focus:ring-ocean-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-2">
                  Booking Type
                </label>
                <select
                  value={formData.booking_type}
                  onChange={(e) => setFormData({ ...formData, booking_type: e.target.value })}
                  className="w-full px-4 py-2 border border-charcoal-300 rounded-lg focus:ring-2 focus:ring-ocean-500"
                >
                  <option value="standard">Standard</option>
                  <option value="trade">Trade</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-2">
                Delivery Address
              </label>
              <input
                type="text"
                value={formData.delivery_address}
                onChange={(e) => setFormData({ ...formData, delivery_address: e.target.value })}
                required
                className="w-full px-4 py-2 border border-charcoal-300 rounded-lg focus:ring-2 focus:ring-ocean-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-charcoal-300 rounded-lg focus:ring-2 focus:ring-ocean-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-charcoal-300 rounded-lg focus:ring-2 focus:ring-ocean-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-2">
                  Weeks
                </label>
                <input
                  type="number"
                  value={formData.duration_weeks}
                  onChange={(e) => setFormData({ ...formData, duration_weeks: parseInt(e.target.value) })}
                  required
                  min="1"
                  className="w-full px-4 py-2 border border-charcoal-300 rounded-lg focus:ring-2 focus:ring-ocean-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-2">
                Special Requirements
              </label>
              <textarea
                value={formData.special_requirements}
                onChange={(e) => setFormData({ ...formData, special_requirements: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-charcoal-300 rounded-lg focus:ring-2 focus:ring-ocean-500"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-4 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-charcoal-300 text-charcoal-700 rounded-lg hover:bg-charcoal-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition-colors disabled:bg-charcoal-300"
            >
              {saving ? 'Saving...' : booking ? 'Update Booking' : 'Create Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
