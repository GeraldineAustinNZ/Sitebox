/*
  # Setup Automated Reminder Email Scheduling

  1. Extensions
    - Enable pg_cron for scheduled jobs
    - Enable pg_net for HTTP requests to edge functions

  2. Database Functions
    - Create function to trigger reminder email edge function

  3. Scheduled Jobs
    - Create a daily cron job that runs at 8:00 AM UTC
    - Job calls the send-reminder-emails edge function
    - Checks for bookings with delivery/pickup dates 2 days in the future
    - Sends reminder emails to customers

  4. Notes
    - The job runs daily to check for upcoming deliveries and pickups
    - Duplicate emails are prevented by checking email_logs table in the edge function
    - Failed emails are logged for admin review
    - To manually trigger: SELECT trigger_reminder_emails();
*/

CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

CREATE OR REPLACE FUNCTION trigger_reminder_emails()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  supabase_url text;
  service_key text;
BEGIN
  supabase_url := current_setting('app.settings.supabase_url', true);
  service_key := current_setting('app.settings.supabase_service_role_key', true);

  IF supabase_url IS NULL OR service_key IS NULL THEN
    RAISE NOTICE 'Supabase URL or service key not configured';
    RETURN;
  END IF;

  PERFORM net.http_post(
    url := supabase_url || '/functions/v1/send-reminder-emails',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || service_key
    ),
    body := '{}'::jsonb
  );
END;
$$;

SELECT cron.schedule(
  'send-daily-reminder-emails',
  '0 8 * * *',
  'SELECT trigger_reminder_emails();'
);
