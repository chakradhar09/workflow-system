package com.workflow.workflow_server.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "tasks")
public class Task {

    @Id
    private String id;
    private String title;
    private String description;
    private String dueDate;
    private String assignedTo;
    private String status;
    private List<Subtask> subtasks;
    private Integer progress;
    private Integer estimatedTime;

}