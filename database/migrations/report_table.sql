

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id CHAR(36) PRIMARY KEY DEFAULT UUID(),
  user_id CHAR(36) NOT NULL,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  location JSON,
  media_urls JSON, -- Use JSON to mimic arrays in MySQL
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES auth_users(id)
);

-- Create emergencies table
CREATE TABLE IF NOT EXISTS emergencies (
  id CHAR(36) PRIMARY KEY DEFAULT UUID(),
  user_id CHAR(36) NOT NULL,
  location JSON NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP NULL,
  resolved_by CHAR(36),
  FOREIGN KEY (user_id) REFERENCES auth_users(id),
  FOREIGN KEY (resolved_by) REFERENCES auth_users(id)
);


DELIMITER $$

CREATE TRIGGER update_reports_updated_at
BEFORE UPDATE ON reports
FOR EACH ROW
BEGIN
  SET NEW.updated_at = CURRENT_TIMESTAMP;
END;
$$

DELIMITER ;
