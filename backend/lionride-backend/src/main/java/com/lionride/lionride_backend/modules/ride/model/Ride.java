package com.lionride.lionride_backend.modules.ride.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "rides")
public class Ride {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ride_id")
    private Long rideId;

    @Column(name = "rider_uid", nullable = false)
    private String riderUid;

    @Column(name = "driver_uid")
    private String driverUid; // Initially null, updated when a driver accepts the ride

    @Column(name = "pickup_address", nullable = false)
    private String pickupAddress;

    @Column(name = "destination_address", nullable = false)
    private String destinationAddress;

    @Column(name = "estimated_fare", nullable = false)
    private BigDecimal estimatedFare;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Version
    private Long version;

    // Custom no-args constructor to set default values.
    public Ride() {
        LocalDateTime now = LocalDateTime.now();
        this.status = "Pending";
        this.createdAt = now;
        this.updatedAt = now;
    }
}
