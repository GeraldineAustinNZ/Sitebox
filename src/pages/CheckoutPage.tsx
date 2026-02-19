import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { AlertCircle, Loader2, Lock } from 'lucide-react';
import { SEO } from '../components/SEO';
import { getAvailableTrailer } from '../lib/availability';
import { generateBookingReference } from '../lib/booking-utils';
import { formatPrice, type PricingBreakdown } from '../lib/pricing';

interface CheckoutPageProps {
  customerId?: string;
}

export function CheckoutPage({ customerId = '' }: CheckoutPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const stripe = useStripe();
  const elements = useElements();

  const locationState = location.state as any;
  const [currentPricing] = useState<PricingBreakdown | null>(locationState?.pricing || null);

  const [cardholderName, setCardholderName] = useState('');
  const [cardholderNameError, setCardholderNameError] = useState<string | null>(null);
  const [isPaymentElementComplete, setIsPaymentElementComplete] = useState(false);
  const [isPaymentElementReady, setIsPaymentElementReady] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!locationState?.pricing) {
      navigate('/book');
    }
  }, [locationState, navigate]);

  useEffect(() => {
    if (!stripe || !elements) {
      console.log('[Checkout] Stripe or Elements not ready yet');
    } else {
      console.log('[Checkout] Stripe and Elements are ready');
    }
  }, [stripe, elements]);

  const validateCardholderName = (name: string) => {
    if (!name.trim()) {
      setCardholderNameError('Cardholder name is required');
      return false;
    }
    if (name.trim().length < 3) {
      setCardholderNameError('Please enter a valid name');
      return false;
    }
    setCardholderNameError(null);
    return true;
  };

  const handleCardholderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCardholderName(value);
    if (value.trim()) {
      validateCardholderName(value);
    }
  };

  const onError = (errorMessage: string | null) => {
    setError(errorMessage);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !currentPricing) {
      console.error("Stripe not ready or pricing missing");
      return;
    }

    if (!cardholderName.trim() || cardholderNameError) {
      setCardholderNameError('Cardholder name is required');
      return;
    }

    if (!isPaymentElementComplete) {
      onError('Please complete your card details');
      return;
    }

    setProcessing(true);
    onError(null);

    try {
      const trailerId = await getAvailableTrailer(
        new Date(locationState.startDate),
        new Date(locationState.endDate)
      );

      if (!trailerId) {
        throw new Error("No trailers available. Please try different dates.");
      }

      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw new Error(submitError.message);
      }

      const result = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      console.log("[Checkout] confirmPayment result:", result);

      if (result.error) {
        throw new Error(result.error.message);
      }

      if (!result.paymentIntent) {
        throw new Error("Payment failed: No payment intent returned.");
      }

      if (result.paymentIntent.status !== "succeeded") {
        throw new Error(
          `Payment not completed. Status: ${result.paymentIntent.status}`
        );
      }

      console.log(
        "[Checkout] Payment succeeded with ID:",
        result.paymentIntent.id
      );

      const bookingReference = await generateBookingReference();

      const bookingResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-booking`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            trailerId,
            bookingReference,
            customerName: locationState.customerName,
            customerEmail: locationState.customerEmail,
            customerPhone: locationState.customerPhone,
            deliveryAddress: locationState.deliveryAddress,
            startDate: locationState.startDate,
            endDate: locationState.endDate,
            durationWeeks: currentPricing.weeks,
            bookingType: locationState.bookingType,
            weeklyRate: currentPricing.weeklyRate,
            rentalPrice: currentPricing.rentalPrice,
            deliveryFee: currentPricing.deliveryFee,
            pickupFee: currentPricing.pickupFee,
            addonsCost: currentPricing.addonsCost,
            totalPrice: currentPricing.totalPrice,
            specialRequirements: locationState.specialRequirements,
            paymentIntentId: result.paymentIntent.id,
            stripeCustomerId: customerId,
            hasPremiumLock: false,
            hasWheelClamp: false,
            hasGpsSecurity: false,
          }),
        }
      );

      const bookingJson = await bookingResponse.json().catch(() => ({}));

      console.log(
        "[Checkout] Booking response:",
        bookingResponse.status,
        bookingJson
      );

      if (!bookingResponse.ok) {
        const errorMessage =
          bookingJson.error ||
          bookingJson.message ||
          "Failed to create booking";
        throw new Error(
          `Backend Error (${bookingResponse.status}): ${errorMessage}`
        );
      }

      if (!bookingJson.ok || !bookingJson.booking) {
        throw new Error(bookingJson.message || "Failed to create booking");
      }

      console.log('[Checkout] Booking created successfully:', bookingJson.booking.id);

      navigate('/booking-confirmation', {
        state: {
          booking: bookingJson.booking,
          bookingReference,
          emailSent: bookingJson.emailSent,
          emailError: bookingJson.emailError,
        },
      });
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      console.error('[Checkout] Error:', errorMessage);
      onError(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  if (!currentPricing) {
    return null;
  }

  return (
    <>
      <SEO
        title="Secure Checkout - Wanaka Trailer Hire"
        description="Complete your trailer rental booking with secure payment"
      />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Complete Your Booking</h1>
            <p className="mt-2 text-gray-600">Secure payment powered by Stripe</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                <div>
                  <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    id="cardholderName"
                    value={cardholderName}
                    onChange={handleCardholderNameChange}
                    onBlur={() => validateCardholderName(cardholderName)}
                    placeholder="Name on card"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      cardholderNameError ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={processing}
                  />
                  {cardholderNameError && (
                    <p className="mt-1 text-sm text-red-600">{cardholderNameError}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Details
                  </label>
                  <div className="border border-gray-300 rounded-lg p-4 min-h-[120px]">
                    {!isPaymentElementReady && (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                        <span className="ml-2 text-gray-600">Loading payment form...</span>
                      </div>
                    )}
                    <PaymentElement
                      onReady={() => {
                        console.log('[Checkout] PaymentElement is ready');
                        setIsPaymentElementReady(true);
                      }}
                      onChange={(event) => {
                        console.log('[Checkout] PaymentElement changed:', event.complete);
                        setIsPaymentElementComplete(event.complete);
                        if (event.complete) {
                          setError(null);
                        }
                      }}
                      onLoadError={(error) => {
                        console.error('[Checkout] PaymentElement load error:', error);
                        setError('Failed to load payment form. Please refresh the page.');
                      }}
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-900">Payment Error</p>
                      <p className="text-sm text-red-700 mt-1">{error}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-gray-600 p-4 bg-gray-50 rounded-lg">
                  <Lock className="w-4 h-4" />
                  <span>Your payment information is encrypted and secure</span>
                </div>

                <button
                  type="submit"
                  disabled={!stripe || processing || !cardholderName.trim() || !!cardholderNameError || !isPaymentElementComplete}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    `Pay ${formatPrice(currentPricing.totalPrice)}`
                  )}
                </button>
              </form>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rental ({currentPricing.weeks} {currentPricing.weeks === 1 ? 'week' : 'weeks'})</span>
                    <span className="font-medium">{formatPrice(currentPricing.rentalPrice)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery</span>
                    <span className="font-medium">{formatPrice(currentPricing.deliveryFee)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Pickup</span>
                    <span className="font-medium">{formatPrice(currentPricing.pickupFee)}</span>
                  </div>

                  {currentPricing.addonsCost > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Add-ons</span>
                      <span className="font-medium">{formatPrice(currentPricing.addonsCost)}</span>
                    </div>
                  )}

                  <div className="border-t pt-3 flex justify-between text-base">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-gray-900">{formatPrice(currentPricing.totalPrice)}</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t space-y-2 text-sm text-gray-600">
                  <p className="font-medium text-gray-900">Delivery Details</p>
                  <p>{locationState.customerName}</p>
                  <p>{locationState.deliveryAddress}</p>
                  <p className="pt-2">{locationState.startDate} to {locationState.endDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
