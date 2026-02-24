import { useEffect, useMemo, useRef, useState, cloneElement, ReactElement } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Loader2, AlertCircle } from 'lucide-react';

const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripeKey) {
  console.error('[StripeWrapper] VITE_STRIPE_PUBLISHABLE_KEY is not defined');
}
if (stripeKey && !stripeKey.startsWith('pk_')) {
  console.error('[StripeWrapper] Invalid Stripe publishable key format. Key should start with "pk_"');
}

const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

interface StripeWrapperProps {
  children: ReactElement;
}

export function StripeWrapper({ children }: StripeWrapperProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const locationState = location.state as any;

  // Pull only the values we actually need (avoid depending on the whole object)
  const totalPrice: number | null = locationState?.pricing?.totalPrice ?? null;
  const customerName: string = locationState?.customerName ?? '';
  const customerEmail: string = locationState?.customerEmail ?? '';

  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // prevent duplicate PI creation for same amount/email/name
  const lastRequestKeyRef = useRef<string>('');

  // A stable request key for "same intent inputs"
  const requestKey = useMemo(() => {
    if (!totalPrice || !customerEmail || !customerName) return '';
    return `${customerEmail}::${customerName}::${totalPrice}`;
  }, [customerEmail, customerName, totalPrice]);

  // Guard: if no pricing, go back
  useEffect(() => {
    if (!locationState?.pricing) {
      navigate('/book');
    }
  }, [locationState?.pricing, navigate]);

  useEffect(() => {
    let aborted = false;
    const controller = new AbortController();

    const initializeStripeAndIntent = async () => {
      try {
        // If we don't have required data yet, don't try
        if (!requestKey) {
          setLoading(false);
          setError('Missing booking details (name/email/price). Please return to booking and try again.');
          return;
        }

        // If we've already created a PI for this exact requestKey, skip
        if (lastRequestKeyRef.current === requestKey && clientSecret) {
          console.log('[StripeWrapper] Skipping - already have PI for this requestKey');
          return;
        }

        setLoading(true);
        setError(null);

        console.log('[StripeWrapper] Starting initialization for:', requestKey);

        if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
          throw new Error('Stripe publishable key is not configured.');
        }
        if (!import.meta.env.VITE_SUPABASE_URL) {
          throw new Error('Supabase URL is not configured');
        }
        if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
          throw new Error('Supabase anon key is not configured');
        }
        if (!stripePromise) {
          throw new Error('Failed to initialize Stripe. Please check your Stripe publishable key.');
        }

        // Load Stripe instance once
        if (!stripe) {
          const stripeInstance = await stripePromise;
          if (!stripeInstance) {
            throw new Error('Failed to load Stripe. Please check your Stripe publishable key and internet connection.');
          }
          if (aborted) return;
          console.log('[StripeWrapper] Stripe loaded successfully');
          setStripe(stripeInstance);
        }

        // Create (or recreate) a PaymentIntent when totalPrice changes
        console.log('[StripeWrapper] Creating payment intent for total:', totalPrice);

        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment-intent`,
          {
            method: 'POST',
            signal: controller.signal,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({
              amount: totalPrice,
              customerName,
              customerEmail,
            }),
          }
        );

        console.log('[StripeWrapper] Payment intent response status:', response.status);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('[StripeWrapper] Payment intent error:', errorData);

          if (errorData?.error?.includes?.('Stripe is not configured')) {
            throw new Error('Payment system is not configured. Please contact support to complete your booking.');
          }

          throw new Error(errorData.error || 'Failed to initialize payment');
        }

        const data = await response.json();

        if (!data.clientSecret) {
          throw new Error('Invalid payment response: missing client secret');
        }

        if (aborted) return;

        // Mark this requestKey as done so we don't recreate repeatedly
        lastRequestKeyRef.current = requestKey;

        setClientSecret(data.clientSecret);
        setCustomerId(data.customerId || '');
        setLoading(false);

        console.log('[StripeWrapper] Payment intent created successfully');
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
        console.error('[StripeWrapper] Initialization error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize payment system';
        if (!aborted) {
          setError(errorMessage);
          setLoading(false);
        }
      }
    };

    initializeStripeAndIntent();

    return () => {
      aborted = true;
      controller.abort();
    };
    // IMPORTANT: depend on scalar values, not full locationState
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestKey]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Initializing secure payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    const isConfigError = error.includes('not configured') || error.includes('contact support');

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-lg mx-auto bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-xl font-semibold text-red-900 mb-2">Payment System Error</h2>
              <p className="text-red-700">{error}</p>
            </div>
          </div>

          {isConfigError && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-amber-900 font-medium mb-2">Configuration Required</p>
              <p className="text-sm text-amber-800">
                Ensure STRIPE_SECRET_KEY is set in your Supabase edge function secrets.
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => navigate('/book')}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Return to Booking
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!stripe || !clientSecret) return null;

  return (
    <Elements
      // ✅ Force remount when clientSecret changes (new PaymentIntent)
      key={clientSecret}
      stripe={stripe}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#2563eb',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            borderRadius: '8px',
          },
        },
        loader: 'auto',
      }}
    >
      {cloneElement(children, { customerId })}
    </Elements>
  );
}