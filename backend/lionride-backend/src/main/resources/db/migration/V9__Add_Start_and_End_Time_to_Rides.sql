-- V9__Add_Start_and_End_Time_to_Rides.sql
ALTER TABLE rides
    ADD COLUMN IF NOT EXISTS start_time TIMESTAMP NULL;

ALTER TABLE rides
    ADD COLUMN IF NOT EXISTS end_time TIMESTAMP NULL;