package com.tasktracker.TaskManager.controller;

import com.tasktracker.TaskManager.model.Task;
import com.tasktracker.TaskManager.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:5173")
public class TaskController {

    @Autowired
    private TaskService service;

    // ✅ GET TASKS BY USER
    @GetMapping("/{userId}")
    public List<Task> getTasksByUser(@PathVariable Long userId) {
        return service.getTasksByUser(userId);
    }

    // ✅ CREATE TASK
    @PostMapping("/{userId}")
    public Task createTask(@PathVariable Long userId, @RequestBody Task task) {
        return service.addTask(userId, task);
    }

    // ✅ UPDATE TASK (🔥 NEW)
    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task task) {
        return service.updateTask(id, task);
    }

    // ✅ MARK DONE
    @PutMapping("/{id}/done")
    public Task markDone(@PathVariable Long id) {
        return service.markDone(id);
    }

    // ✅ DELETE
    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        service.deleteTask(id);
    }
}