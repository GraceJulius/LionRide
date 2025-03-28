-- V3__Create_Driver_Table.sql
--
-- Migration script for creating the Driver table for the LionRide application.
-- This table stores driver-specific details.
--
-- Columns:
--   - driver_id: Auto-incrementing primary key.
--   - uid: Firebase UID (foreign key referencing the Users table).
--   - vehicle_make: The make of the driver's vehicle.
--   - vehicle_model: The model of the vehicle.
--   - vehicle_year: The year of manufacture.
--   - license_plate: The vehicle's license plate.
--   - driver_license_number: The driver's license number.
--   - license_expiry: The expiration date of the driver's license.
--   - background_check_status: Status of the background check ('Pending', 'Cleared', 'Failed') with a default of 'Pending'.
--   - average_rating: The driver's average rating (default 0.0).
--   - total_trips: Number of rides completed by the driver (default 0).
--
CREATE TABLE IF NOT EXISTS drivers (
    driver_id SERIAL PRIMARY KEY,
    uid VARCHAR(255) NOT NULL,
    vehicle_make VARCHAR(50) NOT NULL,
    vehicle_model VARCHAR(50) NOT NULL,
    vehicle_year INT NOT NULL,
    license_plate VARCHAR(20) NOT NULL,
    driver_license_number VARCHAR(50) NOT NULL,
    license_expiry DATE NOT NULL,
    background_check_status VARCHAR(20) NOT NULL DEFAULT 'Pending'
        CHECK (background_check_status IN ('Pending', 'Cleared', 'Failed')),
    average_rating DECIMAL(3,2) DEFAULT 0.0,
    total_trips INT DEFAULT 0,
    CONSTRAINT fk_user FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE
);
