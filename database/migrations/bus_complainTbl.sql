
CREATE TABLE IF NOT EXISTS bus_companies (
  id CHAR(36) PRIMARY KEY DEFAULT UUID(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample bus companies
INSERT INTO bus_companies (name) VALUES
  ('Vector Classic'),
  ('Raida'),
  ('Anabil'),
  ('Asim'),
  ('Asmani'),
  ('Rajdhani')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Add bus company reference to reports
ALTER TABLE reports 
ADD COLUMN IF NOT EXISTS bus_company_id CHAR(36),
ADD CONSTRAINT fk_bus_company FOREIGN KEY (bus_company_id) REFERENCES bus_companies(id);

-- Create post likes table
CREATE TABLE IF NOT EXISTS post_likes (
  id CHAR(36) PRIMARY KEY DEFAULT UUID(),
  report_id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (report_id, user_id),
  FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES auth_users(id)
);

-- Create post comments table
CREATE TABLE IF NOT EXISTS post_comments (
  id CHAR(36) PRIMARY KEY DEFAULT UUID(),
  report_id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES auth_users(id)
);

-- Add interaction counts to reports
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS likes_count INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS comments_count INT DEFAULT 0;

-- Placeholder for RLS (MySQL does not support RLS natively)
-- Access control for bus_companies, post_likes, and post_comments must be implemented in the application layer.

-- Create functions to update interaction counts
DELIMITER $$

CREATE TRIGGER update_report_likes_count
AFTER INSERT ON post_likes
FOR EACH ROW
BEGIN
  UPDATE reports
  SET likes_count = likes_count + 1
  WHERE id = NEW.report_id;
END;
$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER update_report_likes_count_delete
AFTER DELETE ON post_likes
FOR EACH ROW
BEGIN
  UPDATE reports
  SET likes_count = likes_count - 1
  WHERE id = OLD.report_id;
END;
$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER update_report_comments_count
AFTER INSERT ON post_comments
FOR EACH ROW
BEGIN
  UPDATE reports
  SET comments_count = comments_count + 1
  WHERE id = NEW.report_id;
END;
$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER update_report_comments_count_delete
AFTER DELETE ON post_comments
FOR EACH ROW
BEGIN
  UPDATE reports
  SET comments_count = comments_count - 1
  WHERE id = OLD.report_id;
END;
$$

DELIMITER ;
