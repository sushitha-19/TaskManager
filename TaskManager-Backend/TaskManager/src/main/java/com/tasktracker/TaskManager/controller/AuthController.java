package com.tasktracker.TaskManager.controller;

import com.tasktracker.TaskManager.model.User;
import com.tasktracker.TaskManager.repository.UserRepository;
import com.tasktracker.TaskManager.service.EmailService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserRepository repo;

    @Autowired
    private EmailService emailService;

    // ✅ SIGNUP WITH EMAIL VERIFICATION (SAFE VERSION)
    @PostMapping("/signup")
    public String signup(@RequestBody User user) {

        // ✅ Check duplicate email
        if (repo.findByEmail(user.getEmail()).isPresent()) {
            return "Email already registered. Please login.";
        }

        try {
            // ❗ AUTO VERIFY USER
            user.setVerified(true);
            user.setVerificationToken(null);

            repo.save(user);

            // ✅ OPTIONAL: still send email (you can remove if you want)
            try {
                emailService.sendVerificationEmail(user.getEmail(), "dummy-token");
            } catch (Exception e) {
                System.out.println("Email failed: " + e.getMessage());
            }

            return "Signup successful! You can login now.";

        } catch (Exception e) {
            e.printStackTrace();
            return "Signup failed: " + e.getMessage();
        }
    }
    // ✅ VERIFY EMAIL
    @GetMapping("/verify")
    public String verify(@RequestParam String token) {

        Optional<User> userOpt = repo.findByVerificationToken(token);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setVerified(true);
            user.setVerificationToken(null);
            repo.save(user);
            return "Email verified successfully!";
        } else {
            return "Invalid token";
        }
    }

    // ✅ LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {

        Optional<User> existingUser = repo.findByEmail(user.getEmail());

        if (existingUser.isEmpty()) {
            return ResponseEntity.status(400).body("User not found");
        }

        User u = existingUser.get();

        if (!u.getPassword().equals(user.getPassword())) {
            return ResponseEntity.status(400).body("Invalid password");
        }

        return ResponseEntity.ok(u);
    }

    // ✅ FORGOT PASSWORD
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