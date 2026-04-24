package com.tasktracker.TaskManager.controller;

import com.tasktracker.TaskManager.model.User;
import com.tasktracker.TaskManager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserRepository repo;

    // SIGNUP
    @PostMapping("/signup")
    public User signup(@RequestBody User user) {
        return repo.save(user);
    }

    // LOGIN
    @PostMapping("/login")
    public User login(@RequestBody User user) {

        Optional<User> existingUser = repo.findByEmail(user.getEmail());

        if (existingUser.isPresent() &&
                existingUser.get().getPassword().equals(user.getPassword())) {
            return existingUser.get();
        } else {
            throw new RuntimeException("Invalid credentials");
        }
    }

    // ✅ FORGOT PASSWORD (NEW)
    @PutMapping("/forgot-password")
    public String forgotPassword(@RequestBody User user) {

        Optional<User> existingUser = repo.findByEmail(user.getEmail());

        if (existingUser.isPresent()) {
            User u = existingUser.get();
            u.setPassword(user.getPassword());
            repo.save(u);
            return "Password updated successfully";
        } else {
            throw new RuntimeException("User not found");
        }
    }
}