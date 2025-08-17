import { Webhooks } from "@polar-sh/nextjs";
import { createClient as createClientServiceRole } from "@supabase/supabase-js";

// Service role client for storing payments
const supabaseServiceRole = createClientServiceRole(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
  onPayload: async (payload) => {
    // Handle checkout session completed
    if (
      payload.type === "checkout.created" ||
      payload.type === "checkout.updated"
    ) {
      const checkout = payload.data;

      if (checkout.status === "succeeded") {
        const customerEmail = checkout.customerEmail;

        const { data: user, error: userError } = await supabaseServiceRole
          .from("users")
          .select("*")
          .eq("email", customerEmail)
          .single();
        if (userError) {
          console.error("Error looking up user:", userError);
          throw new Error(`Failed to look up user: ${userError.message}`);
        }

        const paymentData = {
          user_id: user?.id,
          polar_checkout_id: checkout.id,
          customer_email: customerEmail,
          amount: checkout.amount,
          currency: checkout.currency,
          product_id: checkout.product?.id,
          product_name: checkout.product?.name,
          status: "completed",
        };

        const { error } = await supabaseServiceRole
          .from("payments")
          .upsert(paymentData, {
            onConflict: "polar_checkout_id",
            ignoreDuplicates: false,
          });

        if (error) {
          console.error("Error storing payment:", error);
          throw new Error(`Failed to store payment: ${error.message}`);
        }
      }
    }

    // Handle refunds
    if (
      payload.type === "checkout.updated" &&
      payload.data.status === "failed"
    ) {
      await supabaseServiceRole
        .from("payments")
        .update({ status: "failed", updated_at: new Date().toISOString() })
        .eq("polar_checkout_id", payload.data.id);
    }
  },
});
