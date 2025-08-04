/*
  # Database Schema Update
  
  1. Tables Created:
    - users (extended profile fields)
    - bus_companies
    - reports
    - police_specializations
    - case_assignments
    - post_likes
    - post_comments
    - emergencies

  2. Changes:
    - Added ENUM types for status fields
    - Added foreign key constraints
    - Added indexes for performance
*/

-- Create custom types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('passenger', 'police', 'admin');
    CREATE TYPE report_type AS ENUM ('harassment', 'reckless-driving', 'fare-dispute', 'other');
    CREATE TYPE report_status AS ENUM ('pending', 'investigating', 'resolved');
    CREATE TYPE report_priority AS ENUM ('high', 'medium', 'low');
    CREATE TYPE case_status AS ENUM ('assigned', 'in_progress', 'completed');
    CREATE TYPE emergency_status AS ENUM ('active', 'resolved');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add profile fields to auth.users
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'passenger'::user_role;

-- Bus companies
CREATE TABLE IF NOT EXISTS bus_companies (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Reports/Complaints
CREATE TABLE IF NOT EXISTS reports (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    bus_company_id uuid REFERENCES bus_companies,
    type report_type NOT NULL,
    description TEXT NOT NULL,
    location JSONB,
    media_urls TEXT[],
    status report_status DEFAULT 'pending',
    priority report_priority DEFAULT 'medium',
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Police specializations
CREATE TABLE IF NOT EXISTS police_specializations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Case assignments
CREATE TABLE IF NOT EXISTS case_assignments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id uuid REFERENCES reports,
    police_id uuid REFERENCES auth.users,
    specialization_id uuid REFERENCES police_specializations,
    status case_status DEFAULT 'assigned',
    assigned_at TIMESTAMPTZ DEFAULT now()
);

-- Post likes
CREATE TABLE IF NOT EXISTS post_likes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id uuid REFERENCES reports ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(report_id, user_id)
);

-- Post comments
CREATE TABLE IF NOT EXISTS post_comments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id uuid REFERENCES reports ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Emergencies
CREATE TABLE IF NOT EXISTS emergencies (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users,
    location JSONB NOT NULL,
    status emergency_status DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT now(),
    resolved_at TIMESTAMPTZ,
    resolved_by uuid REFERENCES auth.users
);

-- Enable RLS
ALTER TABLE bus_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE police_specializations ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergencies ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_case_assignments_police_id ON case_assignments(police_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_report_id ON post_likes(report_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_report_id ON post_comments(report_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for reports
DROP TRIGGER IF EXISTS update_reports_updated_at ON reports;
CREATE TRIGGER update_reports_updated_at
    BEFORE UPDATE ON reports
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();