package com.lionride.lionride_backend.modules.user.repository;

import com.lionride.lionride_backend.modules.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
}
