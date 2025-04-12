-- V8__Add_version_column_to_rides.sql
ALTER TABLE rides
    ADD COLUMN IF NOT EXISTS version BIGINT NOT NULL DEFAULT 0;
