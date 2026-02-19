/*
  # Create Email Logs Table

  1. New Tables
    - `email_logs`
      - `id` (uuid, primary key) - Unique identifier for each email log
      - `booking_id` (uuid, foreign key) - Reference to the booking
      - `email_type` (text) - Type of email: 'booking_confirmation', 'delivery_reminder', 'pickup_reminder'
      - `recipient_email` (text) - Email address of the recipient
      - `recipient_name` (text) - Name of the recipient
      - `subject` (text) - Email subject line
      - `sent_at` (timestamptz) - When the email was sent
      - `status` (text) - Status: 'sent', 'failed', 'pending'
      - `error_message` (text, nullable) - Error message if sending failed
      - `resend_email_id` (text, nullable) - ID from Resend service
      - `created_at` (timestamptz) - Record creation timestamp

  2. Security
    - Enable RLS on `email_logs` table
    - Add policy for admin users to read email logs
    - Add policy for system to insert email logs

  3. Indexes
    - Index on booking_id for faster lookups
    - Index on email_type for filtering
    - Index on sent_at for date-based queries
*/

CREATE TABLE IF NOT EXISTS email_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  email_type text NOT NULL CHECK (email_type IN ('booking_confirmation', 'delivery_reminder', 'pickup_reminder')),
  recipient_email text NOT NULL,
  recipient_name text NOT NULL,
  subject text NOT NULL,
  sent_at timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('sent', 'failed', 'pending')),
  error_message text,
  resend_email_id text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can read email logs"
  ON email_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Service role can insert email logs"
  ON email_logs
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_email_logs_booking_id ON email_logs(booking_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_email_type ON email_logs(email_type);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sent_at);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
