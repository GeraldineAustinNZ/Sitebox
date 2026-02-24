import { useState, useEffect, useMemo } from 'react';
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

/**
 * If you already have these prices in your pricing engine, replace these constants
 * with values coming from locationState or PricingBreakdown.
 */
const ADDON_PRICES_NZD_PER_WEEK = {
  premiumLock: 25,
  wheelClamp: 20,
  gpsSecurity: 30,
};

// Optional: bundle discount when all 3 selected
const BUNDLE_DISCOUNT_NZD_PER_WEEK = 10;

type AddOnsState = {
  hasPremiumLock: boolean;
  hasWheelClamp: boolean;
  hasGpsSecurity: boolean;
};

export function CheckoutPage({ customerId = '' }: CheckoutPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const stripe = useStripe();
  const elements = useElements();

  const locationState = location.state as any;

  // IMPORTANT: allow pricing to change when add-ons change
  const [currentPricing, setCurrentPricing] = useState<PricingBreakdown | null>(
    locationState?.pricing || null
  );

  // Restore add-ons from state if they exist (so refresh/replace keeps them)
  const [addOns, setAddOns] = useState<AddOnsState>(() => ({
    hasPremiumLock: Boolean(locationState?.addOns?.hasPremiumLock),
    hasWheelClamp: Boolean(locationState?.addOns?.hasWheelClamp),
    hasGpsSecurity: Boolean(locationState?.addOns?.hasGpsSecurity),
  }));

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  /**
   * Compute add-ons cost based on weeks and selected add-ons.
   * (If your pricing engine already calculates this, replace this logic.)
   */
  const computedAddonsCost = useMemo(() => {
    if (!currentPricing) return 0;
    const weeks = currentPricing.weeks || 0;

    const perWeek =
      (addOns.hasPremiumLock ? ADDON_PRICES_NZD_PER_WEEK.premiumLock : 0) +
      (addOns.hasWheelClamp ? ADDON_PRICES_NZD_PER_WEEK.wheelClamp : 0) +
      (addOns.hasGpsSecurity ? ADDON_PRICES_NZD_PER_WEEK.gpsSecurity : 0);

    const allThree =
      addOns.hasPremiumLock && addOns.hasWheelClamp && addOns.hasGpsSecurity;

    const discountPerWeek = allThree ? BUNDLE_DISCOUNT_NZD_PER_WEEK : 0;

    const total = Math.max(0, (perWeek - discountPerWeek) * weeks);
    return total;
  }, [addOns, currentPricing]);

  /**
   * Recalculate totals whenever add-ons change.
   * We update BOTH local state and location.state (replace) so a Stripe wrapper can
   * recreate the PaymentIntent using the new total.
   */
  useEffect(() => {
    if (!currentPricing) return;

    const baseTotalWithoutAddons =
      (currentPricing.totalPrice ?? 0) - (currentPricing.addonsCost ?? 0);

    const nextPricing: PricingBreakdown = {
      ...currentPricing,
      addonsCost: computedAddonsCost,
      totalPrice: baseTotalWithoutAddons + computedAddonsCost,
    };

    setCurrentPricing(nextPricing);

    // Update route state so other components (Stripe wrapper) can respond
    // NOTE: This stays on /checkout but updates location.state.
    navigate('/checkout', {
      replace: true,
      state: {
        ...locationState,
        pricing: nextPricing,
        addOns,
      },
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [computedAddonsCost]);

  const toggleAddon = (key: keyof AddOnsState) => {
    // If payment element already ready, changing add-ons may mismatch PaymentIntent amount.
    // We prevent toggling after the payment UI is loaded to keep charge/booking consistent,
    // unless your Stripe wrapper recreates the PaymentIntent instantly on pricing change.
    if (isPaymentElementReady) {
      setError(
        'Add-ons are locked once the payment form loads. Refresh the page if you need to change add-ons.'
      );
      return;
    }

    setAddOns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    setError(null);
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

            // ✅ restore add-on flags into booking record
            hasPremiumLock: addOns.hasPremiumLock,
            hasWheelClamp: addOns.hasWheelClamp,
            hasGpsSecurity: addOns.hasGpsSecurity,
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

  const allThreeSelected =
    addOns.hasPremiumLock && addOns.hasWheelClamp && addOns.hasGpsSecurity;

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
                {/* ✅ ADD-ONS SECTION */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h2 className="text-base font-semibold text-gray-900">Optional Security Add-ons</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Select any extras you want to add to your booking.
                  </p>

                  <div className="mt-4 space-y-3">
                    <label className="flex items-center justify-between gap-3 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={addOns.hasPremiumLock}
                          onChange={() => toggleAddon('hasPremiumLock')}
                          disabled={processing}
                          className="h-4 w-4"
                        />
                        <div>
                          <div className="font-medium text-gray-900">Premium Lock</div>
                          <div className="text-sm text-gray-600">
                            {formatPrice(ADDON_PRICES_NZD_PER_WEEK.premiumLock)} / week
                          </div>
                        </div>
                      </div>
                    </label>

                    <label className="flex items-center justify-between gap-3 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={addOns.hasWheelClamp}
                          onChange={() => toggleAddon('hasWheelClamp')}
                          disabled={processing}
                          className="h-4 w-4"
                        />
                        <div>
                          <div className="font-medium text-gray-900">Wheel Clamp</div>
                          <div className="text-sm text-gray-600">
                            {formatPrice(ADDON_PRICES_NZD_PER_WEEK.wheelClamp)} / week
                          </div>
                        </div>
                      </div>
                    </label>

                    <label className="flex items-center justify-between gap-3 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={addOns.hasGpsSecurity}
                          onChange={() => toggleAddon('hasGpsSecurity')}
                          disabled={processing}
                          className="h-4 w-4"
                        />
                        <div>
                          <div className="font-medium text-gray-900">GPS Security</div>
                          <div className="text-sm text-gray-600">
                            {formatPrice(ADDON_PRICES_NZD_PER_WEEK.gpsSecurity)} / week
                          </div>
                        </div>
                      </div>
                    </label>

                    {allThreeSelected && (
                      <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                        Bundle discount applied: {formatPrice(BUNDLE_DISCOUNT_NZD_PER_WEEK)} / week
                      </div>
                    )}

                    {isPaymentElementReady && (
                      <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                        Add-ons are locked once the payment form loads. Refresh the page if you need to change them.
                      </div>
                    )}
                  </div>
                </div>

                {/* CARDHOLDER NAME */}
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

                {/* PAYMENT */}
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
                  disabled={
                    !stripe ||
                    processing ||
                    !cardholderName.trim() ||
                    !!cardholderNameError ||
                    !isPaymentElementComplete
                  }
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

            {/* SUMMARY */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Rental ({currentPricing.weeks} {currentPricing.weeks === 1 ? 'week' : 'weeks'})
                    </span>
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