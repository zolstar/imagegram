-- create the databases
CREATE DATABASE IF NOT EXISTS imagegram;

-- create the users for each database
CREATE USER 'imagegram_user'@'%' IDENTIFIED BY 'imagegram_password';
GRANT ALL PRIVILEGES ON `imagegram`.* TO 'imagegram_user'@'%';

FLUSH PRIVILEGES;