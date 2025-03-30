-- V5__Create_Rider_Table.sql
--
-- Migration script for creating the Riders table for the LionRide application.
-- This table stores rider-specific details.
--
-- Columns:
--   - uid: Firebase UID (primary key, and foreign key referencing the Users table).
--   - default_payment_method: The rider's default payment method.
--
CREATE TABLE IF NOT EXISTS riders (
                                      uid VARCHAR(255) PRIMARY KEY,
    default_payment_method VARCHAR(50)
    );

ALTER TABLE riders
    ADD CONSTRAINT fk_user_rider FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE;