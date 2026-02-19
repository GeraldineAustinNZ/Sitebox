/*
  # Update Bookings Table - Add Missing Fields

  ## Overview
  Adds missing fields to the bookings table for complete payment tracking and customer management.

  ## Changes Made
  1. Add `weekly_rate` column to track the per-week rate applied
  2. Add `stripe_customer_id` column to store Stripe customer ID
  3. Update existing `rental_price` column (if needed for compatibility)
  
  ## Notes
  - Uses IF NOT EXISTS checks to safely add columns
  - All new columns are nullable to avoid issues with existing data
*/

-- Add weekly_rate column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'weekly_rate'
  ) THEN
    ALTER TABLE bookings ADD COLUMN weekly_rate numeric(10,2);
  END IF;
END $$;

-- Add stripe_customer_id column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'stripe_customer_id'
  ) THEN
    ALTER TABLE bookings ADD COLUMN stripe_customer_id text;
  END IF;
END $$;

-- Create booking_modifications table if it doesn't exist
CREATE TABLE IF NOT EXISTS booking_modifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  modification_type text NOT NULL CHECK (modification_type IN ('change_dates', 'cancel', 'other')),
  requested_start_date date,
  requested_end_date date,
  reason text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  processed_at timestamptz
);

-- Create index if it doesn't exist
CREATE INDEX IF NOT EXISTS booking_modifications_booking_id_idx ON booking_modifications(booking_id);

-- Enable RLS on booking_modifications if not already enabled
ALTER TABLE booking_modifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DO $$
BEGIN
  -- Drop and recreate booking_modifications policies
  DROP POLICY IF EXISTS "Anyone can create modification requests" ON booking_modifications;
  CREATE POLICY "Anyone can create modification requests"
    ON booking_modifications
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

  DROP POLICY IF EXISTS "Anyone can view modification requests" ON booking_modifications;
  CREATE POLICY "Anyone can view modification requests"
    ON booking_modifications
    FOR SELECT
    TO anon, authenticated
    USING (true);

  DROP POLICY IF EXISTS "Authenticated users can update modification requests" ON booking_modifications;
  CREATE POLICY "Authenticated users can update modification requests"
    ON booking_modifications
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);
END $$;