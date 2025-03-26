-- V2__Update_Users_Table_For_Firebase.sql
--
-- This migration script updates the Users table to align with Firebase authentication.
-- It drops the Password column (Firebase handles passwords) and replaces the serial
-- UserID primary key with a uid column (to store the Firebase UID).
-- The UserType column is updated to allow 'DRIVER', 'RIDER', or 'BOTH' values.
--
ALTER TABLE Users DROP COLUMN Password;

ALTER TABLE Users DROP COLUMN UserID;

ALTER TABLE Users ADD COLUMN UID VARCHAR(255) PRIMARY KEY;

ALTER TABLE Users DROP CONSTRAINT IF EXISTS users_usertype_check;

ALTER TABLE Users ADD CONSTRAINT users_usertype_check
CHECK (UserType IN ('DRIVER', 'RIDER', 'BOTH'));
