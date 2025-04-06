package com.lionride.lionride_backend.modules.rider.repository;

import com.lionride.lionride_backend.modules.rider.model.Rider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RiderRepository extends JpaRepository<Rider, String> {
    Rider findByUid(String uid);
}
