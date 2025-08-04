/*
  # Add Admin and Police Users
  
  1. Creates users:
    - Admin user with email/password
    - Police user with ID/password
  
  Note: Both users are pre-confirmed and ready to use
*/

-- Create admin user if not exists
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'admin@mail.com'
  ) THEN
    INSERT INTO auth.users (
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
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'admin@mail.com',
      crypt('admin2222', gen_salt('bf')),
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
  END IF;
END $$;

-- Create police user if not exists
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = '222284@police.gov'
  ) THEN
    INSERT INTO auth.users (
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
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      '222284@police.gov',
      crypt('011222284', gen_salt('bf')),
      now(),
      now(),
      '{"provider": "email", "providers": ["email"]}',
      '{"role": "police"}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    );
  END IF;
END $$;