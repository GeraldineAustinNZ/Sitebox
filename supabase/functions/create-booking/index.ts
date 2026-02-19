import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface StripePaymentIntent {
  id: string;
  status: string;
  amount: number;
  amount_received: number;
  currency: string;
  customer: string;
  metadata: Record<string, string>;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const {
      trailerId,
      bookingReference,
      customerName,
      customerEmail,
      customerPhone,
      deliveryAddress,
      startDate,
      endDate,
      durationWeeks,
      bookingType,
      weeklyRate,
      rentalPrice,
      deliveryFee,
      pickupFee,
      addonsCost,
      totalPrice,
      specialRequirements,
      paymentIntentId,
      stripeCustomerId,
      hasPremiumLock,
      hasWheelClamp,
      hasGpsSecurity,
    } = await req.json();

    console.log('[create-booking] Received request:', {
      trailerId,
      bookingReference,
      customerEmail,
      paymentIntentId,
      totalPrice,
    });

    if (!trailerId || !bookingReference || !customerName || !customerEmail || !customerPhone ||
        !deliveryAddress || !startDate || !endDate || !paymentIntentId || !totalPrice) {
      console.error("[create-booking] Validation failed: missing required fields");
      return new Response(
        JSON.stringify({
          ok: false,
          stage: "validation",
          message: "Missing required fields",
          details: "Required: trailerId, bookingReference, customerName, customerEmail, customerPhone, deliveryAddress, startDate, endDate, paymentIntentId, totalPrice",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!stripeKey) {
      console.error("[create-booking] Stripe secret key not configured");
      return new Response(
        JSON.stringify({
          ok: false,
          stage: "validation",
          message: "Payment system not configured",
          details: "STRIPE_SECRET_KEY is missing",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("[create-booking] Supabase configuration missing");
      return new Response(
        JSON.stringify({
          ok: false,
          stage: "validation",
          message: "Database not configured",
          details: "Supabase environment variables missing",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`[create-booking] Verifying payment intent: ${paymentIntentId}`);

    const stripeResponse = await fetch(
      `https://api.stripe.com/v1/payment_intents/${paymentIntentId}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${stripeKey}`,
        },
      }
    );

    if (!stripeResponse.ok) {
      const stripeError = await stripeResponse.json().catch(() => ({}));
      console.error("[create-booking] Stripe API error:", stripeError);
      return new Response(
        JSON.stringify({
          ok: false,
          stage: "stripe_verify",
          message: "Failed to verify payment with Stripe",
          details: stripeError.error?.message || "Stripe API request failed",
          stripeStatus: null,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const paymentIntent: StripePaymentIntent = await stripeResponse.json();

    console.log('[create-booking] Payment intent retrieved:', {
      id: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      amount_received: paymentIntent.amount_received,
      currency: paymentIntent.currency,
    });

    if (paymentIntent.status !== "succeeded") {
      console.error(`[create-booking] Payment not succeeded: ${paymentIntent.status}`);
      return new Response(
        JSON.stringify({
          ok: false,
          stage: "stripe_verify",
          message: `Payment not completed. Current status: ${paymentIntent.status}`,
          details: "Payment must be in 'succeeded' state before booking can be created",
          stripeStatus: paymentIntent.status,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const expectedAmountCents = Math.round(totalPrice * 100);
    if (paymentIntent.amount_received !== expectedAmountCents) {
      console.error('[create-booking] Amount mismatch:', {
        expected: expectedAmountCents,
        received: paymentIntent.amount_received,
      });
      return new Response(
        JSON.stringify({
          ok: false,
          stage: "stripe_verify",
          message: "Payment amount does not match booking total",
          details: `Expected $${totalPrice} NZD (${expectedAmountCents} cents), but received ${paymentIntent.amount_received} cents`,
          stripeStatus: paymentIntent.status,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (paymentIntent.currency.toLowerCase() !== "nzd") {
      console.error(`[create-booking] Wrong currency: ${paymentIntent.currency}`);
      return new Response(
        JSON.stringify({
          ok: false,
          stage: "stripe_verify",
          message: `Incorrect payment currency: ${paymentIntent.currency.toUpperCase()}`,
          details: "Only NZD payments are accepted",
          stripeStatus: paymentIntent.status,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log('[create-booking] Payment verified successfully');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('[create-booking] Checking for existing booking with this payment intent');
    const { data: existingBooking, error: checkError } = await supabase
      .from("bookings")
      .select("*")
      .eq("payment_intent_id", paymentIntentId)
      .maybeSingle();

    if (checkError) {
      console.error("[create-booking] Error checking for existing booking:", {
        error: checkError,
        code: checkError.code,
        message: checkError.message,
        details: checkError.details,
        hint: checkError.hint,
      });
      return new Response(
        JSON.stringify({
          ok: false,
          stage: "db_insert",
          message: checkError.message || "Database error while checking for duplicates",
          code: checkError.code,
          details: checkError.details,
          hint: checkError.hint,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (existingBooking) {
      console.log(`[create-booking] Booking already exists for payment intent ${paymentIntentId}:`, existingBooking.id);
      return new Response(
        JSON.stringify({
          ok: true,
          booking: existingBooking,
          deduped: true,
          message: "Booking already exists for this payment",
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log('[create-booking] Creating new booking');
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        trailer_id: trailerId,
        booking_reference: bookingReference,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        delivery_address: deliveryAddress,
        start_date: startDate,
        end_date: endDate,
        duration_weeks: durationWeeks,
        booking_type: bookingType,
        weekly_rate: weeklyRate,
        rental_price: rentalPrice,
        delivery_fee: deliveryFee,
        pickup_fee: pickupFee,
        addons_cost: addonsCost || 0,
        total_price: totalPrice,
        special_requirements: specialRequirements,
        status: "confirmed",
        payment_status: "succeeded",
        payment_intent_id: paymentIntentId,
        stripe_customer_id: stripeCustomerId,
        has_premium_lock: hasPremiumLock || false,
        has_wheel_clamp: hasWheelClamp || false,
        has_gps_security: hasGpsSecurity || false,
      })
      .select()
      .single();

    if (bookingError) {
      console.error("[create-booking] Database insert error:", {
        error: bookingError,
        code: bookingError.code,
        message: bookingError.message,
        details: bookingError.details,
        hint: bookingError.hint,
      });

      if (bookingError.code === "23505") {
        console.log('[create-booking] Duplicate detected, fetching existing booking');
        const { data: dupBooking } = await supabase
          .from("bookings")
          .select("*")
          .eq("payment_intent_id", paymentIntentId)
          .maybeSingle();

        if (dupBooking) {
          return new Response(
            JSON.stringify({
              ok: true,
              booking: dupBooking,
              deduped: true,
              message: "Booking already exists for this payment",
            }),
            {
              status: 200,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
      }

      return new Response(
        JSON.stringify({
          ok: false,
          stage: "db_insert",
          message: bookingError.message || "Failed to create booking",
          code: bookingError.code,
          details: bookingError.details,
          hint: bookingError.hint,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log('[create-booking] Booking created successfully:', booking.id);

    let emailSent = false;
    let emailError: string | null = null;

    try {
      console.log('[create-booking] Sending confirmation email');
      const emailResponse = await fetch(
        `${supabaseUrl}/functions/v1/send-booking-confirmation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${supabaseServiceKey}`,
          },
          body: JSON.stringify({
            bookingId: booking.id,
            customerEmail,
            customerName,
            bookingReference,
            startDate,
            endDate,
            deliveryAddress,
            totalPrice,
            weeklyRate,
            deliveryFee,
            pickupFee,
            addonsCost: addonsCost || 0,
            durationWeeks,
            hasPremiumLock: hasPremiumLock || false,
            hasWheelClamp: hasWheelClamp || false,
            hasGpsSecurity: hasGpsSecurity || false,
          }),
        }
      );

      const emailResult = await emailResponse.json().catch(() => ({}));

      if (emailResponse.ok && emailResult.success) {
        emailSent = true;
        console.log('[create-booking] Confirmation email sent:', emailResult.emailId);
      } else {
        emailError = emailResult.error || "Email service returned an error";
        console.error('[create-booking] Failed to send confirmation email:', emailError);
      }
    } catch (err: any) {
      emailError = err.message || "Failed to contact email service";
      console.error('[create-booking] Error sending confirmation email:', err);
    }

    return new Response(
      JSON.stringify({
        ok: true,
        booking,
        emailSent,
        emailError,
        deduped: false,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("[create-booking] Unexpected error:", error);
    return new Response(
      JSON.stringify({
        ok: false,
        stage: "unknown",
        message: error.message || "Unexpected error creating booking",
        details: error instanceof Error ? error.stack : String(error),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
