package com.workflow.workflow_server.controller;

import com.workflow.workflow_server.entity.Subtask;
import com.workflow.workflow_server.entity.Task;
import com.workflow.workflow_server.repository.TaskRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskRepository taskRepository;

    // Constructor Injection
    public TaskController(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    // Helper method to find a task or throw ResponseStatusException for 404
    private Task findTaskByIdOrThrow(String id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found with id: " + id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        // Best practice: Initialize subtasks list in Task entity.
        // Defensive initialization here if not guaranteed by entity.
        if (task.getSubtasks() == null) {
            task.setSubtasks(new ArrayList<>());
        }
        // Ensure any subtasks provided during creation have IDs
        for (Subtask subtask : task.getSubtasks()) {
            if (subtask.getId() == null || subtask.getId().isEmpty()) {
                subtask.setId(UUID.randomUUID().toString());
            }
        }
        Task savedTask = taskRepository.save(task);
        return new ResponseEntity<>(savedTask, HttpStatus.CREATED);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        List<Task> tasks = taskRepository.findAll();
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable String id) {
        Task task = findTaskByIdOrThrow(id);
        return ResponseEntity.ok(task);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable String id, @RequestBody Task taskDetails) {
        Task existingTask = findTaskByIdOrThrow(id);

        existingTask.setTitle(taskDetails.getTitle());
        existingTask.setDescription(taskDetails.getDescription());
        existingTask.setDueDate(taskDetails.getDueDate());
        existingTask.setAssignedTo(taskDetails.getAssignedTo());
        existingTask.setStatus(taskDetails.getStatus());
        existingTask.setProgress(taskDetails.getProgress());
        existingTask.setEstimatedTime(taskDetails.getEstimatedTime());

        // Handle subtasks: if taskDetails provides subtasks, use them.
        // This means null will set subtasks to null, empty list will clear them.
        // Ensure subtasks being set (new or existing) have IDs.
        if (taskDetails.getSubtasks() != null) {
            for (Subtask subtask : taskDetails.getSubtasks()) {
                if (subtask.getId() == null || subtask.getId().isEmpty()) {
                    subtask.setId(UUID.randomUUID().toString());
                }
            }
        }
        existingTask.setSubtasks(taskDetails.getSubtasks()); // Wholesale replacement as per original logic

        Task updatedTask = taskRepository.save(existingTask);
        return new ResponseEntity<>(updatedTask, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteTask(@PathVariable String id) {
        Task task = findTaskByIdOrThrow(id); // Ensures task exists
        taskRepository.deleteById(task.getId());
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{taskId}/subtasks")
    public ResponseEntity<Task> createSubtask(@PathVariable String taskId, @RequestBody Subtask subtask) {
        Task existingTask = findTaskByIdOrThrow(taskId);

        // Ensure the subtask list is initialized (best done in Task entity)
        if (existingTask.getSubtasks() == null) {
            existingTask.setSubtasks(new ArrayList<>());
        }

        // Generate an ID for the new subtask if it doesn't have one
        if (subtask.getId() == null || subtask.getId().isEmpty()) {
            subtask.setId(UUID.randomUUID().toString());
        }

        existingTask.getSubtasks().add(subtask);
        Task updatedTask = taskRepository.save(existingTask);
        return new ResponseEntity<>(updatedTask, HttpStatus.CREATED);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping("/{taskId}/subtasks")
    public ResponseEntity<List<Subtask>> getAllSubtasks(@PathVariable String taskId) {
        Task task = findTaskByIdOrThrow(taskId);
        // Return an empty list if subtasks is null, though entity initialization is preferred
        List<Subtask> subtasks = task.getSubtasks() == null ? new ArrayList<>() : task.getSubtasks();
        return new ResponseEntity<>(subtasks, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')") // Consider allowing the assigned user as well
    @PutMapping("/{taskId}/subtasks/{subtaskId}")
    public ResponseEntity<Task> updateSubtask(@PathVariable String taskId, @PathVariable String subtaskId, @RequestBody Subtask subtaskDetails) {
        Task task = findTaskByIdOrThrow(taskId);

        List<Subtask> subtasks = task.getSubtasks();
        // This check is mostly defensive if Task entity initializes subtasks list
        if (subtasks == null) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Task's subtask list is not initialized.");
        }

        Optional<Subtask> subtaskOptional = subtasks.stream()
                .filter(s -> s.getId() != null && s.getId().equals(subtaskId)) // Check s.getId() for null
                .findFirst();

        if (subtaskOptional.isPresent()) {
            Subtask existingSubtask = subtaskOptional.get();
            existingSubtask.setTitle(subtaskDetails.getTitle());
            existingSubtask.setDescription(subtaskDetails.getDescription());
            existingSubtask.setDueDate(subtaskDetails.getDueDate());
            existingSubtask.setAssignedTo(subtaskDetails.getAssignedTo());
            existingSubtask.setStatus(subtaskDetails.getStatus());
            existingSubtask.setProgress(subtaskDetails.getProgress()); // Added for consistency
            existingSubtask.setEstimatedTime(subtaskDetails.getEstimatedTime()); // Added for consistency
            // The ID of the existing subtask (subtaskId) is not changed by subtaskDetails.getId()

            Task updatedTask = taskRepository.save(task);
            return new ResponseEntity<>(updatedTask, HttpStatus.OK);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Subtask not found with id: " + subtaskId + " in task " + taskId);
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{taskId}/subtasks/{subtaskId}")
    public ResponseEntity<Task> deleteSubtask(@PathVariable String taskId, @PathVariable String subtaskId) {
        Task task = findTaskByIdOrThrow(taskId);

        List<Subtask> subtasks = task.getSubtasks();
        if (subtasks == null) { // Defensive check
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Task has no subtasks list to delete from.");
        }

        Optional<Subtask> subtaskOptional = subtasks.stream()
                .filter(s -> s.getId() != null && s.getId().equals(subtaskId)) // Check s.getId() for null
                .findFirst();

        if (subtaskOptional.isPresent()) {
            subtasks.remove(subtaskOptional.get());
            Task updatedTask = taskRepository.save(task);
            // Original returned updated task with OK, maintaining that.
            // Could also return ResponseEntity.noContent().build();
            return new ResponseEntity<>(updatedTask, HttpStatus.OK);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Subtask not found with id: " + subtaskId + " for deletion in task " + taskId);
        }
    }
}