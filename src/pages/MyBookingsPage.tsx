import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Calendar, MapPin, Search, Loader2, AlertCircle, Edit2, XCircle } from 'lucide-react';
import { SEO } from '../components/SEO';
import { supabase } from '../lib/supabase';
import { formatDateShort } from '../lib/booking-utils';
import { formatPrice } from '../lib/pricing';

interface Booking {
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
  weekly_rate: number;
  delivery_fee: number;
  pickup_fee: number;
  total_price: number;
  special_requirements: string | null;
  status: string;
  payment_status: string;
  created_at: string;
}

export function MyBookingsPage() {
  const location = useLocation();
  const prefilledEmail = location.state?.email || '';

  const [email, setEmail] = useState(prefilledEmail);
  const [bookingRef, setBookingRef] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModificationModal, setShowModificationModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [modificationType, setModificationType] = useState<'change_dates' | 'cancel'>('change_dates');
  const [modificationReason, setModificationReason] = useState('');
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const [submittingModification, setSubmittingModification] = useState(false);

  useEffect(() => {
    if (prefilledEmail) {
      handleSearch();
    }
  }, [prefilledEmail]);

  const handleSearch = async () => {
    if (!email && !bookingRef) {
      setError('Please enter either an email address or booking reference');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let query = supabase.from('bookings').select('*');

      if (bookingRef) {
        query = query.eq('booking_reference', bookingRef.toUpperCase());
      } else if (email) {
        query = query.eq('customer_email', email.toLowerCase());
      }

      query = query.order('created_at', { ascending: false });

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      if (!data || data.length === 0) {
        setError('No bookings found. Please check your details and try again.');
        setBookings([]);
      } else {
        setBookings(data);
      }
    } catch (err: any) {
      setError('Failed to fetch bookings. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleModificationRequest = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowModificationModal(true);
    setModificationType('change_dates');
    setModificationReason('');
    setNewStartDate('');
    setNewEndDate('');
  };

  const submitModificationRequest = async () => {
    if (!selectedBooking) return;

    if (modificationType === 'change_dates' && (!newStartDate || !newEndDate)) {
      alert('Please select new dates');
      return;
    }

    setSubmittingModification(true);

    try {
      const { error: modError } = await supabase
        .from('booking_modifications')
        .insert({
          booking_id: selectedBooking.id,
          modification_type: modificationType,
          requested_start_date: modificationType === 'change_dates' ? newStartDate : null,
          requested_end_date: modificationType === 'change_dates' ? newEndDate : null,
          reason: modificationReason,
          status: 'pending',
        });

      if (modError) throw modError;

      alert(
        modificationType === 'cancel'
          ? 'Cancellation request submitted. We will contact you shortly.'
          : 'Modification request submitted. We will contact you shortly to confirm.'
      );

      setShowModificationModal(false);
      setSelectedBooking(null);
    } catch (err: any) {
      alert('Failed to submit request. Please contact us directly.');
      console.error(err);
    } finally {
      setSubmittingModification(false);
    }
  };

  return (
    <>
      <SEO
        title="My Bookings - Sitebox Wanaka"
        description="View and manage your trailer bookings"
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">My Bookings</h1>
            <p className="text-xl text-slate-600">
              View your bookings and request changes
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="flex items-center mb-6">
              <Search className="w-5 h-5 text-slate-400 mr-2" />
              <h2 className="text-xl font-bold text-slate-900">Find Your Bookings</h2>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div className="text-center text-slate-500 text-sm">OR</div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Booking Reference
                </label>
                <input
                  type="text"
                  value={bookingRef}
                  onChange={(e) => setBookingRef(e.target.value)}
                  placeholder="SBW-2024-0001"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
                <p className="text-red-900">{error}</p>
              </div>
            )}

            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Search Bookings
                </>
              )}
            </button>
          </div>

          {bookings.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">Your Bookings</h2>
              {bookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-2xl font-bold text-emerald-600 mb-1">
                        {booking.booking_reference}
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full font-medium ${
                            booking.status === 'confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : booking.status === 'active'
                              ? 'bg-blue-100 text-blue-800'
                              : booking.status === 'completed'
                              ? 'bg-slate-100 text-slate-800'
                              : booking.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                        <span className="text-slate-600">
                          Booked {new Date(booking.created_at).toLocaleDateString('en-NZ')}
                        </span>
                      </div>
                    </div>
                    {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                      <button
                        onClick={() => handleModificationRequest(booking)}
                        className="px-4 py-2 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors flex items-center"
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Modify
                      </button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-bold text-slate-900 mb-3 flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-emerald-600" />
                        Rental Period
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-slate-600">Delivery:</span>{' '}
                          <span className="font-medium text-slate-900">
                            {formatDateShort(new Date(booking.start_date))}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-600">Pickup:</span>{' '}
                          <span className="font-medium text-slate-900">
                            {formatDateShort(new Date(booking.end_date))}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-600">Duration:</span>{' '}
                          <span className="font-medium text-slate-900">
                            {booking.duration_weeks} {booking.duration_weeks === 1 ? 'week' : 'weeks'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 mb-3 flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-emerald-600" />
                        Delivery Location
                      </h4>
                      <p className="text-sm text-slate-700">{booking.delivery_address}</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700">Total Paid</span>
                      <span className="text-xl font-bold text-emerald-600">
                        {formatPrice(booking.total_price)}
                      </span>
                    </div>
                  </div>

                  {booking.special_requirements && (
                    <div className="border-t mt-4 pt-4">
                      <h4 className="text-sm font-bold text-slate-900 mb-2">Special Requirements</h4>
                      <p className="text-sm text-slate-700">{booking.special_requirements}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {showModificationModal && selectedBooking && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl max-w-lg w-full p-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Modify Booking {selectedBooking.booking_reference}
                </h3>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      What would you like to do?
                    </label>
                    <div className="space-y-2">
                      <button
                        onClick={() => setModificationType('change_dates')}
                        className={`w-full p-4 border-2 rounded-lg text-left transition-colors ${
                          modificationType === 'change_dates'
                            ? 'border-emerald-600 bg-emerald-50'
                            : 'border-slate-300 hover:border-slate-400'
                        }`}
                      >
                        <div className="flex items-center">
                          <Edit2 className="w-5 h-5 mr-3" />
                          <div>
                            <div className="font-medium text-slate-900">Change Dates</div>
                            <div className="text-sm text-slate-600">Request different delivery/pickup dates</div>
                          </div>
                        </div>
                      </button>
                      <button
                        onClick={() => setModificationType('cancel')}
                        className={`w-full p-4 border-2 rounded-lg text-left transition-colors ${
                          modificationType === 'cancel'
                            ? 'border-red-600 bg-red-50'
                            : 'border-slate-300 hover:border-slate-400'
                        }`}
                      >
                        <div className="flex items-center">
                          <XCircle className="w-5 h-5 mr-3" />
                          <div>
                            <div className="font-medium text-slate-900">Cancel Booking</div>
                            <div className="text-sm text-slate-600">Request to cancel this booking</div>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {modificationType === 'change_dates' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          New Delivery Date
                        </label>
                        <input
                          type="date"
                          value={newStartDate}
                          onChange={(e) => setNewStartDate(e.target.value)}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          New Pickup Date
                        </label>
                        <input
                          type="date"
                          value={newEndDate}
                          onChange={(e) => setNewEndDate(e.target.value)}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Reason (Optional)
                    </label>
                    <textarea
                      value={modificationReason}
                      onChange={(e) => setModificationReason(e.target.value)}
                      placeholder="Please let us know why you're requesting this change..."
                      rows={3}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setShowModificationModal(false)}
                    disabled={submittingModification}
                    className="flex-1 py-3 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitModificationRequest}
                    disabled={submittingModification}
                    className="flex-1 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:bg-slate-300 flex items-center justify-center"
                  >
                    {submittingModification ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Request'
                    )}
                  </button>
                </div>

                <p className="text-sm text-slate-600 mt-4">
                  We'll review your request and contact you within 24 hours to confirm.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
