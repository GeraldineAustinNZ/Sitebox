/*
  # Create Enquiries Tables for Sitebox Wanaka

  ## New Tables
  
  ### `quote_enquiries`
  - `id` (uuid, primary key) - Unique identifier for each enquiry
  - `name` (text, required) - Customer's full name
  - `phone` (text, required) - Contact phone number
  - `email` (text, required) - Contact email address
  - `delivery_address` (text, required) - Where the trailer should be delivered
  - `start_date` (date, required) - Preferred start date for storage
  - `estimated_duration` (text, required) - How long they need storage
  - `enquiry_type` (text, default 'general') - Type of enquiry (general, renovation, etc.)
  - `message` (text) - Optional additional message
  - `created_at` (timestamptz) - When the enquiry was submitted
  
  ### `trade_enquiries`
  - `id` (uuid, primary key) - Unique identifier for each trade enquiry
  - `business_name` (text, required) - Name of the business
  - `contact_name` (text, required) - Primary contact person
  - `phone` (text, required) - Contact phone number
  - `email` (text, required) - Contact email address
  - `estimated_weekly_needs` (text) - How often they need storage
  - `message` (text) - Optional additional information
  - `created_at` (timestamptz) - When the enquiry was submitted

  ## Security
  - Enable RLS on both tables
  - Add policies for anonymous users to insert enquiries (public forms)
  - No read access for anonymous users (admin only)
*/

-- Create quote_enquiries table
CREATE TABLE IF NOT EXISTS quote_enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  delivery_address text NOT NULL,
  start_date date NOT NULL,
  estimated_duration text NOT NULL,
  enquiry_type text DEFAULT 'general',
  message text,
  created_at timestamptz DEFAULT now()
);

-- Create trade_enquiries table
CREATE TABLE IF NOT EXISTS trade_enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name text NOT NULL,
  contact_name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  estimated_weekly_needs text,
  message text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE quote_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_enquiries ENABLE ROW LEVEL SECURITY;

-- Policies for quote_enquiries
-- Allow anyone to insert enquiries (public form submission)
CREATE POLICY "Anyone can submit quote enquiries"
  ON quote_enquiries
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policies for trade_enquiries
-- Allow anyone to insert trade enquiries (public form submission)
CREATE POLICY "Anyone can submit trade enquiries"
  ON trade_enquiries
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS quote_enquiries_created_at_idx ON quote_enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS trade_enquiries_created_at_idx ON trade_enquiries(created_at DESC);