/*
  # Create Reports and Emergencies Tables

  1. New Tables
    - `reports`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `type` (text)
      - `description` (text)
      - `location` (jsonb)
      - `media_urls` (text[])
      - `status` (text)
      - `priority` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `emergencies`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `location` (jsonb)
      - `status` (text)
      - `created_at` (timestamptz)
      - `resolved_at` (timestamptz)
      - `resolved_by` (uuid, references auth.users)

  2. Security
    - Enable RLS on both tables
    - Add policies for user and police access
*/

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  type text NOT NULL,
  description text NOT NULL,
  location jsonb,
  media_urls text[],
  status text DEFAULT 'pending',
  priority text DEFAULT 'medium',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create emergencies table
CREATE TABLE IF NOT EXISTS emergencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  location jsonb NOT NULL,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz,
  resolved_by uuid REFERENCES auth.users
);

-- Enable RLS
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergencies ENABLE ROW LEVEL SECURITY;

-- Policies for reports
CREATE POLICY "Users can create reports"
  ON reports
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own reports"
  ON reports
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.uid() = auth.users.id 
      AND auth.users.email LIKE '%@police.gov'
    )
  );

CREATE POLICY "Police can update reports"
  ON reports
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.uid() = auth.users.id 
      AND auth.users.email LIKE '%@police.gov'
    )
  );

-- Policies for emergencies
CREATE POLICY "Users can create emergencies"
  ON emergencies
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view emergencies"
  ON emergencies
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Police can update emergencies"
  ON emergencies
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.uid() = auth.users.id 
      AND auth.users.email LIKE '%@police.gov'
    )
  );

-- Create function to update report timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for reports
CREATE TRIGGER update_reports_updated_at
  BEFORE UPDATE ON reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();