/*
  # Create complaints table and storage

  1. New Tables
    - `complaints`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `type` (text)
      - `description` (text)
      - `location` (jsonb)
      - `media_urls` (text[])
      - `status` (text)
      - `created_at` (timestamp)
  
  2. Storage
    - Create bucket for complaint media
  
  3. Security
    - Enable RLS on complaints table
    - Add policies for users and police
*/

-- Create complaints table
CREATE TABLE IF NOT EXISTS complaints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  type text NOT NULL,
  description text NOT NULL,
  location jsonb,
  media_urls text[],
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;

-- Policies for complaints
CREATE POLICY "Users can create complaints"
  ON complaints
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own complaints"
  ON complaints
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

-- Create storage bucket for media
INSERT INTO storage.buckets (id, name)
VALUES ('media', 'media')
ON CONFLICT DO NOTHING;

-- Storage policies
CREATE POLICY "Anyone can view media"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'media');

CREATE POLICY "Authenticated users can upload media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'media');