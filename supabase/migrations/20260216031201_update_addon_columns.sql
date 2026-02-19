/*
  # Update Add-on Columns

  ## Overview
  Renames add-on columns to reflect the new add-on offerings:
  - Premium Lock: $25 (one-time)
  - Wheel Clamp: $15/week
  - GPS Security: $10/week

  ## Changes Made
  1. Renamed Columns:
    - `has_climate_control` → `has_wheel_clamp`
    - `has_insurance` → `has_gps_security`
  
  2. Updated Pricing:
    - Premium Lock reduced from $50 to $25
    - Climate Control ($30/week) replaced with Wheel Clamp ($15/week)
    - Insurance ($20/week) replaced with GPS Security ($10/week)
  
  ## Notes
  - All existing bookings with old add-ons will have their data preserved
  - Bundle discount (10%) still applies when all three add-ons are selected
  - Uses IF EXISTS checks for safe migration
*/

-- Rename has_climate_control to has_wheel_clamp if the column exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'has_climate_control'
  ) THEN
    ALTER TABLE bookings RENAME COLUMN has_climate_control TO has_wheel_clamp;
  END IF;
END $$;

-- Rename has_insurance to has_gps_security if the column exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'has_insurance'
  ) THEN
    ALTER TABLE bookings RENAME COLUMN has_insurance TO has_gps_security;
  END IF;
END $$;

-- If the new columns don't exist yet (in case the old columns didn't exist), create them
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'has_wheel_clamp'
  ) THEN
    ALTER TABLE bookings ADD COLUMN has_wheel_clamp boolean DEFAULT false;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'has_gps_security'
  ) THEN
    ALTER TABLE bookings ADD COLUMN has_gps_security boolean DEFAULT false;
  END IF;
END $$;
