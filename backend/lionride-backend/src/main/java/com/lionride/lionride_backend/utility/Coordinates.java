package com.lionride.lionride_backend.utility;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class Coordinates {
    private double lat;
    private double lng;

    public Coordinates(double lat, double lng) {
        this.lat = lat;
        this.lng = lng;
    }

}
