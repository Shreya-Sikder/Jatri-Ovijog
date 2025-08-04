
CREATE TABLE IF NOT EXISTS police_specializations (
  id CHAR(36) PRIMARY KEY DEFAULT UUID(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO police_specializations (name, description) VALUES
  ('Traffic Safety', 'Handles reckless driving and traffic violations'),
  ('Personal Safety', 'Manages harassment and passenger safety issues'),
  ('Emergency Response', 'Coordinates emergency situations'),
  ('Property Crime', 'Handles theft and property-related issues')
ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description);


CREATE TABLE IF NOT EXISTS case_assignments (
  id CHAR(36) PRIMARY KEY DEFAULT UUID(),
  report_id CHAR(36),
  police_id CHAR(36),
  specialization_id CHAR(36),
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'assigned',
  FOREIGN KEY (report_id) REFERENCES reports(id),
  FOREIGN KEY (police_id) REFERENCES auth_users(id),
  FOREIGN KEY (specialization_id) REFERENCES police_specializations(id)
);

ALTER TABLE auth_users 
ADD COLUMN IF NOT EXISTS raw_user_meta_data JSON;

