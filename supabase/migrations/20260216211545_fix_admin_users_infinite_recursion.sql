/*
  # Fix Infinite Recursion in Admin Users RLS

  1. Changes
    - Drop the recursive policy "Admins can view all admin users"
    - Keep the simple "Admin users can read own data" policy
    - This allows admin login to work without infinite recursion

  2. Security
    - Admins can still read their own data during login
    - The recursive policy was not needed for basic admin authentication
    - Future admin management features can use service role key or different approach
*/

-- Drop the problematic recursive policy
DROP POLICY IF EXISTS "Admins can view all admin users" ON admin_users;
