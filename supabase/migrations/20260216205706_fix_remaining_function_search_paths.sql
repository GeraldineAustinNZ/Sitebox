/*
  # Fix Remaining Function Search Paths

  1. Security Improvements
    - Add search_path security to generate_booking_reference function
    - Add search_path security to update_updated_at_column function
  
  2. Changes
    - Recreate functions with SET search_path = '' for security
*/

-- Fix generate_booking_reference function
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  ref text;
  year text;
  seq int;
BEGIN
  year := to_char(now(), 'YYYY');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(booking_reference FROM 'SBW-' || year || '-(\\d+)') AS int)), 0) + 1
  INTO seq
  FROM public.bookings
  WHERE booking_reference LIKE 'SBW-' || year || '-%';
  
  ref := 'SBW-' || year || '-' || LPAD(seq::text, 4, '0');
  RETURN ref;
END;
$$;

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION update_updated_at_column()
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