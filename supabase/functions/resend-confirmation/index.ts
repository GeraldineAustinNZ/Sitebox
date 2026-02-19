import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { bookingReference, customerEmail } = await req.json();

    if (!bookingReference || !customerEmail) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase configuration missing");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("*")
      .eq("booking_reference", bookingReference)
      .eq("customer_email", customerEmail)
      .maybeSingle();

    if (bookingError || !booking) {
      return new Response(
        JSON.stringify({ success: false, error: "Booking not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

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
          customerEmail: booking.customer_email,
          customerName: booking.customer_name,
          bookingReference: booking.booking_reference,
          startDate: booking.start_date,
          endDate: booking.end_date,
          deliveryAddress: booking.delivery_address,
          totalPrice: Number(booking.total_price),
          weeklyRate: Number(booking.weekly_rate),
          deliveryFee: Number(booking.delivery_fee),
          pickupFee: Number(booking.pickup_fee),
          addonsCost: Number(booking.addons_cost || 0),
          durationWeeks: booking.duration_weeks,
          hasPremiumLock: booking.has_premium_lock || false,
          hasWheelClamp: booking.has_wheel_clamp || false,
          hasGpsSecurity: booking.has_gps_security || false,
        }),
      }
    );

    const result = await emailResponse.json().catch(() => ({}));

    if (!emailResponse.ok || !result.success) {
      throw new Error(result.error || "Failed to send email");
    }

    return new Response(
      JSON.stringify({ success: true, message: "Confirmation email resent successfully" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error: any) {
    console.error("[resend-confirmation] Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || "Failed to resend confirmation email" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
