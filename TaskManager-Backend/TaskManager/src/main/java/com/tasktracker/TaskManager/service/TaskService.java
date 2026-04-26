package com.tasktracker.TaskManager.service;

import com.tasktracker.TaskManager.model.Task;
import com.tasktracker.TaskManager.model.User;
import com.tasktracker.TaskManager.repository.TaskRepository;
import com.tasktracker.TaskManager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepo;

    @Autowired
    private UserRepository userRepo;

    // ✅ GET USER TASKS
    public List<Task> getTasksByUser(Long userId) {
        return taskRepo.findByUserId(userId);
    }

    // ✅ ADD TASK
    public Task addTask(Long userId, Task task) {

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        task.setUser(user);

        if (task.getStatus() == null) task.setStatus("pending");
        if (task.getPriority() == null) task.setPriority("low");

        return taskRepo.save(task);
    }

    // ✅ UPDATE TASK (NEW)
    public Task updateTask(Long id, Task updatedTask) {
        Task task = taskRepo.findById(id).orElseThrow();

        task.setTitle(updatedTask.getTitle());
        task.setDueDate(updatedTask.getDueDate());
        task.setPriority(updatedTask.getPriority());

        return taskRepo.save(task);
    }

    // ✅ MARK DONE
    public Task markDone(Long id) {
        Task task = taskRepo.findById(id).orElseThrow();
        task.setStatus("done");
        return taskRepo.save(task);
    }

    // ✅ DELETE
    public void deleteTask(Long id) {
        taskRepo.deleteById(id);
    }
}