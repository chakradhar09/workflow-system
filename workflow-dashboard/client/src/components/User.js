import React from 'react';
import Task from './Task';
import { Typography, Grid, Paper } from '@mui/material';
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
    },
  ];

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
            My Tasks
          </Typography>
          <Grid container spacing={2}>
            {tasks.map((task) => (
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