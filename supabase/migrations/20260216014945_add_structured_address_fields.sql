/*
  # Add Structured Address Fields to Bookings Table

  ## Overview
  Adds structured address fields to store detailed address components from Google Places API autocomplete,
  enabling better address validation, distance calculations, and future delivery route optimization.

  ## Changes Made
  
  ### New Columns Added to `bookings` table:
  1. `street_address` (text, nullable) - Street number and name
  2. `suburb` (text, nullable) - Suburb or locality
  3. `city` (text, nullable) - City name (e.g., Wanaka, Queenstown)
  4. `postcode` (text, nullable) - Postal code
  5. `country` (text, nullable) - Country name
  6. `latitude` (numeric, nullable) - GPS latitude coordinate
  7. `longitude` (numeric, nullable) - GPS longitude coordinate
  
  ## Notes
  - All new columns are nullable to maintain compatibility with existing bookings
  - The existing `delivery_address` field remains as the primary formatted address
  - Structured fields enable future features like distance-based pricing and route optimization
  - Uses IF NOT EXISTS checks to safely add columns without errors
*/

-- Add street_address column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'street_address'
  ) THEN
    ALTER TABLE bookings ADD COLUMN street_address text;
  END IF;
END $$;

-- Add suburb column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'suburb'
  ) THEN
    ALTER TABLE bookings ADD COLUMN suburb text;
  END IF;
END $$;

-- Add city column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'city'
  ) THEN
    ALTER TABLE bookings ADD COLUMN city text;
  END IF;
END $$;

-- Add postcode column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'postcode'
  ) THEN
    ALTER TABLE bookings ADD COLUMN postcode text;
  END IF;
END $$;

-- Add country column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'country'
  ) THEN
    ALTER TABLE bookings ADD COLUMN country text;
  END IF;
END $$;

-- Add latitude column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'latitude'
  ) THEN
    ALTER TABLE bookings ADD COLUMN latitude numeric(10, 7);
  END IF;
END $$;

-- Add longitude column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'longitude'
  ) THEN
    ALTER TABLE bookings ADD COLUMN longitude numeric(10, 7);
  END IF;
END $$;

-- Create index on city for faster filtering by service area
CREATE INDEX IF NOT EXISTS bookings_city_idx ON bookings(city);

-- Create index on latitude and longitude for potential geospatial queries
CREATE INDEX IF NOT EXISTS bookings_location_idx ON bookings(latitude, longitude);
