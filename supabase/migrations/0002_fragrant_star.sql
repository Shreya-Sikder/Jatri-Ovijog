/*
  # Create Admin User
  
  1. Creates an admin user with:
    - Email: admin
    - Password: admin
    - Role: authenticated
  
  Note: Email confirmation is handled through Supabase dashboard settings
*/

-- Create admin user if not exists
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'admin'
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
      'admin',
      crypt('admin', gen_salt('bf')),
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