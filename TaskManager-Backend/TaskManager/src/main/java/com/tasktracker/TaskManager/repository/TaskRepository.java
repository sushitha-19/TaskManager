package com.tasktracker.TaskManager.repository;

import com.tasktracker.TaskManager.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    // ✅ IMPORTANT: fetch tasks by user
    List<Task> findByUserId(Long userId);
}