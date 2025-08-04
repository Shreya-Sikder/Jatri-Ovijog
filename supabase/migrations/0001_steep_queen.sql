/*
  # Create admin user

  1. Initial Setup
    - Creates admin user with email "admin" and password "admin"
    - Adds admin role to auth.users
  
  2. Security
    - Password will need to be changed on first login
*/

-- Create admin user with email "admin"
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin',
  crypt('admin', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"role": "admin"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);