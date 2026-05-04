package com.tasktracker.TaskManager.controller;

import com.tasktracker.TaskManager.model.Task;
import com.tasktracker.TaskManager.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:5173")
public class ChatController {

    @Autowired
    private TaskService taskService;

    private final String GEMINI_API_KEY = "AIzaSyAq3cAq0YAN3hq94opDIaRBmkA_R1Se-xc";

    @PostMapping
    public String chat(@RequestBody Map<String, String> request) {

        try {
            String userMessage = request.get("message");
            String userIdStr = request.get("userId");

            if (userMessage == null || userMessage.trim().isEmpty()) {
                return "Message cannot be empty";
            }

            if (userIdStr == null) {
                return "UserId is required";
            }

            Long userId = Long.parseLong(userIdStr);

            List<Task> tasks = taskService.getTasksByUser(userId);

            // ================= PROMPT =================
            StringBuilder prompt = new StringBuilder();
            prompt.append("You are a helpful AI assistant for a task manager app.\n\n");
            prompt.append("User question: ").append(userMessage).append("\n\n");

            if (tasks == null || tasks.isEmpty()) {
                prompt.append("User has no tasks.\n");
            } else {
                prompt.append("User tasks:\n");
                for (Task t : tasks) {
                    prompt.append("- ")
                            .append(t.getTitle())
                            .append(" | Status: ").append(t.getStatus())
                            .append(" | Priority: ").append(t.getPriority())
                            .append(" | Due: ").append(t.getDueDate())
                            .append("\n");
                }
            }

            prompt.append("\nGive a short, clear answer.");

            // ================= GEMINI API =================
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key="
                    + GEMINI_API_KEY;

            RestTemplate restTemplate = new RestTemplate();

            Map<String, Object> body = new HashMap<>();
            body.put("contents", List.of(
                    Map.of("parts", List.of(
                            Map.of("text", prompt.toString())
                    ))
            ));

            Map<String, Object> response;

            try {
                response = restTemplate.postForObject(url, body, Map.class);
            } catch (Exception e) {
                System.out.println("❌ Gemini API call failed:");
                e.printStackTrace();
                return "AI service error: check backend logs";
            }

            // ================= VALIDATE =================
            if (response == null || !response.containsKey("candidates")) {
                System.out.println("Invalid response: " + response);
                return "Invalid AI response";
            }

            try {
                List<Map<String, Object>> candidates =
                        (List<Map<String, Object>>) response.get("candidates");

                Map<String, Object> content =
                        (Map<String, Object>) candidates.get(0).get("content");

                List<Map<String, Object>> parts =
                        (List<Map<String, Object>>) content.get("parts");

                return parts.get(0).get("text").toString();

            } catch (Exception e) {
                System.out.println("❌ Parsing error:");
                e.printStackTrace();
                return "Error parsing AI response";
            }

        } catch (Exception e) {
            System.out.println("❌ Server error:");
            e.printStackTrace();
            return "Server error: " + e.getMessage();
        }
    }
}