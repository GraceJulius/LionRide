package com.lionride.lionride_backend.modules.driver.service;

import com.lionride.lionride_backend.modules.driver.model.Driver;
import com.lionride.lionride_backend.modules.driver.repository.DriverRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.NoSuchElementException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DriverServiceTest {

    @Mock
    private DriverRepository driverRepository;
    @InjectMocks
    private DriverService driverService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void registerDriver_success() {
        Driver driver = new Driver();
        driver.setUid("uid123");

        when(driverRepository.findByUid("uid123")).thenReturn(null);
        when(driverRepository.save(driver)).thenReturn(driver);

        Driver result = driverService.registerDriver(driver);
        assertEquals("uid123", result.getUid());
        verify(driverRepository).save(driver);
    }

    @Test
    void registerDriver_alreadyExists_throwsException() {
        Driver existing = new Driver();
        existing.setUid("uid123");
        when(driverRepository.findByUid("uid123")).thenReturn(existing);

        Driver newDriver = new Driver();
        newDriver.setUid("uid123");

        assertThrows(IllegalArgumentException.class, () -> driverService.registerDriver(newDriver));
    }

    @Test
    void updateDriver_success() {
        Driver existing = new Driver();
        existing.setUid("uid123");
        when(driverRepository.findByUid("uid123")).thenReturn(existing);
        when(driverRepository.save(any(Driver.class))).thenReturn(existing);

        Driver updated = driverService.updateDriver("uid123", "Toyota", "Camry", 2020,
                "ABC123", "DL999", LocalDate.of(2026, 1, 1));

        assertEquals("Toyota", updated.getVehicleMake());
        assertEquals("Camry", updated.getVehicleModel());
        assertEquals(2020, updated.getVehicleYear());
    }

    @Test
    void updateDriver_notFound_throwsException() {
        when(driverRepository.findByUid("uid123")).thenReturn(null);
        assertThrows(NoSuchElementException.class, () -> driverService.updateDriver(
                "uid123", "Toyota", "Camry", 2020, "ABC123", "DL999", LocalDate.now()));
    }

    @Test
    void getDriverByUid_returnsDriver() {
        Driver driver = new Driver();
        driver.setUid("uid123");
        when(driverRepository.findByUid("uid123")).thenReturn(driver);

        Driver result = driverService.getDriverByUid("uid123");
        assertEquals("uid123", result.getUid());
    }
}