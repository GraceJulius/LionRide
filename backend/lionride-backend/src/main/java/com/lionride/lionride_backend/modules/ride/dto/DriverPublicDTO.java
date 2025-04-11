package com.lionride.lionride_backend.modules.ride.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class DriverPublicDTO {
    private String uid;
    private String name;
    private String vehicleMake;
    private String vehicleModel;
    private String licensePlate;
}
