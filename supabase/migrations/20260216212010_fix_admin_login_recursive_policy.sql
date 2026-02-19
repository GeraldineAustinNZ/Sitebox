/*
  # Fix Admin Login - Remove Recursive Policy
  
  1. Changes
    - Drop the recursive "Admins can read admin data" policy
    - Create a simple non-recursive policy that allows admins to read their own record
    
  2. Security
    - Admin users can read their own data after authentication
    - No recursive policy checks that cause infinite loops
    - Simple and secure for admin login flow
*/

-- Drop the problematic recursive policy
DROP POLICY IF EXISTS "Admins can read admin data" ON admin_users;

-- Create a simple non-recursive policy
CREATE POLICY "Admin can read own record"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);
