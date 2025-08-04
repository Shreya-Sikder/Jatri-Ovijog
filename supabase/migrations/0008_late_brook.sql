/*
  # Fix Permission Issues
  
  1. Changes
    - Add policies for accessing user profiles
    - Fix report access policies
    - Update case assignment policies
  
  2. Security
    - Enable proper access to user profiles for police
    - Ensure reports can be viewed by authorized users
*/

-- Allow police to view user profiles
CREATE POLICY "Police can view user profiles"
  ON auth.users
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'email' LIKE '%@police.gov'
    OR auth.uid() = id
  );

-- Update reports policies
CREATE POLICY "Users can view reports"
  ON reports
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id 
    OR (auth.jwt() ->> 'email' LIKE '%@police.gov')
  );

-- Update case assignments policies
CREATE POLICY "Police can manage case assignments"
  ON case_assignments
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'email' LIKE '%@police.gov');

-- Grant necessary permissions
GRANT SELECT ON auth.users TO authenticated;
GRANT SELECT ON reports TO authenticated;
GRANT SELECT, INSERT, UPDATE ON case_assignments TO authenticated;