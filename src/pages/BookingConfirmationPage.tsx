import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Calendar, MapPin, Mail, Phone, Lock, Shield, Disc, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { SEO } from '../components/SEO';
import { formatDate } from '../lib/booking-utils';
import { formatPrice } from '../lib/pricing';

export function BookingConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking, bookingReference, emailSent: initialEmailSent, emailError: initialEmailError } = location.state || {};

  const [emailSent, setEmailSent] = useState<boolean>(initialEmailSent ?? false);
  const [emailError, setEmailError] = useState<string | null>(initialEmailError ?? null);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    if (!booking) {
      navigate('/');
    }
  }, [booking, navigate]);

  if (!booking) {
    return null;
  }

  const startDate = new Date(booking.start_date);
  const endDate = new Date(booking.end_date);

  const handleResendEmail = async () => {
    setResending(true);
    setResendSuccess(false);
    setEmailError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/resend-confirmation`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            bookingReference: booking.booking_reference,
            customerEmail: booking.customer_email,
          }),
        }
      );

      const result = await response.json().catch(() => ({}));

      if (response.ok && result.success) {
        setEmailSent(true);
        setResendSuccess(true);
        setEmailError(null);
      } else {
        setEmailError(result.error || 'Failed to resend email. Please try again.');
      }
    } catch {
      setEmailError('Network error. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      <SEO
        title="Booking Confirmed - Sitebox Wanaka"
        description="Your trailer booking has been confirmed"
      />

      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-4">
              <CheckCircle className="w-12 h-12 text-emerald-600" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Booking Confirmed!</h1>
            <p className="text-xl text-slate-600">
              Your secure mobile storage trailer is booked and ready
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <div className="text-center mb-8 pb-8 border-b">
              <div className="text-sm text-slate-600 mb-2">Booking Reference</div>
              <div className="text-3xl font-bold text-emerald-600">{bookingReference}</div>
              <p className="text-sm text-slate-600 mt-2">
                Save this reference number for your records
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-emerald-600" />
                  Rental Period
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-slate-600">Delivery Date</div>
                    <div className="font-medium text-slate-900">{formatDate(startDate)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600">Pickup Date</div>
                    <div className="font-medium text-slate-900">{formatDate(endDate)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600">Duration</div>
                    <div className="font-medium text-slate-900">
                      {booking.duration_weeks} {booking.duration_weeks === 1 ? 'week' : 'weeks'}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-emerald-600" />
                  Delivery Location
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-slate-600">Address</div>
                    <div className="font-medium text-slate-900">{booking.delivery_address}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-8 mb-8">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Payment Summary</h3>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-slate-700">
                  <span>Rental ({formatPrice(booking.weekly_rate)}/week × {booking.duration_weeks} weeks)</span>
                  <span className="font-medium">
                    {formatPrice((booking.total_price - booking.delivery_fee - booking.pickup_fee - (booking.addons_cost || 0)))}
                  </span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Delivery Fee</span>
                  <span className="font-medium">{formatPrice(booking.delivery_fee)}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Pickup Fee</span>
                  <span className="font-medium">{formatPrice(booking.pickup_fee)}</span>
                </div>
                {(booking.has_premium_lock || booking.has_wheel_clamp || booking.has_gps_security) && (
                  <>
                    <div className="pt-3 border-t">
                      <div className="text-sm font-semibold text-slate-900 mb-2">Premium Add-ons</div>
                      <div className="space-y-2 ml-4">
                        {booking.has_premium_lock && (
                          <div className="flex justify-between text-slate-700 text-sm">
                            <div className="flex items-center">
                              <Lock className="w-4 h-4 mr-2 text-emerald-600" />
                              <span>Premium Lock</span>
                            </div>
                            <span>Included</span>
                          </div>
                        )}
                        {booking.has_wheel_clamp && (
                          <div className="flex justify-between text-slate-700 text-sm">
                            <div className="flex items-center">
                              <Disc className="w-4 h-4 mr-2 text-emerald-600" />
                              <span>Wheel Clamp</span>
                            </div>
                            <span>Included</span>
                          </div>
                        )}
                        {booking.has_gps_security && (
                          <div className="flex justify-between text-slate-700 text-sm">
                            <div className="flex items-center">
                              <Shield className="w-4 h-4 mr-2 text-emerald-600" />
                              <span>GPS Security</span>
                            </div>
                            <span>Included</span>
                          </div>
                        )}
                        {booking.has_premium_lock && booking.has_wheel_clamp && booking.has_gps_security && (
                          <div className="flex justify-between text-emerald-700 text-sm font-medium">
                            <span>Bundle Discount (10%)</span>
                            <span>Applied</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {booking.addons_cost > 0 && (
                      <div className="flex justify-between text-slate-700">
                        <span>Add-ons Total</span>
                        <span className="font-medium">{formatPrice(booking.addons_cost)}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="flex justify-between text-xl font-bold text-slate-900 pt-4 border-t">
                <span>Total Paid</span>
                <span className="text-emerald-600">{formatPrice(booking.total_price)}</span>
              </div>
            </div>

            <div className="border-t pt-8">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Contact Information</h3>
              <div className="space-y-2">
                <div className="flex items-center text-slate-700">
                  <Mail className="w-4 h-4 mr-2 text-slate-400" />
                  <span>{booking.customer_email}</span>
                </div>
                <div className="flex items-center text-slate-700">
                  <Phone className="w-4 h-4 mr-2 text-slate-400" />
                  <span>{booking.customer_phone}</span>
                </div>
              </div>
            </div>

            {booking.special_requirements && (
              <div className="border-t pt-8 mt-8">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Special Requirements</h3>
                <p className="text-slate-700">{booking.special_requirements}</p>
              </div>
            )}
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-slate-900 mb-3">What Happens Next?</h3>
            <ul className="space-y-3 text-slate-700">
              <li className="flex items-start">
                {emailSent ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  {emailSent ? (
                    <span>
                      {resendSuccess ? 'Confirmation email resent to' : 'A confirmation email has been sent to'}{' '}
                      <strong>{booking.customer_email}</strong>
                    </span>
                  ) : (
                    <div>
                      <span className="text-amber-800">
                        We were unable to send a confirmation email to{' '}
                        <strong>{booking.customer_email}</strong>.
                        Your booking is confirmed — please save your reference number above.
                      </span>
                      {emailError && (
                        <p className="text-xs text-amber-700 mt-1">{emailError}</p>
                      )}
                      <button
                        onClick={handleResendEmail}
                        disabled={resending}
                        className="mt-2 inline-flex items-center px-3 py-1.5 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {resending ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                            Resend Confirmation Email
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>We'll contact you 24 hours before delivery to confirm timing</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Your trailer will be delivered on {formatDate(startDate)}</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>We'll pick up the trailer on {formatDate(endDate)}</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/my-bookings"
              state={{ email: booking.customer_email }}
              className="flex-1 py-4 px-6 bg-emerald-600 text-white rounded-lg font-semibold text-center hover:bg-emerald-700 transition-colors"
            >
              View My Bookings
            </Link>
            <Link
              to="/"
              className="flex-1 py-4 px-6 bg-slate-200 text-slate-700 rounded-lg font-semibold text-center hover:bg-slate-300 transition-colors"
            >
              Return to Home
            </Link>
          </div>

          <div className="mt-8 text-center">
            <p className="text-slate-600 mb-2">Questions about your booking?</p>
            <a
              href="tel:0273422200"
              className="text-emerald-600 font-medium hover:text-emerald-700"
            >
              Call us at 027 342 2200
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
