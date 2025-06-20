package com.workflow.workflow_server.controller;

import com.workflow.workflow_server.entity.Subtask;
import com.workflow.workflow_server.entity.Task;
import com.workflow.workflow_server.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
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
        Optional<Task> task = taskRepository.findById(id);
        return task.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable String id, @RequestBody Task taskDetails) {
        Optional<Task> task = taskRepository.findById(id);
        if (task.isPresent()) {
            Task existingTask = task.get();
            existingTask.setTitle(taskDetails.getTitle());
            existingTask.setDescription(taskDetails.getDescription());
            existingTask.setDueDate(taskDetails.getDueDate());
            existingTask.setAssignedTo(taskDetails.getAssignedTo());
            existingTask.setStatus(taskDetails.getStatus());
            existingTask.setSubtasks(taskDetails.getSubtasks());
            existingTask.setProgress(taskDetails.getProgress());
            existingTask.setEstimatedTime(taskDetails.getEstimatedTime());
            Task updatedTask = taskRepository.save(existingTask);
            return new ResponseEntity<>(updatedTask, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteTask(@PathVariable String id) {
        Optional<Task> task = taskRepository.findById(id);
        if (task.isPresent()) {
            taskRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{taskId}/subtasks")
    public ResponseEntity<Task> createSubtask(@PathVariable String taskId, @RequestBody Subtask subtask) {
        Optional<Task> task = taskRepository.findById(taskId);
        if (task.isPresent()) {
            Task existingTask = task.get();
            List<Subtask> subtasks = existingTask.getSubtasks();
            subtasks.add(subtask);
            existingTask.setSubtasks(subtasks);
            Task updatedTask = taskRepository.save(existingTask);
            return new ResponseEntity<>(updatedTask, HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping("/{taskId}/subtasks")
    public ResponseEntity<List<Subtask>> getAllSubtasks(@PathVariable String taskId) {
        Optional<Task> task = taskRepository.findById(taskId);
        if (task.isPresent()) {
            Task existingTask = task.get();
            List<Subtask> subtasks = existingTask.getSubtasks();
            return new ResponseEntity<>(subtasks, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

     @PreAuthorize("hasRole('ADMIN')") // Consider allowing the assigned user as well
     @PutMapping("/{taskId}/subtasks/{subtaskId}")
    public ResponseEntity<Task> updateSubtask(@PathVariable String taskId, @PathVariable String subtaskId, @RequestBody Subtask subtaskDetails) {
        Optional<Task> taskOptional = taskRepository.findById(taskId);
        if (taskOptional.isPresent()) {
            Task task = taskOptional.get();
            List<Subtask> subtasks = task.getSubtasks();
            Optional<Subtask> subtaskOptional = subtasks.stream().filter(subtask -> subtask.getId().equals(subtaskId)).findFirst();
            if (subtaskOptional.isPresent()) {
                Subtask existingSubtask = subtaskOptional.get();
                existingSubtask.setTitle(subtaskDetails.getTitle());
                existingSubtask.setDescription(subtaskDetails.getDescription());
                existingSubtask.setDueDate(subtaskDetails.getDueDate());
                existingSubtask.setAssignedTo(subtaskDetails.getAssignedTo());
                existingSubtask.setStatus(subtaskDetails.getStatus());
                existingSubtask.setProgress(subtaskDetails.getProgress());
                existingSubtask.setEstimatedTime(subtaskDetails.getEstimatedTime());
                Task updatedTask = taskRepository.save(task);
                return new ResponseEntity<>(updatedTask, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{taskId}/subtasks/{subtaskId}")
    public ResponseEntity<Task> deleteSubtask(@PathVariable String taskId, @PathVariable String subtaskId) {
        Optional<Task> taskOptional = taskRepository.findById(taskId);
        if (taskOptional.isPresent()) {
            Task task = taskOptional.get();
            List<Subtask> subtasks = task.getSubtasks();
            Optional<Subtask> subtaskOptional = subtasks.stream().filter(subtask -> subtask.getId().equals(subtaskId)).findFirst();
            if (subtaskOptional.isPresent()) {
                subtasks.remove(subtaskOptional.get());
                Task updatedTask = taskRepository.save(task);
                return new ResponseEntity<>(updatedTask, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

}