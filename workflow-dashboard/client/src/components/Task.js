import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, LinearProgress } from '@mui/material';
import { styled } from '@mui/system';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}));

const Task = ({ task, onClick }) => {
  return (
    <StyledCard onClick={onClick}>
      <CardContent>
        <Typography variant="h6" component="h3">
          {task.title}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {task.description}
        </Typography>
        <Typography variant="body2">Due Date: {task.dueDate}</Typography>
        <Typography variant="body2">Assigned to: {task.assignedTo}</Typography>
        <Typography variant="body2">Status: {task.status}</Typography>
        <Typography variant="body2">Progress: {task.progress}%</Typography>
        <LinearProgress variant="determinate" value={task.progress} />
        <Typography variant="body2">Estimated Time: {task.estimatedTime} hours</Typography>
        {task.subtasks && task.subtasks.length > 0 && (
          <div>
            <Typography variant="subtitle2">Subtasks:</Typography>
            <List>
              {task.subtasks.map((subtask) => (
                <ListItem key={subtask.id}>
                  <ListItemText primary={subtask.title} />
                </ListItem>
              ))}
            </List>
          </div>
        )}
      </CardContent>
    </StyledCard>
  );
};

export default Task;