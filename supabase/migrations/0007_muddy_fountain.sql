/*
  # Feed System and Interactions

  1. New Tables
    - `post_likes` - Stores user likes on reports
    - `post_comments` - Stores comments on reports
    - `bus_companies` - Stores bus company information
  
  2. Changes
    - Add bus_company_id to reports table
    - Add interaction counts to reports
  
  3. Security
    - Enable RLS on all new tables
    - Add policies for likes and comments
*/

-- Create bus companies table
CREATE TABLE IF NOT EXISTS bus_companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Insert sample bus companies
INSERT INTO bus_companies (name) VALUES
  ('Vector Classic'),
  ('Raida'),
  ('Anabil'),
  ('Asim'),
  ('Asmani'),
  ('Rajdhani');

-- Add bus company reference to reports
ALTER TABLE reports 
ADD COLUMN IF NOT EXISTS bus_company_id uuid REFERENCES bus_companies(id);

-- Create post likes table
CREATE TABLE IF NOT EXISTS post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid REFERENCES reports(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE(report_id, user_id)
);

-- Create post comments table
CREATE TABLE IF NOT EXISTS post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid REFERENCES reports(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Add interaction counts to reports
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS likes_count int DEFAULT 0,
ADD COLUMN IF NOT EXISTS comments_count int DEFAULT 0;

-- Enable RLS
ALTER TABLE bus_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

-- Policies for bus companies
CREATE POLICY "Anyone can view bus companies"
  ON bus_companies FOR SELECT
  TO authenticated
  USING (true);

-- Policies for likes
CREATE POLICY "Users can like posts"
  ON post_likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their likes"
  ON post_likes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view likes"
  ON post_likes FOR SELECT
  TO authenticated
  USING (true);

-- Policies for comments
CREATE POLICY "Users can add comments"
  ON post_comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their comments"
  ON post_comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view comments"
  ON post_comments FOR SELECT
  TO authenticated
  USING (true);

-- Create functions to update interaction counts
CREATE OR REPLACE FUNCTION update_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE reports SET likes_count = likes_count + 1 WHERE id = NEW.report_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE reports SET likes_count = likes_count - 1 WHERE id = OLD.report_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE reports SET comments_count = comments_count + 1 WHERE id = NEW.report_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE reports SET comments_count = comments_count - 1 WHERE id = OLD.report_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for interaction counts
CREATE TRIGGER update_report_likes_count
  AFTER INSERT OR DELETE ON post_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_likes_count();

CREATE TRIGGER update_report_comments_count
  AFTER INSERT OR DELETE ON post_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_comments_count();