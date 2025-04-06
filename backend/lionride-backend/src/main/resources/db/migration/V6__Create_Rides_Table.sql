-- V6__Create_Rides_Table.sql
--
-- Migration script for creating the rides table for the LionRide application.
-- This table stores ride request details along with fare estimation and status.
-- The driver_uid column is nullable and will be updated when a driver accepts the ride.
--
CREATE TABLE IF NOT EXISTS rides (
    ride_id SERIAL PRIMARY KEY,
    rider_uid VARCHAR(255) NOT NULL,
    driver_uid VARCHAR(255),  -- Will be updated when a driver accepts the ride; can be NULL initially
    pickup_address VARCHAR(255) NOT NULL,
    destination_address VARCHAR(255) NOT NULL,
    scheduled_time TIMESTAMP,  -- Optional scheduled ride time
    estimated_fare DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rider FOREIGN KEY (rider_uid) REFERENCES users(uid) ON DELETE CASCADE,
    CONSTRAINT fk_driver FOREIGN KEY (driver_uid) REFERENCES drivers(uid) ON DELETE SET NULL
    );
