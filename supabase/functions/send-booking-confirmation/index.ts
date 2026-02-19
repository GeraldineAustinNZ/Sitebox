import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { Resend } from "npm:resend@4.0.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";
import { getBookingConfirmationEmail } from "../_shared/email-templates.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface BookingConfirmationRequest {
  bookingId?: string;
  customerEmail: string;
  customerName: string;
  bookingReference: string;
  startDate: string;
  endDate: string;
  deliveryAddress: string;
  totalPrice: number;
  weeklyRate: number;
  deliveryFee: number;
  pickupFee: number;
  addonsCost: number;
  durationWeeks: number;
  hasPremiumLock: boolean;
  hasWheelClamp: boolean;
  hasGpsSecurity: boolean;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !supabaseServiceKey) {
    return new Response(
      JSON.stringify({ success: false, error: "Supabase configuration missing" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  let bookingData: BookingConfirmationRequest | null = null;
  let bookingId: string | undefined;
  let subject = "Booking Confirmation";

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("Email service is not configured (RESEND_API_KEY missing)");
    }

    const fromAddress = Deno.env.get("EMAIL_FROM_ADDRESS") || "bookings@resend.dev";
    const fromName = Deno.env.get("EMAIL_FROM_NAME") || "Sitebox Wanaka";

    bookingData = await req.json() as BookingConfirmationRequest;

    bookingId = bookingData.bookingId;
    if (!bookingId) {
      const { data: booking } = await supabase
        .from("bookings")
        .select("id")
        .eq("booking_reference", bookingData.bookingReference)
        .maybeSingle();

      bookingId = booking?.id;
    }

    const emailContent = getBookingConfirmationEmail(bookingData);
    subject = emailContent.subject;

    if (bookingId) {
      await supabase.from("email_logs").insert({
        booking_id: bookingId,
        email_type: "booking_confirmation",
        recipient_email: bookingData.customerEmail,
        recipient_name: bookingData.customerName,
        subject,
        status: "pending",
      });
    }

    const resend = new Resend(resendApiKey);
    const emailResponse = await resend.emails.send({
      from: `${fromName} <${fromAddress}>`,
      to: bookingData.customerEmail,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    if (emailResponse.error || !emailResponse.data) {
      const errorMsg = emailResponse.error?.message || "No response data from Resend";
      console.error("[send-booking-confirmation] Resend error:", errorMsg);

      if (bookingId) {
        await supabase
          .from("email_logs")
          .update({ status: "failed", error_message: errorMsg })
          .eq("booking_id", bookingId)
          .eq("email_type", "booking_confirmation")
          .eq("status", "pending");
      }

      throw new Error(errorMsg);
    }

    console.log("[send-booking-confirmation] Email sent:", emailResponse.data.id);

    if (bookingId) {
      await supabase
        .from("email_logs")
        .update({ status: "sent", resend_email_id: emailResponse.data.id })
        .eq("booking_id", bookingId)
        .eq("email_type", "booking_confirmation")
        .eq("status", "pending");
    }

    return new Response(
      JSON.stringify({
        success: true,
        emailId: emailResponse.data.id,
        message: "Booking confirmation email sent successfully",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("[send-booking-confirmation] Error:", error);

    if (bookingId && bookingData) {
      await supabase.from("email_logs").upsert(
        {
          booking_id: bookingId,
          email_type: "booking_confirmation",
          recipient_email: bookingData.customerEmail,
          recipient_name: bookingData.customerName,
          subject,
          status: "failed",
          error_message: error.message || "Unknown error",
        },
        { onConflict: "booking_id,email_type", ignoreDuplicates: false }
      ).eq("status", "pending");
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Failed to send booking confirmation email",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
