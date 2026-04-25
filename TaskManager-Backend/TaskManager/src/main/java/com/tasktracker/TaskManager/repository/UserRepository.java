package com.tasktracker.TaskManager.repository;

import com.tasktracker.TaskManager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    // ✅ NEW METHOD
    Optional<User> findByVerificationToken(String token);
}