import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { Resend } from "npm:resend@4.0.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";
import { getDeliveryReminderEmail, getPickupReminderEmail } from "../_shared/email-templates.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface Booking {
  id: string;
  booking_reference: string;
  customer_name: string;
  customer_email: string;
  start_date: string;
  end_date: string;
  delivery_address: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY environment variable is not set");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase configuration missing");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const resend = new Resend(resendApiKey);

    const today = new Date();
    const twoDaysFromNow = new Date(today);
    twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
    twoDaysFromNow.setHours(0, 0, 0, 0);

    const threeDaysFromNow = new Date(today);
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    threeDaysFromNow.setHours(0, 0, 0, 0);

    const targetDate = twoDaysFromNow.toISOString().split('T')[0];

    const { data: deliveryBookings, error: deliveryError } = await supabase
      .from("bookings")
      .select("id, booking_reference, customer_name, customer_email, start_date, delivery_address")
      .gte("start_date", targetDate)
      .lt("start_date", threeDaysFromNow.toISOString().split('T')[0])
      .eq("status", "confirmed");

    if (deliveryError) {
      throw new Error(`Failed to fetch delivery bookings: ${deliveryError.message}`);
    }

    const { data: pickupBookings, error: pickupError } = await supabase
      .from("bookings")
      .select("id, booking_reference, customer_name, customer_email, end_date, delivery_address")
      .gte("end_date", targetDate)
      .lt("end_date", threeDaysFromNow.toISOString().split('T')[0])
      .eq("status", "confirmed");

    if (pickupError) {
      throw new Error(`Failed to fetch pickup bookings: ${pickupError.message}`);
    }

    const results = {
      deliveryRemindersSent: 0,
      pickupRemindersSent: 0,
      errors: [] as string[],
    };

    if (deliveryBookings && deliveryBookings.length > 0) {
      for (const booking of deliveryBookings as Booking[]) {
        const { data: existingLog } = await supabase
          .from("email_logs")
          .select("id")
          .eq("booking_id", booking.id)
          .eq("email_type", "delivery_reminder")
          .eq("status", "sent")
          .maybeSingle();

        if (existingLog) {
          continue;
        }

        try {
          const { subject, html } = getDeliveryReminderEmail({
            customerName: booking.customer_name,
            bookingReference: booking.booking_reference,
            date: booking.start_date,
            address: booking.delivery_address,
            type: "delivery",
          });

          const emailResponse = await resend.emails.send({
            from: "Mobile Storage <bookings@yourdomain.com>",
            to: booking.customer_email,
            subject,
            html,
          });

          if (emailResponse.data) {
            await supabase.from("email_logs").insert({
              booking_id: booking.id,
              email_type: "delivery_reminder",
              recipient_email: booking.customer_email,
              recipient_name: booking.customer_name,
              subject,
              status: "sent",
              resend_email_id: emailResponse.data.id,
            });

            results.deliveryRemindersSent++;
          } else {
            throw new Error("No response data from Resend");
          }
        } catch (error: any) {
          console.error(`Failed to send delivery reminder for booking ${booking.booking_reference}:`, error);
          results.errors.push(`Delivery reminder for ${booking.booking_reference}: ${error.message}`);

          await supabase.from("email_logs").insert({
            booking_id: booking.id,
            email_type: "delivery_reminder",
            recipient_email: booking.customer_email,
            recipient_name: booking.customer_name,
            subject: `Reminder: Trailer Delivery Tomorrow - ${booking.booking_reference}`,
            status: "failed",
            error_message: error.message,
          });
        }
      }
    }

    if (pickupBookings && pickupBookings.length > 0) {
      for (const booking of pickupBookings as any) {
        const { data: existingLog } = await supabase
          .from("email_logs")
          .select("id")
          .eq("booking_id", booking.id)
          .eq("email_type", "pickup_reminder")
          .eq("status", "sent")
          .maybeSingle();

        if (existingLog) {
          continue;
        }

        try {
          const { subject, html } = getPickupReminderEmail({
            customerName: booking.customer_name,
            bookingReference: booking.booking_reference,
            date: booking.end_date,
            address: booking.delivery_address,
            type: "pickup",
          });

          const emailResponse = await resend.emails.send({
            from: "Mobile Storage <bookings@yourdomain.com>",
            to: booking.customer_email,
            subject,
            html,
          });

          if (emailResponse.data) {
            await supabase.from("email_logs").insert({
              booking_id: booking.id,
              email_type: "pickup_reminder",
              recipient_email: booking.customer_email,
              recipient_name: booking.customer_name,
              subject,
              status: "sent",
              resend_email_id: emailResponse.data.id,
            });

            results.pickupRemindersSent++;
          } else {
            throw new Error("No response data from Resend");
          }
        } catch (error: any) {
          console.error(`Failed to send pickup reminder for booking ${booking.booking_reference}:`, error);
          results.errors.push(`Pickup reminder for ${booking.booking_reference}: ${error.message}`);

          await supabase.from("email_logs").insert({
            booking_id: booking.id,
            email_type: "pickup_reminder",
            recipient_email: booking.customer_email,
            recipient_name: booking.customer_name,
            subject: `Reminder: Trailer Pickup Tomorrow - ${booking.booking_reference}`,
            status: "failed",
            error_message: error.message,
          });
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Reminder emails processed",
        results,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error processing reminder emails:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Failed to process reminder emails",
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 500,
      }
    );
  }
});
