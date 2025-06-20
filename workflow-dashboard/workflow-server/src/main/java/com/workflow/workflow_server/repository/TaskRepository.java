package com.workflow.workflow_server.repository;

import com.workflow.workflow_server.entity.Task;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TaskRepository extends MongoRepository<Task, String> {
}
