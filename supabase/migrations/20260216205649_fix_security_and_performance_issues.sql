/*
  # Fix Security and Performance Issues

  1. Performance Improvements
    - Add indexes on foreign keys for better query performance
    - Optimize RLS policies to use subqueries for auth functions
    - Fix function search paths for security
  
  2. Security Improvements
    - Consolidate multiple permissive RLS policies
    - Secure function search paths
    - Optimize auth RLS initialization

  3. Changes Made
    - Add index on `blocked_dates.trailer_id`
    - Add index on `bookings.trailer_id`
    - Update admin_users RLS policies to use subqueries
    - Consolidate admin_users SELECT policies
    - Fix search_path on functions
*/

-- Add missing foreign key indexes for performance
CREATE INDEX IF NOT EXISTS idx_blocked_dates_trailer_id ON blocked_dates(trailer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_trailer_id ON bookings(trailer_id);

-- Drop existing admin_users policies
DROP POLICY IF EXISTS "Admin users can read own data" ON admin_users;
DROP POLICY IF EXISTS "Admins can view all admin users" ON admin_users;

-- Create consolidated and optimized admin_users SELECT policy
CREATE POLICY "Admins can read admin data"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    (select auth.uid()) = id OR
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = (select auth.uid())
    )
  );

-- Fix search_path on functions for security
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = user_id
  );
END;
$$;

CREATE OR REPLACE FUNCTION update_admin_users_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Note: The following issues are intentional for public booking functionality:
-- 1. Public bookings table allows anonymous inserts (needed for customer booking form)
-- 2. Public enquiries tables allow anonymous inserts (needed for lead generation forms)
-- 3. Public booking_modifications allow inserts (needed for customer-initiated changes)
-- These are acceptable security tradeoffs for a public-facing booking system.

-- Add comment explaining the intentional permissive policies
COMMENT ON TABLE bookings IS 'Public table that accepts anonymous bookings through the booking form. INSERT policy is intentionally permissive.';
COMMENT ON TABLE quote_enquiries IS 'Public table that accepts anonymous enquiries through the quote form. INSERT policy is intentionally permissive.';
COMMENT ON TABLE trade_enquiries IS 'Public table that accepts anonymous enquiries through the trade form. INSERT policy is intentionally permissive.';
COMMENT ON TABLE booking_modifications IS 'Public table that accepts modification requests from customers. INSERT policy is intentionally permissive.';