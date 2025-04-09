package com.lionride.lionride_backend.modules.ride.repository;

import com.lionride.lionride_backend.modules.ride.model.Ride;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RideRepository extends JpaRepository<Ride, Long> {
    List<Ride> findTop5ByRiderUidAndStatusOrderByCreatedAtDesc(String riderUid, String status);
    List<Ride> findByStatus(String status);
}
