package com.tasktracker.TaskManager.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime dueDate;
    private String priority;

    private String status;

    // optional relation
    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    // ✅ FIX: ensure no null values from DB
    @PrePersist
    public void prePersist() {
        if (status == null || status.isEmpty()) {
            status = "pending";
        }
        if (priority == null || priority.isEmpty()) {
            priority = "low";
        }
    }
}