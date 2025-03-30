-- V4__Use_uid_as_PK_in_Drivers.sql
--
-- Migration script to modify the drivers table so that the uid column
-- becomes the primary key and foreign key, removing the auto-incrementing driver_id.
--

-- 1. Drop the existing primary key constraint on driver_id.
ALTER TABLE drivers DROP CONSTRAINT IF EXISTS drivers_pkey;

-- 2. Drop the driver_id column.
ALTER TABLE drivers DROP COLUMN IF EXISTS driver_id;

-- 3. Set uid as the primary key.
ALTER TABLE drivers ADD PRIMARY KEY (uid);
