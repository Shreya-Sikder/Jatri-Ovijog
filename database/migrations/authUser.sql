/*
  # Add Admin and Police Users
  
  1. Creates users:
    - Admin user with email/password
    - Police user with ID/password
  
  Note: Both users are pre-confirmed and ready to use.
*/

-- Create admin user if not exists
INSERT INTO auth_users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
SELECT 
  '00000000-0000-0000-0000-000000000000',
  UUID(),
  'authenticated',
  'authenticated',
  'admin@mail.com',
  PASSWORD('admin2222'),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"role": "admin"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM auth_users WHERE email = 'admin@mail.com'
);

-- Create police user if not exists
INSERT INTO auth_users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
SELECT 
  '00000000-0000-0000-0000-000000000000',
  UUID(),
  'authenticated',
  'authenticated',
  '222284@police.gov',
  PASSWORD('011222284'),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"role": "police"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM auth_users WHERE email = '222284@police.gov'
);
