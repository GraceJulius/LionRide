package com.lionride.lionride_backend.modules.driver.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "drivers")
public class Driver {
    @Id
    @Column(name = "uid", nullable = false)
    private String uid;

    @Column(name = "vehicle_make", nullable = false)
    private String vehicleMake;

    @Column(name = "vehicle_model", nullable = false)
    private String vehicleModel;

    @Column(name = "vehicle_year", nullable = false)
    private int vehicleYear;

    @Column(name = "license_plate", nullable = false)
    private String licensePlate;

    @Column(name = "driver_license_number", nullable = false)
    private String driverLicenseNumber;

    @Column(name = "license_expiry", nullable = false, columnDefinition = "date")
    private LocalDate licenseExpiry;

    @Column(name = "background_check_status", nullable = false, columnDefinition = "VARCHAR(20) DEFAULT 'Pending'")
    private String backgroundCheckStatus;

    @Column(name = "average_rating", precision = 3, scale = 2, columnDefinition = "NUMERIC(3,2) DEFAULT 0.0")
    private BigDecimal averageRating;

    @Column(name = "total_trips", columnDefinition = "INT DEFAULT 0")
    private Integer totalTrips;
}
