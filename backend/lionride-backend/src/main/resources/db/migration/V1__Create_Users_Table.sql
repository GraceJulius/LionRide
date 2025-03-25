-- V1__Create_Users_Table.sql
--
-- Migration script for creating the Users table for the LionRide application.
-- This table stores all user accounts with necessary validations and constraints.
--
-- Columns:
--   - UserID: Auto-incrementing primary key.
--   - FirstName: User's first name (required).
--   - LastName: User's last name (required).
--   - Email: School-verified email address (required, unique).
--   - Password: Hashed password (required).
--   - PhoneNumber: User's phone number (optional).
--   - ProfilePhoto: URL/path to the user's profile photo (optional).
--   - UserType: User role (must be 'Driver', 'Rider', or 'Both'; required).
--   - CreatedAt: Timestamp of record creation, defaulting to the current timestamp.
--
CREATE TABLE IF NOT EXISTS Users (
    UserID SERIAL PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    PhoneNumber VARCHAR(20),
    ProfilePhoto VARCHAR(255),
    UserType VARCHAR(20) NOT NULL CHECK (UserType IN ('Driver', 'Rider', 'Both')),
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
