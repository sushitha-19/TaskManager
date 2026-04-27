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

    // ✅ SIGNUP
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {

        // ✅ Check duplicate email
        if (repo.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity
                    .status(400)
                    .body("Email already registered. Please login.");
        }

        try {
            // ✅ Generate token
            String token = UUID.randomUUID().toString();

            user.setVerified(false);
            user.setVerificationToken(token);

            repo.save(user);

            // ✅ Try sending email (DON'T break if fails)
            try {
                emailService.sendVerificationEmail(user.getEmail(), token);
            } catch (Exception e) {
                System.out.println("Email sending failed: " + e.getMessage());
            }

            return ResponseEntity.ok("Verification link sent to your email");

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Signup failed");
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
            return "Email verified successfully! You can login now.";
        } else {
            return "Invalid or expired token";
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

        // ❗ Remove password before sending
        u.setPassword(null);

        return ResponseEntity.ok(u);
    }

    // ✅ FORGOT PASSWORD
    @PutMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody User user) {

        Optional<User> existingUser = repo.findByEmail(user.getEmail());

        if (existingUser.isPresent()) {
            User u = existingUser.get();
            u.setPassword(user.getPassword());
            repo.save(u);
            return ResponseEntity.ok("Password updated successfully");
        } else {
            return ResponseEntity.status(400).body("User not found");
        }
    }
}