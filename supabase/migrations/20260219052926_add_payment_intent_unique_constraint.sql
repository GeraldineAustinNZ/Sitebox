/*
  # Add unique constraint on payment_intent_id

  1. Changes
    - Add unique constraint to `bookings.payment_intent_id` to prevent duplicate bookings
    - This ensures idempotency: retrying with the same payment intent won't create duplicates

  2. Important Notes
    - Uses `IF NOT EXISTS` pattern to make migration safe to re-run
    - Existing duplicate payment_intent_id values (if any) must be resolved before applying
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'bookings_payment_intent_id_key'
  ) THEN
    ALTER TABLE bookings 
      ADD CONSTRAINT bookings_payment_intent_id_key 
      UNIQUE (payment_intent_id);
  END IF;
END $$;
