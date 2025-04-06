package com.lionride.lionride_backend.modules.rider.service;

import com.lionride.lionride_backend.modules.rider.model.Rider;
import com.lionride.lionride_backend.modules.rider.repository.RiderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
public class RiderService {

    @Autowired
    private RiderRepository riderRepository;

    public Rider registerRider(Rider rider) {
        if (riderRepository.findByUid(rider.getUid()) != null) {
            throw new IllegalArgumentException("Rider already registered with uid: " + rider.getUid());
        }
        return riderRepository.save(rider);
    }

    public Rider updateRider(String uid, String defaultPaymentMethod) {
        Rider existingRider = riderRepository.findByUid(uid);
        if (existingRider == null) {
            throw new NoSuchElementException("Rider not found with uid: " + uid);
        }
        existingRider.setDefaultPaymentMethod(defaultPaymentMethod);
        return riderRepository.save(existingRider);
    }

    public Rider getRiderByUid(String uid) {
        return riderRepository.findByUid(uid);
    }
}
