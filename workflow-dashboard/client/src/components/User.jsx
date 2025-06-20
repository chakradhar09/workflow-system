import React from 'react';
import Task from './Task';
import { Typography, Grid, Paper, Divider } from '@mui/material';
import { styled } from '@mui/system';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const User = () => {
  // Mock task list for demonstration
  const tasks = [
    {
      id: 1,
      title: 'Design UI',
      description: 'Design the user interface for the dashboard',
      dueDate: '2024-01-31',
      assignedTo: 'John Doe',
      status: 'In Progress',
      subtasks: [],
      progress: 50,
      estimatedTime: 40,
    },
    {
      id: 2,
      title: 'Develop API',
      description: 'Develop the backend API for task management',
      dueDate: '2024-02-15',
      assignedTo: 'Jane Smith',
      status: 'Completed',
      subtasks: [],
      progress: 100,
      estimatedTime: 80,
    },
     {
      id: 3,
      title: 'Write Documentation',
      description: 'Write user and developer documentation',
      dueDate: '2024-02-20',
      assignedTo: 'John Doe',
      status: 'In Progress',
      subtasks: [],
      progress: 20,
      estimatedTime: 30,
    },
  ];

  // Filter tasks based on status
  const ongoingTasks = tasks.filter(task => task.status === 'In Progress' || task.status === 'Not Started');
  const completedTasks = tasks.filter(task => task.status === 'Completed');

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4" component="h2">
          User Dashboard
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <StyledPaper>
          <Typography variant="h5" component="h3">
            Ongoing Tasks
          </Typography>
          <Grid container spacing={2}>
            {ongoingTasks.map((task) => (
              <Grid item xs={12} sm={6} md={4} key={task.id}>
                <Task task={task} />
              </Grid>
            ))}
          </Grid>
        </StyledPaper>
      </Grid>

      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} /> {/* Add a divider */}
        <StyledPaper>
          <Typography variant="h5" component="h3">
            Completed Tasks
          </Typography>
          <Grid container spacing={2}>
            {completedTasks.map((task) => (
              <Grid item xs={12} sm={6} md={4} key={task.id}>
                <Task task={task} />
              </Grid>
            ))}
          </Grid>
        </StyledPaper>
      </Grid>
    </Grid>
  );
};

export default User;