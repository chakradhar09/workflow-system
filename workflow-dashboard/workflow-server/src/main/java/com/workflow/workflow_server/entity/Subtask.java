package com.workflow.workflow_server.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;

@Data
public class Subtask {

    @Id
    private String id;
    private String title;
    private String description;
    private String dueDate;
    private String assignedTo;
    private String status;
    private Integer progress;
    private Integer estimatedTime;

}