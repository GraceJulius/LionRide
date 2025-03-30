package com.lionride.lionride_backend.modules.driver.repository;

import com.lionride.lionride_backend.modules.driver.model.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DriverRepository extends JpaRepository<Driver, String> {
    Driver findByUid(String uid);
}
