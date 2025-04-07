--V7__Recreate_Rides_Table.sql
DROP TABLE IF EXISTS rides;

CREATE TABLE rides (
    ride_id BIGSERIAL PRIMARY KEY,
    rider_uid VARCHAR(255) NOT NULL,
    driver_uid VARCHAR(255),
    pickup_address VARCHAR(255) NOT NULL,
    destination_address VARCHAR(255) NOT NULL,
    estimated_fare DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rider FOREIGN KEY (rider_uid) REFERENCES users(uid) ON DELETE CASCADE,
    CONSTRAINT fk_driver FOREIGN KEY (driver_uid) REFERENCES drivers(uid) ON DELETE SET NULL
);
