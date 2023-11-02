-- Prepare mysql server for the project
CREATE DATABASE IF NOT EXISTS gh_dev_db;
CREATE USER IF NOT EXISTS 'gh_dev_user'@'localhost' IDENTIFIED BY 'gh_dev_pwd';
GRANT ALL PRIVILEGES ON `gh_dev_db`.* TO 'gh_dev_user'@'localhost';
GRANT SELECT ON `performance_schema`.* TO 'gh_dev_user'@'localhost';

-- New for MySQL 8.0.35
ALTER USER `gh_dev_user`@`localhost` PASSWORD EXPIRE DEFAULT;

FLUSH PRIVILEGES;
