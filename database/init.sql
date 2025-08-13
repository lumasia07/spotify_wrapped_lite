-- Create database if not exists
CREATE DATABASE IF NOT EXISTS spotify_wrapped;
USE spotify_wrapped;

-- Grant privileges
GRANT ALL PRIVILEGES ON spotify_wrapped.* TO 'root'@'%';
FLUSH PRIVILEGES;