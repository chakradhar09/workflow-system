import React, { useState, useEffect } from 'react';
import Task from './Task.jsx';
import { Typography, Grid, Paper, Divider, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const User = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks'); // Fetch tasks from backend
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setTasks(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchTasks();
  }, []); // Empty dependency array means this effect runs once on component mount

  // Filter tasks based on status
  const ongoingTasks = tasks.filter(task => task.status === 'In Progress' || task.status === 'Not Started');
  const completedTasks = tasks.filter(task => task.status === 'Completed');

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error loading tasks: {error.message}</Typography>;
  }

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
              <Grid item xs={12} sm={6} md={4} key={task.id || task._id}> {/* Use task._id if backend uses MongoDB default */}
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
              <Grid item xs={12} sm={6} md={4} key={task.id || task._id}> {/* Use task._id if backend uses MongoDB default */}
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