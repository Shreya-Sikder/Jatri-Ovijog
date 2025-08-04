/*
  # Add Sample Feed Data
  
  1. Changes:
    - Insert sample reports with proper user_id handling
    - Add test data for different bus companies
    - Maintain data integrity with proper foreign key relationships
  
  2. Security:
    - Ensure proper user association
    - Maintain RLS policies
*/

-- First, ensure we have a test user
DO $$
DECLARE
  test_user_id uuid;
BEGIN
  -- Get or create test user
  SELECT id INTO test_user_id
  FROM auth.users
  WHERE email = 'admin@mail.com'
  LIMIT 1;

  -- Insert sample reports
  INSERT INTO reports (
    user_id,
    type,
    description,
    location,
    status,
    priority,
    bus_company_id,
    likes_count,
    comments_count
  )
  SELECT
    test_user_id,
    type,
    description,
    location,
    status,
    priority,
    company_id,
    FLOOR(RANDOM() * 50)::int,
    FLOOR(RANDOM() * 20)::int
  FROM (
    VALUES
      (
        'harassment',
        'Passenger reported inappropriate behavior from conductor',
        '{"latitude": 23.8103, "longitude": 90.4125}'::jsonb,
        'pending',
        'high',
        (SELECT id FROM bus_companies WHERE name = 'Vector Classic')
      ),
      (
        'reckless-driving',
        'Bus driver was overspeeding and breaking traffic rules',
        '{"latitude": 23.8001, "longitude": 90.4312}'::jsonb,
        'investigating',
        'high',
        (SELECT id FROM bus_companies WHERE name = 'Raida')
      ),
      (
        'fare-dispute',
        'Conductor charged extra fare without proper explanation',
        '{"latitude": 23.7937, "longitude": 90.4066}'::jsonb,
        'pending',
        'medium',
        (SELECT id FROM bus_companies WHERE name = 'Anabil')
      ),
      (
        'harassment',
        'Conductor misbehaved with elderly passenger',
        '{"latitude": 23.7925, "longitude": 90.4078}'::jsonb,
        'resolved',
        'high',
        (SELECT id FROM bus_companies WHERE name = 'Asim')
      ),
      (
        'reckless-driving',
        'Driver was using phone while driving',
        '{"latitude": 23.8118, "longitude": 90.4155}'::jsonb,
        'investigating',
        'high',
        (SELECT id FROM bus_companies WHERE name = 'Asmani')
      ),
      (
        'other',
        'Bus was extremely overcrowded during rush hour',
        '{"latitude": 23.8223, "longitude": 90.4256}'::jsonb,
        'pending',
        'medium',
        (SELECT id FROM bus_companies WHERE name = 'Rajdhani')
      )
  ) AS t(type, description, location, status, priority, company_id)
  WHERE test_user_id IS NOT NULL;
END $$;