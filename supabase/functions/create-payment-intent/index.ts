import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { amount, customerEmail, customerName } = await req.json();

    if (!amount || !customerEmail || !customerName) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");

    if (!stripeKey) {
      return new Response(
        JSON.stringify({
          error: "Stripe secret key not configured",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const amountInCents = Math.round(Number(amount) * 100);

    if (amountInCents <= 0) {
      return new Response(
        JSON.stringify({ error: "Invalid payment amount" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 🔹 Create Stripe customer
    const stripeCustomerResponse = await fetch(
      "https://api.stripe.com/v1/customers",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${stripeKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          email: customerEmail,
          name: customerName,
        }),
      }
    );

    if (!stripeCustomerResponse.ok) {
      const err = await stripeCustomerResponse.json().catch(() => ({}));
      throw new Error(err.error?.message || "Failed to create Stripe customer");
    }

    const customer = await stripeCustomerResponse.json();

    // 🔹 Create PaymentIntent (CARDS ONLY)
    const paymentIntentResponse = await fetch(
      "https://api.stripe.com/v1/payment_intents",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${stripeKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          amount: amountInCents.toString(),
          currency: "nzd",
          customer: customer.id,

          // ✅ REQUIRED for PaymentElement when using cards only
          "payment_method_types[]": "card",

          // Optional but recommended
          description: "Sitebox Wanaka Booking",
          receipt_email: customerEmail,

          "metadata[customer_email]": customerEmail,
          "metadata[customer_name]": customerName,
        }),
      }
    );

    if (!paymentIntentResponse.ok) {
      const err = await paymentIntentResponse.json().catch(() => ({}));
      throw new Error(err.error?.message || "Failed to create payment intent");
    }

    const paymentIntent = await paymentIntentResponse.json();

    if (!paymentIntent.client_secret) {
      throw new Error("Stripe did not return a client secret");
    }

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        customerId: customer.id,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error creating payment intent:", error);

    return new Response(
      JSON.stringify({
        error: error.message || "Failed to create payment intent",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});