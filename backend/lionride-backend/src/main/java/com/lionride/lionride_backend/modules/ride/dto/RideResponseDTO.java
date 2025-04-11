package com.lionride.lionride_backend.modules.ride.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Setter
@Getter
public class RideResponseDTO {
    private Long rideId;
    private String riderUid;
    private String driverUid;
    private String pickupAddress;
    private String destinationAddress;
    private BigDecimal estimatedFare;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    // Merged public driver details.
    private DriverPublicDTO driverDetails;

}
