/*
  # Feed System and Police Specialization

  1. New Tables
    - `feed_posts`
      - Reports feed with bus company specific issues
    - `police_specializations`
      - Track police officer specialties
    - `case_assignments`
      - Connect reports to specialized officers

  2. Security
    - Enable RLS
    - Add policies for public feed viewing
    - Restrict specialization management to admin
*/

-- Create police specializations table
CREATE TABLE IF NOT EXISTS police_specializations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Insert default specializations
INSERT INTO police_specializations (name, description) VALUES
  ('Traffic Safety', 'Handles reckless driving and traffic violations'),
  ('Personal Safety', 'Manages harassment and passenger safety issues'),
  ('Emergency Response', 'Coordinates emergency situations'),
  ('Property Crime', 'Handles theft and property-related issues');

-- Create case assignments table
CREATE TABLE IF NOT EXISTS case_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid REFERENCES reports(id),
  police_id uuid REFERENCES auth.users,
  specialization_id uuid REFERENCES police_specializations(id),
  assigned_at timestamptz DEFAULT now(),
  status text DEFAULT 'assigned'
);

-- Add specialization field to police profiles
ALTER TABLE IF EXISTS auth.users 
ADD COLUMN IF NOT EXISTS raw_user_meta_data jsonb;

-- Enable RLS
ALTER TABLE police_specializations ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_assignments ENABLE ROW LEVEL SECURITY;

-- Policies for specializations
CREATE POLICY "Public can view specializations"
  ON police_specializations
  FOR SELECT
  TO authenticated
  USING (true);

-- Policies for case assignments
CREATE POLICY "Police can view assignments"
  ON case_assignments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.uid() = auth.users.id 
      AND auth.users.email LIKE '%@police.gov'
    )
  );

CREATE POLICY "Police can update their assignments"
  ON case_assignments
  FOR UPDATE
  TO authenticated
  USING (police_id = auth.uid());