/*
  # Add Add-ons to Bookings Table

  ## Overview
  Adds support for premium add-ons (Premium Lock, Climate Control, Insurance) to the bookings table.
  Includes bundle discount when all three add-ons are selected.

  ## Changes Made
  1. New Columns:
    - `has_premium_lock` (boolean) - Whether premium lock add-on is selected
    - `has_climate_control` (boolean) - Whether climate control add-on is selected
    - `has_insurance` (boolean) - Whether insurance add-on is selected
    - `addons_cost` (numeric) - Total cost of add-ons after bundle discount

  ## Add-on Pricing
  - Premium Lock: $50 (available for all booking durations)
  - Climate Control: $30/week
  - Insurance: $20/week
  - Bundle Discount: 10% off when all three are selected

  ## Notes
  - All columns default to false/0 for existing bookings
  - Add-ons are locked in once payment is complete
  - Uses IF NOT EXISTS checks for safe migration
*/

-- Add has_premium_lock column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'has_premium_lock'
  ) THEN
    ALTER TABLE bookings ADD COLUMN has_premium_lock boolean DEFAULT false;
  END IF;
END $$;

-- Add has_climate_control column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'has_climate_control'
  ) THEN
    ALTER TABLE bookings ADD COLUMN has_climate_control boolean DEFAULT false;
  END IF;
END $$;

-- Add has_insurance column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'has_insurance'
  ) THEN
    ALTER TABLE bookings ADD COLUMN has_insurance boolean DEFAULT false;
  END IF;
END $$;

-- Add addons_cost column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'addons_cost'
  ) THEN
    ALTER TABLE bookings ADD COLUMN addons_cost numeric(10,2) DEFAULT 0;
  END IF;
END $$;
