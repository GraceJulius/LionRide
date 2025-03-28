package com.lionride.lionride_backend.modules.driver.service;

import com.lionride.lionride_backend.modules.driver.model.Driver;
import com.lionride.lionride_backend.modules.driver.repository.DriverRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.NoSuchElementException;

@Service
public class DriverService {
    @Autowired
    private DriverRepository driverRepository;

    public Driver registerDriver(Driver driver) {
        if (driverRepository.findByUid(driver.getUid()) != null) {
            throw new IllegalArgumentException("Driver already registered with uid: " + driver.getUid());
        }
        // Database defaults (e.g., background_check_status 'Pending') are applied.
        return driverRepository.save(driver);
    }

    public Driver updateDriver(String uid, String vehicleMake, String vehicleModel, int vehicleYear,
                               String licensePlate, String driverLicenseNumber, LocalDate licenseExpiry) {
        Driver existingDriver = driverRepository.findByUid(uid);
        if (existingDriver == null) {
            throw new NoSuchElementException("Driver not found with uid: " + uid);
        }
        existingDriver.setVehicleMake(vehicleMake);
        existingDriver.setVehicleModel(vehicleModel);
        existingDriver.setVehicleYear(vehicleYear);
        existingDriver.setLicensePlate(licensePlate);
        existingDriver.setDriverLicenseNumber(driverLicenseNumber);
        existingDriver.setLicenseExpiry(licenseExpiry);
        // Note: background_check_status, average_rating, and total_trips remain unchanged.
        return driverRepository.save(existingDriver);
    }

    public Driver getDriverByUid(String uid) {
        return driverRepository.findByUid(uid);
    }
}
