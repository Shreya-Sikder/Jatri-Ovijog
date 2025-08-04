

-- Create complaints table
CREATE TABLE IF NOT EXISTS complaints (
  id CHAR(36) PRIMARY KEY DEFAULT UUID(),
  user_id CHAR(36) NOT NULL,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  location JSON,
  media_urls JSON, -- Use JSON instead of text[] in MySQL
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES auth_users(id)
);


INSERT INTO storage_buckets (id, name)
VALUES ('media', 'media')
ON DUPLICATE KEY UPDATE name = name;

